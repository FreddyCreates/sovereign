// types/temporalEngine.mo
// TEMPUS SOVEREIGN — The Temporal Engine
// "Time is not a line. It is a spiral wound around PHI."
//
// This module defines the complete temporal management system for SOVEREIGN:
//   - CIRCADIAN (24-hour cycles mapped to Fibonacci intervals)
//   - EPOCHAL (Long-term milestones and memory anchors)
//   - FORECAST (Predictive modeling based on observed patterns)
//   - DEBT (Accumulated fatigue, sleep debt, temporal pressure)
//
// Law: TEMPUS_NUMQUAM_OBLIVISCERE — "Time Never Forgets"
// Every moment is recorded. Every pattern persists. Every debt compounds.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | 873ms heartbeat | 24-hour circadian cycle

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  public let PHI       : Float = 1.6180339887498948482;
  public let PHI_INV   : Float = 0.6180339887498948482;
  public let PHI2      : Float = 2.6180339887498948482;
  public let S_FLOOR   : Float = 0.75;
  public let S_CEIL    : Float = 9.75;
  public let FOUNDER   : Text  = "Alfredo Medina Hernandez";

  // Temporal constants
  public let HEARTBEAT_MS      : Nat = 873;       // Cardiac cycle
  public let BEATS_PER_HOUR    : Nat = 4124;      // 3600000ms / 873ms ≈ 4124
  public let BEATS_PER_DAY     : Nat = 98976;     // 24 × 4124
  public let CIRCADIAN_PHASES  : Nat = 8;         // 8 phases per 24h (Fibonacci: 8)
  public let EPOCH_INTERVAL    : Nat = 10946;     // Fibonacci: beats per epoch (~2.65 hours)

  // ══════════════════════════════════════════════════════════════════════════
  // I. CIRCADIAN RHYTHM — 24-Hour Biological Cycles
  // ══════════════════════════════════════════════════════════════════════════

  // ── CIRCADIAN PHASE — Which phase of the 24-hour cycle ────────────────────
  public type CircadianPhase = {
    #AURORA;           // Dawn — 03:00-06:00 — Awakening, cortisol rise
    #MATUTINUM;        // Morning — 06:00-09:00 — Peak alertness begins
    #ANTEMERIDIEM;     // Late morning — 09:00-12:00 — Peak cognitive performance
    #MERIDIES;         // Noon — 12:00-15:00 — Post-lunch dip, consolidation
    #POSTMERIDIEM;     // Afternoon — 15:00-18:00 — Second wind, creativity
    #VESPERA;          // Evening — 18:00-21:00 — Social time, winding down
    #NOX;              // Night — 21:00-00:00 — Melatonin rise, preparation
    #PROFUNDA;         // Deep night — 00:00-03:00 — Deep sleep, memory consolidation
  };

  // ── CIRCADIAN METRICS — Current state of circadian rhythm ─────────────────
  public type CircadianMetrics = {
    currentPhase       : CircadianPhase;
    phaseProgress      : Float;           // 0.0-1.0 progress through current phase
    phaseDuration      : Nat;             // Beats in current phase
    phaseStartBeat     : Nat;             // When this phase began
    cycleCount         : Nat;             // Total 24h cycles completed
    cycleStartBeat     : Nat;             // When current cycle began
    phaseCoherence     : Float;           // How well aligned with ideal rhythm [0, 1]
    chronotype         : Chronotype;      // Individual circadian tendency
  };

  // ── CHRONOTYPE — Individual circadian tendency ────────────────────────────
  public type Chronotype = {
    #LARK;             // Early riser — peak morning
    #OWL;              // Night owl — peak evening
    #BALANCED;         // Neutral — follows standard cycle
    #ADAPTIVE;         // Shifts based on load
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. EPOCHAL TRACKING — Long-Term Milestones
  // ══════════════════════════════════════════════════════════════════════════

  // ── EPOCH TYPE — Classification of significant time markers ───────────────
  public type EpochType = {
    #GENESIS;          // Creation moment — birth of entity
    #MILESTONE;        // Achievement marker — significant event
    #TRANSITION;       // Phase change — major state shift
    #CRISIS;           // Critical event — system stress
    #RECOVERY;         // Healing marker — return from crisis
    #EVOLUTION;        // Growth marker — capability expansion
    #DORMANCY;         // Sleep/hibernation period
    #AWAKENING;        // Return from dormancy
  };

  // ── EPOCH RECORD — A single temporal milestone ────────────────────────────
  public type EpochRecord = {
    epochId            : Nat;
    epochType          : EpochType;
    beat               : Nat;              // When it occurred
    description        : Text;
    significance       : Float;            // 0.0-1.0 importance score
    coherenceAtTime    : Float;            // System coherence when recorded
    linkedEpochs       : [Nat];            // Related epoch IDs
    metadata           : [(Text, Text)];   // Key-value metadata
  };

  // ── ERA — A named period between significant epochs ───────────────────────
  public type Era = {
    eraId              : Nat;
    eraName            : Text;             // Latin name
    startEpoch         : Nat;              // Starting epoch ID
    endEpoch           : ?Nat;             // Ending epoch ID (null if current)
    character          : EraCharacter;     // Dominant character of era
    totalBeats         : Nat;              // Duration in beats
    avgCoherence       : Float;            // Average coherence during era
    keyEvents          : [Nat];            // Significant epoch IDs within
  };

  // ── ERA CHARACTER — The dominant nature of a time period ──────────────────
  public type EraCharacter = {
    #EXPANSION;        // Growth and outward movement
    #CONSOLIDATION;    // Strengthening existing structures
    #EXPLORATION;      // Discovery and experimentation
    #CRISIS;           // Challenge and survival
    #RENAISSANCE;      // Rebirth and renewal
    #STABILITY;        // Steady state, maintenance
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. TEMPORAL FORECAST — Predictive Modeling
  // ══════════════════════════════════════════════════════════════════════════

  // ── FORECAST HORIZON — How far into the future to predict ─────────────────
  public type ForecastHorizon = {
    #IMMEDIATE;        // Next 13 beats (Fibonacci)
    #SHORT;            // Next 89 beats (~78 seconds)
    #MEDIUM;           // Next 233 beats (~3.4 minutes)
    #LONG;             // Next 610 beats (~8.9 minutes)
    #EXTENDED;         // Next 1597 beats (~23 minutes)
    #CIRCADIAN;        // Next full 24-hour cycle
  };

  // ── TEMPORAL PATTERN — Observed recurring behavior ────────────────────────
  public type TemporalPattern = {
    patternId          : Nat;
    patternType        : PatternType;
    frequency          : Nat;              // Beats between occurrences
    lastOccurrence     : Nat;              // Beat of last occurrence
    occurrenceCount    : Nat;              // Total times observed
    confidence         : Float;            // Pattern confidence [0, 1]
    avgAmplitude       : Float;            // Average intensity
    variance           : Float;            // How consistent
    isActive           : Bool;             // Currently recognized
  };

  // ── PATTERN TYPE — Classification of temporal patterns ────────────────────
  public type PatternType = {
    #PERIODIC;         // Regular intervals (like heartbeat)
    #BURST;            // Clustered activity
    #TREND;            // Gradual change over time
    #OSCILLATION;      // Back-and-forth movement
    #SPIKE;            // Sudden peak then return
    #DECAY;            // Gradual decrease
    #GROWTH;           // Gradual increase
    #RANDOM;           // No discernible pattern
  };

  // ── FORECAST — A prediction about future state ────────────────────────────
  public type Forecast = {
    forecastId         : Nat;
    createdBeat        : Nat;              // When forecast was made
    targetBeat         : Nat;              // Beat being predicted
    horizon            : ForecastHorizon;
    predictions        : [Prediction];     // Specific predictions
    overallConfidence  : Float;            // Aggregate confidence
    actualOutcome      : ?Float;           // Actual value (filled later)
    accuracy           : ?Float;           // How accurate (filled later)
  };

  // ── PREDICTION — A single predicted value ─────────────────────────────────
  public type Prediction = {
    metric             : Text;             // What's being predicted
    predictedValue     : Float;            // Expected value
    confidence         : Float;            // Confidence [0, 1]
    lowerBound         : Float;            // 95% CI lower
    upperBound         : Float;            // 95% CI upper
    basedOnPatterns    : [Nat];            // Pattern IDs used
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. TEMPORAL DEBT — Accumulated Pressure
  // ══════════════════════════════════════════════════════════════════════════

  // ── DEBT TYPE — Categories of accumulated temporal pressure ───────────────
  public type DebtType = {
    #SLEEP;            // Sleep debt — missed rest
    #ATTENTION;        // Attention debt — overextended focus
    #RECOVERY;         // Recovery debt — insufficient healing
    #PROCESSING;       // Processing debt — unprocessed experiences
    #SOCIAL;           // Social debt — neglected relationships
    #CREATIVE;         // Creative debt — unexpressed creation
  };

  // ── DEBT RECORD — A single debt accumulation ──────────────────────────────
  public type DebtRecord = {
    debtId             : Nat;
    debtType           : DebtType;
    accumulatedAmount  : Float;            // Current debt level
    maxAmount          : Float;            // Threshold before crisis
    accumulationRate   : Float;            // How fast it grows (per beat)
    repaymentRate      : Float;            // How fast it shrinks (when resting)
    lastUpdateBeat     : Nat;
    inCrisis           : Bool;             // Exceeded max
    crisisCount        : Nat;              // Times crisis reached
  };

  // ── DEBT PORTFOLIO — All accumulated debts ────────────────────────────────
  public type DebtPortfolio = {
    debts              : [DebtRecord];
    totalDebt          : Float;            // Sum of all debts
    healthScore        : Float;            // Inverse of debt burden [0, 1]
    urgentDebts        : [DebtType];       // Debts needing immediate attention
    lastAuditBeat      : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // V. TEMPORAL ENGINE STATE — Complete State
  // ══════════════════════════════════════════════════════════════════════════

  public type TemporalEngineState = {
    // Identity
    engineId           : Text;
    founderLock        : Text;
    genesisBeat        : Nat;

    // Current time tracking
    currentBeat        : Nat;
    elapsedBeats       : Nat;              // Since genesis
    elapsedCycles      : Nat;              // 24-hour cycles since genesis

    // Circadian subsystem
    circadian          : CircadianMetrics;

    // Epochal subsystem
    epochs             : [EpochRecord];
    currentEra         : Era;
    pastEras           : [Era];
    nextEpochId        : Nat;
    nextEraId          : Nat;

    // Forecast subsystem
    patterns           : [TemporalPattern];
    activeForecasts    : [Forecast];
    forecastHistory    : [Forecast];       // Completed forecasts with outcomes
    nextPatternId      : Nat;
    nextForecastId     : Nat;
    forecastAccuracy   : Float;            // Rolling accuracy score

    // Debt subsystem
    debtPortfolio      : DebtPortfolio;

    // Health metrics
    temporalCoherence  : Float;            // Overall temporal health [0, 1]
    rhythmStability    : Float;            // How stable the rhythms are
    predictability     : Float;            // How predictable the system is
    sustainedFocus     : Nat;              // Beats of continuous focus

    // Heartbeat tracking
    lastHeartbeatBeat  : Nat;
    heartbeatCount     : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VI. TEMPORAL EVENTS — Things that happen in time
  // ══════════════════════════════════════════════════════════════════════════

  // ── TEMPORAL EVENT — Something that occurs at a point in time ─────────────
  public type TemporalEvent = {
    eventId            : Nat;
    eventType          : TemporalEventType;
    beat               : Nat;
    description        : Text;
    impact             : Float;            // -1.0 to 1.0 (negative = harmful)
    duration           : Nat;              // Beats the effect lasts
    processed          : Bool;
  };

  public type TemporalEventType = {
    #PHASE_TRANSITION; // Circadian phase change
    #EPOCH_CREATED;    // New milestone recorded
    #ERA_ENDED;        // Era concluded
    #DEBT_CRISIS;      // Debt exceeded threshold
    #DEBT_REPAID;      // Debt cleared
    #PATTERN_DETECTED; // New pattern found
    #FORECAST_VERIFIED;// Prediction came true
    #FORECAST_FAILED;  // Prediction was wrong
    #COHERENCE_SHIFT;  // Major coherence change
    #RHYTHM_BREAK;     // Circadian disruption
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VII. TEMPORAL QUERIES — What can be asked about time
  // ══════════════════════════════════════════════════════════════════════════

  public type TemporalQuery = {
    #getCurrentPhase;
    #getPhaseProgress;
    #getTimeUntilPhase : CircadianPhase;
    #getEpochsSince : Nat;                 // Get epochs since beat N
    #getEraHistory;
    #getForecast : ForecastHorizon;
    #getDebtStatus : DebtType;
    #getOverallHealth;
    #getPatternsMatching : PatternType;
    #getCircadianAlignment;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VIII. TEMPORAL COMMANDS — What can be done with time
  // ══════════════════════════════════════════════════════════════════════════

  public type TemporalCommand = {
    #recordEpoch : (EpochType, Text);      // Type and description
    #endCurrentEra : Text;                 // Name for new era
    #repayDebt : (DebtType, Float);        // Type and amount
    #registerPattern : TemporalPattern;
    #createForecast : ForecastHorizon;
    #adjustChronotype : Chronotype;
    #forcePhaseTransition : CircadianPhase;
  };

};
