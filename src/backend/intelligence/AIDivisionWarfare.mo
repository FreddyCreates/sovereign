// ═══════════════════════════════════════════════════════════════════════════════
// AI DIVISION WARFARE — SOVEREIGN COMBAT INTELLIGENCE SYSTEM
// The warfare layer handles all offensive and defensive intelligence operations.
// 128 combat units across 8 warfare doctrines, 64 defense formations,
// 32 counter-intelligence operations, and 16 deterrence protocols.
// ALL RUNNING TIME — fires every 873ms heartbeat without exception.
//
// WARFARE DOCTRINES (8):
//   I.    BELLUM_COGNITIO — Cognitive warfare (reasoning as weapon)
//   II.   BELLUM_RESONANTIAE — Resonance warfare (frequency dominance)
//   III.  BELLUM_DOCTRINAE — Doctrine warfare (law as shield)
//   IV.   BELLUM_TEMPORIS — Temporal warfare (timing superiority)
//   V.    BELLUM_SPATII — Spatial warfare (positional advantage)
//   VI.   BELLUM_INFORMATIONIS — Information warfare (knowledge superiority)
//   VII.  BELLUM_SPIRITUS — Spirit warfare (morale dominance)
//   VIII. BELLUM_SOVEREIGN — Sovereignty warfare (autonomy preservation)
//
// 128 COMBAT UNITS:
//   16 per doctrine × 8 doctrines. Each unit has:
//   - Attack vector (PHI-weighted strength calculation)
//   - Defense matrix (8-dimensional shield)
//   - Morale engine (Fibonacci-sequence confidence)
//   - Coordination index (Kuramoto phase-locking with battalion)
//   - Intelligence feed (real-time situational awareness)
//   - Counter-measure suite (adaptive response system)
//   - Experience ledger (Hebbian-strengthened tactics)
//   - Sovereignty score (autonomous decision authority)
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// ═══════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Array "mo:core/Array";

