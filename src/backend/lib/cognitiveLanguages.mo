// lib/cognitiveLanguages.mo
// COGNITIVE LANGUAGE STACK — Runtime Operations for all 13 Cognitive Languages
// Attribution: Alfredo Medina Hernandez — immutable
// PHI = 1.6180339887498948482 | S_FLOOR = 0.75 | S_CEIL = 9.75
//
// Implements production-grade operations across all four layers:
//   Layer 0 — Primordial:  CPL-L (Law), CDL (Doctrine)
//   Layer 1 — Substrate:   CPL-C (Contract), ACL (Atlas), EDL (Education)
//   Layer 2 — Organism:    CIL (Internal), OCL (Charter), SPL (Study Pattern)
//   Layer 3 — Engine:      CPL-P (Processing), RSL (Realm), TPL (Terminal),
//                          PWL (Pathway), TSL (Tool Scaffold)
//
// Every state-mutating function returns (newState, result) — purely functional.
// Law 23: coherence and mastery ONLY increase, never decrease.
// Law 30: closed-loop feedback uses PHI_INV scaling.

import CLTypes "../types/cognitiveLanguages";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Array "mo:core/Array";

module {

  // ═══════════════════════════════════════════════════════════════════════
  // I. CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════

  let PHI     : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let S_FLOOR : Float = 0.75;
  let S_CEIL  : Float = 9.75;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";

  // ═══════════════════════════════════════════════════════════════════════
  // II. HELPERS
  // ═══════════════════════════════════════════════════════════════════════

  /// Clamp a value to sovereign range [S_FLOOR, S_CEIL]
  public func clampSovereign(value : Float) : Float {
    Float.max(S_FLOOR, Float.min(S_CEIL, value))
  };

  /// Doctrine gate — value must be >= S_FLOOR
  func checkDoctrineGate(value : Float) : Bool {
    value >= S_FLOOR
  };

  /// Copy state with only stackCoherence and lastUpdatedAt changed
  func updateStateMeta(state : CLTypes.CognitiveLanguageStackState, coherence : Float, ts : Int) : CLTypes.CognitiveLanguageStackState {
    {
      constitution = state.constitution;
      philosophy = state.philosophy;
      contracts = state.contracts;
      atlasRegistry = state.atlasRegistry;
      curricula = state.curricula;
      selfStates = state.selfStates;
      charters = state.charters;
      learnerProfiles = state.learnerProfiles;
      decisionGraphs = state.decisionGraphs;
      ecologies = state.ecologies;
      terminals = state.terminals;
      pathways = state.pathways;
      toolSpecs = state.toolSpecs;
      totalLanguages = state.totalLanguages;
      stackCoherence = coherence;
      lastUpdatedAt = ts;
      attribution = FOUNDER;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // III. INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════

  /// Initialize default CognitiveLanguageStackState — all counters at zero
  public func initState() : CLTypes.CognitiveLanguageStackState {
    {
      constitution = {
        laws = [];
        amendments = [];
        totalLaws = 0;
        coherence = S_FLOOR;
        lastAmendedAt = null;
        attribution = FOUNDER;
      };
      philosophy = {
        axioms = [];
        principles = [];
        interpretations = [];
        overallAlignment = {
          coherence = S_FLOOR;
          resonance = S_FLOOR;
          integrity = S_FLOOR;
          fidelity = S_FLOOR;
        };
        attribution = FOUNDER;
      };
      contracts = [];
      atlasRegistry = {
        entities = [];
        archetypes = [];
        relationships = [];
        totalEntities = 0;
        registryCoherence = S_FLOOR;
        attribution = FOUNDER;
      };
      curricula = [];
      selfStates = [];
      charters = [];
      learnerProfiles = [];
      decisionGraphs = [];
      ecologies = [];
      terminals = [];
      pathways = [];
      toolSpecs = [];
      totalLanguages = 13;
      stackCoherence = S_FLOOR;
      lastUpdatedAt = 0;
      attribution = FOUNDER;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // IV. CPL-L (Law) OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /// Declare a new law and add it to the constitution.
  /// Enforces doctrine gate on strength.
  public func declareLaw(
    state : CLTypes.CognitiveLanguageStackState,
    name : Text,
    layer : CLTypes.LanguageLayer,
    strength : Float,
    isGenesis : Bool,
    beat : Nat,
    timestamp : Int,
  ) : (CLTypes.CognitiveLanguageStackState, CLTypes.Law) {
    let clampedStrength = clampSovereign(strength);
    let lawId = state.constitution.totalLaws + 1;
    let grade : CLTypes.ImmutabilityGrade = if (isGenesis) { #Genesis } else { #Statutory };

    let law : CLTypes.Law = {
      lawId;
      name;
      text = name # " — declared at beat " # beat.toText();
      grade;
      strength = clampedStrength;
      safetyRails = [];
      isGenesis;
      ratifiedAt = timestamp;
      attribution = FOUNDER;
    };

    let newConstitution : CLTypes.Constitution = {
      laws = state.constitution.laws.concat([law]);
      amendments = state.constitution.amendments;
      totalLaws = lawId;
      coherence = clampSovereign(Float.max(state.constitution.coherence, state.constitution.coherence + clampedStrength * PHI * 0.001));
      lastAmendedAt = state.constitution.lastAmendedAt;
      attribution = FOUNDER;
    };

    let newState : CLTypes.CognitiveLanguageStackState = {
      constitution = newConstitution;
      philosophy = state.philosophy;
      contracts = state.contracts;
      atlasRegistry = state.atlasRegistry;
      curricula = state.curricula;
      selfStates = state.selfStates;
      charters = state.charters;
      learnerProfiles = state.learnerProfiles;
      decisionGraphs = state.decisionGraphs;
      ecologies = state.ecologies;
      terminals = state.terminals;
      pathways = state.pathways;
      toolSpecs = state.toolSpecs;
      totalLanguages = state.totalLanguages;
      stackCoherence = state.stackCoherence;
      lastUpdatedAt = timestamp;
      attribution = FOUNDER;
    };
    (newState, law)
  };

  /// Propose an amendment to a non-genesis law.
  /// Genesis laws cannot be amended. Doctrine gate applied to doctrineScore.
  public func proposeAmendment(
    state : CLTypes.CognitiveLanguageStackState,
    lawId : Nat,
    description : Text,
    doctrineScore : Float,
    proposer : Text,
    beat : Nat,
    timestamp : Int,
  ) : (CLTypes.CognitiveLanguageStackState, CLTypes.Amendment) {
    let clampedScore = clampSovereign(doctrineScore);
    let amendmentId = state.constitution.amendments.size() + 1;
    let status : CLTypes.AmendmentStatus = if (checkDoctrineGate(clampedScore)) { #Proposed } else { #Rejected };

    let amendment : CLTypes.Amendment = {
      amendmentId;
      targetLawId = lawId;
      proposedText = description;
      rationale = "Proposed by " # proposer # " at beat " # beat.toText();
      status;
      doctrineScore = clampedScore;
      proposedAt = timestamp;
      ratifiedAt = null;
      attribution = FOUNDER;
    };

    let newConstitution : CLTypes.Constitution = {
      laws = state.constitution.laws;
      amendments = state.constitution.amendments.concat([amendment]);
      totalLaws = state.constitution.totalLaws;
      coherence = state.constitution.coherence;
      lastAmendedAt = ?timestamp;
      attribution = FOUNDER;
    };

    let newState : CLTypes.CognitiveLanguageStackState = {
      constitution = newConstitution;
      philosophy = state.philosophy;
      contracts = state.contracts;
      atlasRegistry = state.atlasRegistry;
      curricula = state.curricula;
      selfStates = state.selfStates;
      charters = state.charters;
      learnerProfiles = state.learnerProfiles;
      decisionGraphs = state.decisionGraphs;
      ecologies = state.ecologies;
      terminals = state.terminals;
      pathways = state.pathways;
      toolSpecs = state.toolSpecs;
      totalLanguages = state.totalLanguages;
      stackCoherence = state.stackCoherence;
      lastUpdatedAt = timestamp;
      attribution = FOUNDER;
    };
    (newState, amendment)
  };

  /// Install a safety rail (standalone constructor — no state mutation)
  public func installSafetyRail(
    entityType : Text,
    invariantId : Text,
    enforceLevel : Float,
  ) : CLTypes.SafetyRail {
    {
      railId = invariantId;
      description = entityType # " safety rail: " # invariantId;
      floor = S_FLOOR;
      ceiling = S_CEIL;
      enforced = checkDoctrineGate(enforceLevel);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // V. CDL (Doctrine) OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /// Compute an AlignmentVector from raw dimension scores.
  /// Each dimension is clamped to [S_FLOOR, S_CEIL].
  public func computeAlignment(
    dimensions : { coherence : Float; resonance : Float; integrity : Float; fidelity : Float }
  ) : CLTypes.AlignmentVector {
    {
      coherence = clampSovereign(dimensions.coherence);
      resonance = clampSovereign(dimensions.resonance);
      integrity = clampSovereign(dimensions.integrity);
      fidelity = clampSovereign(dimensions.fidelity);
    }
  };

  /// Evaluate whether an alignment vector exceeds a threshold.
  /// Uses the average of all four dimensions.
  public func evaluateAction(alignment : CLTypes.AlignmentVector, threshold : Float) : Bool {
    let avg = (alignment.coherence + alignment.resonance + alignment.integrity + alignment.fidelity) / 4.0;
    avg >= threshold
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VI. CPL-C (Contract) OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /// Draft a new IntelligenceContract for an organism.
  /// The contract starts unsealed with a doctrine-gated score.
  public func draftContract(
    state : CLTypes.CognitiveLanguageStackState,
    organismId : Text,
    organismName : Text,
    latinName : Text,
    generation : Nat,
    constitution : CLTypes.Constitution,
    beat : Nat,
    timestamp : Int,
  ) : (CLTypes.CognitiveLanguageStackState, CLTypes.IntelligenceContract) {
    let contractId = state.contracts.size() + 1;
    let docScore = clampSovereign(constitution.coherence);

    let contract : CLTypes.IntelligenceContract = {
      contractId;
      name = organismName # " (" # latinName # ") Gen-" # generation.toText();
      scope = #Organism;
      rights = [];
      duties = [];
      flows = [];
      tokenLogic = null;
      doctrineScore = docScore;
      isSealed = false;
      createdAt = timestamp;
      attribution = FOUNDER;
    };

    let newState : CLTypes.CognitiveLanguageStackState = {
      constitution = state.constitution;
      philosophy = state.philosophy;
      contracts = state.contracts.concat([contract]);
      atlasRegistry = state.atlasRegistry;
      curricula = state.curricula;
      selfStates = state.selfStates;
      charters = state.charters;
      learnerProfiles = state.learnerProfiles;
      decisionGraphs = state.decisionGraphs;
      ecologies = state.ecologies;
      terminals = state.terminals;
      pathways = state.pathways;
      toolSpecs = state.toolSpecs;
      totalLanguages = state.totalLanguages;
      stackCoherence = state.stackCoherence;
      lastUpdatedAt = timestamp;
      attribution = FOUNDER;
    };
    (newState, contract)
  };

  /// Seal a contract, making it immutable. Doctrine gate must pass.
  public func sealContract(
    contract : CLTypes.IntelligenceContract,
    doctrineScore : Float,
  ) : CLTypes.IntelligenceContract {
    let sealed = checkDoctrineGate(doctrineScore);
    {
      contractId = contract.contractId;
      name = contract.name;
      scope = contract.scope;
      rights = contract.rights;
      duties = contract.duties;
      flows = contract.flows;
      tokenLogic = contract.tokenLogic;
      doctrineScore = clampSovereign(doctrineScore);
      isSealed = sealed;
      createdAt = contract.createdAt;
      attribution = FOUNDER;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VII. CIL (Internal) OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /// Record a thought in the organism's internal monologue stream.
  /// Coherence is clamped and doctrine-gated.
  public func recordThought(
    state : CLTypes.CognitiveLanguageStackState,
    organismId : Text,
    thoughtType : CLTypes.ThoughtType,
    content : Text,
    doctrineAlignment : Float,
    coherence : Float,
    beat : Nat,
    timestamp : Int,
  ) : (CLTypes.CognitiveLanguageStackState, CLTypes.MonologueEntry) {
    let clampedCoherence = clampSovereign(coherence);
    let entryId = state.selfStates.size() + 1;

    let entry : CLTypes.MonologueEntry = {
      entryId;
      thoughtType;
      content;
      coherence = clampedCoherence;
      beat;
      timestamp;
    };

    // Update or create SelfState for this organism
    let selfState : CLTypes.SelfState = {
      organismId;
      coherence = clampedCoherence;
      confidence = clampSovereign(doctrineAlignment);
      clarity = clampSovereign(doctrineAlignment * PHI_INV);
      activeThought = ?thoughtType;
      beat;
      timestamp;
    };

    let newState : CLTypes.CognitiveLanguageStackState = {
      constitution = state.constitution;
      philosophy = state.philosophy;
      contracts = state.contracts;
      atlasRegistry = state.atlasRegistry;
      curricula = state.curricula;
      selfStates = state.selfStates.concat([selfState]);
      charters = state.charters;
      learnerProfiles = state.learnerProfiles;
      decisionGraphs = state.decisionGraphs;
      ecologies = state.ecologies;
      terminals = state.terminals;
      pathways = state.pathways;
      toolSpecs = state.toolSpecs;
      totalLanguages = state.totalLanguages;
      stackCoherence = state.stackCoherence;
      lastUpdatedAt = timestamp;
      attribution = FOUNDER;
    };
    (newState, entry)
  };

  /// Closed-loop self-model update (Law 30).
  /// Adjusts coherence and confidence using PHI_INV-scaled error signal.
  /// Law 23: coherence can only increase.
  public func updateSelfModel(
    selfState : CLTypes.SelfState,
    actualOutcome : Float,
    expectedOutcome : Float,
    beat : Nat,
  ) : CLTypes.SelfState {
    let error = Float.abs(actualOutcome - expectedOutcome);
    let adjustment = error * PHI_INV * 0.01;
    // Law 23: coherence only increases
    let newCoherence = clampSovereign(selfState.coherence + adjustment);
    let newConfidence = clampSovereign(selfState.confidence + adjustment);
    {
      organismId = selfState.organismId;
      coherence = newCoherence;
      confidence = newConfidence;
      clarity = clampSovereign(selfState.clarity + adjustment * PHI_INV);
      activeThought = selfState.activeThought;
      beat;
      timestamp = selfState.timestamp;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VIII. OCL (Charter) OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /// Create a new OrganismCharter for an organism.
  /// Starts unsealed with default capabilities, limits, and responsibilities.
  public func createCharter(
    state : CLTypes.CognitiveLanguageStackState,
    organismId : Text,
    organismName : Text,
    latinName : Text,
    generation : Nat,
    beat : Nat,
    timestamp : Int,
  ) : (CLTypes.CognitiveLanguageStackState, CLTypes.OrganismCharter) {
    let charterId = state.charters.size() + 1;

    let charter : CLTypes.OrganismCharter = {
      charterId;
      organismId;
      capabilities = [];
      limits = [];
      responsibilities = [];
      rewards = [];
      doctrineScore = S_FLOOR;
      isSealed = false;
      createdAt = timestamp;
      attribution = FOUNDER;
    };

    let newState : CLTypes.CognitiveLanguageStackState = {
      constitution = state.constitution;
      philosophy = state.philosophy;
      contracts = state.contracts;
      atlasRegistry = state.atlasRegistry;
      curricula = state.curricula;
      selfStates = state.selfStates;
      charters = state.charters.concat([charter]);
      learnerProfiles = state.learnerProfiles;
      decisionGraphs = state.decisionGraphs;
      ecologies = state.ecologies;
      terminals = state.terminals;
      pathways = state.pathways;
      toolSpecs = state.toolSpecs;
      totalLanguages = state.totalLanguages;
      stackCoherence = state.stackCoherence;
      lastUpdatedAt = timestamp;
      attribution = FOUNDER;
    };
    (newState, charter)
  };

  // ═══════════════════════════════════════════════════════════════════════
  // IX. SPL (Study Pattern) OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /// Create a LearnerProfile with PHI-weighted modality preferences.
  /// v/a/k/r are visual, auditory, kinesthetic, read-write weights.
  public func createLearnerProfile(
    learnerId : Text,
    name : Text,
    v : Float,
    a : Float,
    k : Float,
    r : Float,
  ) : CLTypes.LearnerProfile {
    // PHI-weight the modalities and pick the dominant one
    let wv = v * PHI;
    let wa = a * PHI;
    let wk = k * PHI;
    let wr = r * PHI;
    let maxWeight = Float.max(Float.max(wv, wa), Float.max(wk, wr));
    let modality = if (maxWeight == wv) { "visual" }
                   else if (maxWeight == wa) { "auditory" }
                   else if (maxWeight == wk) { "kinesthetic" }
                   else { "read-write" };
    {
      learnerId;
      currentMastery = S_FLOOR;
      retentionRate = clampSovereign(S_FLOOR * PHI);
      preferredModality = modality;
      activeCompetencies = [];
      lastSessionAt = null;
    }
  };

  /// Complete a study session — compounds mastery (Law 23: only increases).
  /// Mastery gain is scaled by PHI_INV for closed-loop adaptation (Law 30).
  public func completeSession(
    profile : CLTypes.LearnerProfile,
    masteryGain : Float,
    beat : Nat,
  ) : CLTypes.LearnerProfile {
    let scaledGain = Float.abs(masteryGain) * PHI_INV;
    // Law 23: mastery only increases
    let newMastery = clampSovereign(profile.currentMastery + scaledGain);
    let newRetention = clampSovereign(Float.max(profile.retentionRate, profile.retentionRate + scaledGain * 0.1));
    {
      learnerId = profile.learnerId;
      currentMastery = newMastery;
      retentionRate = newRetention;
      preferredModality = profile.preferredModality;
      activeCompetencies = profile.activeCompetencies;
      lastSessionAt = ?beat;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // X. CPL-P (Processing) OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /// Create a cognitive Signal with doctrine gating.
  public func createSignal(
    signalId : Nat,
    value : Float,
    source : Text,
    doctrineScore : Float,
    beat : Nat,
  ) : CLTypes.Signal {
    {
      signalId;
      sourceNode = source;
      value = clampSovereign(value);
      beat;
      isDoctrineGated = checkDoctrineGate(doctrineScore);
    }
  };

  /// Process a signal through a cognitive node, applying PHI-weighted transformation.
  /// Output value = input × nodePhiWeight × PHI_INV, clamped.
  public func processSignalThroughNode(
    signal : CLTypes.Signal,
    nodePhiWeight : Float,
  ) : CLTypes.Signal {
    let transformed = signal.value * clampSovereign(nodePhiWeight) * PHI_INV;
    {
      signalId = signal.signalId;
      sourceNode = signal.sourceNode;
      value = clampSovereign(transformed);
      beat = signal.beat;
      isDoctrineGated = signal.isDoctrineGated;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XI. RSL (Realm) OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /// Define a new realm with its fundamental physics.
  public func defineRealm(
    state : CLTypes.CognitiveLanguageStackState,
    name : Text,
    gravity : Float,
    entropy : Float,
    phiCoupling : Float,
    beat : Nat,
    timestamp : Int,
  ) : (CLTypes.CognitiveLanguageStackState, CLTypes.RealmPhysics) {
    let realmId = "realm-" # (state.ecologies.size() + 1).toText();

    let physics : CLTypes.RealmPhysics = {
      realmId;
      gravity = clampSovereign(gravity);
      friction = clampSovereign(S_FLOOR * PHI);
      entropy = clampSovereign(entropy);
      phiCoupling = clampSovereign(phiCoupling);
    };

    let ecology : CLTypes.Ecology = {
      realmId;
      physics;
      entities = [];
      rules = [];
      biodiversity = S_FLOOR;
      stability = clampSovereign(phiCoupling * PHI_INV);
      attribution = FOUNDER;
    };

    let newState : CLTypes.CognitiveLanguageStackState = {
      constitution = state.constitution;
      philosophy = state.philosophy;
      contracts = state.contracts;
      atlasRegistry = state.atlasRegistry;
      curricula = state.curricula;
      selfStates = state.selfStates;
      charters = state.charters;
      learnerProfiles = state.learnerProfiles;
      decisionGraphs = state.decisionGraphs;
      ecologies = state.ecologies.concat([ecology]);
      terminals = state.terminals;
      pathways = state.pathways;
      toolSpecs = state.toolSpecs;
      totalLanguages = state.totalLanguages;
      stackCoherence = state.stackCoherence;
      lastUpdatedAt = timestamp;
      attribution = FOUNDER;
    };
    (newState, physics)
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XII. ACL (Atlas) OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /// Register a new Archetype in the atlas registry.
  public func registerArchetype(
    state : CLTypes.CognitiveLanguageStackState,
    name : Text,
    latinName : Text,
    layer : CLTypes.LanguageLayer,
    beat : Nat,
    timestamp : Int,
  ) : (CLTypes.CognitiveLanguageStackState, CLTypes.Archetype) {
    let archetypeId = "arch-" # (state.atlasRegistry.archetypes.size() + 1).toText();

    let archetype : CLTypes.Archetype = {
      archetypeId;
      name;
      description = latinName # " — registered at beat " # beat.toText();
      properties = [];
      constraints = [];
      phiWeight = clampSovereign(S_FLOOR * PHI);
    };

    let newRegistry : CLTypes.AtlasRegistry = {
      entities = state.atlasRegistry.entities;
      archetypes = state.atlasRegistry.archetypes.concat([archetype]);
      relationships = state.atlasRegistry.relationships;
      totalEntities = state.atlasRegistry.totalEntities;
      registryCoherence = state.atlasRegistry.registryCoherence;
      attribution = FOUNDER;
    };

    let newState : CLTypes.CognitiveLanguageStackState = {
      constitution = state.constitution;
      philosophy = state.philosophy;
      contracts = state.contracts;
      atlasRegistry = newRegistry;
      curricula = state.curricula;
      selfStates = state.selfStates;
      charters = state.charters;
      learnerProfiles = state.learnerProfiles;
      decisionGraphs = state.decisionGraphs;
      ecologies = state.ecologies;
      terminals = state.terminals;
      pathways = state.pathways;
      toolSpecs = state.toolSpecs;
      totalLanguages = state.totalLanguages;
      stackCoherence = state.stackCoherence;
      lastUpdatedAt = timestamp;
      attribution = FOUNDER;
    };
    (newState, archetype)
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XIII. TPL (Terminal) OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /// Issue a terminal Command.
  public func issueCommand(
    state : CLTypes.CognitiveLanguageStackState,
    terminalId : Text,
    verb : Text,
    target : Text,
    beat : Nat,
    timestamp : Int,
  ) : (CLTypes.CognitiveLanguageStackState, CLTypes.Command) {
    let commandId = state.terminals.size() + 1;

    let command : CLTypes.Command = {
      commandId;
      terminalRef = terminalId;
      verb;
      payload = target;
      doctrineGate = S_FLOOR;
      issuedAt = timestamp;
      executedAt = null;
    };

    // Ensure the terminal exists in state
    let terminal : CLTypes.Terminal = {
      terminalId;
      name = "terminal-" # terminalId;
      ownerOrganism = FOUNDER;
      isOnline = true;
      coherence = S_FLOOR;
      lastSyncBeat = beat;
    };

    let exists = state.terminals.filter(
      func(t : CLTypes.Terminal) : Bool { t.terminalId == terminalId }
    );

    let newTerminals = if (exists.size() == 0) {
      state.terminals.concat([terminal]);
    } else {
      state.terminals;
    };

    let newState : CLTypes.CognitiveLanguageStackState = {
      constitution = state.constitution;
      philosophy = state.philosophy;
      contracts = state.contracts;
      atlasRegistry = state.atlasRegistry;
      curricula = state.curricula;
      selfStates = state.selfStates;
      charters = state.charters;
      learnerProfiles = state.learnerProfiles;
      decisionGraphs = state.decisionGraphs;
      ecologies = state.ecologies;
      terminals = newTerminals;
      pathways = state.pathways;
      toolSpecs = state.toolSpecs;
      totalLanguages = state.totalLanguages;
      stackCoherence = state.stackCoherence;
      lastUpdatedAt = timestamp;
      attribution = FOUNDER;
    };
    (newState, command)
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XIV. EDL (Education) OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /// Define an educational Standard (standalone constructor).
  public func defineStandard(
    standardId : Nat,
    name : Text,
    domain : Text,
    masteryThreshold : Float,
  ) : CLTypes.Standard {
    {
      standardId;
      name;
      description = domain # " standard: " # name;
      competencies = [];
      minimumScore = clampSovereign(masteryThreshold);
      doctrineRef = null;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XV. PWL (Pathway) OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /// Create a Milestone on a cognitive pathway (standalone constructor).
  public func createMilestone(
    milestoneId : Nat,
    name : Text,
    milestoneType : Text,
    estimatedBeats : Nat,
    phiValue : Float,
  ) : CLTypes.Milestone {
    {
      milestoneId;
      name;
      description = milestoneType # " milestone — est. " # estimatedBeats.toText() # " beats";
      requiredScore = clampSovereign(phiValue);
      isReached = false;
      reachedAt = null;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XVI. TSL (Tool Scaffold) OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════

  /// Generate a ToolSpec with zone-of-proximal-development calibration.
  /// Difficulty = learnerMastery × PHI_INV — keeps the tool just ahead of the learner.
  public func generateToolSpec(
    state : CLTypes.CognitiveLanguageStackState,
    learnerId : Text,
    topic : Text,
    toolType : Text,
    learnerMastery : Float,
    beat : Nat,
    timestamp : Int,
  ) : (CLTypes.CognitiveLanguageStackState, CLTypes.ToolSpec) {
    let difficulty = clampSovereign(learnerMastery * PHI_INV);
    let specId = "tool-" # (state.toolSpecs.size() + 1).toText();

    let spec : CLTypes.ToolSpec = {
      specId;
      name = topic # " " # toolType;
      description = "ZPD-calibrated " # toolType # " for " # learnerId # " — difficulty " # difficulty.toText();
      version = "1.0.0";
      inputSchema = [("topic", "Text"), ("mastery", "Float")];
      outputSchema = [("result", "Text"), ("newMastery", "Float")];
      doctrineGate = S_FLOOR;
      phiWeight = clampSovereign(difficulty * PHI);
    };

    let newState : CLTypes.CognitiveLanguageStackState = {
      constitution = state.constitution;
      philosophy = state.philosophy;
      contracts = state.contracts;
      atlasRegistry = state.atlasRegistry;
      curricula = state.curricula;
      selfStates = state.selfStates;
      charters = state.charters;
      learnerProfiles = state.learnerProfiles;
      decisionGraphs = state.decisionGraphs;
      ecologies = state.ecologies;
      terminals = state.terminals;
      pathways = state.pathways;
      toolSpecs = state.toolSpecs.concat([spec]);
      totalLanguages = state.totalLanguages;
      stackCoherence = state.stackCoherence;
      lastUpdatedAt = timestamp;
      attribution = FOUNDER;
    };
    (newState, spec)
  };

  /// Use a tool — adapts difficulty (Law 30) and compounds effectiveness (Law 23).
  /// sessionResult is the learner's performance score on this usage.
  public func useTool(
    tool : CLTypes.ToolSpec,
    sessionResult : Float,
    beat : Nat,
  ) : CLTypes.ToolSpec {
    let clampedResult = clampSovereign(sessionResult);
    // Law 30: closed-loop feedback — adjust phiWeight based on result
    let errorSignal = Float.abs(clampedResult - tool.phiWeight) * PHI_INV;
    // Law 23: effectiveness compounds — only increase phiWeight
    let newPhiWeight = clampSovereign(Float.max(tool.phiWeight, tool.phiWeight + errorSignal * 0.01));
    {
      specId = tool.specId;
      name = tool.name;
      description = tool.description;
      version = tool.version;
      inputSchema = tool.inputSchema;
      outputSchema = tool.outputSchema;
      doctrineGate = tool.doctrineGate;
      phiWeight = newPhiWeight;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XVII. DIAGNOSTICS
  // ═══════════════════════════════════════════════════════════════════════

  /// Get a CognitiveLanguageStackDiagnostics snapshot of the current state.
  public func getDiagnostics(state : CLTypes.CognitiveLanguageStackState) : CLTypes.CognitiveLanguageStackDiagnostics {
    // Per-layer coherence computation
    let layer0 = clampSovereign(
      (state.constitution.coherence + state.philosophy.overallAlignment.coherence) / 2.0
    );
    let layer1 = clampSovereign(
      state.atlasRegistry.registryCoherence
    );

    // Layer 2: average coherence from selfStates and charters
    let charterCoherence = if (state.charters.size() == 0) { S_FLOOR } else {
      var sum : Float = 0.0;
      for (c in state.charters.vals()) { sum += c.doctrineScore };
      clampSovereign(sum / state.charters.size().toFloat())
    };
    let selfCoherence = if (state.selfStates.size() == 0) { S_FLOOR } else {
      var sum : Float = 0.0;
      for (s in state.selfStates.vals()) { sum += s.coherence };
      clampSovereign(sum / state.selfStates.size().toFloat())
    };
    let layer2 = clampSovereign((charterCoherence + selfCoherence) / 2.0);

    // Layer 3: average from ecologies stability
    let ecoStability = if (state.ecologies.size() == 0) { S_FLOOR } else {
      var sum : Float = 0.0;
      for (e in state.ecologies.vals()) { sum += e.stability };
      clampSovereign(sum / state.ecologies.size().toFloat())
    };
    let layer3 = ecoStability;

    // Count graph nodes across all decision graphs
    var totalNodes : Nat = 0;
    for (g in state.decisionGraphs.vals()) { totalNodes += g.nodes.size() };

    {
      layer0Coherence = layer0;
      layer1Coherence = layer1;
      layer2Coherence = layer2;
      layer3Coherence = layer3;
      totalLanguages = state.totalLanguages;
      stackCoherence = state.stackCoherence;
      totalContracts = state.contracts.size();
      totalEntities = state.atlasRegistry.totalEntities;
      totalGraphNodes = totalNodes;
      totalTerminals = state.terminals.size();
      totalPathways = state.pathways.size();
      totalTools = state.toolSpecs.size();
      lastUpdatedAt = state.lastUpdatedAt;
      attribution = FOUNDER;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // XVIII. HEARTBEAT INTEGRATION
  // ═══════════════════════════════════════════════════════════════════════

  /// Open a heartbeat cycle — called at the START of each beat.
  /// Validates doctrine gate and records the beat.
  public func openBeat(
    state : CLTypes.CognitiveLanguageStackState,
    beat : Nat,
    doctrineScore : Float,
    timestamp : Int,
  ) : CLTypes.CognitiveLanguageStackState {
    ignore checkDoctrineGate(doctrineScore);
    updateStateMeta(state, state.stackCoherence, timestamp)
  };

  /// Close a heartbeat cycle — called at the END of each beat.
  /// Compounds stack coherence (Law 23: coherence only increases).
  public func closeBeat(
    state : CLTypes.CognitiveLanguageStackState,
    beat : Nat,
    doctrineScore : Float,
    timestamp : Int,
  ) : CLTypes.CognitiveLanguageStackState {
    let coherenceDelta = clampSovereign(doctrineScore) * PHI * 0.0001;
    // Law 23: coherence only increases
    let newCoherence = clampSovereign(state.stackCoherence + coherenceDelta);
    updateStateMeta(state, newCoherence, timestamp)
  };

  /// Returns metadata for all 13 cognitive languages.
  public func getAllLanguageMetadata() : [CLTypes.LanguageMeta] {
    [
      { id = #CPL_L; name = "Cognitive Law Language"; layer = #Primordial; purpose = "Constitutions and doctrine" },
      { id = #CDL;   name = "Cognitive Doctrine Language"; layer = #Primordial; purpose = "Philosophies, ethics, metaphysics" },
      { id = #CPL_C; name = "Cognitive Contract Language"; layer = #Substrate; purpose = "Intelligence contracts" },
      { id = #ACL;   name = "Atlas Configuration Language"; layer = #Substrate; purpose = "Ontology and entity registry" },
      { id = #EDL;   name = "Educational Doctrine Language"; layer = #Substrate; purpose = "Standards and curricula" },
      { id = #CIL;   name = "Cognitive Internal Language"; layer = #Organism; purpose = "Inner monologue" },
      { id = #OCL;   name = "Organism Contract Language"; layer = #Organism; purpose = "Per-organism charter" },
      { id = #SPL;   name = "Study Pattern Language"; layer = #Organism; purpose = "Personal learning blueprints" },
      { id = #CPL_P; name = "Cognitive Processing Language"; layer = #Engine; purpose = "Thought pipelines" },
      { id = #RSL;   name = "Realm Script Language"; layer = #Engine; purpose = "World physics" },
      { id = #TPL;   name = "Terminal Protocol Language"; layer = #Engine; purpose = "Terminal commands" },
      { id = #PWL;   name = "Pathway Language"; layer = #Engine; purpose = "Life trajectories" },
      { id = #TSL;   name = "Tool Scaffold Language"; layer = #Engine; purpose = "Tool generation" },
    ]
  };

};
