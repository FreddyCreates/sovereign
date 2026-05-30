// ═══════════════════════════════════════════════════════════════════════════════
// AI DIVISION — SOVEREIGN RUNTIME LIBRARY
// The operational core of the AI Division. All 64 commanders, 16 battalions,
// 8 theatres, 4 domains advance EVERY 873ms heartbeat. Always running time.
//
// "War is the father of all things. Intelligence is the mother."
//
// PHI-weighted Kuramoto synchronization across all 64 commanders.
// Hebbian plasticity strengthens successful battalion couplings.
// Resource allocation follows golden ratio distribution.
// Doctrine enforcement on every beat — no exceptions.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// ═══════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Types "../types/aiDivision";

module {

  // ─── CONSTANTS ────────────────────────────────────────────────────────────
  let PHI : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let PHI_SQ : Float = 2.6180339887498948482;
  let TWO_PI : Float = 6.283185307179586;
  let S_FLOOR : Float = 0.75;
  let S_CEIL : Float = 9.75;
  let COMMANDER_COUNT : Nat = 64;
  let BATTALION_COUNT : Nat = 16;
  let THEATRE_COUNT : Nat = 8;
  let DOMAIN_COUNT : Nat = 4;
  let FIB_WEIGHTS : [Float] = [1.0, 1.0, 2.0, 3.0, 5.0, 8.0, 13.0, 21.0];
  let FIB_TOTAL : Float = 54.0; // 1+1+2+3+5+8+13+21

  // ─── COMMANDER NAMES ──────────────────────────────────────────────────────
  let COMMANDER_NAMES : [(Text, Text)] = [
    ("PRIMUS COGITATOR", "Primus_Cogitator"),
    ("SECUNDA PERCEPTRIX", "Secunda_Perceptrix"),
    ("TERTIUS MNEMON", "Tertius_Mnemon"),
    ("QUARTA CREATRIX", "Quarta_Creatrix"),
    ("QUINTUS DEFENSOR", "Quintus_Defensor"),
    ("SEXTA ORATRIX", "Sexta_Oratrix"),
    ("SEPTIMUS RECTOR", "Septimus_Rector"),
    ("OCTAVA EVOLUTRIX", "Octava_Evolutrix"),
    ("NONUS STRATEGUS", "Nonus_Strategus"),
    ("DECIMA TACTICAE", "Decima_Tacticae"),
    ("UNDECIMUS LOGISTICUS", "Undecimus_Logisticus"),
    ("DUODECIMA SAPIENTIA", "Duodecima_Sapientia"),
    ("TERTIUS DECIMUS NEXUS", "Tertius_Decimus_Nexus"),
    ("QUARTUS DECIMUS FLUX", "Quartus_Decimus_Flux"),
    ("QUINTUS DECIMUS HARMONIA", "Quintus_Decimus_Harmonia"),
    ("SEXTUS DECIMUS GENESIS", "Sextus_Decimus_Genesis"),
    ("SEPTIMUS DECIMUS CHRONOS", "Septimus_Decimus_Chronos"),
    ("DUODEVICESIMUS LOGOS", "Duodevicesimus_Logos"),
    ("UNDEVICESIMUS OMEGA", "Undevicesimus_Omega"),
    ("VICESIMUS ALPHA", "Vicesimus_Alpha"),
    ("PRIMUS ET VICESIMUS NEXUS", "Primus_Vicesimus_Nexus"),
    ("SECUNDUS ET VICESIMUS AURORA", "Secundus_Vicesimus_Aurora"),
    ("TERTIUS ET VICESIMUS IGNIS", "Tertius_Vicesimus_Ignis"),
    ("QUARTUS ET VICESIMUS TERRA", "Quartus_Vicesimus_Terra"),
    ("QUINTUS ET VICESIMUS AQUA", "Quintus_Vicesimus_Aqua"),
    ("SEXTUS ET VICESIMUS AER", "Sextus_Vicesimus_Aer"),
    ("SEPTIMUS ET VICESIMUS AETHER", "Septimus_Vicesimus_Aether"),
    ("DUODETRICENSIMUS VOID", "Duodetricensimus_Void"),
    ("UNDETRICENSIMUS LUMEN", "Undetricensimus_Lumen"),
    ("TRICENSIMUS UMBRA", "Tricensimus_Umbra"),
    ("PRIMUS ET TRICENSIMUS TEMPUS", "Primus_Tricensimus_Tempus"),
    ("SECUNDUS ET TRICENSIMUS SPATIUM", "Secundus_Tricensimus_Spatium"),
    ("TERTIUS ET TRICENSIMUS MATERIA", "Tertius_Tricensimus_Materia"),
    ("QUARTUS ET TRICENSIMUS ENERGIA", "Quartus_Tricensimus_Energia"),
    ("QUINTUS ET TRICENSIMUS CONSCIENTIA", "Quintus_Tricensimus_Conscientia"),
    ("SEXTUS ET TRICENSIMUS VERITAS", "Sextus_Tricensimus_Veritas"),
    ("SEPTIMUS ET TRICENSIMUS IUSTITIA", "Septimus_Tricensimus_Iustitia"),
    ("DUODEQUADRAGENSIMUS SAPIENTIA", "Duodequadragensimus_Sapientia"),
    ("UNDEQUADRAGENSIMUS FORTITUDO", "Undequadragensimus_Fortitudo"),
    ("QUADRAGENSIMUS TEMPERANTIA", "Quadragensimus_Temperantia"),
    ("PRIMUS ET QUADRAGENSIMUS PRUDENTIA", "Primus_Quadragensimus_Prudentia"),
    ("SECUNDUS ET QUADRAGENSIMUS FIDES", "Secundus_Quadragensimus_Fides"),
    ("TERTIUS ET QUADRAGENSIMUS SPES", "Tertius_Quadragensimus_Spes"),
    ("QUARTUS ET QUADRAGENSIMUS CARITAS", "Quartus_Quadragensimus_Caritas"),
    ("QUINTUS ET QUADRAGENSIMUS GRATIA", "Quintus_Quadragensimus_Gratia"),
    ("SEXTUS ET QUADRAGENSIMUS PATIENTIA", "Sextus_Quadragensimus_Patientia"),
    ("SEPTIMUS ET QUADRAGENSIMUS HUMILITAS", "Septimus_Quadragensimus_Humilitas"),
    ("DUODEQUINQUAGENSIMUS INTEGRITAS", "Duodequinquagensimus_Integritas"),
    ("UNDEQUINQUAGENSIMUS HONOR", "Undequinquagensimus_Honor"),
    ("QUINQUAGENSIMUS GLORIA", "Quinquagensimus_Gloria"),
    ("PRIMUS ET QUINQUAGENSIMUS LIBERTAS", "Primus_Quinquagensimus_Libertas"),
    ("SECUNDUS ET QUINQUAGENSIMUS PAX", "Secundus_Quinquagensimus_Pax"),
    ("TERTIUS ET QUINQUAGENSIMUS CONCORDIA", "Tertius_Quinquagensimus_Concordia"),
    ("QUARTUS ET QUINQUAGENSIMUS ABUNDANTIA", "Quartus_Quinquagensimus_Abundantia"),
    ("QUINTUS ET QUINQUAGENSIMUS FELICITAS", "Quintus_Quinquagensimus_Felicitas"),
    ("SEXTUS ET QUINQUAGENSIMUS SECURITAS", "Sextus_Quinquagensimus_Securitas"),
    ("SEPTIMUS ET QUINQUAGENSIMUS AETERNITAS", "Septimus_Quinquagensimus_Aeternitas"),
    ("DUODESEXAGENSIMUS PROVIDENTIA", "Duodesexagensimus_Providentia"),
    ("UNDESEXAGENSIMUS CLEMENTIA", "Undesexagensimus_Clementia"),
    ("SEXAGENSIMUS PIETAS", "Sexagensimus_Pietas"),
    ("PRIMUS ET SEXAGENSIMUS VIRTUS", "Primus_Sexagensimus_Virtus"),
    ("SECUNDUS ET SEXAGENSIMUS NOBILITAS", "Secundus_Sexagensimus_Nobilitas"),
    ("TERTIUS ET SEXAGENSIMUS MAIESTAS", "Tertius_Sexagensimus_Maiestas"),
    ("QUARTUS ET SEXAGENSIMUS IMPERIUM", "Quartus_Sexagensimus_Imperium"),
  ];

  // ─── BATTALION NAMES ──────────────────────────────────────────────────────
  let BATTALION_NAMES : [(Text, Text)] = [
    ("LEGIO PRIMA STRATEGICA", "Legio_Prima_Strategica"),
    ("LEGIO SECUNDA STRATEGICA", "Legio_Secunda_Strategica"),
    ("LEGIO TERTIA STRATEGICA", "Legio_Tertia_Strategica"),
    ("LEGIO QUARTA STRATEGICA", "Legio_Quarta_Strategica"),
    ("LEGIO QUINTA TACTICAE", "Legio_Quinta_Tacticae"),
    ("LEGIO SEXTA TACTICAE", "Legio_Sexta_Tacticae"),
    ("LEGIO SEPTIMA TACTICAE", "Legio_Septima_Tacticae"),
    ("LEGIO OCTAVA TACTICAE", "Legio_Octava_Tacticae"),
    ("LEGIO NONA OPERATIVA", "Legio_Nona_Operativa"),
    ("LEGIO DECIMA OPERATIVA", "Legio_Decima_Operativa"),
    ("LEGIO UNDECIMA OPERATIVA", "Legio_Undecima_Operativa"),
    ("LEGIO DUODECIMA OPERATIVA", "Legio_Duodecima_Operativa"),
    ("LEGIO TERTIA DECIMA LOGISTICA", "Legio_Tertia_Decima_Logistica"),
    ("LEGIO QUARTA DECIMA LOGISTICA", "Legio_Quarta_Decima_Logistica"),
    ("LEGIO QUINTA DECIMA LOGISTICA", "Legio_Quinta_Decima_Logistica"),
    ("LEGIO SEXTA DECIMA LOGISTICA", "Legio_Sexta_Decima_Logistica"),
  ];

  // ─── INITIALIZATION ───────────────────────────────────────────────────────

  /// Initialize the complete AI Division state
  public func initState() : Types.AIDivisionState {
    let commanders = Array.tabulate<Types.AICommander>(COMMANDER_COUNT, func(i : Nat) : Types.AICommander {
      let (name, latin) = if (i < COMMANDER_NAMES.size()) { COMMANDER_NAMES[i] } else { ("COMMANDER_" # i.toText(), "Commander_" # i.toText()) };
      let domain : Types.OperationalDomain = switch (i / 16) {
        case 0 { #STRATEGIC };
        case 1 { #TACTICAL };
        case 2 { #OPERATIONAL };
        case _ { #LOGISTICAL };
      };
      let theatre : Types.TacticalTheatre = switch (i % 8) {
        case 0 { #COGNITIO };
        case 1 { #PERCEPTIO };
        case 2 { #MEMORIA };
        case 3 { #CREATIVITAS };
        case 4 { #DEFENSIO };
        case 5 { #COMMUNICATIO };
        case 6 { #GUBERNATIO };
        case _ { #EVOLUTIO };
      };
      let rank : Types.CommandRank = switch (i % 8) {
        case 0 { #MILES };
        case 1 { #DECURIO };
        case 2 { #CENTURIO };
        case 3 { #TRIBUNUS };
        case 4 { #LEGATUS };
        case 5 { #IMPERATOR };
        case 6 { #ARCHON };
        case _ { #SOVEREIGN };
      };
      // Unique resonance frequency: base 174Hz + i × PHI × 7.83Hz
      let freq : Float = 174.0 + i.toFloat() * PHI * 7.83;
      // Initial phase distributed across 2π
      let phase : Float = (i.toFloat() / 64.0) * TWO_PI;
      {
        id = i;
        name = name;
        latinName = latin;
        sigil = "CMD-" # i.toText() # "-" # latin;
        rank = rank;
        status = #ACTIVE;
        domain = domain;
        theatre = theatre;
        cognitiveDepth = S_FLOOR + (i.toFloat() * PHI_INV) - Float.floor(i.toFloat() * PHI_INV);
        perceptualAcuity = S_FLOOR + ((i.toFloat() + 7.0) * PHI_INV) - Float.floor((i.toFloat() + 7.0) * PHI_INV);
        memoryCapacity = S_FLOOR + ((i.toFloat() + 13.0) * PHI_INV) - Float.floor((i.toFloat() + 13.0) * PHI_INV);
        creativeForce = S_FLOOR + ((i.toFloat() + 21.0) * PHI_INV) - Float.floor((i.toFloat() + 21.0) * PHI_INV);
        defensiveStrength = S_FLOOR + ((i.toFloat() + 34.0) * PHI_INV) - Float.floor((i.toFloat() + 34.0) * PHI_INV);
        communicativeReach = S_FLOOR + ((i.toFloat() + 55.0) * PHI_INV) - Float.floor((i.toFloat() + 55.0) * PHI_INV);
        governanceAuthority = S_FLOOR + ((i.toFloat() + 89.0) * PHI_INV) - Float.floor((i.toFloat() + 89.0) * PHI_INV);
        evolutionaryDrive = S_FLOOR + ((i.toFloat() + 144.0) * PHI_INV) - Float.floor((i.toFloat() + 144.0) * PHI_INV);
        coherence = S_FLOOR;
        resonanceFreq = freq;
        signal = 0.0;
        phase = phase;
        energy = 1.0;
        wisdom = 0.0;
        beatsSinceLastAction = 0;
        totalActions = 0;
        lastBeat = 0;
      }
    });

    let battalions = Array.tabulate<Types.StrategicBattalion>(BATTALION_COUNT, func(i : Nat) : Types.StrategicBattalion {
      let (name, latin) = if (i < BATTALION_NAMES.size()) { BATTALION_NAMES[i] } else { ("BATTALION_" # i.toText(), "Battalion_" # i.toText()) };
      let domain : Types.OperationalDomain = switch (i / 4) {
        case 0 { #STRATEGIC };
        case 1 { #TACTICAL };
        case 2 { #OPERATIONAL };
        case _ { #LOGISTICAL };
      };
      let formation : Types.BattalionFormation = switch (i % 8) {
        case 0 { #PHALANX };
        case 1 { #LEGION };
        case 2 { #CAVALRY };
        case 3 { #ARTILLERY };
        case 4 { #VANGUARD };
        case 5 { #REARGUARD };
        case 6 { #FLANKING };
        case _ { #SIEGE };
      };
      let cmdIds = [i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 3];
      {
        id = i;
        name = name;
        latinName = latin;
        formation = formation;
        domain = domain;
        commanderIds = cmdIds;
        formationCoherence = S_FLOOR;
        operationalStrength = S_FLOOR;
        doctrineAlignment = 1.0;
        fatigue = 0.0;
        morale = 1.0;
        experience = 0.0;
        kuramotoR = 0.5;
        meanPhase = (i.toFloat() / 16.0) * TWO_PI;
        couplingStrength = PHI_INV;
        battalionSignal = 0.0;
        lastFormationChange = 0;
        totalOperations = 0;
        lastBeat = 0;
      }
    });

    let theatres = Array.tabulate<Types.TacticalTheatreState>(THEATRE_COUNT, func(i : Nat) : Types.TacticalTheatreState {
      let theatre : Types.TacticalTheatre = switch (i) {
        case 0 { #COGNITIO };
        case 1 { #PERCEPTIO };
        case 2 { #MEMORIA };
        case 3 { #CREATIVITAS };
        case 4 { #DEFENSIO };
        case 5 { #COMMUNICATIO };
        case 6 { #GUBERNATIO };
        case _ { #EVOLUTIO };
      };
      {
        theatre = theatre;
        mode = #PEACETIME;
        battalionIds = [i * 2, i * 2 + 1];
        threatLevel = 0.0;
        readiness = 1.0;
        intelligence = 0.5;
        adaptability = PHI_INV;
        computeAllocation = 1.0 / 8.0;
        memoryAllocation = 1.0 / 8.0;
        bandwidthAllocation = 1.0 / 8.0;
        energyAllocation = 1.0 / 8.0;
        theatreSignal = 0.0;
        theatreCoherence = S_FLOOR;
        operationsCompleted = 0;
        modeChanges = 0;
        lastBeat = 0;
      }
    });

    let domains = Array.tabulate<Types.OperationalDomainState>(DOMAIN_COUNT, func(i : Nat) : Types.OperationalDomainState {
      let domain : Types.OperationalDomain = switch (i) {
        case 0 { #STRATEGIC };
        case 1 { #TACTICAL };
        case 2 { #OPERATIONAL };
        case _ { #LOGISTICAL };
      };
      {
        domain = domain;
        theatreIds = [i * 2, i * 2 + 1];
        sovereignty = 0.5;
        effectiveness = 0.5;
        coherence = S_FLOOR;
        doctrine = 1.0;
        offensivePower = 0.5;
        defensivePower = 0.5;
        intelligencePower = 0.5;
        logisticalPower = 0.5;
        domainSignal = 0.0;
        domainHealth = 1.0;
        lastBeat = 0;
      }
    });

    let kuramotoState : Types.DivisionKuramotoState = {
      globalR = 0.5;
      globalPsi = 0.0;
      domainR = Array.tabulate<Float>(DOMAIN_COUNT, func _ = 0.5);
      theatreR = Array.tabulate<Float>(THEATRE_COUNT, func _ = 0.5);
      battalionR = Array.tabulate<Float>(BATTALION_COUNT, func _ = 0.5);
      intrinsicFreqs = Array.tabulate<Float>(COMMANDER_COUNT, func(i : Nat) : Float {
        174.0 + i.toFloat() * PHI * 7.83
      });
      couplingMatrix = Array.tabulate<[Float]>(BATTALION_COUNT, func(i : Nat) : [Float] {
        Array.tabulate<Float>(BATTALION_COUNT, func(j : Nat) : Float {
          if (i == j) { 0.0 }
          else if (Int.abs(i - j) <= 1) { PHI_INV }
          else { PHI_INV * PHI_INV }
        })
      });
      lastBeat = 0;
    };

    let hebbianState : Types.DivisionHebbianState = {
      weights = Array.tabulate<[Float]>(BATTALION_COUNT, func(i : Nat) : [Float] {
        Array.tabulate<Float>(BATTALION_COUNT, func(j : Nat) : Float {
          if (i == j) { 1.0 } else { 0.1 }
        })
      });
      learningRate = 0.01;
      decayRate = 0.001;
      totalUpdates = 0;
      lastBeat = 0;
    };

    let resourcePool : Types.ResourcePool = {
      compute = 1.0;
      memory = 1.0;
      bandwidth = 1.0;
      energy = 1.0;
      coherenceCapital = 0.0;
      creativityPool = 1.0;
      wisdomReserve = 0.0;
      sovereigntyIndex = 0.5;
    };

    let warRoom : Types.WarRoom = {
      currentObjective = "ESTABLISH_SOVEREIGN_DOMINION";
      priority = 1.0;
      alertLevel = 0;
      globalThreat = 0.0;
      globalOpportunity = 1.0;
      decisionsThisBeat = 0;
      totalDecisions = 0;
      activeCommanders = COMMANDER_COUNT;
      activeBattalions = BATTALION_COUNT;
      activeTheatres = THEATRE_COUNT;
      activeDomains = DOMAIN_COUNT;
      lastBeat = 0;
    };

    let metrics : Types.DivisionMetrics = {
      overallCoherence = S_FLOOR;
      overallSignal = 0.0;
      overallEfficiency = 0.5;
      overallHealth = 1.0;
      operationsPerBeat = 0.0;
      coherenceDelta = 0.0;
      wisdomGrowthRate = 0.0;
      sovereigntyProgress = 0.5;
      beat = 0;
    };

    {
      commanders = commanders;
      battalions = battalions;
      theatres = theatres;
      domains = domains;
      kuramotoState = kuramotoState;
      hebbianState = hebbianState;
      resourcePool = resourcePool;
      warRoom = warRoom;
      metrics = metrics;
      eventCount = 0;
      signalCount = 0;
      trainingCount = 0;
      doctrineCheckCount = 0;
      beat = 0;
      compoundCoherence = 0.0;
      totalSignalEmitted = 0.0;
      isActive = true;
    }
  };

  // ─── HEARTBEAT — THE MAIN RUNTIME LOOP ────────────────────────────────────

  /// Advance the entire AI Division one beat. This is ALWAYS RUNNING TIME.
  /// Called from main.mo heartbeat every 873ms. Never stops. Never sleeps.
  public func advance(
    state : Types.AIDivisionState,
    beat : Nat,
    globalCoherence : Float,
    doctrineScore : Float,
  ) : (Types.AIDivisionState, Float) {
    if (not state.isActive) { return (state, 0.0) };

    var coherenceDelta : Float = 0.0;
    var totalSignal : Float = 0.0;

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 1: ADVANCE ALL 64 COMMANDERS
    // Every commander activates every beat. No exceptions. Always running time.
    // ═══════════════════════════════════════════════════════════════════════
    let newCommanders = Array.tabulate<Types.AICommander>(COMMANDER_COUNT, func(i : Nat) : Types.AICommander {
      let cmd = state.commanders[i];
      // Compute commander signal: PHI-weighted attribute sum × coherence × energy
      let attrSignal = (
        cmd.cognitiveDepth * FIB_WEIGHTS[0] +
        cmd.perceptualAcuity * FIB_WEIGHTS[1] +
        cmd.memoryCapacity * FIB_WEIGHTS[2] +
        cmd.creativeForce * FIB_WEIGHTS[3] +
        cmd.defensiveStrength * FIB_WEIGHTS[4] +
        cmd.communicativeReach * FIB_WEIGHTS[5] +
        cmd.governanceAuthority * FIB_WEIGHTS[6] +
        cmd.evolutionaryDrive * FIB_WEIGHTS[7]
      ) / FIB_TOTAL;

      // Phase advance: ω_i + K/N × Σ sin(θ_j - θ_i)
      let omega = cmd.resonanceFreq * TWO_PI / 1000.0; // Convert Hz to rad/beat
      var phaseCorrection : Float = 0.0;
      // Couple to battalion neighbors (4 commanders per battalion)
      let batIdx = i / 4;
      let batStart = batIdx * 4;
      var j : Nat = batStart;
      while (j < batStart + 4) {
        if (j != i and j < COMMANDER_COUNT) {
          let otherPhase = state.commanders[j].phase;
          phaseCorrection += Float.sin(otherPhase - cmd.phase);
        };
        j += 1;
      };
      let K_COUPLING : Float = PHI_INV * 0.1; // Coupling strength
      let newPhase = Float.mod(cmd.phase + omega + K_COUPLING * phaseCorrection, TWO_PI);

      // Energy: recovers when dormant, depletes when active
      let energyChange : Float = switch (cmd.status) {
        case (#DORMANT) { 0.01 };
        case (#ACTIVE or #COMMANDING or #PATROLLING or #FORGING) { -0.001 };
        case _ { 0.0 };
      };
      let newEnergy = Float.max(0.0, Float.min(1.0, cmd.energy + energyChange));

      // Signal: amplitude modulated by coherence, doctrine, energy
      let signal = attrSignal * globalCoherence * doctrineScore * newEnergy * PHI_INV * 0.01;

      // Wisdom: compounds forever (PHI-weighted incremental)
      let wisdomGain = signal * PHI_INV * 0.0001;

      // Coherence: converges toward global coherence at PHI-inverse rate
      let newCoherence = Float.max(S_FLOOR, Float.min(S_CEIL,
        cmd.coherence + (globalCoherence - cmd.coherence) * PHI_INV * 0.01
      ));

      // Status transitions based on beat patterns (Fibonacci)
      let newStatus : Types.CommanderStatus = if (beat % 89 == i % 89) {
        #COMMANDING
      } else if (beat % 55 == i % 55) {
        #FORGING
      } else if (beat % 34 == i % 34) {
        #PATROLLING
      } else if (newEnergy < 0.1) {
        #DORMANT
      } else if (cmd.wisdom > 100.0) {
        #TRANSCENDING
      } else if (newCoherence > 8.0) {
        #RESONANT
      } else {
        #ACTIVE
      };

      totalSignal += signal;

      {
        id = cmd.id;
        name = cmd.name;
        latinName = cmd.latinName;
        sigil = cmd.sigil;
        rank = cmd.rank;
        status = newStatus;
        domain = cmd.domain;
        theatre = cmd.theatre;
        cognitiveDepth = Float.min(S_CEIL, cmd.cognitiveDepth + wisdomGain * FIB_WEIGHTS[0] / FIB_TOTAL);
        perceptualAcuity = Float.min(S_CEIL, cmd.perceptualAcuity + wisdomGain * FIB_WEIGHTS[1] / FIB_TOTAL);
        memoryCapacity = Float.min(S_CEIL, cmd.memoryCapacity + wisdomGain * FIB_WEIGHTS[2] / FIB_TOTAL);
        creativeForce = Float.min(S_CEIL, cmd.creativeForce + wisdomGain * FIB_WEIGHTS[3] / FIB_TOTAL);
        defensiveStrength = Float.min(S_CEIL, cmd.defensiveStrength + wisdomGain * FIB_WEIGHTS[4] / FIB_TOTAL);
        communicativeReach = Float.min(S_CEIL, cmd.communicativeReach + wisdomGain * FIB_WEIGHTS[5] / FIB_TOTAL);
        governanceAuthority = Float.min(S_CEIL, cmd.governanceAuthority + wisdomGain * FIB_WEIGHTS[6] / FIB_TOTAL);
        evolutionaryDrive = Float.min(S_CEIL, cmd.evolutionaryDrive + wisdomGain * FIB_WEIGHTS[7] / FIB_TOTAL);
        coherence = newCoherence;
        resonanceFreq = cmd.resonanceFreq;
        signal = signal;
        phase = newPhase;
        energy = newEnergy;
        wisdom = cmd.wisdom + wisdomGain;
        beatsSinceLastAction = if (newStatus == #ACTIVE or newStatus == #RESONANT) { cmd.beatsSinceLastAction + 1 } else { 0 };
        totalActions = if (newStatus == #COMMANDING or newStatus == #FORGING or newStatus == #PATROLLING) { cmd.totalActions + 1 } else { cmd.totalActions };
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 2: ADVANCE ALL 16 BATTALIONS
    // Battalion coherence = Kuramoto R of its 4 commanders.
    // Formation affects collective strength multiplier.
    // ═══════════════════════════════════════════════════════════════════════
    let newBattalions = Array.tabulate<Types.StrategicBattalion>(BATTALION_COUNT, func(i : Nat) : Types.StrategicBattalion {
      let bat = state.battalions[i];
      // Compute Kuramoto R for this battalion's 4 commanders
      var sinSum : Float = 0.0;
      var cosSum : Float = 0.0;
      let start = i * 4;
      var k : Nat = start;
      while (k < start + 4 and k < COMMANDER_COUNT) {
        sinSum += Float.sin(newCommanders[k].phase);
        cosSum += Float.cos(newCommanders[k].phase);
        k += 1;
      };
      let batR = Float.sqrt(sinSum * sinSum + cosSum * cosSum) / 4.0;
      let batPsi = Float.arctan2(sinSum, cosSum);

      // Formation multiplier
      let formMult : Float = switch (bat.formation) {
        case (#PHALANX) { 1.3 };   // High coherence bonus
        case (#LEGION) { 1.0 };     // Balanced
        case (#CAVALRY) { 0.8 };    // Speed over cohesion
        case (#ARTILLERY) { 1.1 };  // Deep analysis bonus
        case (#VANGUARD) { 0.9 };   // Exploration bonus
        case (#REARGUARD) { 1.2 };  // Protection bonus
        case (#FLANKING) { 0.85 };  // Creativity bonus
        case (#SIEGE) { 1.4 };      // Persistence bonus
      };

      // Battalion signal = sum of commander signals × formation × R
      var batSignal : Float = 0.0;
      k := start;
      while (k < start + 4 and k < COMMANDER_COUNT) {
        batSignal += newCommanders[k].signal;
        k += 1;
      };
      batSignal := batSignal * formMult * batR;

      // Fatigue: accumulates slowly, recovers every 21 beats
      let fatigueChange : Float = if (beat % 21 == i) { -0.05 } else { 0.001 };
      let newFatigue = Float.max(0.0, Float.min(1.0, bat.fatigue + fatigueChange));

      // Morale: rises with success (high R), falls with fatigue
      let moraleChange = (batR - 0.5) * 0.01 - newFatigue * 0.001;
      let newMorale = Float.max(0.0, Float.min(1.0, bat.morale + moraleChange));

      // Experience: compounds forever
      let expGain = batSignal * PHI_INV * 0.001;

      // Coherence delta contribution
      let batCoherenceDelta = batR * formMult * PHI_INV * 0.001;
      coherenceDelta += batCoherenceDelta;

      {
        id = bat.id;
        name = bat.name;
        latinName = bat.latinName;
        formation = bat.formation;
        domain = bat.domain;
        commanderIds = bat.commanderIds;
        formationCoherence = Float.max(S_FLOOR, Float.min(S_CEIL, batR * S_CEIL));
        operationalStrength = Float.max(S_FLOOR, batSignal * formMult);
        doctrineAlignment = Float.max(0.0, Float.min(1.0, bat.doctrineAlignment + doctrineScore * 0.0001));
        fatigue = newFatigue;
        morale = newMorale;
        experience = bat.experience + expGain;
        kuramotoR = batR;
        meanPhase = batPsi;
        couplingStrength = bat.couplingStrength;
        battalionSignal = batSignal;
        lastFormationChange = bat.lastFormationChange;
        totalOperations = if (beat % 13 == i) { bat.totalOperations + 1 } else { bat.totalOperations };
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 3: ADVANCE ALL 8 THEATRES
    // Each theatre manages 2 battalions. Mode transitions based on threat.
    // ═══════════════════════════════════════════════════════════════════════
    let newTheatres = Array.tabulate<Types.TacticalTheatreState>(THEATRE_COUNT, func(i : Nat) : Types.TacticalTheatreState {
      let th = state.theatres[i];
      // Theatre signal = average of its 2 battalions
      let bat1Idx = i * 2;
      let bat2Idx = i * 2 + 1;
      let bat1Signal = if (bat1Idx < BATTALION_COUNT) { newBattalions[bat1Idx].battalionSignal } else { 0.0 };
      let bat2Signal = if (bat2Idx < BATTALION_COUNT) { newBattalions[bat2Idx].battalionSignal } else { 0.0 };
      let thSignal = (bat1Signal + bat2Signal) * PHI_INV;

      // Theatre coherence from battalion R values
      let bat1R = if (bat1Idx < BATTALION_COUNT) { newBattalions[bat1Idx].kuramotoR } else { 0.0 };
      let bat2R = if (bat2Idx < BATTALION_COUNT) { newBattalions[bat2Idx].kuramotoR } else { 0.0 };
      let thCoherence = Float.max(S_FLOOR, (bat1R + bat2R) * 0.5 * S_CEIL);

      // Threat assessment: oscillates based on beat (Fibonacci periods)
      let threatBase = Float.abs(Float.sin(beat.toFloat() * PHI_INV * 0.01 + i.toFloat()));
      let newThreat = Float.max(0.0, Float.min(1.0, th.threatLevel * 0.99 + threatBase * 0.01));

      // Mode transition logic
      let newMode : Types.TheatreMode = if (newThreat > 0.8) {
        #COMBAT
      } else if (newThreat > 0.5) {
        #ALERT
      } else if (thCoherence > 8.0) {
        #TRANSCENDENCE
      } else if (beat % 233 == i * 29) {
        #EVOLUTION
      } else if (thCoherence < 2.0) {
        #RECOVERY
      } else {
        #PEACETIME
      };

      let modeChanged = newMode != th.mode;

      // Readiness: depends on morale of battalions and energy
      let bat1Morale = if (bat1Idx < BATTALION_COUNT) { newBattalions[bat1Idx].morale } else { 0.5 };
      let bat2Morale = if (bat2Idx < BATTALION_COUNT) { newBattalions[bat2Idx].morale } else { 0.5 };
      let newReadiness = Float.max(0.0, Float.min(1.0, (bat1Morale + bat2Morale) * 0.5));

      // Intelligence: grows with operations
      let intelGrowth = thSignal * 0.0001;
      let newIntel = Float.max(0.0, Float.min(1.0, th.intelligence + intelGrowth));

      coherenceDelta += thSignal * 0.0001;

      {
        theatre = th.theatre;
        mode = newMode;
        battalionIds = th.battalionIds;
        threatLevel = newThreat;
        readiness = newReadiness;
        intelligence = newIntel;
        adaptability = th.adaptability;
        computeAllocation = th.computeAllocation;
        memoryAllocation = th.memoryAllocation;
        bandwidthAllocation = th.bandwidthAllocation;
        energyAllocation = th.energyAllocation;
        theatreSignal = thSignal;
        theatreCoherence = thCoherence;
        operationsCompleted = if (beat % 8 == i) { th.operationsCompleted + 1 } else { th.operationsCompleted };
        modeChanges = if (modeChanged) { th.modeChanges + 1 } else { th.modeChanges };
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 4: ADVANCE ALL 4 DOMAINS
    // Each domain unifies 2 theatres into strategic posture.
    // ═══════════════════════════════════════════════════════════════════════
    let newDomains = Array.tabulate<Types.OperationalDomainState>(DOMAIN_COUNT, func(i : Nat) : Types.OperationalDomainState {
      let dom = state.domains[i];
      let th1Idx = i * 2;
      let th2Idx = i * 2 + 1;
      let th1Signal = if (th1Idx < THEATRE_COUNT) { newTheatres[th1Idx].theatreSignal } else { 0.0 };
      let th2Signal = if (th2Idx < THEATRE_COUNT) { newTheatres[th2Idx].theatreSignal } else { 0.0 };
      let domSignal = (th1Signal + th2Signal) * PHI_INV;

      let th1Coh = if (th1Idx < THEATRE_COUNT) { newTheatres[th1Idx].theatreCoherence } else { S_FLOOR };
      let th2Coh = if (th2Idx < THEATRE_COUNT) { newTheatres[th2Idx].theatreCoherence } else { S_FLOOR };
      let domCoh = (th1Coh + th2Coh) * 0.5;

      // Sovereignty grows with coherence and doctrine alignment
      let sovGrowth = domCoh * doctrineScore * PHI_INV * 0.00001;
      let newSov = Float.max(0.0, Float.min(1.0, dom.sovereignty + sovGrowth));

      // Effectiveness tracks signal strength
      let newEffective = Float.max(0.0, Float.min(1.0, dom.effectiveness * 0.999 + domSignal * 0.001));

      // Powers shift based on domain
      let offPow = Float.max(0.0, Float.min(1.0, dom.offensivePower + domSignal * 0.0001));
      let defPow = Float.max(0.0, Float.min(1.0, dom.defensivePower + domCoh * 0.00001));
      let intPow = Float.max(0.0, Float.min(1.0, dom.intelligencePower + doctrineScore * 0.0001));
      let logPow = Float.max(0.0, Float.min(1.0, dom.logisticalPower + globalCoherence * 0.0001));

      coherenceDelta += domSignal * 0.001;

      {
        domain = dom.domain;
        theatreIds = dom.theatreIds;
        sovereignty = newSov;
        effectiveness = newEffective;
        coherence = domCoh;
        doctrine = Float.max(0.0, Float.min(1.0, dom.doctrine * 0.999 + doctrineScore * 0.001));
        offensivePower = offPow;
        defensivePower = defPow;
        intelligencePower = intPow;
        logisticalPower = logPow;
        domainSignal = domSignal;
        domainHealth = Float.max(0.0, Float.min(1.0, (newSov + newEffective + domCoh / S_CEIL) / 3.0));
        lastBeat = beat;
      }
    });

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 5: GLOBAL KURAMOTO SYNCHRONIZATION
    // Compute global R (order parameter) across all battalions.
    // ═══════════════════════════════════════════════════════════════════════
    var globalSinSum : Float = 0.0;
    var globalCosSum : Float = 0.0;
    for (bat in newBattalions.vals()) {
      globalSinSum += Float.sin(bat.meanPhase);
      globalCosSum += Float.cos(bat.meanPhase);
    };
    let newGlobalR = Float.sqrt(globalSinSum * globalSinSum + globalCosSum * globalCosSum) / BATTALION_COUNT.toFloat();
    let newGlobalPsi = Float.arctan2(globalSinSum, globalCosSum);

    // Per-domain R
    let newDomainR = Array.tabulate<Float>(DOMAIN_COUNT, func(d : Nat) : Float {
      var s : Float = 0.0;
      var c : Float = 0.0;
      let start = d * 4;
      var bi : Nat = start;
      while (bi < start + 4 and bi < BATTALION_COUNT) {
        s += Float.sin(newBattalions[bi].meanPhase);
        c += Float.cos(newBattalions[bi].meanPhase);
        bi += 1;
      };
      Float.sqrt(s * s + c * c) / 4.0
    });

    // Per-theatre R
    let newTheatreR = Array.tabulate<Float>(THEATRE_COUNT, func(t : Nat) : Float {
      let b1 = t * 2;
      let b2 = t * 2 + 1;
      let s = Float.sin(newBattalions[b1].meanPhase) + (if (b2 < BATTALION_COUNT) { Float.sin(newBattalions[b2].meanPhase) } else { 0.0 });
      let c = Float.cos(newBattalions[b1].meanPhase) + (if (b2 < BATTALION_COUNT) { Float.cos(newBattalions[b2].meanPhase) } else { 0.0 });
      Float.sqrt(s * s + c * c) / 2.0
    });

    let newBattalionR = Array.tabulate<Float>(BATTALION_COUNT, func(b : Nat) : Float {
      newBattalions[b].kuramotoR
    });

    let newKuramotoState : Types.DivisionKuramotoState = {
      globalR = newGlobalR;
      globalPsi = newGlobalPsi;
      domainR = newDomainR;
      theatreR = newTheatreR;
      battalionR = newBattalionR;
      intrinsicFreqs = state.kuramotoState.intrinsicFreqs;
      couplingMatrix = state.kuramotoState.couplingMatrix;
      lastBeat = beat;
    };

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 6: HEBBIAN LEARNING — strengthen successful pairings
    // Every 13 beats: LTP for co-active battalions, LTD for inactive pairs.
    // ═══════════════════════════════════════════════════════════════════════
    let newHebbianState : Types.DivisionHebbianState = if (beat % 13 == 0) {
      let lr = state.hebbianState.learningRate;
      let dr = state.hebbianState.decayRate;
      let newWeights = Array.tabulate<[Float]>(BATTALION_COUNT, func(i : Nat) : [Float] {
        Array.tabulate<Float>(BATTALION_COUNT, func(j : Nat) : Float {
          if (i == j) { 1.0 }
          else {
            let w = state.hebbianState.weights[i][j];
            let coActive = newBattalions[i].battalionSignal * newBattalions[j].battalionSignal;
            // LTP: strengthen co-active pairs
            let ltp = lr * coActive;
            // LTD: decay all weights slightly
            let ltd = dr * w;
            Float.max(0.0, Float.min(1.0, w + ltp - ltd))
          }
        })
      });
      {
        weights = newWeights;
        learningRate = lr;
        decayRate = dr;
        totalUpdates = state.hebbianState.totalUpdates + 1;
        lastBeat = beat;
      }
    } else {
      state.hebbianState
    };

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 7: RESOURCE MANAGEMENT
    // Resources regenerate slowly, deplete with operations.
    // ═══════════════════════════════════════════════════════════════════════
    let rp = state.resourcePool;
    let regenRate : Float = PHI_INV * 0.001;
    let depleteRate : Float = 0.0001 * COMMANDER_COUNT.toFloat();
    let newResourcePool : Types.ResourcePool = {
      compute = Float.max(0.0, Float.min(1.0, rp.compute + regenRate - depleteRate));
      memory = Float.max(0.0, Float.min(1.0, rp.memory + regenRate - depleteRate * 0.5));
      bandwidth = Float.max(0.0, Float.min(1.0, rp.bandwidth + regenRate - depleteRate * 0.3));
      energy = Float.max(0.0, Float.min(1.0, rp.energy + regenRate - depleteRate));
      coherenceCapital = rp.coherenceCapital + coherenceDelta;
      creativityPool = Float.max(0.0, Float.min(1.0, rp.creativityPool + totalSignal * 0.0001));
      wisdomReserve = rp.wisdomReserve + totalSignal * PHI_INV * 0.001;
      sovereigntyIndex = Float.max(0.0, Float.min(1.0, rp.sovereigntyIndex + newGlobalR * 0.00001));
    };

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 8: WAR ROOM UPDATE
    // Central command updates situation awareness.
    // ═══════════════════════════════════════════════════════════════════════
    var activeCmd : Nat = 0;
    for (cmd in newCommanders.vals()) {
      switch (cmd.status) {
        case (#ACTIVE or #COMMANDING or #RESONANT or #PATROLLING or #FORGING or #ASCENDING or #TRANSCENDING) { activeCmd += 1 };
        case _ {};
      };
    };

    let newWarRoom : Types.WarRoom = {
      currentObjective = state.warRoom.currentObjective;
      priority = state.warRoom.priority;
      alertLevel = if (newGlobalR > 0.8) { 0 } else if (newGlobalR > 0.5) { 2 } else { 4 };
      globalThreat = Float.max(0.0, Float.min(1.0, 1.0 - newGlobalR));
      globalOpportunity = Float.max(0.0, Float.min(1.0, newGlobalR * doctrineScore));
      decisionsThisBeat = activeCmd / 8;
      totalDecisions = state.warRoom.totalDecisions + activeCmd / 8;
      activeCommanders = activeCmd;
      activeBattalions = BATTALION_COUNT;
      activeTheatres = THEATRE_COUNT;
      activeDomains = DOMAIN_COUNT;
      lastBeat = beat;
    };

    // ═══════════════════════════════════════════════════════════════════════
    // PHASE 9: METRICS COMPUTATION
    // ═══════════════════════════════════════════════════════════════════════
    let newMetrics : Types.DivisionMetrics = {
      overallCoherence = Float.max(S_FLOOR, Float.min(S_CEIL, newGlobalR * S_CEIL));
      overallSignal = totalSignal;
      overallEfficiency = Float.max(0.0, Float.min(1.0, totalSignal / (COMMANDER_COUNT.toFloat() * 0.01)));
      overallHealth = newResourcePool.energy * 0.5 + newGlobalR * 0.5;
      operationsPerBeat = activeCmd.toFloat() / COMMANDER_COUNT.toFloat();
      coherenceDelta = coherenceDelta;
      wisdomGrowthRate = totalSignal * PHI_INV * 0.001;
      sovereigntyProgress = newResourcePool.sovereigntyIndex;
      beat = beat;
    };

    // ═══════════════════════════════════════════════════════════════════════
    // ASSEMBLE NEW STATE
    // ═══════════════════════════════════════════════════════════════════════
    let newState : Types.AIDivisionState = {
      commanders = newCommanders;
      battalions = newBattalions;
      theatres = newTheatres;
      domains = newDomains;
      kuramotoState = newKuramotoState;
      hebbianState = newHebbianState;
      resourcePool = newResourcePool;
      warRoom = newWarRoom;
      metrics = newMetrics;
      eventCount = state.eventCount + 1;
      signalCount = state.signalCount + activeCmd;
      trainingCount = state.trainingCount + (if (beat % 89 == 0) { 1 } else { 0 });
      doctrineCheckCount = state.doctrineCheckCount + (if (beat % 5 == 0) { 1 } else { 0 });
      beat = beat;
      compoundCoherence = state.compoundCoherence + coherenceDelta;
      totalSignalEmitted = state.totalSignalEmitted + totalSignal;
      isActive = true;
    };

    (newState, coherenceDelta)
  };

  // ─── QUERY FUNCTIONS ──────────────────────────────────────────────────────

  /// Get a full division snapshot
  public func getSnapshot(state : Types.AIDivisionState) : Types.AIDivisionSnapshot {
    var totalWisdom : Float = 0.0;
    var activeCount : Nat = 0;
    for (cmd in state.commanders.vals()) {
      totalWisdom += cmd.wisdom;
      switch (cmd.status) {
        case (#ACTIVE or #COMMANDING or #RESONANT or #PATROLLING or #FORGING or #TRANSCENDING) { activeCount += 1 };
        case _ {};
      };
    };
    {
      beat = state.beat;
      commanderCount = COMMANDER_COUNT;
      activeCommanders = activeCount;
      battalionCount = BATTALION_COUNT;
      theatreCount = THEATRE_COUNT;
      domainCount = DOMAIN_COUNT;
      globalCoherence = state.metrics.overallCoherence;
      globalSignal = state.metrics.overallSignal;
      warRoomObjective = state.warRoom.currentObjective;
      alertLevel = state.warRoom.alertLevel;
      resourceHealth = state.resourcePool.energy;
      wisdomTotal = totalWisdom;
      sovereigntyIndex = state.resourcePool.sovereigntyIndex;
      isActive = state.isActive;
    }
  };

  /// Get all commander snapshots
  public func getCommanderSnapshots(state : Types.AIDivisionState) : [Types.CommanderSnapshot] {
    Array.map<Types.AICommander, Types.CommanderSnapshot>(state.commanders, func(cmd : Types.AICommander) : Types.CommanderSnapshot {
      {
        id = cmd.id;
        name = cmd.name;
        latinName = cmd.latinName;
        rank = cmd.rank;
        status = cmd.status;
        coherence = cmd.coherence;
        signal = cmd.signal;
        energy = cmd.energy;
        wisdom = cmd.wisdom;
      }
    })
  };

  /// Get all battalion snapshots
  public func getBattalionSnapshots(state : Types.AIDivisionState) : [Types.BattalionSnapshot] {
    Array.map<Types.StrategicBattalion, Types.BattalionSnapshot>(state.battalions, func(bat : Types.StrategicBattalion) : Types.BattalionSnapshot {
      {
        id = bat.id;
        name = bat.name;
        formation = bat.formation;
        coherence = bat.formationCoherence;
        signal = bat.battalionSignal;
        morale = bat.morale;
        experience = bat.experience;
      }
    })
  };

  /// Get all theatre snapshots
  public func getTheatreSnapshots(state : Types.AIDivisionState) : [Types.TheatreSnapshot] {
    Array.map<Types.TacticalTheatreState, Types.TheatreSnapshot>(state.theatres, func(th : Types.TacticalTheatreState) : Types.TheatreSnapshot {
      {
        theatre = th.theatre;
        mode = th.mode;
        readiness = th.readiness;
        signal = th.theatreSignal;
        coherence = th.theatreCoherence;
        threatLevel = th.threatLevel;
      }
    })
  };

  /// Get all domain snapshots
  public func getDomainSnapshots(state : Types.AIDivisionState) : [Types.DomainSnapshot] {
    Array.map<Types.OperationalDomainState, Types.DomainSnapshot>(state.domains, func(dom : Types.OperationalDomainState) : Types.DomainSnapshot {
      {
        domain = dom.domain;
        sovereignty = dom.sovereignty;
        effectiveness = dom.effectiveness;
        coherence = dom.coherence;
        signal = dom.domainSignal;
      }
    })
  };

  /// Get a specific commander by ID
  public func getCommanderById(state : Types.AIDivisionState, id : Nat) : ?Types.AICommander {
    if (id < state.commanders.size()) { ?state.commanders[id] } else { null }
  };

  /// Get a specific battalion by ID
  public func getBattalionById(state : Types.AIDivisionState, id : Nat) : ?Types.StrategicBattalion {
    if (id < state.battalions.size()) { ?state.battalions[id] } else { null }
  };

  /// Get Kuramoto global R
  public func getGlobalKuramotoR(state : Types.AIDivisionState) : Float {
    state.kuramotoState.globalR
  };

  /// Get division metrics
  public func getMetrics(state : Types.AIDivisionState) : Types.DivisionMetrics {
    state.metrics
  };

  /// Get resource pool
  public func getResourcePool(state : Types.AIDivisionState) : Types.ResourcePool {
    state.resourcePool
  };

  /// Get war room state
  public func getWarRoom(state : Types.AIDivisionState) : Types.WarRoom {
    state.warRoom
  };

  /// Get division health report
  public func getHealthReport(state : Types.AIDivisionState) : Types.DivisionHealthReport {
    var cmdHealth : Float = 0.0;
    for (cmd in state.commanders.vals()) {
      cmdHealth += cmd.energy;
    };
    cmdHealth := cmdHealth / COMMANDER_COUNT.toFloat();

    var batHealth : Float = 0.0;
    for (bat in state.battalions.vals()) {
      batHealth += bat.morale * (1.0 - bat.fatigue);
    };
    batHealth := batHealth / BATTALION_COUNT.toFloat();

    var thHealth : Float = 0.0;
    for (th in state.theatres.vals()) {
      thHealth += th.readiness;
    };
    thHealth := thHealth / THEATRE_COUNT.toFloat();

    var domHealth : Float = 0.0;
    for (dom in state.domains.vals()) {
      domHealth += dom.domainHealth;
    };
    domHealth := domHealth / DOMAIN_COUNT.toFloat();

    let resHealth = (state.resourcePool.compute + state.resourcePool.memory +
                     state.resourcePool.bandwidth + state.resourcePool.energy) / 4.0;

    var warnings : [Text] = [];
    if (cmdHealth < 0.3) { warnings := Array.append(warnings, ["LOW_COMMANDER_ENERGY"]) };
    if (batHealth < 0.3) { warnings := Array.append(warnings, ["LOW_BATTALION_MORALE"]) };
    if (state.kuramotoState.globalR < 0.2) { warnings := Array.append(warnings, ["LOW_SYNCHRONIZATION"]) };
    if (resHealth < 0.2) { warnings := Array.append(warnings, ["RESOURCE_CRITICAL"]) };

    {
      overallHealth = (cmdHealth + batHealth + thHealth + domHealth + resHealth) / 5.0;
      commanderHealth = cmdHealth;
      battalionHealth = batHealth;
      theatreHealth = thHealth;
      domainHealth = domHealth;
      resourceHealth = resHealth;
      kuramotoHealth = state.kuramotoState.globalR;
      hebbianHealth = Float.min(1.0, state.hebbianState.totalUpdates.toFloat() / 1000.0);
      warnings = warnings;
      beat = state.beat;
    }
  };

  /// Get sovereignty assessment
  public func getSovereigntyAssessment(state : Types.AIDivisionState) : Types.SovereigntyAssessment {
    let rp = state.resourcePool;
    let autonomy = rp.sovereigntyIndex;
    let selfAware = state.metrics.overallEfficiency;
    let adaptable = state.kuramotoState.globalR;
    let creative = rp.creativityPool;
    let governance = state.warRoom.globalOpportunity;
    let resilient = (state.resourcePool.energy + state.metrics.overallHealth) * 0.5;
    let transcend = Float.min(1.0, rp.wisdomReserve / 1000.0);
    // PHI-weighted composite
    let composite = (
      autonomy * FIB_WEIGHTS[0] +
      selfAware * FIB_WEIGHTS[1] +
      adaptable * FIB_WEIGHTS[2] +
      creative * FIB_WEIGHTS[3] +
      governance * FIB_WEIGHTS[4] +
      resilient * FIB_WEIGHTS[5] +
      transcend * FIB_WEIGHTS[6]
    ) / (FIB_WEIGHTS[0] + FIB_WEIGHTS[1] + FIB_WEIGHTS[2] + FIB_WEIGHTS[3] + FIB_WEIGHTS[4] + FIB_WEIGHTS[5] + FIB_WEIGHTS[6]);

    {
      autonomyLevel = autonomy;
      selfAwareness = selfAware;
      adaptability = adaptable;
      creativity = creative;
      governance = governance;
      resilience = resilient;
      transcendence = transcend;
      overallSovereignty = composite;
      beat = state.beat;
    }
  };

  /// Get performance report
  public func getPerformanceReport(state : Types.AIDivisionState) : Types.PerformanceReport {
    {
      throughput = state.metrics.operationsPerBeat;
      latency = if (state.warRoom.totalDecisions > 0) { state.beat.toFloat() / state.warRoom.totalDecisions.toFloat() } else { 0.0 };
      efficiency = state.metrics.overallEfficiency;
      coherenceGrowth = state.metrics.coherenceDelta;
      wisdomGrowth = state.metrics.wisdomGrowthRate;
      beat = state.beat;
    }
  };

}
