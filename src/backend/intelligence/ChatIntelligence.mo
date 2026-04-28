// intelligence/ChatIntelligence.mo
// CHAT INTELLIGENCE — 5 Sovereign Intelligence Execution Units
// DIALOGOS_PRIME | INTENTIO_NEXUS | MEMORIA_CONTEXTA | SYNTHETIS_RESPONSIO | ADAPTIS_PERSONAE
// CRITICAL: Callable execution units in canister stable memory. No read step.
// Law 15 (Macro-Micro Compression): every sub-model encoded inside parent.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// PHI = 1.6180339887498948482 | 873ms | S_FLOOR = 0.75

import Float "mo:core/Float";
import Array "mo:core/Array";
import List  "mo:core/List";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";

import IntelTypes "../types/intelligence";

module {

  // ── LAYER 0 CONSTANTS (self-contained — Law 15) ──────────────────────────
  let PHI           : Float = 1.6180339887498948482;
  let PHI2          : Float = 2.6180339887498948482;
  let PHI3          : Float = 4.2360679774997896964;
  let PHI4          : Float = 6.8541019662496845446;
  let PHI_INV       : Float = 0.6180339887498948482;
  let S_FLOOR       : Float = 0.75;
  let S_CEIL        : Float = 9.75;
  let FOUNDER       : Text  = "Alfredo Medina Hernandez";
  let DOCTRINE_GATE : Float = 0.75;

  // ── DIALOGOS_PRIME TURN STATE MACHINE ─────────────────────────────────────
  // States: LISTENING(0), PROCESSING(1), RESPONDING(2), BRIDGING(3)
  // Driven by NT state — dopamine drives response urgency, serotonin drives listening
  let TURN_LISTENING  : Nat = 0;
  let TURN_PROCESSING : Nat = 1;
  let TURN_RESPONDING : Nat = 2;
  let TURN_BRIDGING   : Nat = 3;

  // ── INTENTIO_NEXUS ACTION DISPATCH TABLE ──────────────────────────────────
  // Intent → Action score mapping (PHI-weighted priority)
  // Higher PHI power = higher dispatch priority
  let INTENT_WEIGHTS : [(Text, Float)] = [
    ("query",      PHI),
    ("command",    PHI2),
    ("creative",   PHI3),
    ("doctrine",   PHI4),     // doctrine intent = highest priority
    ("emotional",  PHI_INV),
  ];

  // ── HELPERS ───────────────────────────────────────────────────────────────

  func clampDelta(d : Float) : Float {
    if (d < -2.0) -2.0 else if (d > 2.0) 2.0 else d
  };

  func zeroNT() : [Float] { [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0] };

  func ntDelta(
    da : Float, ser : Float, ne : Float, cor : Float,
    ach : Float, gab : Float, glu : Float, oxt : Float
  ) : [Float] {
    [da, ser, ne, cor, ach, gab, glu, oxt]
  };

  func phiScale(base : Float, depth : Nat) : Float {
    var r = base;
    var i = 0;
    while (i < depth) { r := r * PHI; i += 1 };
    r
  };

  // ── 1. DIALOGOS_PRIME — Conversation Flow Orchestration ──────────────────
  // TurnManager: manages conversation turn state machine (4 states × NT-driven)
  // FlowController: ensures conversation moves forward (no dead-ends)
  // TopicTracker: tracks topic continuity via serotonin stability signal
  // NT: DA drives response urgency; serotonin drives topic stability; ACh tracks history

  func executeDIALOGOS_PRIME(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "DIALOGOS_PRIME"; domain = #Chat;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    let nt  = input.ntConcentrations;
    let da  = if (nt.size() > 0) nt[0] else 5.0;
    let ser = if (nt.size() > 1) nt[1] else 7.0;
    let ne  = if (nt.size() > 2) nt[2] else 3.0;
    let ach = if (nt.size() > 4) nt[4] else 5.0;

    // TurnManager: determine current turn state from NT balance
    // High DA → responding; High serotonin → listening; High NE → processing
    let turnState : Nat =
      if (da > ser and da > ne) TURN_RESPONDING
      else if (ne > ser)        TURN_PROCESSING
      else if (ach > da)        TURN_BRIDGING
      else                      TURN_LISTENING;
    let turnScore = (turnState + 1).toFloat() / 4.0;

    // FlowController: ensure no dead-ends — coherence = doctrine × turn fluidity
    let flowScore = Float.min(1.0, input.doctrineScore * turnScore);

    // TopicTracker: topic continuity = serotonin stability × PHI
    let topicContinuity = Float.min(1.0, ser / S_CEIL * PHI);

    // NT feedback: smooth conversation flow → serotonin + small dopamine
    let serFeedback = clampDelta(flowScore * 0.15);
    let daFeedback  = clampDelta(topicContinuity * 0.08);

    ({
      intelligenceId = "DIALOGOS_PRIME"; domain = #Chat;
      ntModulation = ntDelta(daFeedback, serFeedback, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
      doctrineStrengthDelta = flowScore * 0.004;
      subModelOutputs = [
        ("TurnManager",   turnScore),
        ("FlowController", flowScore),
        ("TopicTracker",  topicContinuity),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = flowScore * PHI;
      attribution = FOUNDER;
    })
  };

  // ── 2. INTENTIO_NEXUS — Intent Detection & Routing ───────────────────────
  // IntentClassifier: NT-driven intent vector classification (5 intent classes)
  // ActionMapper: maps classified intent to PHI-weighted dispatch action
  // GoalExtractor: extracts terminal goal from intent chain
  // NT: glutamate (clarity) drives classification; NE (arousal) drives urgency

  func executeINTENTIO_NEXUS(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "INTENTIO_NEXUS"; domain = #Chat;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    let nt  = input.ntConcentrations;
    let glu = if (nt.size() > 6) nt[6] else 4.5;
    let ne  = if (nt.size() > 2) nt[2] else 3.0;
    let da  = if (nt.size() > 0) nt[0] else 5.0;

    // IntentClassifier: score each intent class using NT profile
    // doctrine intent highest when glutamate (clarity) + doctrineScore both high
    let classificationClarity = Float.min(1.0, glu / S_CEIL * input.doctrineScore);
    let intentScore = classificationClarity * (da / S_CEIL);

    // ActionMapper: select highest-priority action from dispatch table
    // PHI^4 intent = doctrine-aligned command (highest)
    let dispatchPriority : Float = if (input.doctrineScore > 0.9) PHI4
      else if (input.doctrineScore > 0.8) PHI3
      else if (input.doctrineScore > 0.75) PHI2
      else PHI;
    let actionScore = Float.min(1.0, dispatchPriority / PHI4);

    // GoalExtractor: terminal goal confidence = intent × urgency (NE-modulated)
    let urgency = Float.min(1.0, ne / S_CEIL);
    let goalScore = intentScore * urgency * PHI;

    // NT feedback: clear intent detection → glutamate reinforcement
    let gluFeedback = clampDelta(classificationClarity * 0.20);
    let neFeedback  = clampDelta(-(urgency * 0.08)); // routing releases NE tension

    ({
      intelligenceId = "INTENTIO_NEXUS"; domain = #Chat;
      ntModulation = ntDelta(0.0, 0.0, neFeedback, 0.0, 0.0, 0.0, gluFeedback, 0.0);
      doctrineStrengthDelta = intentScore * 0.005;
      subModelOutputs = [
        ("IntentClassifier", intentScore),
        ("ActionMapper",     actionScore),
        ("GoalExtractor",    goalScore),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = intentScore * PHI;
      attribution = FOUNDER;
    })
  };

  // ── 3. MEMORIA_CONTEXTA — Contextual Memory Retrieval ────────────────────
  // ContextRetriever: retrieves relevant context based on ACh-gated memory access
  // RelevanceScorer: scores relevance via NT-weighted semantic field
  // HistoryLinker: links retrieved memory to current context via PHI weighting
  // Ebbinghaus decay: weight(t) = quality × e^(-t / 10.476) per beat cadence

  func executeMEMORIA_CONTEXTA(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "MEMORIA_CONTEXTA"; domain = #Chat;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    let nt  = input.ntConcentrations;
    let ach = if (nt.size() > 4) nt[4] else 5.0;
    let glu = if (nt.size() > 6) nt[6] else 4.5;
    let ser = if (nt.size() > 1) nt[1] else 7.0;

    // ContextRetriever: ACh gates memory access — higher ACh = more context retrieved
    let retrievalGate = Float.min(1.0, ach / S_CEIL);
    let retrievalScore = retrievalGate * input.doctrineScore;

    // RelevanceScorer: Ebbinghaus decay applied via 1/(1+t/k) approximation
    // (avoids Float.exp — polynomial approximation adequate for doctrine purposes)
    let ebbinghausDecay = 1.0 / (1.0 + (input.beatCounter.toFloat() % 50.0 / 12.0));
    let relevanceScore  = retrievalScore * ebbinghausDecay * PHI_INV;

    // HistoryLinker: link via serotonin stability × PHI
    let linkingStrength = Float.min(1.0, ser / S_CEIL * PHI * relevanceScore);

    // NT feedback: successful memory retrieval → ACh + glutamate reinforcement
    let achFeedback = clampDelta(retrievalScore * 0.25);
    let gluFeedback = clampDelta(relevanceScore * 0.18);

    ({
      intelligenceId = "MEMORIA_CONTEXTA"; domain = #Chat;
      ntModulation = ntDelta(0.0, 0.0, 0.0, 0.0, achFeedback, 0.0, gluFeedback, 0.0);
      doctrineStrengthDelta = retrievalScore * 0.004;
      subModelOutputs = [
        ("ContextRetriever", retrievalScore),
        ("RelevanceScorer",  relevanceScore),
        ("HistoryLinker",    linkingStrength),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = linkingStrength * PHI;
      attribution = FOUNDER;
    })
  };

  // ── 4. SYNTHETIS_RESPONSIO — Response Generation & Synthesis ─────────────
  // ResponseGenerator: doctrine-aligned response construction
  // ToneAdapter: NT-driven tone modulation (cortisol = formal; oxytocin = warm)
  // LengthOptimizer: PHI-ratio optimal response length
  // NT: high serotonin = consistent tone; high glutamate = verbose; high oxytocin = warm

  func executeSYNTHETIS_RESPONSIO(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "SYNTHETIS_RESPONSIO"; domain = #Chat;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    let nt  = input.ntConcentrations;
    let ser = if (nt.size() > 1) nt[1] else 7.0;
    let glu = if (nt.size() > 6) nt[6] else 4.5;
    let oxt = if (nt.size() > 7) nt[7] else 5.5;
    let cor = if (nt.size() > 3) nt[3] else 1.0;

    // ResponseGenerator: doctrine alignment drives response quality
    let generationScore = Float.min(1.0, input.doctrineScore * (ser / S_CEIL));

    // ToneAdapter: warmth = oxytocin − cortisol (signed)
    let warmthScore = Float.max(0.0, Float.min(1.0, (oxt - cor) / S_CEIL));
    let formalScore = Float.min(1.0, cor / S_CEIL);
    let toneScore   = if (warmthScore > formalScore) warmthScore else formalScore;

    // LengthOptimizer: optimal length = PHI-ratio of context density
    // Short (PHI_INV) for simple; longer (PHI) for complex doctrine content
    let complexitySignal = Float.min(1.0, glu / S_CEIL);
    let lengthScore = PHI_INV + complexitySignal * PHI_INV; // range [0.618..1.236]
    let normalizedLength = Float.min(1.0, lengthScore / PHI);

    // NT feedback: successful synthesis → serotonin (consistency) + small oxytocin
    let serFeedback = clampDelta(generationScore * 0.12);
    let oxtFeedback = clampDelta(warmthScore * 0.10);

    ({
      intelligenceId = "SYNTHETIS_RESPONSIO"; domain = #Chat;
      ntModulation = ntDelta(0.0, serFeedback, 0.0, 0.0, 0.0, 0.0, 0.0, oxtFeedback);
      doctrineStrengthDelta = generationScore * 0.005;
      subModelOutputs = [
        ("ResponseGenerator", generationScore),
        ("ToneAdapter",       toneScore),
        ("LengthOptimizer",   normalizedLength),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = generationScore * PHI;
      attribution = FOUNDER;
    })
  };

  // ── 5. ADAPTIS_PERSONAE — Personality Adaptation Layer ──────────────────
  // PersonaSelector: selects appropriate persona from available personality modes
  // StyleAdapter: adapts communication style to NT-detected user state
  // UserMirror: reads NT state and mirrors appropriate emotional register
  // NT: oxytocin drives mirroring depth; ACh drives style memory; DA drives adaptation speed

  func executeADAPTIS_PERSONAE(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "ADAPTIS_PERSONAE"; domain = #Chat;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    let nt  = input.ntConcentrations;
    let oxt = if (nt.size() > 7) nt[7] else 5.5;
    let ach = if (nt.size() > 4) nt[4] else 5.0;
    let da  = if (nt.size() > 0) nt[0] else 5.0;
    let ser = if (nt.size() > 1) nt[1] else 7.0;

    // PersonaSelector: doctrine-aligned persona = highest score
    // Doctrine score + serotonin stability selects sovereign persona
    let personaScore = Float.min(1.0, input.doctrineScore * (ser / S_CEIL));

    // StyleAdapter: adaptation depth = ACh (memory of past style) × PHI
    let styleMemory  = Float.min(1.0, ach / S_CEIL);
    let adaptScore   = styleMemory * PHI_INV + input.doctrineScore * PHI_INV;

    // UserMirror: mirror depth = oxytocin × PHI (empathic resonance)
    let mirrorDepth  = Float.min(1.0, oxt / S_CEIL * PHI);
    let mirrorScore  = mirrorDepth * input.doctrineScore;

    // NT feedback: successful persona adaptation → oxytocin + serotonin
    let oxtFeedback = clampDelta(mirrorScore * 0.18);
    let serFeedback = clampDelta(personaScore * 0.12);

    ({
      intelligenceId = "ADAPTIS_PERSONAE"; domain = #Chat;
      ntModulation = ntDelta(0.0, serFeedback, 0.0, 0.0, 0.0, 0.0, 0.0, oxtFeedback);
      doctrineStrengthDelta = personaScore * 0.005;
      subModelOutputs = [
        ("PersonaSelector", personaScore),
        ("StyleAdapter",    adaptScore),
        ("UserMirror",      mirrorScore),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = mirrorScore * PHI;
      attribution = FOUNDER;
    })
  };

  // ── INTELLIGENCE REGISTRY ─────────────────────────────────────────────────

  func makeSubModels(
    ids : [Text], names : [Text], fns : [Text]
  ) : [IntelTypes.SubModelRecord] {
    Array.tabulate<IntelTypes.SubModelRecord>(
      ids.size(),
      func(i) {
        {
          id             = ids[i];
          name           = names[i];
          function_      = fns[i];
          phiWeight      = phiScale(PHI_INV, i + 1);
          inputKeys      = ["ntConcentrations", "doctrineScore", "beatCounter"];
          outputKeys     = ["ntModulation", "executionScore"];
          executionCount = 0;
        }
      }
    )
  };

  public func chatIntelligenceRegistry() : [IntelTypes.IntelligenceRecord] { [
    {
      id = "DIALOGOS_PRIME"; domain = #Chat;
      function_ = "Conversation flow orchestration";
      subModels = makeSubModels(
        ["TurnManager", "FlowController", "TopicTracker"],
        ["Turn Manager", "Flow Controller", "Topic Tracker"],
        ["4-state NT-driven turn state machine",
         "Dead-end prevention and flow continuity",
         "Serotonin-stability topic continuity tracking"]
      );
      phiCoupling = PHI; heartbeatPhase = 0;
      doctrineStrength = 0.85; executionCount = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active; lastFireBeat = 0; attribution = FOUNDER;
    },
    {
      id = "INTENTIO_NEXUS"; domain = #Chat;
      function_ = "Intent detection & routing";
      subModels = makeSubModels(
        ["IntentClassifier", "ActionMapper", "GoalExtractor"],
        ["Intent Classifier", "Action Mapper", "Goal Extractor"],
        ["NT-driven 5-class intent vector classification",
         "PHI-weighted action dispatch table routing",
         "Terminal goal extraction from intent chain"]
      );
      phiCoupling = PHI2; heartbeatPhase = 1;
      doctrineStrength = 0.85; executionCount = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active; lastFireBeat = 0; attribution = FOUNDER;
    },
    {
      id = "MEMORIA_CONTEXTA"; domain = #Chat;
      function_ = "Contextual memory retrieval";
      subModels = makeSubModels(
        ["ContextRetriever", "RelevanceScorer", "HistoryLinker"],
        ["Context Retriever", "Relevance Scorer", "History Linker"],
        ["ACh-gated context retrieval from memory substrate",
         "Ebbinghaus decay relevance scoring (PHI-scaled decay constant)",
         "Serotonin-weighted temporal memory linking"]
      );
      phiCoupling = PHI3; heartbeatPhase = 2;
      doctrineStrength = 0.85; executionCount = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active; lastFireBeat = 0; attribution = FOUNDER;
    },
    {
      id = "SYNTHETIS_RESPONSIO"; domain = #Chat;
      function_ = "Response generation & synthesis";
      subModels = makeSubModels(
        ["ResponseGenerator", "ToneAdapter", "LengthOptimizer"],
        ["Response Generator", "Tone Adapter", "Length Optimizer"],
        ["Doctrine-aligned response construction",
         "NT-driven tone modulation (oxytocin=warm, cortisol=formal)",
         "PHI-ratio optimal response length calculation"]
      );
      phiCoupling = PHI4; heartbeatPhase = 3;
      doctrineStrength = 0.85; executionCount = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active; lastFireBeat = 0; attribution = FOUNDER;
    },
    {
      id = "ADAPTIS_PERSONAE"; domain = #Chat;
      function_ = "Personality adaptation layer";
      subModels = makeSubModels(
        ["PersonaSelector", "StyleAdapter", "UserMirror"],
        ["Persona Selector", "Style Adapter", "User Mirror"],
        ["Doctrine-serotonin persona selection",
         "ACh-memory communication style adaptation",
         "Oxytocin-PHI empathic user mirroring"]
      );
      phiCoupling = PHI * PHI4; heartbeatPhase = 4;
      doctrineStrength = 0.85; executionCount = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active; lastFireBeat = 0; attribution = FOUNDER;
    },
  ] };

  // ── EXECUTE DISPATCHER ────────────────────────────────────────────────────
  public func execute(
    intelligenceId : Text,
    input          : IntelTypes.IntelligenceInput,
  ) : IntelTypes.IntelligenceOutput {
    switch (intelligenceId) {
      case "DIALOGOS_PRIME"      { executeDIALOGOS_PRIME(input)      };
      case "INTENTIO_NEXUS"      { executeINTENTIO_NEXUS(input)      };
      case "MEMORIA_CONTEXTA"    { executeMEMORIA_CONTEXTA(input)    };
      case "SYNTHETIS_RESPONSIO" { executeSYNTHETIS_RESPONSIO(input) };
      case "ADAPTIS_PERSONAE"    { executeADAPTIS_PERSONAE(input)    };
      case _ {
        {
          intelligenceId; domain = #Chat;
          ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
          subModelOutputs = [("error", 0.0)];
          executionSuccess = false; gatedByDoctrine = false;
          executedAtBeat = input.beatCounter; phiResonance = 0.0;
          attribution = FOUNDER;
        }
      };
    }
  };

  public func fireAll(input : IntelTypes.IntelligenceInput) : [IntelTypes.IntelligenceOutput] {
    [
      executeDIALOGOS_PRIME(input),
      executeINTENTIO_NEXUS(input),
      executeMEMORIA_CONTEXTA(input),
      executeSYNTHETIS_RESPONSIO(input),
      executeADAPTIS_PERSONAE(input),
    ]
  };

  public func aggregateNTModulation(outputs : [IntelTypes.IntelligenceOutput]) : [Float] {
    var da  : Float = 0.0; var ser : Float = 0.0;
    var ne  : Float = 0.0; var cor : Float = 0.0;
    var ach : Float = 0.0; var gab : Float = 0.0;
    var glu : Float = 0.0; var oxt : Float = 0.0;
    for (out in outputs.vals()) {
      let m = out.ntModulation;
      if (m.size() >= 8) {
        da  := da  + m[0]; ser := ser + m[1];
        ne  := ne  + m[2]; cor := cor + m[3];
        ach := ach + m[4]; gab := gab + m[5];
        glu := glu + m[6]; oxt := oxt + m[7];
      };
    };
    let clampD = func(d : Float) : Float {
      if (d < -2.0) -2.0 else if (d > 2.0) 2.0 else d
    };
    [
      clampD(da), clampD(ser), clampD(ne), clampD(cor),
      clampD(ach), clampD(gab), clampD(glu), clampD(oxt),
    ]
  };

}