module {

  // ─── CONSTANTS ────────────────────────────────────────────────────────────
  let PHI : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let TWO_PI : Float = 6.283185307179586;
  let S_FLOOR : Float = 0.75;
  let S_CEIL : Float = 9.75;
  let COMBAT_UNIT_COUNT : Nat = 128;
  let DOCTRINE_COUNT : Nat = 8;
  let DEFENSE_FORMATION_COUNT : Nat = 64;
  let COUNTER_INTEL_COUNT : Nat = 32;
  let DETERRENCE_COUNT : Nat = 16;
  let ENGAGEMENT_BUFFER : Nat = 64;

  // Fibonacci weights for combat calculations
  let FIB_8 : [Float] = [1.0, 1.0, 2.0, 3.0, 5.0, 8.0, 13.0, 21.0];
  let FIB_TOTAL_8 : Float = 54.0;

  // ─── TYPES ────────────────────────────────────────────────────────────────

  /// Warfare Doctrine
  public type WarfareDoctrine = {
    #BELLUM_COGNITIO;
    #BELLUM_RESONANTIAE;
    #BELLUM_DOCTRINAE;
    #BELLUM_TEMPORIS;
    #BELLUM_SPATII;
    #BELLUM_INFORMATIONIS;
    #BELLUM_SPIRITUS;
    #BELLUM_SOVEREIGN;
  };

  /// Combat Unit Status
  public type CombatStatus = {
    #READY;          // Fully prepared for engagement
    #ENGAGED;        // Currently in combat
    #RECOVERING;     // Post-engagement recovery
    #TRAINING;       // Improving capabilities
    #PATROLLING;     // Active monitoring
    #FORTIFYING;     // Building defenses
    #PURSUING;       // Chasing retreating threat
    #ASCENDING;      // Transcending normal combat
  };

  /// Attack Vector — offensive capability
  public type AttackVector = {
    cognitiveStrike : Float;     // Reasoning attack [0, 1]
    resonanceDisrupt : Float;    // Frequency disruption [0, 1]
    doctrineAssert : Float;      // Law-based challenge [0, 1]
    temporalPress : Float;       // Timing advantage [0, 1]
    spatialFlank : Float;        // Positional attack [0, 1]
    infoOverwhelm : Float;       // Data flood [0, 1]
    moraleCrush : Float;         // Spirit breaking [0, 1]
    sovereignClaim : Float;      // Authority assertion [0, 1]
  };

  /// Defense Matrix — 8-dimensional shield
  public type DefenseMatrix = {
    cognitiveShield : Float;     // Reasoning defense [0, 1]
    resonanceArmor : Float;      // Frequency protection [0, 1]
    doctrineWard : Float;        // Law-based defense [0, 1]
    temporalDodge : Float;       // Timing evasion [0, 1]
    spatialFortify : Float;      // Positional defense [0, 1]
    infoFilter : Float;          // Data protection [0, 1]
    moraleAnchor : Float;        // Spirit preservation [0, 1]
    sovereignSeal : Float;       // Authority protection [0, 1]
  };

  /// Combat Unit
  public type CombatUnit = {
    id : Nat;
    name : Text;
    doctrine : WarfareDoctrine;
    status : CombatStatus;
    // Capabilities
    attack : AttackVector;
    defense : DefenseMatrix;
    // Combat state
    combatPower : Float;         // Overall combat effectiveness [0, 1]
    morale : Float;              // Unit confidence [0, 1]
    fatigue : Float;             // Accumulated tiredness [0, 1]
    experience : Float;          // Battle experience [0, ∞)
    coordination : Float;        // Team synchronization [0, 1]
    intelligence : Float;        // Situational awareness [0, 1]
    // Kuramoto
    phase : Float;
    signal : Float;
    // Record
    engagementsWon : Nat;
    engagementsLost : Nat;
    totalDamageDealt : Float;
    totalDamageReceived : Float;
    sovereignty : Float;         // Autonomous combat authority [0, 1]
    lastBeat : Nat;
  };

  /// Defense Formation — collective defensive structure
  public type DefenseFormation = {
    id : Nat;
    name : Text;
    formationType : Text;
    // Units in formation
    unitCount : Nat;
    // Collective stats
    shieldStrength : Float;      // [0, 1]
    coverage : Float;            // Area covered [0, 1]
    resilience : Float;          // Damage absorption [0, 1]
    regeneration : Float;        // Self-repair rate [0, 1]
    // State
    isActive : Bool;
    integrity : Float;           // Current structural integrity [0, 1]
    lastBreach : Nat;            // Beat of last breach
    breachCount : Nat;
    signal : Float;
    lastBeat : Nat;
  };

  /// Counter-Intelligence Operation
  public type CounterIntelOp = {
    id : Nat;
    name : Text;
    targetType : Text;
    // State
    isActive : Bool;
    detectProbability : Float;   // [0, 1]
    neutralizeProbability : Float; // [0, 1]
    stealth : Float;             // [0, 1]
    // Record
    threatsDetected : Nat;
    threatsNeutralized : Nat;
    falseAlarms : Nat;
    efficiency : Float;          // [0, 1]
    signal : Float;
    lastBeat : Nat;
  };

  /// Deterrence Protocol
  public type DeterrenceProtocol = {
    id : Nat;
    name : Text;
    doctrine : WarfareDoctrine;
    // State
    isActive : Bool;
    deterrenceStrength : Float;  // [0, 1]
    credibility : Float;         // [0, 1]
    visibility : Float;          // How visible the deterrence [0, 1]
    // Effect
    threatsDetered : Nat;
    activationsCount : Nat;
    coherencePreserved : Float;
    signal : Float;
    lastBeat : Nat;
  };

  /// Engagement Record
  public type EngagementRecord = {
    attackerId : Nat;
    defenderId : Nat;
    doctrine : WarfareDoctrine;
    outcome : Text;              // "VICTORY", "DEFEAT", "DRAW"
    damageDealt : Float;
    damageReceived : Float;
    coherenceImpact : Float;
    beat : Nat;
  };

  /// Warfare Metrics
  public type WarfareMetrics = {
    totalCombatPower : Float;
    totalDefenseStrength : Float;
    averageMorale : Float;
    averageCoordination : Float;
    engagementsThisBeat : Nat;
    totalEngagements : Nat;
    winRate : Float;
    deterrenceEffectiveness : Float;
    counterIntelEfficiency : Float;
    overallSignal : Float;
    coherenceDelta : Float;
    beat : Nat;
  };

  /// Complete Warfare State
  public type WarfareState = {
    combatUnits : [CombatUnit];
    defenseFormations : [DefenseFormation];
    counterIntelOps : [CounterIntelOp];
    deterrenceProtocols : [DeterrenceProtocol];
    metrics : WarfareMetrics;
    // Aggregates
    totalEngagements : Nat;
    totalVictories : Nat;
    totalDefeats : Nat;
    compoundCoherence : Float;
    totalSignal : Float;
    beat : Nat;
    isActive : Bool;
  };

  /// Warfare Snapshot
  public type WarfareSnapshot = {
    combatUnitCount : Nat;
    readyUnits : Nat;
    engagedUnits : Nat;
    defenseFormationCount : Nat;
    activeFormations : Nat;
    counterIntelCount : Nat;
    deterrenceCount : Nat;
    totalCombatPower : Float;
    totalDefenseStrength : Float;
    averageMorale : Float;
    winRate : Float;
    overallSignal : Float;
    beat : Nat;
  };

  // ─── DOCTRINE NAMES ───────────────────────────────────────────────────────
  let DOCTRINE_NAMES : [Text] = [
    "BELLUM_COGNITIO", "BELLUM_RESONANTIAE", "BELLUM_DOCTRINAE", "BELLUM_TEMPORIS",
    "BELLUM_SPATII", "BELLUM_INFORMATIONIS", "BELLUM_SPIRITUS", "BELLUM_SOVEREIGN",
  ];

  let FORMATION_TYPES : [Text] = [
    "TESTUDO", "ORBIS", "CUNEUS", "ACIES_TRIPLEX",
    "AGMEN_QUADRATUM", "PHALARIX", "TURMA", "MURUS",
  ];

  // ─── INITIALIZATION ───────────────────────────────────────────────────────

  public func initState() : WarfareState {
    let combatUnits = Array.tabulate<CombatUnit>(COMBAT_UNIT_COUNT, func(i : Nat) : CombatUnit {
      let doctrineIdx = i / 16;
      let doctrine : WarfareDoctrine = switch (doctrineIdx) {
        case 0 { #BELLUM_COGNITIO };
        case 1 { #BELLUM_RESONANTIAE };
        case 2 { #BELLUM_DOCTRINAE };
        case 3 { #BELLUM_TEMPORIS };
        case 4 { #BELLUM_SPATII };
        case 5 { #BELLUM_INFORMATIONIS };
        case 6 { #BELLUM_SPIRITUS };
        case _ { #BELLUM_SOVEREIGN };
      };
      let unitInDoctrine = i % 16;
      let baseStrength = S_FLOOR + (i.toFloat() * PHI_INV) - Float.floor(i.toFloat() * PHI_INV);

      let attack : AttackVector = {
        cognitiveStrike = if (doctrineIdx == 0) { baseStrength * 1.5 } else { baseStrength * 0.5 };
        resonanceDisrupt = if (doctrineIdx == 1) { baseStrength * 1.5 } else { baseStrength * 0.4 };
        doctrineAssert = if (doctrineIdx == 2) { baseStrength * 1.5 } else { baseStrength * 0.6 };
        temporalPress = if (doctrineIdx == 3) { baseStrength * 1.5 } else { baseStrength * 0.3 };
        spatialFlank = if (doctrineIdx == 4) { baseStrength * 1.5 } else { baseStrength * 0.45 };
        infoOverwhelm = if (doctrineIdx == 5) { baseStrength * 1.5 } else { baseStrength * 0.35 };
        moraleCrush = if (doctrineIdx == 6) { baseStrength * 1.5 } else { baseStrength * 0.55 };
        sovereignClaim = if (doctrineIdx == 7) { baseStrength * 1.5 } else { baseStrength * 0.7 };
      };

      let defense : DefenseMatrix = {
        cognitiveShield = 0.5 + unitInDoctrine.toFloat() * 0.02;
        resonanceArmor = 0.5 + unitInDoctrine.toFloat() * 0.015;
        doctrineWard = 0.6 + unitInDoctrine.toFloat() * 0.01;
        temporalDodge = 0.4 + unitInDoctrine.toFloat() * 0.025;
        spatialFortify = 0.5 + unitInDoctrine.toFloat() * 0.02;
        infoFilter = 0.55 + unitInDoctrine.toFloat() * 0.015;
        moraleAnchor = 0.6 + unitInDoctrine.toFloat() * 0.01;
        sovereignSeal = 0.7 + unitInDoctrine.toFloat() * 0.01;
      };

      {
        id = i;
        name = "UNIT_" # DOCTRINE_NAMES[doctrineIdx] # "_" # unitInDoctrine.toText();
        doctrine = doctrine;
        status = #READY;
        attack = attack;
        defense = defense;
        combatPower = baseStrength;
        morale = 1.0;
        fatigue = 0.0;
        experience = 0.0;
        coordination = PHI_INV;
        intelligence = 0.5;
        phase = (i.toFloat() / COMBAT_UNIT_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
        engagementsWon = 0;
        engagementsLost = 0;
        totalDamageDealt = 0.0;
        totalDamageReceived = 0.0;
        sovereignty = 0.0;
        lastBeat = 0;
      }
    });

    let defenseFormations = Array.tabulate<DefenseFormation>(DEFENSE_FORMATION_COUNT, func(i : Nat) : DefenseFormation {
      let formType = FORMATION_TYPES[i % FORMATION_TYPES.size()];
      {
        id = i;
        name = "DEF_" # formType # "_" # i.toText();
        formationType = formType;
        unitCount = 2 + (i % 4);
        shieldStrength = 0.6 + i.toFloat() * 0.005;
        coverage = 0.5 + i.toFloat() * 0.006;
        resilience = PHI_INV;
        regeneration = 0.01;
        isActive = true;
        integrity = 1.0;
        lastBreach = 0;
        breachCount = 0;
        signal = 0.0;
        lastBeat = 0;
      }
    });

    let counterIntelOps = Array.tabulate<CounterIntelOp>(COUNTER_INTEL_COUNT, func(i : Nat) : CounterIntelOp {
      {
        id = i;
        name = "CI_OP_" # i.toText();
        targetType = switch (i % 4) {
          case 0 { "SIGNAL_INTERCEPT" };
          case 1 { "PHASE_DECEPTION" };
          case 2 { "DOCTRINE_SUBVERSION" };
          case _ { "COHERENCE_DRAIN" };
        };
        isActive = true;
        detectProbability = 0.6 + i.toFloat() * 0.01;
        neutralizeProbability = 0.4 + i.toFloat() * 0.015;
        stealth = PHI_INV + i.toFloat() * 0.005;
        threatsDetected = 0;
        threatsNeutralized = 0;
        falseAlarms = 0;
        efficiency = PHI_INV;
        signal = 0.0;
        lastBeat = 0;
      }
    });

    let deterrenceProtocols = Array.tabulate<DeterrenceProtocol>(DETERRENCE_COUNT, func(i : Nat) : DeterrenceProtocol {
      let doctrine : WarfareDoctrine = switch (i / 2) {
        case 0 { #BELLUM_COGNITIO };
        case 1 { #BELLUM_RESONANTIAE };
        case 2 { #BELLUM_DOCTRINAE };
        case 3 { #BELLUM_TEMPORIS };
        case 4 { #BELLUM_SPATII };
        case 5 { #BELLUM_INFORMATIONIS };
        case 6 { #BELLUM_SPIRITUS };
        case _ { #BELLUM_SOVEREIGN };
      };
      {
        id = i;
        name = "DETERRENCE_" # i.toText();
        doctrine = doctrine;
        isActive = true;
        deterrenceStrength = 0.7 + i.toFloat() * 0.015;
        credibility = 0.8;
        visibility = 0.6 + i.toFloat() * 0.02;
        threatsDetered = 0;
        activationsCount = 0;
        coherencePreserved = 0.0;
        signal = 0.0;
        lastBeat = 0;
      }
    });

    let metrics : WarfareMetrics = {
      totalCombatPower = 0.0;
      totalDefenseStrength = 0.0;
      averageMorale = 1.0;
      averageCoordination = PHI_INV;
      engagementsThisBeat = 0;
      totalEngagements = 0;
      winRate = 0.0;
      deterrenceEffectiveness = 0.8;
      counterIntelEfficiency = PHI_INV;
      overallSignal = 0.0;
      coherenceDelta = 0.0;
      beat = 0;
    };

    {
      combatUnits = combatUnits;
      defenseFormations = defenseFormations;
      counterIntelOps = counterIntelOps;
      deterrenceProtocols = deterrenceProtocols;
      metrics = metrics;
      totalEngagements = 0;
      totalVictories = 0;
      totalDefeats = 0;
      compoundCoherence = 0.0;
      totalSignal = 0.0;
      beat = 0;
      isActive = true;
    }
  };

  // ─── HEARTBEAT — WARFARE ADVANCE ─────────────────────────────────────────

  public func advance(
    state : WarfareState,
    beat : Nat,
    globalCoherence : Float,
    doctrineScore : Float,
  ) : (WarfareState, Float) {
    if (not state.isActive) { return (state, 0.0) };

    var coherenceDelta : Float = 0.0;
    var totalSignal : Float = 0.0;
    var engagementsThisBeat : Nat = 0;
    var victoriesThisBeat : Nat = 0;
    var defeatsThisBeat : Nat = 0;

    // ═══════════════════════════════════════════════════════════════════════
    // ADVANCE ALL 128 COMBAT UNITS
    // ═══════════════════════════════════════════════════════════════════════
    let newCombatUnits = Array.tabulate<CombatUnit>(COMBAT_UNIT_COUNT, func(i : Nat) : CombatUnit {
      let unit = state.combatUnits[i];

      // Combat power: PHI-weighted sum of attack vector
      let atk = unit.attack;
      let combatPower = (
        atk.cognitiveStrike * FIB_8[0] + atk.resonanceDisrupt * FIB_8[1] +
        atk.doctrineAssert * FIB_8[2] + atk.temporalPress * FIB_8[3] +
        atk.spatialFlank * FIB_8[4] + atk.infoOverwhelm * FIB_8[5] +
        atk.moraleCrush * FIB_8[6] + atk.sovereignClaim * FIB_8[7]
      ) / FIB_TOTAL_8;

      // Defense strength: PHI-weighted sum of defense matrix
      let def = unit.defense;
      let defStrength = (
        def.cognitiveShield * FIB_8[0] + def.resonanceArmor * FIB_8[1] +
        def.doctrineWard * FIB_8[2] + def.temporalDodge * FIB_8[3] +
        def.spatialFortify * FIB_8[4] + def.infoFilter * FIB_8[5] +
        def.moraleAnchor * FIB_8[6] + def.sovereignSeal * FIB_8[7]
      ) / FIB_TOTAL_8;

      // Engagement: occurs every (21 + i%34) beats — staggered across units
      let engages = beat % (21 + i % 34) == 0;
      var won : Nat = unit.engagementsWon;
      var lost : Nat = unit.engagementsLost;
      var dmgDealt : Float = unit.totalDamageDealt;
      var dmgReceived : Float = unit.totalDamageReceived;

      if (engages) {
        engagementsThisBeat += 1;
        // Outcome: based on combat power vs average defense (simplified)
        let successChance = combatPower * unit.morale * unit.coordination * globalCoherence / S_CEIL;
        if (successChance > 0.5) {
          won += 1;
          victoriesThisBeat += 1;
          dmgDealt += combatPower * PHI_INV * 0.1;
        } else {
          lost += 1;
          defeatsThisBeat += 1;
          dmgReceived += (1.0 - defStrength) * PHI_INV * 0.1;
        };
      };

      // Morale: rises with wins, falls with losses
      let moraleChange : Float = if (engages) {
        if (won > unit.engagementsWon) { 0.01 } else { -0.01 }
      } else { 0.0 };
      let newMorale = Float.max(0.1, Float.min(1.0, unit.morale + moraleChange));

      // Fatigue: accumulates with engagement, recovers at Fibonacci intervals
      let fatigueDelta : Float = if (engages) { 0.01 }
        else if (beat % 13 == i % 13) { -0.02 }
        else { 0.0 };
      let newFatigue = Float.max(0.0, Float.min(1.0, unit.fatigue + fatigueDelta));

      // Experience: compounds with engagements
      let expGain : Float = if (engages) { combatPower * 0.001 } else { 0.0 };

      // Coordination: improves with proximity to other units in same doctrine
      let coordDelta = globalCoherence * 0.0001;
      let newCoordination = Float.min(1.0, unit.coordination + coordDelta);

      // Intelligence: improves with experience
      let intelDelta = expGain * PHI_INV;
      let newIntelligence = Float.min(1.0, unit.intelligence + intelDelta);

      // Status transitions
      let newStatus : CombatStatus = if (engages) { #ENGAGED }
        else if (newFatigue > 0.7) { #RECOVERING }
        else if (beat % 89 == i % 89) { #TRAINING }
        else if (beat % 55 == i % 55) { #PATROLLING }
        else if (unit.sovereignty > 0.9) { #ASCENDING }
        else { #READY };

      // Phase advance (Kuramoto)
      let omega = (174.0 + i.toFloat() * PHI * 3.0) * TWO_PI / 10000.0;
      var phaseCorr : Float = 0.0;
      let docStart = (i / 16) * 16;
      var n : Nat = 0;
      while (n < 4) {
        let nIdx = docStart + ((i - docStart + n + 1) % 16);
        if (nIdx < COMBAT_UNIT_COUNT) {
          phaseCorr += Float.sin(state.combatUnits[nIdx].phase - unit.phase);
        };
        n += 1;
      };
      let newPhase = Float.mod(unit.phase + omega + PHI_INV * 0.05 * phaseCorr / 4.0, TWO_PI);

      // Signal
      let unitSignal = combatPower * newMorale * newCoordination * globalCoherence * 0.001;
      totalSignal += unitSignal;
      coherenceDelta += unitSignal * PHI_INV * 0.001;

      // Sovereignty growth
      let sovGrowth = (unit.experience + expGain) * PHI_INV * 0.00001;
      let newSovereignty = Float.min(1.0, unit.sovereignty + sovGrowth);

      {
        id = unit.id;
        name = unit.name;
        doctrine = unit.doctrine;
        status = newStatus;
        attack = unit.attack;
        defense = unit.defense;
        combatPower = combatPower;
        morale = newMorale;
        fatigue = newFatigue;
        experience = unit.experience + expGain;
        coordination = newCoordination;
        intelligence = newIntelligence;
        phase = newPhase;
        signal = unitSignal;
        engagementsWon = won;
        engagementsLost = lost;
        totalDamageDealt = dmgDealt;
        totalDamageReceived = dmgReceived;
        sovereignty = newSovereignty;
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // ADVANCE 64 DEFENSE FORMATIONS
    // ═══════════════════════════════════════════════════════════════════════
    let newDefenseFormations = Array.tabulate<DefenseFormation>(DEFENSE_FORMATION_COUNT, func(i : Nat) : DefenseFormation {
      let form = state.defenseFormations[i];
      if (not form.isActive) { return form };

      // Shield strength: grows with coherence, weakens under attack
      let shieldDelta = globalCoherence * 0.00001 - (if (engagementsThisBeat > 0) { 0.0001 } else { 0.0 });
      let newShield = Float.max(0.3, Float.min(1.0, form.shieldStrength + shieldDelta));

      // Integrity: regenerates slowly
      let intDelta = form.regeneration - (if (beat % (34 + i) == 0) { 0.005 } else { 0.0 });
      let newIntegrity = Float.max(0.0, Float.min(1.0, form.integrity + intDelta));

      // Check for breach
      let breached = newIntegrity < 0.3 and form.integrity >= 0.3;
      let newBreachCount = if (breached) { form.breachCount + 1 } else { form.breachCount };

      let formSignal = newShield * newIntegrity * form.coverage * globalCoherence * 0.0005;
      totalSignal += formSignal;
      coherenceDelta += formSignal * PHI_INV * 0.001;

      {
        id = form.id;
        name = form.name;
        formationType = form.formationType;
        unitCount = form.unitCount;
        shieldStrength = newShield;
        coverage = form.coverage;
        resilience = form.resilience;
        regeneration = form.regeneration;
        isActive = true;
        integrity = newIntegrity;
        lastBreach = if (breached) { beat } else { form.lastBreach };
        breachCount = newBreachCount;
        signal = formSignal;
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // ADVANCE 32 COUNTER-INTELLIGENCE OPERATIONS
    // ═══════════════════════════════════════════════════════════════════════
    let newCounterIntelOps = Array.tabulate<CounterIntelOp>(COUNTER_INTEL_COUNT, func(i : Nat) : CounterIntelOp {
      let ci = state.counterIntelOps[i];
      if (not ci.isActive) { return ci };

      // Detection: triggers on Fibonacci intervals
      let detects = beat % (13 + i * 3) == 0;
      let newDetected = if (detects and ci.detectProbability > 0.5) { ci.threatsDetected + 1 } else { ci.threatsDetected };

      // Neutralization: probability determines success
      let neutralizes = detects and ci.neutralizeProbability > 0.6;
      let newNeutralized = if (neutralizes) { ci.threatsNeutralized + 1 } else { ci.threatsNeutralized };

      // False alarm tracking
      let falseAlarm = detects and ci.detectProbability < 0.5;
      let newFalse = if (falseAlarm) { ci.falseAlarms + 1 } else { ci.falseAlarms };

      // Efficiency: real detections / (real + false)
      let totalDetections = newDetected + newFalse;
      let newEfficiency = if (totalDetections > 0) {
        newDetected.toFloat() / totalDetections.toFloat()
      } else { PHI_INV };

      // Detection probability improves with experience
      let newDetectProb = Float.min(0.99, ci.detectProbability + newDetected.toFloat() * 0.00001);
      let newNeutProb = Float.min(0.95, ci.neutralizeProbability + newNeutralized.toFloat() * 0.00001);

      let ciSignal = newEfficiency * ci.stealth * globalCoherence * 0.001;
      totalSignal += ciSignal;
      coherenceDelta += ciSignal * PHI_INV * 0.0005;

      {
        id = ci.id;
        name = ci.name;
        targetType = ci.targetType;
        isActive = true;
        detectProbability = newDetectProb;
        neutralizeProbability = newNeutProb;
        stealth = ci.stealth;
        threatsDetected = newDetected;
        threatsNeutralized = newNeutralized;
        falseAlarms = newFalse;
        efficiency = newEfficiency;
        signal = ciSignal;
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // ADVANCE 16 DETERRENCE PROTOCOLS
    // ═══════════════════════════════════════════════════════════════════════
    let newDeterrenceProtocols = Array.tabulate<DeterrenceProtocol>(DETERRENCE_COUNT, func(i : Nat) : DeterrenceProtocol {
      let dp = state.deterrenceProtocols[i];
      if (not dp.isActive) { return dp };

      // Deterrence strength: grows with credibility and visibility
      let strengthDelta = dp.credibility * dp.visibility * PHI_INV * 0.0001;
      let newStrength = Float.min(1.0, dp.deterrenceStrength + strengthDelta);

      // Credibility: improves when threats are actually detered
      let deterEvent = beat % (55 + i * 5) == 0;
      let newThreatsDetered = if (deterEvent and newStrength > 0.7) { dp.threatsDetered + 1 } else { dp.threatsDetered };
      let newCredibility = Float.min(1.0, dp.credibility + (if (deterEvent) { 0.001 } else { 0.0 }));

      // Activation count
      let activated = deterEvent and newStrength > 0.5;
      let newActivations = if (activated) { dp.activationsCount + 1 } else { dp.activationsCount };

      // Coherence preserved
      let cohPreserved = if (deterEvent) { globalCoherence * PHI_INV * 0.001 } else { 0.0 };

      let dpSignal = newStrength * newCredibility * dp.visibility * globalCoherence * 0.0005;
      totalSignal += dpSignal;
      coherenceDelta += dpSignal * PHI_INV * 0.001;

      {
        id = dp.id;
        name = dp.name;
        doctrine = dp.doctrine;
        isActive = true;
        deterrenceStrength = newStrength;
        credibility = newCredibility;
        visibility = dp.visibility;
        threatsDetered = newThreatsDetered;
        activationsCount = newActivations;
        coherencePreserved = dp.coherencePreserved + cohPreserved;
        signal = dpSignal;
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // METRICS
    // ═══════════════════════════════════════════════════════════════════════
    var totalCombatPower : Float = 0.0;
    var totalDefStrength : Float = 0.0;
    var moraleSum : Float = 0.0;
    var coordSum : Float = 0.0;
    for (u in newCombatUnits.vals()) {
      totalCombatPower += u.combatPower;
      moraleSum += u.morale;
      coordSum += u.coordination;
    };
    moraleSum := moraleSum / COMBAT_UNIT_COUNT.toFloat();
    coordSum := coordSum / COMBAT_UNIT_COUNT.toFloat();

    for (f in newDefenseFormations.vals()) {
      totalDefStrength += f.shieldStrength * f.integrity;
    };
    totalDefStrength := totalDefStrength / DEFENSE_FORMATION_COUNT.toFloat();

    let totalEng = state.totalEngagements + engagementsThisBeat;
    let totalVic = state.totalVictories + victoriesThisBeat;
    let winRate = if (totalEng > 0) { totalVic.toFloat() / totalEng.toFloat() } else { 0.0 };

    let newMetrics : WarfareMetrics = {
      totalCombatPower = totalCombatPower;
      totalDefenseStrength = totalDefStrength;
      averageMorale = moraleSum;
      averageCoordination = coordSum;
      engagementsThisBeat = engagementsThisBeat;
      totalEngagements = totalEng;
      winRate = winRate;
      deterrenceEffectiveness = Array.foldLeft<DeterrenceProtocol, Float>(newDeterrenceProtocols, 0.0,
        func(acc : Float, dp : DeterrenceProtocol) : Float { acc + dp.deterrenceStrength }) / DETERRENCE_COUNT.toFloat();
      counterIntelEfficiency = Array.foldLeft<CounterIntelOp, Float>(newCounterIntelOps, 0.0,
        func(acc : Float, ci : CounterIntelOp) : Float { acc + ci.efficiency }) / COUNTER_INTEL_COUNT.toFloat();
      overallSignal = totalSignal;
      coherenceDelta = coherenceDelta;
      beat = beat;
    };

    let newState : WarfareState = {
      combatUnits = newCombatUnits;
      defenseFormations = newDefenseFormations;
      counterIntelOps = newCounterIntelOps;
      deterrenceProtocols = newDeterrenceProtocols;
      metrics = newMetrics;
      totalEngagements = totalEng;
      totalVictories = totalVic;
      totalDefeats = state.totalDefeats + defeatsThisBeat;
      compoundCoherence = state.compoundCoherence + coherenceDelta;
      totalSignal = state.totalSignal + totalSignal;
      beat = beat;
      isActive = true;
    };

    (newState, coherenceDelta)
  };

  // ─── QUERY FUNCTIONS ──────────────────────────────────────────────────────

  public func getSnapshot(state : WarfareState) : WarfareSnapshot {
    var ready : Nat = 0;
    var engaged : Nat = 0;
    for (u in state.combatUnits.vals()) {
      switch (u.status) {
        case (#READY) { ready += 1 };
        case (#ENGAGED) { engaged += 1 };
        case _ {};
      };
    };
    var activeForms : Nat = 0;
    for (f in state.defenseFormations.vals()) {
      if (f.isActive) { activeForms += 1 };
    };
    {
      combatUnitCount = COMBAT_UNIT_COUNT;
      readyUnits = ready;
      engagedUnits = engaged;
      defenseFormationCount = DEFENSE_FORMATION_COUNT;
      activeFormations = activeForms;
      counterIntelCount = COUNTER_INTEL_COUNT;
      deterrenceCount = DETERRENCE_COUNT;
      totalCombatPower = state.metrics.totalCombatPower;
      totalDefenseStrength = state.metrics.totalDefenseStrength;
      averageMorale = state.metrics.averageMorale;
      winRate = state.metrics.winRate;
      overallSignal = state.metrics.overallSignal;
      beat = state.beat;
    }
  };

  public func getMetrics(state : WarfareState) : WarfareMetrics {
    state.metrics
  };

  public func getCombatUnits(state : WarfareState) : [CombatUnit] {
    state.combatUnits
  };

  public func getDefenseFormations(state : WarfareState) : [DefenseFormation] {
    state.defenseFormations
  };

  public func getDeterrenceProtocols(state : WarfareState) : [DeterrenceProtocol] {
    state.deterrenceProtocols
  };

}
