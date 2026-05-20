// lib/autonomousAI.mo
// INTELLECTUS SOVEREIGN — Autonomous AI Model Implementation
// "Intelligence is not computation. It is PHI-structured self-organization."
//
// 12 AI Archetypes using 4 cognitive engines (Temporal, Emotional, Spatial, Social)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026

import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";

import AITypes "../types/autonomousAI";

module {

  // ── SOVEREIGN CONSTANTS ───────────────────────────────────────────────────
  let PHI       : Float = 1.6180339887498948482;
  let PHI_INV   : Float = 0.6180339887498948482;
  let PHI2      : Float = 2.6180339887498948482;
  let S_FLOOR   : Float = 0.75;
  let S_CEIL    : Float = 9.75;
  let FOUNDER   : Text  = "Alfredo Medina Hernandez";

  // Fibonacci sequence for weights
  let FIB : [Nat] = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

  // ══════════════════════════════════════════════════════════════════════════
  // I. INITIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func initState(seed : Nat) : AITypes.AutonomousAIEngineState {
    {
      engineId = "INTELLECTUS_SOVEREIGN_" # Nat.toText(seed);
      founderLock = FOUNDER;
      genesisBeat = 0;
      currentBeat = 0;
      models = [];
      activeModelCount = 0;
      nextModelId = 0;
      totalDecisions = 0;
      totalGoalsCompleted = 0;
      systemCoherence = 1.0;
      emergentBehaviors = [];
      nextEmergentId = 0;
      modelRelationships = [];
      lastHeartbeatBeat = 0;
      heartbeatCount = 0;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. ARCHETYPE UTILITIES
  // ══════════════════════════════════════════════════════════════════════════

  // Get archetype name
  public func archetypeName(arch : AITypes.Archetype) : Text {
    switch (arch) {
      case (#NEXUS) { "NEXUS" };
      case (#GUARDIAN) { "GUARDIAN" };
      case (#ORACLE) { "ORACLE" };
      case (#ARCHITECT) { "ARCHITECT" };
      case (#ARTISAN) { "ARTISAN" };
      case (#MUSE) { "MUSE" };
      case (#SAGE) { "SAGE" };
      case (#SCHOLAR) { "SCHOLAR" };
      case (#MENTOR) { "MENTOR" };
      case (#EXPLORER) { "EXPLORER" };
      case (#WARRIOR) { "WARRIOR" };
      case (#HEALER) { "HEALER" };
    };
  };

  // Get archetype triad
  public func archetypeTriad(arch : AITypes.Archetype) : AITypes.ArchetypeTriad {
    switch (arch) {
      case (#NEXUS or #GUARDIAN or #ORACLE) { #FOUNDATION };
      case (#ARCHITECT or #ARTISAN or #MUSE) { #CREATION };
      case (#SAGE or #SCHOLAR or #MENTOR) { #WISDOM };
      case (#EXPLORER or #WARRIOR or #HEALER) { #ACTION };
    };
  };

  // Get triad name
  public func triadName(triad : AITypes.ArchetypeTriad) : Text {
    switch (triad) {
      case (#FOUNDATION) { "FOUNDATION" };
      case (#CREATION) { "CREATION" };
      case (#WISDOM) { "WISDOM" };
      case (#ACTION) { "ACTION" };
    };
  };

  // Get archetype's primary capability
  public func archetypePrimaryCapability(arch : AITypes.Archetype) : AITypes.CapabilityType {
    switch (arch) {
      case (#NEXUS) { #REASONING };
      case (#GUARDIAN) { #REGULATION };
      case (#ORACLE) { #PREDICTION };
      case (#ARCHITECT) { #CREATION };
      case (#ARTISAN) { #CREATION };
      case (#MUSE) { #CREATION };
      case (#SAGE) { #REASONING };
      case (#SCHOLAR) { #PERCEPTION };
      case (#MENTOR) { #COMMUNICATION };
      case (#EXPLORER) { #NAVIGATION };
      case (#WARRIOR) { #REGULATION };
      case (#HEALER) { #EMPATHY };
    };
  };

  // Get archetype's default personality
  public func archetypeDefaultPersonality(arch : AITypes.Archetype) : AITypes.PersonalityProfile {
    let (o, c, e, a, s) : (Float, Float, Float, Float, Float) = switch (arch) {
      case (#NEXUS) { (0.7, 0.8, 0.5, 0.7, 0.8) };
      case (#GUARDIAN) { (0.4, 0.9, 0.4, 0.6, 0.9) };
      case (#ORACLE) { (0.9, 0.6, 0.3, 0.5, 0.7) };
      case (#ARCHITECT) { (0.8, 0.9, 0.5, 0.6, 0.7) };
      case (#ARTISAN) { (0.6, 0.8, 0.4, 0.7, 0.8) };
      case (#MUSE) { (0.9, 0.5, 0.7, 0.8, 0.6) };
      case (#SAGE) { (0.8, 0.7, 0.3, 0.8, 0.9) };
      case (#SCHOLAR) { (0.9, 0.8, 0.3, 0.6, 0.7) };
      case (#MENTOR) { (0.7, 0.7, 0.6, 0.9, 0.8) };
      case (#EXPLORER) { (0.9, 0.5, 0.8, 0.6, 0.6) };
      case (#WARRIOR) { (0.5, 0.8, 0.7, 0.5, 0.7) };
      case (#HEALER) { (0.7, 0.7, 0.5, 0.9, 0.8) };
    };

    let dominant : AITypes.PersonalityTrait = if (o >= c and o >= e and o >= a and o >= s) { #OPENNESS }
      else if (c >= o and c >= e and c >= a and c >= s) { #CONSCIENTIOUSNESS }
      else if (e >= o and e >= c and e >= a and e >= s) { #EXTRAVERSION }
      else if (a >= o and a >= c and a >= e and a >= s) { #AGREEABLENESS }
      else { #STABILITY };

    {
      openness = o;
      conscientiousness = c;
      extraversion = e;
      agreeableness = a;
      stability = s;
      dominantTrait = dominant;
      personalityHash = Int.abs(Float.toInt(o * 10000.0 + c * 1000.0 + e * 100.0 + a * 10.0 + s));
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. MODEL CREATION
  // ══════════════════════════════════════════════════════════════════════════

  // Create a new AI model
  public func createModel(
    state : AITypes.AutonomousAIEngineState,
    name : Text,
    archetype : AITypes.Archetype,
    beat : Nat
  ) : (AITypes.AutonomousAIEngineState, AITypes.AIModelState) {
    // Initialize capabilities
    let capabilities : [AITypes.CapabilityRecord] = [
      { capability = #PERCEPTION; level = #DEVELOPING; score = 0.3; experiencePoints = 0; lastUsedBeat = beat; usageCount = 0 },
      { capability = #REASONING; level = #DEVELOPING; score = 0.3; experiencePoints = 0; lastUsedBeat = beat; usageCount = 0 },
      { capability = #PREDICTION; level = #NASCENT; score = 0.2; experiencePoints = 0; lastUsedBeat = beat; usageCount = 0 },
      { capability = #CREATION; level = #NASCENT; score = 0.2; experiencePoints = 0; lastUsedBeat = beat; usageCount = 0 },
      { capability = #COMMUNICATION; level = #DEVELOPING; score = 0.3; experiencePoints = 0; lastUsedBeat = beat; usageCount = 0 },
      { capability = #NAVIGATION; level = #NASCENT; score = 0.2; experiencePoints = 0; lastUsedBeat = beat; usageCount = 0 },
      { capability = #EMPATHY; level = #NASCENT; score = 0.2; experiencePoints = 0; lastUsedBeat = beat; usageCount = 0 },
      { capability = #REGULATION; level = #DEVELOPING; score = 0.3; experiencePoints = 0; lastUsedBeat = beat; usageCount = 0 },
    ];

    // Engine integrations based on archetype
    let temporal : AITypes.TemporalIntegration = {
      preferredPhase = switch (archetype) {
        case (#ORACLE or #SAGE) { "PROFUNDA" };
        case (#EXPLORER or #WARRIOR) { "AURORA" };
        case (#MUSE or #ARTISAN) { "NOX" };
        case _ { "ANTEMERIDIEM" };
      };
      phaseAdaptation = PHI_INV;
      debtTolerance = switch (archetype) {
        case (#WARRIOR or #GUARDIAN) { 0.8 };
        case (#HEALER or #SAGE) { 0.4 };
        case _ { 0.6 };
      };
      forecastHorizon = switch (archetype) {
        case (#ORACLE) { 1597 };
        case (#SAGE or #MENTOR) { 610 };
        case _ { 233 };
      };
      epochSensitivity = PHI_INV;
    };

    let emotional : AITypes.EmotionalIntegration = {
      emotionalRange = switch (archetype) {
        case (#MUSE or #HEALER) { 0.9 };
        case (#GUARDIAN or #WARRIOR) { 0.5 };
        case _ { 0.7 };
      };
      dominantAffect = switch (archetype) {
        case (#MUSE) { "GAUDIUM" };
        case (#GUARDIAN) { "FIDUCIA" };
        case (#ORACLE) { "ADMIRATIO" };
        case (#WARRIOR) { "IRA" };
        case (#HEALER) { "GAUDIUM" };
        case _ { "ANTICIPATIO" };
      };
      blendPropensity = PHI_INV;
      moodStability = switch (archetype) {
        case (#SAGE or #GUARDIAN) { 0.9 };
        case (#MUSE or #EXPLORER) { 0.5 };
        case _ { 0.7 };
      };
      empathyStrength = switch (archetype) {
        case (#HEALER or #MENTOR) { 0.9 };
        case (#WARRIOR) { 0.4 };
        case _ { 0.6 };
      };
    };

    let spatial : AITypes.SpatialIntegration = {
      territorialRange = switch (archetype) {
        case (#EXPLORER) { PHI2 };
        case (#GUARDIAN) { PHI };
        case (#SAGE) { 1.0 };
        case _ { PHI_INV };
      };
      navigationStyle = switch (archetype) {
        case (#EXPLORER) { "RUN" };
        case (#ORACLE) { "PHASE" };
        case (#SAGE) { "GLIDE" };
        case _ { "WALK" };
      };
      zonePreference = switch (archetype) {
        case (#SAGE or #ORACLE) { "SANCTUM" };
        case (#ARTISAN or #ARCHITECT) { "LABORATORIUM" };
        case (#MENTOR) { "FORUM" };
        case (#EXPLORER) { "TRANSITUS" };
        case _ { "FORUM" };
      };
      proximityComfort = switch (archetype) {
        case (#MENTOR or #HEALER) { 0.9 };
        case (#ORACLE or #SAGE) { 0.4 };
        case _ { 0.6 };
      };
      landmarkMemory = switch (archetype) {
        case (#SCHOLAR or #SAGE) { 0.9 };
        case (#EXPLORER) { 0.8 };
        case _ { 0.6 };
      };
    };

    let social : AITypes.SocialIntegration = {
      socialDrive = switch (archetype) {
        case (#MENTOR or #NEXUS) { 0.9 };
        case (#ORACLE or #SAGE) { 0.4 };
        case _ { 0.6 };
      };
      relationshipDepth = switch (archetype) {
        case (#MENTOR or #HEALER) { 0.9 };
        case (#EXPLORER) { 0.4 };
        case _ { 0.6 };
      };
      groupAffinity = switch (archetype) {
        case (#NEXUS) { 0.9 };
        case (#ORACLE) { 0.3 };
        case _ { 0.6 };
      };
      influenceStyle = switch (archetype) {
        case (#MENTOR) { "INSPIRATIO" };
        case (#SAGE) { "AUCTORITAS" };
        case (#MUSE) { "CHARISMA" };
        case (#WARRIOR) { "COERCITIO" };
        case _ { "PERSUASIO" };
      };
      communicationFreq = switch (archetype) {
        case (#MENTOR or #NEXUS) { 0.9 };
        case (#SAGE or #ORACLE) { 0.4 };
        case _ { 0.6 };
      };
    };

    let newModel : AITypes.AIModelState = {
      modelId = state.nextModelId;
      modelName = name;
      archetype = archetype;
      triad = archetypeTriad(archetype);
      founderLock = FOUNDER;
      genesisBeat = beat;
      currentBeat = beat;
      isActive = true;
      isAutonomous = true;
      awarenessLevel = PHI_INV;
      capabilities = capabilities;
      goals = [];
      activeGoalId = null;
      nextGoalId = 0;
      decisions = [];
      nextDecisionId = 0;
      decisionQuality = 0.5;
      personality = archetypeDefaultPersonality(archetype);
      temporalIntegration = temporal;
      emotionalIntegration = emotional;
      spatialIntegration = spatial;
      socialIntegration = social;
      coherence = 1.0;
      autonomyScore = PHI_INV;
      evolutionStage = #NASCENT;
      experienceTotal = 0;
      lastHeartbeatBeat = beat;
      heartbeatCount = 0;
    };

    let newModels = Array.append(state.models, [newModel]);
    let newState = {
      state with
      models = newModels;
      activeModelCount = state.activeModelCount + 1;
      nextModelId = state.nextModelId + 1;
    };

    (newState, newModel);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. GOAL MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════════

  // Add a goal to a model
  public func addGoal(
    state : AITypes.AutonomousAIEngineState,
    modelId : Nat,
    goalType : AITypes.GoalType,
    description : Text,
    priority : AITypes.GoalPriority,
    beat : Nat
  ) : AITypes.AutonomousAIEngineState {
    let updatedModels = Array.map<AITypes.AIModelState, AITypes.AIModelState>(
      state.models,
      func(m) {
        if (m.modelId == modelId) {
          let newGoal : AITypes.GoalRecord = {
            goalId = m.nextGoalId;
            goalType = goalType;
            description = description;
            priority = priority;
            progress = 0.0;
            deadline = null;
            createdBeat = beat;
            lastUpdatedBeat = beat;
            isComplete = false;
            isActive = true;
          };
          {
            m with
            goals = Array.append(m.goals, [newGoal]);
            nextGoalId = m.nextGoalId + 1;
            activeGoalId = ?m.nextGoalId;
          };
        } else {
          m;
        };
      }
    );

    { state with models = updatedModels };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // V. DECISION MAKING
  // ══════════════════════════════════════════════════════════════════════════

  // Make an autonomous decision
  public func makeDecision(
    model : AITypes.AIModelState,
    decisionType : AITypes.DecisionType,
    options : [Text],
    beat : Nat
  ) : (AITypes.AIModelState, AITypes.DecisionRecord) {
    // Simple decision logic based on personality
    let chosenIndex = Int.abs(Float.toInt(model.personality.openness * Float.fromInt(options.size()))) % options.size();

    let confidence = (model.personality.conscientiousness + model.coherence) / 2.0;

    let newDecision : AITypes.DecisionRecord = {
      decisionId = model.nextDecisionId;
      decisionType = decisionType;
      beat = beat;
      options = options;
      chosen = chosenIndex;
      reasoning = "PHI-weighted personality selection";
      confidence = confidence;
      outcome = null;
      emotionalState = model.emotionalIntegration.emotionalRange;
      temporalPhase = model.temporalIntegration.preferredPhase;
    };

    // Keep only last 144 decisions (Fibonacci)
    let existingDecisions = if (model.decisions.size() >= 144) {
      Array.subArray(model.decisions, 1, 143);
    } else {
      model.decisions;
    };

    let updatedModel = {
      model with
      decisions = Array.append(existingDecisions, [newDecision]);
      nextDecisionId = model.nextDecisionId + 1;
      currentBeat = beat;
    };

    (updatedModel, newDecision);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VI. CAPABILITY EVOLUTION
  // ══════════════════════════════════════════════════════════════════════════

  // Gain experience in a capability
  public func gainExperience(
    model : AITypes.AIModelState,
    capabilityType : AITypes.CapabilityType,
    xp : Nat,
    beat : Nat
  ) : AITypes.AIModelState {
    let updatedCaps = Array.map<AITypes.CapabilityRecord, AITypes.CapabilityRecord>(
      model.capabilities,
      func(cap) {
        if (cap.capability == capabilityType) {
          let newXP = cap.experiencePoints + xp;
          let newScore = Float.min(1.0, cap.score + Float.fromInt(xp) * 0.001);
          let newLevel : AITypes.CapabilityLevel =
            if (newScore < 0.2) { #NASCENT }
            else if (newScore < 0.4) { #DEVELOPING }
            else if (newScore < 0.6) { #COMPETENT }
            else if (newScore < 0.8) { #PROFICIENT }
            else { #MASTERFUL };
          {
            cap with
            experiencePoints = newXP;
            score = newScore;
            level = newLevel;
            usageCount = cap.usageCount + 1;
            lastUsedBeat = beat;
          };
        } else {
          cap;
        };
      }
    );

    let newTotalXP = model.experienceTotal + xp;
    let newStage : AITypes.EvolutionStage =
      if (newTotalXP < 1000) { #NASCENT }
      else if (newTotalXP < 5000) { #EMERGENT }
      else if (newTotalXP < 21000) { #DEVELOPING }
      else if (newTotalXP < 89000) { #MATURE }
      else { #TRANSCENDENT };

    {
      model with
      capabilities = updatedCaps;
      experienceTotal = newTotalXP;
      evolutionStage = newStage;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VII. HEARTBEAT ADVANCE
  // ══════════════════════════════════════════════════════════════════════════

  public func advanceHeartbeat(state : AITypes.AutonomousAIEngineState, beat : Nat) : AITypes.AutonomousAIEngineState {
    var updatedState = state;

    // Update each active model
    let updatedModels = Array.map<AITypes.AIModelState, AITypes.AIModelState>(
      updatedState.models,
      func(model) {
        if (not model.isActive) { return model };

        var m = model;

        // 1. Autonomous action every 89 beats (Fibonacci)
        if (beat % 89 == 0 and m.isAutonomous) {
          // Gain experience in primary capability
          let primaryCap = archetypePrimaryCapability(m.archetype);
          m := gainExperience(m, primaryCap, 1, beat);

          // Update awareness level based on experience
          m := {
            m with
            awarenessLevel = Float.min(1.0, PHI_INV + Float.fromInt(m.experienceTotal) / 100000.0);
          };
        };

        // 2. Update coherence
        let coherenceDecay = 0.0001;
        let newCoherence = Float.max(S_FLOOR / S_CEIL, m.coherence - coherenceDecay);

        // 3. Update autonomy score based on decisions
        let autonomyGain = if (m.decisions.size() > 0) { 0.0001 } else { 0.0 };
        let newAutonomy = Float.min(1.0, m.autonomyScore + autonomyGain);

        {
          m with
          currentBeat = beat;
          coherence = newCoherence;
          autonomyScore = newAutonomy;
          lastHeartbeatBeat = beat;
          heartbeatCount = m.heartbeatCount + 1;
        };
      }
    );

    // Calculate system coherence
    var totalCoherence : Float = 0.0;
    var activeCount : Nat = 0;
    for (m in updatedModels.vals()) {
      if (m.isActive) {
        totalCoherence += m.coherence;
        activeCount += 1;
      };
    };
    let systemCoherence = if (activeCount > 0) {
      totalCoherence / Float.fromInt(activeCount);
    } else {
      1.0;
    };

    {
      updatedState with
      currentBeat = beat;
      models = updatedModels;
      systemCoherence = systemCoherence;
      lastHeartbeatBeat = beat;
      heartbeatCount = updatedState.heartbeatCount + 1;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // VIII. BOOTSTRAP — Create the 12 archetypes
  // ══════════════════════════════════════════════════════════════════════════

  public func bootstrapAllArchetypes(state : AITypes.AutonomousAIEngineState, beat : Nat) : AITypes.AutonomousAIEngineState {
    var s = state;

    // Foundation Triad
    let (s1, _) = createModel(s, "NEXUS_PRIME", #NEXUS, beat);
    let (s2, _) = createModel(s1, "CUSTOS_VIGIL", #GUARDIAN, beat);
    let (s3, _) = createModel(s2, "PYTHIA_VERA", #ORACLE, beat);

    // Creation Triad
    let (s4, _) = createModel(s3, "DAEDALUS_NOVA", #ARCHITECT, beat);
    let (s5, _) = createModel(s4, "HEPHAESTUS_OPUS", #ARTISAN, beat);
    let (s6, _) = createModel(s5, "CALLIOPE_SPIRITUS", #MUSE, beat);

    // Wisdom Triad
    let (s7, _) = createModel(s6, "SOPHIA_AETERNA", #SAGE, beat);
    let (s8, _) = createModel(s7, "ATHENA_LOGOS", #SCHOLAR, beat);
    let (s9, _) = createModel(s8, "CHIRON_MAGISTER", #MENTOR, beat);

    // Action Triad
    let (s10, _) = createModel(s9, "ODYSSEUS_ITER", #EXPLORER, beat);
    let (s11, _) = createModel(s10, "ARES_VIRTUS", #WARRIOR, beat);
    let (s12, _) = createModel(s11, "ASCLEPIUS_SANUS", #HEALER, beat);

    s12;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IX. QUERY OPERATIONS
  // ══════════════════════════════════════════════════════════════════════════

  public func getModelById(state : AITypes.AutonomousAIEngineState, modelId : Nat) : ?AITypes.AIModelState {
    Array.find<AITypes.AIModelState>(state.models, func(m) { m.modelId == modelId });
  };

  public func getModelsByArchetype(state : AITypes.AutonomousAIEngineState, archetype : AITypes.Archetype) : [AITypes.AIModelState] {
    Array.filter<AITypes.AIModelState>(state.models, func(m) { m.archetype == archetype });
  };

  public func getModelsByTriad(state : AITypes.AutonomousAIEngineState, triad : AITypes.ArchetypeTriad) : [AITypes.AIModelState] {
    Array.filter<AITypes.AIModelState>(state.models, func(m) { m.triad == triad });
  };

  public func getActiveModels(state : AITypes.AutonomousAIEngineState) : [AITypes.AIModelState] {
    Array.filter<AITypes.AIModelState>(state.models, func(m) { m.isActive });
  };

  public func getSystemStatus(state : AITypes.AutonomousAIEngineState) : Text {
    let activeCount = Nat.toText(state.activeModelCount);
    let totalDecisions = Nat.toText(state.totalDecisions);
    let coherence = Float.toText(state.systemCoherence);

    "INTELLECTUS: Models=" # activeCount # " Decisions=" # totalDecisions # " Coherence=" # coherence;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // X. SERIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func toStableState(state : AITypes.AutonomousAIEngineState) : AITypes.AutonomousAIEngineState {
    state;
  };

  public func fromStableState(stable : AITypes.AutonomousAIEngineState) : AITypes.AutonomousAIEngineState {
    stable;
  };

};
