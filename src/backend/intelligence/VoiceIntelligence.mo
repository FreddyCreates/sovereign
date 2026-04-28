// intelligence/VoiceIntelligence.mo
// VOICE MANAGEMENT INTELLIGENCE — 5 Sovereign Intelligence Execution Units
// RESONANTIA | VOX_SENTIO | LINGUA_FLUX | PERSONA_ECHO | TEMPUS_VOX
// CRITICAL: These are callable execution units in canister stable memory.
// Calling an intelligence fires everything inside it immediately. No read step.
// Law 15 (Macro-Micro Compression): every sub-model is encoded inside its parent.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// PHI = 1.6180339887498948482 | 873ms | S_FLOOR = 0.75

import Float "mo:core/Float";
import Array "mo:core/Array";
import List  "mo:core/List";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";
import Int   "mo:core/Int";

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
  let SCHUMANN      : Float = 7.83;
  let HEARTBEAT_MS  : Float = 873.0;
  let FOUNDER       : Text  = "Alfredo Medina Hernandez";
  let DOCTRINE_GATE : Float = 0.75;

  // ── FIBONACCI TEMPORAL WINDOW ─────────────────────────────────────────────
  // TEMPUS_VOX: PHI-scaled sliding window — 144 tokens (Fibonacci F(12))
  let TEMPORAL_WINDOW_SIZE : Nat = 144;

  // ── PHI-COUPLED FREQUENCY LADDER (RESONANTIA) ─────────────────────────────
  // All 12 frequency nodes scaled from Schumann × PHI^n
  // Pre-computed: no arithmetic in module-level expressions for stable vars
  let RESONANTIA_FREQ_NODES : [Float] = [
    0.001,    // node 0 — deep substrate (symbolic)
    0.1,      // node 1 — biological slow wave
    0.5,      // node 2 — delta memory consolidation
    4.0,      // node 3 — theta creative
    7.83,     // node 4 — Schumann fundamental (SCHUMANN)
    12.6733,  // node 5 — 12.68 Hz sigma  (SCHUMANN * PHI)
    20.4993,  // node 6 — 20.53 Hz beta   (SCHUMANN * PHI2)
    33.1724,  // node 7 — 33.21 Hz fibo   (SCHUMANN * PHI3)
    40.0,     // node 8 — gamma cross-cortical
    111.0,    // node 9 — hemi shift
    432.0,    // node 10 — acoustic anchor
    266.991,  // node 11 — inverse-PHI acoustic (432.0 * PHI_INV)
  ];

  // ── HELPERS ───────────────────────────────────────────────────────────────

  func clamp(x : Float) : Float {
    if (x < S_FLOOR) S_FLOOR else if (x > S_CEIL) S_CEIL else x
  };

  func clampDelta(d : Float) : Float {
    if (d < -2.0) -2.0 else if (d > 2.0) 2.0 else d
  };

  func phiScale(base : Float, depth : Nat) : Float {
    var r = base;
    var i = 0;
    while (i < depth) { r := r * PHI; i += 1 };
    r
  };

  // Build an 8-float zero NT modulation array
  func zeroNT() : [Float] { [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0] };

  // Build an NT delta array targeting specific indices
  func ntDelta(
    da  : Float, ser : Float, ne  : Float, cor : Float,
    ach : Float, gab : Float, glu : Float, oxt : Float
  ) : [Float] {
    [da, ser, ne, cor, ach, gab, glu, oxt]
  };

  // ── SUB-MODEL BUILDERS ────────────────────────────────────────────────────

  func buildSubModel(
    id : Text, name : Text, fn : Text,
    phiWeight : Float, inputKeys : [Text], outputKeys : [Text]
  ) : IntelTypes.SubModelRecord {
    { id; name; function_ = fn; phiWeight; inputKeys; outputKeys; executionCount = 0 }
  };

  // ── 1. RESONANTIA — Frequency Pattern Recognition ─────────────────────────
  // WaveformAnalyzer: detects waveform signatures mapped to PHI-ladder nodes
  // ToneClassifier: classifies tonal content against Schumann harmonics
  // HarmonicMapper: maps detected harmonics to NT modulation targets
  // NT effect: high harmonic resonance → dopamine (reward) + serotonin (stability)
  // PHI coupling: node position determines modulation weight (PHI^n per node)

  func executeRESONANTIA(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "RESONANTIA"; domain = #Voice;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    // WaveformAnalyzer: compute resonance with PHI-ladder nodes
    // Match input "frequency" param against closest node — frequency distance as score
    var closestNodeScore : Float = 0.0;
    var closestNodeIdx : Nat = 0;
    let inputFreq : Float = switch (input.parameters.find(func((k, _) : (Text, Float)) : Bool { k == "frequency_hz" })) {
      case (?(_, v)) v;
      case null SCHUMANN;
    };
    var i : Nat = 0;
    for (nodeFreq in RESONANTIA_FREQ_NODES.vals()) {
      let diff = inputFreq - nodeFreq;
      let absDiff = if (diff < 0.0) -diff else diff;
      let score = 1.0 / (1.0 + absDiff);
      if (score > closestNodeScore) {
        closestNodeScore := score;
        closestNodeIdx := i;
      };
      i += 1;
    };
    let waveformScore = closestNodeScore * input.doctrineScore;

    // ToneClassifier: classify tone type based on node index
    // nodes 0-3: sub-cortical | 4-6: conscious | 7-11: harmonic synthesis
    let toneCategory : Float = if (closestNodeIdx < 4) 0.25
      else if (closestNodeIdx < 7) 0.65
      else 0.95;

    // HarmonicMapper: PHI^n weight modulates NT delta
    let harmonicWeight = phiScale(PHI_INV, closestNodeIdx % 5);

    // NT modulation: harmonic resonance → dopamine + serotonin; dissonance → cortisol
    let daBoost  = clampDelta(waveformScore * harmonicWeight * 0.4);
    let serBoost = clampDelta(toneCategory * harmonicWeight * 0.3);
    let corDelta = clampDelta(-(waveformScore * 0.1)); // resonance suppresses cortisol

    ({
      intelligenceId = "RESONANTIA"; domain = #Voice;
      ntModulation = ntDelta(daBoost, serBoost, 0.0, corDelta, 0.0, 0.0, harmonicWeight * 0.1, 0.0);
      doctrineStrengthDelta = waveformScore * 0.005;
      subModelOutputs = [
        ("WaveformAnalyzer", waveformScore),
        ("ToneClassifier",   toneCategory),
        ("HarmonicMapper",   harmonicWeight),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = closestNodeScore * PHI;
      attribution = FOUNDER;
    })
  };

  // ── 2. VOX_SENTIO — Emotional Tone Detection ──────────────────────────────
  // SentimentExtractor: maps NT concentrations to base valence (-1..1)
  // EmotionClassifier: classifies emotion from valence + arousal
  // MoodTracker: maintains running mood window, PHI-decay weighted average
  // NT input: DA+OXT → positive valence; cortisol+NE → negative/arousal
  // NT output: identified emotion feeds back to NT state

  func executeVOX_SENTIO(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "VOX_SENTIO"; domain = #Voice;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    let nt = input.ntConcentrations;
    let da  = if (nt.size() > 0) nt[0] else 5.0;
    let ser = if (nt.size() > 1) nt[1] else 7.0;
    let ne  = if (nt.size() > 2) nt[2] else 3.0;
    let cor = if (nt.size() > 3) nt[3] else 1.0;
    let oxt = if (nt.size() > 7) nt[7] else 5.5;

    // SentimentExtractor: valence = (DA + OXT - cortisol - NE) normalized
    let rawValence = (da + oxt - cor - ne) / (S_CEIL * 2.0);
    let valence = Float.max(-1.0, Float.min(1.0, rawValence));

    // Arousal derived from NE + glutamate − GABA
    let glu  = if (nt.size() > 6) nt[6] else 4.5;
    let gaba = if (nt.size() > 5) nt[5] else 3.0;
    let arousal = Float.max(0.0, Float.min(1.0, (ne + glu - gaba) / S_CEIL));

    // EmotionClassifier: 2D valence-arousal → categorical emotion
    // High valence + high arousal = excited; low valence + high arousal = anxious; etc.
    let emotionScore : Float =
      if (valence > 0.3 and arousal > 0.5) 0.9      // excited/joyful
      else if (valence > 0.3 and arousal <= 0.5) 0.7 // content/calm
      else if (valence <= 0.0 and arousal > 0.5) 0.3 // anxious/fearful
      else 0.5;                                        // neutral/sad

    // MoodTracker: PHI-decay running average (simplified as current weighted)
    let moodWeight = emotionScore * PHI_INV;

    // NT feedback: detected positive emotion boosts oxytocin + serotonin
    let oxtFeedback  = clampDelta(emotionScore * 0.2);
    let serFeedback  = clampDelta(moodWeight * 0.15);
    let corFeedback  = clampDelta(-(emotionScore * 0.1));

    ({
      intelligenceId = "VOX_SENTIO"; domain = #Voice;
      ntModulation = ntDelta(0.0, serFeedback, 0.0, corFeedback, 0.0, 0.0, 0.0, oxtFeedback);
      doctrineStrengthDelta = emotionScore * 0.004;
      subModelOutputs = [
        ("SentimentExtractor", valence),
        ("EmotionClassifier",  emotionScore),
        ("MoodTracker",        moodWeight),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = emotionScore * PHI;
      attribution = FOUNDER;
    })
  };

  // ── 3. LINGUA_FLUX — Real-time Language Processing ────────────────────────
  // SpeechTokenizer: boundary detection via PHI-ratio token chunking
  // GrammarParser: syntactic validity score (doctrine-aligned grammar = high)
  // SemanticLinker: meaning vector linking via NT-weighted semantic field
  // Temporal window: 144 tokens (Fibonacci F12) — PHI-scaled
  // NT: glutamate (clarity) drives tokenization; ACh (memory) drives linking

  func executeLINGUA_FLUX(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "LINGUA_FLUX"; domain = #Voice;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    let nt  = input.ntConcentrations;
    let glu = if (nt.size() > 6) nt[6] else 4.5;
    let ach = if (nt.size() > 4) nt[4] else 5.0;

    // SpeechTokenizer: PHI-ratio chunk size — longer tokens at higher glutamate
    let tokenBoundaryScore = Float.min(1.0, glu / S_CEIL);
    let chunkSize = Float.max(1.0, tokenBoundaryScore * TEMPORAL_WINDOW_SIZE.toFloat() * PHI_INV);

    // GrammarParser: doctrine-aligned grammar scores high when NT state is coherent
    let doctrineCoherence = Float.min(1.0, input.doctrineScore);
    let grammarScore = doctrineCoherence * tokenBoundaryScore;

    // SemanticLinker: meaning density = ACh (memory) × PHI^(chunkSize / window)
    let linkingDepth = Float.min(TEMPORAL_WINDOW_SIZE.toFloat(), chunkSize) / TEMPORAL_WINDOW_SIZE.toFloat();
    let semanticScore = Float.min(1.0, ach / S_CEIL * PHI * linkingDepth);

    // NT output: successful parsing → glutamate + ACh reinforcement
    let gluFeedback = clampDelta(grammarScore * 0.25);
    let achFeedback = clampDelta(semanticScore * 0.20);

    ({
      intelligenceId = "LINGUA_FLUX"; domain = #Voice;
      ntModulation = ntDelta(0.0, 0.0, 0.0, 0.0, achFeedback, 0.0, gluFeedback, 0.0);
      doctrineStrengthDelta = grammarScore * 0.004;
      subModelOutputs = [
        ("SpeechTokenizer", tokenBoundaryScore),
        ("GrammarParser",   grammarScore),
        ("SemanticLinker",  semanticScore),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = semanticScore * PHI;
      attribution = FOUNDER;
    })
  };

  // ── 4. PERSONA_ECHO — Voice Personality Synthesis ─────────────────────────
  // PersonalityMatrix: 5-dimension PHI-weighted personality field
  // VoiceBlender: blends NT-driven voice characteristics into coherent profile
  // CharacterEngine: generates stable character identity vector
  // NT: dopamine (assertiveness), oxytocin (warmth), serotonin (consistency)

  func executePERSONA_ECHO(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "PERSONA_ECHO"; domain = #Voice;
        ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
        subModelOutputs = []; executionSuccess = false; gatedByDoctrine = true;
        executedAtBeat = input.beatCounter; phiResonance = 0.0;
        attribution = FOUNDER;
      }
    };

    let nt  = input.ntConcentrations;
    let da  = if (nt.size() > 0) nt[0] else 5.0;
    let ser = if (nt.size() > 1) nt[1] else 7.0;
    let oxt = if (nt.size() > 7) nt[7] else 5.5;
    let ach = if (nt.size() > 4) nt[4] else 5.0;
    let ne  = if (nt.size() > 2) nt[2] else 3.0;

    // PersonalityMatrix: 5 Big-personality dimensions, each PHI-weighted
    // openness, conscientiousness, extraversion, agreeableness, neuroticism
    let openness         = Float.min(1.0, (glu_from_nt(nt) + da) / (S_CEIL * 2.0));
    let conscientiousness = Float.min(1.0, (ser + ach)         / (S_CEIL * 2.0));
    let extraversion     = Float.min(1.0, (da + ne)            / (S_CEIL * 2.0));
    let agreeableness    = Float.min(1.0, (oxt + ser)          / (S_CEIL * 2.0));
    let neuroticism      = Float.min(1.0, cortisol_from_nt(nt) / S_CEIL);

    // PersonalityMatrix aggregate — PHI-weighted composite
    let personalityScore = (
      openness * PHI + conscientiousness * PHI2 +
      extraversion * PHI3 + agreeableness * PHI4 +
      (1.0 - neuroticism) * PHI
    ) / (PHI + PHI2 + PHI3 + PHI4 + PHI);

    // VoiceBlender: blend characteristics into vocal profile
    let voiceWarmth  = agreeableness * oxt / S_CEIL;
    let voiceClarity = conscientiousness * ser / S_CEIL;
    let blendScore   = (voiceWarmth + voiceClarity) * PHI_INV;

    // CharacterEngine: stable identity = doctrine-aligned personality
    let characterStability = Float.min(1.0, personalityScore * input.doctrineScore);

    // NT feedback: coherent personality synthesis → oxytocin + serotonin
    let oxtFeedback = clampDelta(agreeableness * 0.15);
    let serFeedback = clampDelta(conscientiousness * 0.12);

    ({
      intelligenceId = "PERSONA_ECHO"; domain = #Voice;
      ntModulation = ntDelta(0.0, serFeedback, 0.0, 0.0, 0.0, 0.0, 0.0, oxtFeedback);
      doctrineStrengthDelta = characterStability * 0.005;
      subModelOutputs = [
        ("PersonalityMatrix", personalityScore),
        ("VoiceBlender",      blendScore),
        ("CharacterEngine",   characterStability),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = characterStability * PHI;
      attribution = FOUNDER;
    })
  };

  // ── 5. TEMPUS_VOX — Temporal Voice Context ────────────────────────────────
  // HistoryTracker: tracks last N tokens (N=144 Fibonacci) with Ebbinghaus decay
  // ContextWindow: PHI-scaled sliding window over conversation history
  // ConversationLinker: links temporal segments via semantic continuity score
  // NT: ACh (memory formation), glutamate (active recall), serotonin (continuity)

  func executeTEMPUS_VOX(input : IntelTypes.IntelligenceInput) : IntelTypes.IntelligenceOutput {
    let gated = input.doctrineScore < DOCTRINE_GATE;
    if (gated) {
      return {
        intelligenceId = "TEMPUS_VOX"; domain = #Voice;
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

    // HistoryTracker: Ebbinghaus decay — retention approximated via 1/(1+t/k)
    // (avoids Float.exp which isn't in mo:core; approximation is adequate for doctrine purposes)
    let decayBeats : Float = 12.0; // PHI-scaled memory decay constant
    let beatsElapsed : Float = (input.beatCounter % 100).toFloat(); // relative age
    let retention = 1.0 / (1.0 + beatsElapsed / decayBeats);
    let historyScore = retention * ach / S_CEIL;

    // ContextWindow: PHI-scaled window coverage — how much context is active
    let windowCoverage = Float.min(1.0, (ach * glu) / (S_CEIL * S_CEIL) * PHI);
    let contextScore = windowCoverage * input.doctrineScore;

    // ConversationLinker: semantic continuity across temporal segments
    // Linked by serotonin (stability across time) × ACh (memory) × PHI
    let continuityScore = Float.min(1.0, (ser * ach) / (S_CEIL * S_CEIL) * PHI * PHI_INV);

    // NT output: temporal coherence → ACh + serotonin reinforcement
    let achFeedback = clampDelta(historyScore * 0.25);
    let serFeedback = clampDelta(continuityScore * 0.15);
    let gluFeedback = clampDelta(windowCoverage * 0.12);

    ({
      intelligenceId = "TEMPUS_VOX"; domain = #Voice;
      ntModulation = ntDelta(0.0, serFeedback, 0.0, 0.0, achFeedback, 0.0, gluFeedback, 0.0);
      doctrineStrengthDelta = contextScore * 0.004;
      subModelOutputs = [
        ("HistoryTracker",     historyScore),
        ("ContextWindow",      contextScore),
        ("ConversationLinker", continuityScore),
      ];
      executionSuccess = true; gatedByDoctrine = false;
      executedAtBeat = input.beatCounter;
      phiResonance = continuityScore * PHI;
      attribution = FOUNDER;
    })
  };

  // ── NT HELPER EXTRACTORS ──────────────────────────────────────────────────
  // Used inside personality functions that receive the NT array
  func glu_from_nt(nt : [Float]) : Float { if (nt.size() > 6) nt[6] else 4.5 };
  func cortisol_from_nt(nt : [Float]) : Float { if (nt.size() > 3) nt[3] else 1.0 };

  // ── INTELLIGENCE REGISTRY — Initial Records ───────────────────────────────
  // All 5 voice intelligences as initialized IntelligenceRecord values.
  // These go into canister stable storage on first boot.

  func makeSubModels(
    ids   : [Text], names : [Text], fns : [Text]
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

  public func voiceIntelligenceRegistry() : [IntelTypes.IntelligenceRecord] { [
    {
      id = "RESONANTIA"; domain = #Voice;
      function_ = "Frequency pattern recognition";
      subModels = makeSubModels(
        ["WaveformAnalyzer", "ToneClassifier", "HarmonicMapper"],
        ["Waveform Analyzer", "Tone Classifier", "Harmonic Mapper"],
        ["Detects waveform signatures on PHI-ladder nodes",
         "Classifies tonal content against Schumann harmonics",
         "Maps harmonics to NT modulation targets"]
      );
      phiCoupling     = PHI;     // position 1 in voice hierarchy
      heartbeatPhase  = 0;       // fires in phase 0
      doctrineStrength = 0.85;
      executionCount  = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active;
      lastFireBeat    = 0;
      attribution     = FOUNDER;
    },
    {
      id = "VOX_SENTIO"; domain = #Voice;
      function_ = "Emotional tone detection";
      subModels = makeSubModels(
        ["SentimentExtractor", "EmotionClassifier", "MoodTracker"],
        ["Sentiment Extractor", "Emotion Classifier", "Mood Tracker"],
        ["Maps NT concentrations to valence vector",
         "Classifies emotion from valence + arousal space",
         "PHI-decay weighted running mood average"]
      );
      phiCoupling     = PHI2;   // position 2 in voice hierarchy
      heartbeatPhase  = 1;
      doctrineStrength = 0.85;
      executionCount  = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active;
      lastFireBeat    = 0;
      attribution     = FOUNDER;
    },
    {
      id = "LINGUA_FLUX"; domain = #Voice;
      function_ = "Real-time language processing";
      subModels = makeSubModels(
        ["SpeechTokenizer", "GrammarParser", "SemanticLinker"],
        ["Speech Tokenizer", "Grammar Parser", "Semantic Linker"],
        ["PHI-ratio token boundary detection (144-token Fibonacci window)",
         "Doctrine-aligned syntactic validity scoring",
         "ACh-weighted semantic meaning vector linking"]
      );
      phiCoupling     = PHI3;   // position 3 in voice hierarchy
      heartbeatPhase  = 2;
      doctrineStrength = 0.85;
      executionCount  = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active;
      lastFireBeat    = 0;
      attribution     = FOUNDER;
    },
    {
      id = "PERSONA_ECHO"; domain = #Voice;
      function_ = "Voice personality synthesis";
      subModels = makeSubModels(
        ["PersonalityMatrix", "VoiceBlender", "CharacterEngine"],
        ["Personality Matrix", "Voice Blender", "Character Engine"],
        ["5-dimension PHI-weighted personality field from NT state",
         "NT-driven voice characteristic blending",
         "Stable doctrine-aligned character identity generation"]
      );
      phiCoupling     = PHI4;   // position 4 in voice hierarchy
      heartbeatPhase  = 3;
      doctrineStrength = 0.85;
      executionCount  = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active;
      lastFireBeat    = 0;
      attribution     = FOUNDER;
    },
    {
      id = "TEMPUS_VOX"; domain = #Voice;
      function_ = "Temporal voice context";
      subModels = makeSubModels(
        ["HistoryTracker", "ContextWindow", "ConversationLinker"],
        ["History Tracker", "Context Window", "Conversation Linker"],
        ["Ebbinghaus decay tracking (144-token PHI-scaled window)",
         "PHI-scaled sliding window context coverage",
         "Semantic continuity linking across temporal segments"]
      );
      phiCoupling     = PHI * PHI4; // position 5 — PHI^5
      heartbeatPhase  = 4;
      doctrineStrength = 0.85;
      executionCount  = 0;
      lastNTModulation = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
      activationState = #Active;
      lastFireBeat    = 0;
      attribution     = FOUNDER;
    },
  ] };

  // ── EXECUTE DISPATCHER ────────────────────────────────────────────────────
  // Calling this fires the intelligence immediately. Law 15 — no read step.
  public func execute(
    intelligenceId : Text,
    input          : IntelTypes.IntelligenceInput,
  ) : IntelTypes.IntelligenceOutput {
    switch (intelligenceId) {
      case "RESONANTIA"   { executeRESONANTIA(input)  };
      case "VOX_SENTIO"   { executeVOX_SENTIO(input)  };
      case "LINGUA_FLUX"  { executeLINGUA_FLUX(input) };
      case "PERSONA_ECHO" { executePERSONA_ECHO(input)};
      case "TEMPUS_VOX"   { executeTEMPUS_VOX(input)  };
      case _ {
        {
          intelligenceId; domain = #Voice;
          ntModulation = zeroNT(); doctrineStrengthDelta = 0.0;
          subModelOutputs = [("error", 0.0)];
          executionSuccess = false; gatedByDoctrine = false;
          executedAtBeat = input.beatCounter; phiResonance = 0.0;
          attribution = FOUNDER;
        }
      };
    }
  };

  // ── FIRE ALL — called on every heartbeat ──────────────────────────────────
  // Fires all 5 voice intelligences in their heartbeat phase order.
  // Returns aggregate NT modulation (sum of all 5 vectors).
  public func fireAll(input : IntelTypes.IntelligenceInput) : [IntelTypes.IntelligenceOutput] {
    [
      executeRESONANTIA(input),
      executeVOX_SENTIO(input),
      executeLINGUA_FLUX(input),
      executePERSONA_ECHO(input),
      executeTEMPUS_VOX(input),
    ]
  };

  // ── AGGREGATE NT MODULATION ───────────────────────────────────────────────
  // Sums all output NT vectors into a single 8-float delta for application to organism state.
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
    [
      clampDelta(da),  clampDelta(ser), clampDelta(ne),  clampDelta(cor),
      clampDelta(ach), clampDelta(gab), clampDelta(glu), clampDelta(oxt),
    ]
  };

}
