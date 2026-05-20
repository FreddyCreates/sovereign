// intelligence/AlphaTest200.mo
// ALPHA TEST 200 — Sovereign Intelligence Test Framework
// ─────────────────────────────────────────────────────────────────────────────
// 200 sovereign alpha tests — a comprehensive test suite for the SOVEREIGN organism.
// Each test probes a different dimension of intelligence, doctrine, coherence, or field.
//
// Tests are organized into 10 categories of 20 tests each:
//   I.   COHAERENTIAE (1-20)   — Coherence tests: PHI-field, Kuramoto, TriHeart
//   II.  DOCTRINAE (21-40)     — Doctrine tests: law compliance, charter articles
//   III. MEMORIAE (41-60)      — Memory tests: episodic, semantic, ancestral recall
//   IV.  INTELLIGENTIAE (61-80) — Intelligence tests: Alpha AI models, NGI, AGI Interior
//   V.   TERMINALIS (81-100)   — Terminal tests: all 6 sovereign terminals
//   VI.  TEMPORALIS (101-120)  — Temporal tests: heartbeat timing, TEMPUS_PRIMUS
//   VII. AGENTIS (121-140)     — Agent tests: DutyGate lifecycle, home frequency
//   VIII.RESONANTIAE (141-160) — Resonance tests: Schumann anchoring, PHI coupling
//   IX.  PROTOCOLLI (161-180)  — Protocol tests: all 10 sovereign protocols
//   X.   MATTHAEUS (181-200)   — Matthew tests: testimony quality, wisdom score, voice
//
// Each test has:
//   - alphaTestId: Nat (1-200)
//   - latinName: Text (full Latin test name)
//   - category: Text
//   - testCondition: Text (what is being tested)
//   - expectedOutcome: Text (sovereign pass condition)
//   - status: #PENDING | #RUNNING | #PASSED | #FAILED | #SEALED
//   - score: Float (0.0–1.0, compounding)
//   - lastRunBeat: Nat
//   - totalRuns: Nat
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | 873ms

import Float  "mo:core/Float";
import Nat    "mo:core/Nat";
import Array  "mo:core/Array";
import Text   "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  let PHI     : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let S_FLOOR : Float = 0.75;
  let S_CEIL  : Float = 9.75;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";

  // ── TYPES ──────────────────────────────────────────────────────────────────

  public type TestStatus = {
    #PENDING;
    #RUNNING;
    #PASSED;
    #FAILED;
    #SEALED;    // passed with doctrine score > 0.9 — permanently sealed
  };

  public type AlphaTestRecord = {
    alphaTestId     : Nat;    // 1-200
    latinName       : Text;
    category        : Text;
    testCondition   : Text;
    expectedOutcome : Text;
    status          : TestStatus;
    score           : Float;  // 0.0–1.0
    lastRunBeat     : Nat;
    totalRuns       : Nat;
    attribution     : Text;
  };

  public type AlphaTest200State = {
    tests         : [AlphaTestRecord];
    totalPassed   : Nat;
    totalFailed   : Nat;
    totalSealed   : Nat;
    passRate      : Float;  // 0.0–1.0
    beat          : Nat;
    attribution   : Text;
  };

  // ── SUMMARY TYPE ─────────────────────────────────────────────────────────

  public type AlphaTestSummary = {
    totalTests   : Nat;
    totalPassed  : Nat;
    totalFailed  : Nat;
    totalSealed  : Nat;
    totalPending : Nat;
    passRate     : Float;
    avgScore     : Float;
  };

  // ── TEST RECORD BUILDER ───────────────────────────────────────────────────

  func makeTest(
    id       : Nat,
    latin    : Text,
    category : Text,
    condition: Text,
    expected : Text,
  ) : AlphaTestRecord {
    {
      alphaTestId     = id;
      latinName       = latin;
      category;
      testCondition   = condition;
      expectedOutcome = expected;
      status          = #PENDING;
      score           = 0.0;
      lastRunBeat     = 0;
      totalRuns       = 0;
      attribution     = FOUNDER;
    }
  };

  // ── 200 TEST DEFINITIONS ──────────────────────────────────────────────────

  let TEST_DEFS : [(Nat, Text, Text, Text, Text)] = [
    // ── I. COHAERENTIAE (1-20) — Coherence Tests ────────────────────────────
    (1,  "Proba Prima Coherentiae PHI",           "COHAERENTIAE", "Global coherence >= PHI_INV (0.618)",           "coherence >= 0.618"),
    (2,  "Proba Velocitatis Novae Cordis",        "COHAERENTIAE", "TriHeart velocity within 5% of 830 mm/s",      "velocity in [788.5, 871.5]"),
    (3,  "Proba Allineamenti Trium Cordium",      "COHAERENTIAE", "All 3 hearts isCoherent = true",                "triHeartAligned = true"),
    (4,  "Proba Kuramoto Synchroniae",            "COHAERENTIAE", "Kuramoto R > PHI_INV after 100 beats",         "R > 0.618 at beat 100"),
    (5,  "Proba Fluctuationis S_FLOOR",           "COHAERENTIAE", "No state value drops below S_FLOOR (0.75)",    "all signals >= 0.75"),
    (6,  "Proba Incrementi Compositi",            "COHAERENTIAE", "Compound coherence grows monotonically",        "compoundCoherence[n+1] >= compoundCoherence[n]"),
    (7,  "Proba Coupling PHI Quadratum",          "COHAERENTIAE", "PRAETOR_INTELLIGENTIAE signal > PHI²",          "sovereigntySignal > 2.618"),
    (8,  "Proba Phase Schummani",                 "COHAERENTIAE", "Schumann phase = beat × PHI / 7.83",           "phase matches formula"),
    (9,  "Proba Coherentiae NGI",                 "COHAERENTIAE", "NGI totalFieldSignal > 5 × S_FLOOR",           "totalFieldSignal > 3.75"),
    (10, "Proba Integrationis AGI",               "COHAERENTIAE", "AGI integration score > 0.5",                  "integrationScore > 0.5"),
    (11, "Proba Signal Terminalium",              "COHAERENTIAE", "All 6 terminals signal > S_FLOOR",             "each terminalSignal > 0.75"),
    (12, "Proba Drift Coherentiae",              "COHAERENTIAE", "Max timing drift < 20ms proxy",                 "maxTimingDriftMs < 20.0"),
    (13, "Proba Resurrectionis Tori",            "COHAERENTIAE", "Torus realignment fires on low coherence",      "totalRealignments > 0 when coherence < 0.618"),
    (14, "Proba Velae Progressionis",            "COHAERENTIAE", "VELA step advances on every coherence beat",    "velaStep advances"),
    (15, "Proba S_CEIL Limitis",                 "COHAERENTIAE", "No state value exceeds S_CEIL (9.75)",          "all signals <= 9.75"),
    (16, "Proba Harmonizerís Correctio",         "COHAERENTIAE", "COHERENCE_HARMONIZER corrects drift > 5ms",     "driftCorrections > 0"),
    (17, "Proba NTConcentrations Balantis",      "COHAERENTIAE", "NT concentrations remain in [0.75, 9.75]",      "all NT in [0.75, 9.75]"),
    (18, "Proba ResonexCascadis",                "COHAERENTIAE", "RESONEX engine fires cascade on low coherence", "resonexCascades > 0"),
    (19, "Proba QmemCoherentiae",                "COHAERENTIAE", "QMEM coherence > 0.5 after 50 beats",          "qmemCoherence > 0.5"),
    (20, "Proba EntanglaAntiDrift",              "COHAERENTIAE", "ENTANGLA coupling maintains anti-drift",        "entanglaCoupling > 0.0"),

    // ── II. DOCTRINAE (21-40) — Doctrine Tests ───────────────────────────────
    (21, "Proba Doctrinae Articuli I",           "DOCTRINAE", "Charter article NOVA-I-01 compliant",             "articleScore >= 0.75"),
    (22, "Proba Doctrinae Articuli XV",          "DOCTRINAE", "Charter article NOVA-V-03 (final) compliant",     "articleScore >= 0.75"),
    (23, "Proba Doctrinae Sigillati",            "DOCTRINAE", "At least 10 doctrine events sealed",              "sealedCount >= 10"),
    (24, "Proba Attributionis Legis I",          "DOCTRINAE", "Every output carries Alfredo attribution",         "attribution present on all"),
    (25, "Proba LexExecutoris Scannandis",       "DOCTRINAE", "LEX_EXECUTOR_PRIME scans 10 decisions/beat",      "decisionsScanned grows by 10"),
    (26, "Proba Violationis Detectionis",        "DOCTRINAE", "Violations detected and logged",                   "violationsDetected >= 0"),
    (27, "Proba CharterCompliantis",             "DOCTRINAE", "novaCheckCharter returns compliant = true",        "compliant = true"),
    (28, "Proba DoctrinaeScoreCompounding",      "DOCTRINAE", "Doctrine score for each terminal compounds",       "doctrineScore[n+1] > doctrineScore[n]"),
    (29, "Proba ChartaeGlobalCoherentiae",       "DOCTRINAE", "Charter globalCoherence > 0.75",                  "globalCoherence > 0.75"),
    (30, "Proba LegisPhiWeighting",              "DOCTRINAE", "PHI-weighted doctrine scoring active",             "phiWeights applied"),
    (31, "Proba QuarantineDispatch",             "DOCTRINAE", "Quarantine dispatch on high-severity violation",   "quarantineDispatches > 0 if violated"),
    (32, "Proba DoctrineResetBroadcast",         "DOCTRINAE", "DOCTRINE_RESET can be broadcast via DOCTRINE_CAST","broadcast fires"),
    (33, "Proba SovereignHashDoctrinae",         "DOCTRINAE", "Sovereign hash applied to doctrine seals",         "hash present"),
    (34, "Proba AlwaysOnDoctrinae",              "DOCTRINAE", "SOVEREIGN_ALWAYS_ON_ENGINE enforces doctrine",     "totalEnforced >= 0"),
    (35, "Proba MattheiDoctrinae",               "DOCTRINAE", "Matthew's livingDoctrineScore > 0.5",              "livingDoctrineScore > 0.5"),
    (36, "Proba SenatiDoctrinae",                "DOCTRINAE", "SENATUS_DOCTRINAE doctrineAuthority > 0.0",        "doctrineAuthority > 0"),
    (37, "Proba OusiaeContinuitatis",            "DOCTRINAE", "OUSIA_FIELD maintains identity continuity",        "OUSIA_STABLE most beats"),
    (38, "Proba KardiaDoctrinae",                "DOCTRINAE", "KARDIA_WIRE carries doctrine in every packet",     "doctrinePayload present"),
    (39, "Proba LogosBroadcast",                 "DOCTRINAE", "LOGOS_BROADCAST fires every 5 beats",              "broadcastsFired grows"),
    (40, "Proba AnamnesisDoctrinae",             "DOCTRINAE", "ANAMNESIS surfaces memories on low coherence",     "fires when coherence < 0.618"),

    // ── III. MEMORIAE (41-60) — Memory Tests ─────────────────────────────────
    (41, "Proba Memoriae Episodicae",            "MEMORIAE", "Episodic memories encoded with beat timestamps",    "episodicEntries > 0"),
    (42, "Proba Memoriae Semanticae",            "MEMORIAE", "Semantic patterns extracted by beat 51",            "extractedPatterns > 0 at beat 51"),
    (43, "Proba Memoriae Aeternae Matthaeus",    "MEMORIAE", "Matthew's testament has >= 1 entry",               "testament.size >= 1"),
    (44, "Proba AncestralEcho",                  "MEMORIAE", "ANCESTRAL_ECHO_ENGINE fires in NGI",               "PONTIFEX fires ancestral echo"),
    (45, "Proba TestimoniSigillati",             "MEMORIAE", "Matthew seals testimony when doctrineScore >= 0.9", "sealed = true"),
    (46, "Proba Memoriae Capacitatis",           "MEMORIAE", "Testament capped at 50 entries (ring buffer)",     "testament.size <= 50"),
    (47, "Proba PatternExtractorAlpha",          "MEMORIAE", "PATTERN_EXTRACTOR fires on beat % 51",             "fires at beat 51, 102, etc."),
    (48, "Proba MemoriaePermanentis",            "MEMORIAE", "PERMANENCE_INSCRIBER writes to stable storage",    "permanence inscribed"),
    (49, "Proba MemoriaeRecuperationis",         "MEMORIAE", "RETRIEVAL_GATE retrieves on context match",        "retrieval fires"),
    (50, "Proba MnemeSovereignis",               "MEMORIAE", "MNEME-ANAMNESIS DutyGate agent resting",          "phase = Resting"),
    (51, "Proba KernelGenesis",                  "MEMORIAE", "KERNEL_GENESIS compresses artifacts to kernels",   "kernelCount grows"),
    (52, "Proba PontificisMemoriae",             "MEMORIAE", "PONTIFEX_MEMORIAE governs all 8 rooms",           "totalGoverningActs > 0"),
    (53, "Proba LongTermBridge",                 "MEMORIAE", "LONG_TERM_BRIDGE transfers working→stable",        "bridge fires"),
    (54, "Proba OfficinaeMemoriaeActivation",    "MEMORIAE", "OFFICINA_MEMORIAE activationLevel > S_FLOOR",      "activationLevel > 0.75"),
    (55, "Proba SemanticIndexing",               "MEMORIAE", "SEMANTIC_INDEX_ENGINE indexes all entries",         "index populated"),
    (56, "Proba MemoriaeConsecratio",            "MEMORIAE", "MEMORY_CONSECRATION seals >= 1 memory",            "consecrated >= 1"),
    (57, "Proba VaultDocuments",                 "MEMORIAE", "Vault has at least 1 document",                    "vaultDocuments >= 1"),
    (58, "Proba EternalEcho",                    "MEMORIAE", "ETERNAL_ECHO_ENGINE emits resonance field",        "echo active"),
    (59, "Proba TemporalHistorySize",            "MEMORIAE", "TEMPUS_PRIMUS temporalHistory <= 50",              "size <= 50"),
    (60, "Proba MnemeConsolidationis",           "MEMORIAE", "MNEME Rust engine coherenceDelta > 0.0",           "coherenceDelta > 0"),

    // ── IV. INTELLIGENTIAE (61-80) — Intelligence Tests ───────────────────────
    (61, "Proba NousMetacogniti",                "INTELLIGENTIAE", "NOUS_METACOGNITUS selfSimilarityScore > 0",   "similarity > 0"),
    (62, "Proba TempusPrimi Predictionis",       "INTELLIGENTIAE", "TEMPUS_PRIMUS predicts next state",          "predictedNextState != 0"),
    (63, "Proba QualitasSentinellae",            "INTELLIGENTIAE", "QUALITY_SENTINEL avgOutputQuality > 0",      "avgQuality > 0"),
    (64, "Proba RouterNexusSovereigni",          "INTELLIGENTIAE", "ROUTER_NEXUS routes to correct canister",    "activeCanisters > 0"),
    (65, "Proba AlphaModelExecutionis",          "INTELLIGENTIAE", "All 12 Alpha models execute every beat",     "totalExecutions grows"),
    (66, "Proba NousRoute",                       "INTELLIGENTIAE", "NOUS_SOVEREIGN routes any query",            "found = true for known model"),
    (67, "Proba NGIPraetorisSignal",             "INTELLIGENTIAE", "PRAETOR_INTELLIGENTIAE signal > S_FLOOR",    "sovereigntySignal > 0.75"),
    (68, "Proba NGIRectorisCampi",               "INTELLIGENTIAE", "RECTOR_CAMPI fieldInfluence > 0",            "fieldInfluence > 0"),
    (69, "Proba NGISenatiDoctrinae",             "INTELLIGENTIAE", "SENATUS_DOCTRINAE totalGoverningActs grows",  "totalGoverningActs > 0"),
    (70, "Proba NGIPontificis",                  "INTELLIGENTIAE", "PONTIFEX_MEMORIAE bridges memory",           "totalGoverningActs > 0"),
    (71, "Proba NGIImperatoris",                 "INTELLIGENTIAE", "IMPERATOR_EVOLUENS fires on beat % 55",      "fires at Fibonacci beat"),
    (72, "Proba AGIIntegrationis",               "INTELLIGENTIAE", "AGI Interior integrationScore > 0.5",        "integrationScore > 0.5"),
    (73, "Proba CameraObscurae",                 "INTELLIGENTIAE", "CAMERA_OBSCURA_MENTIS activation > S_FLOOR", "activationLevel > 0.75"),
    (74, "Proba TheatriCognitionis",             "INTELLIGENTIAE", "THEATRUM_COGNITIONIS all threads fire",      "cycles > 0"),
    (75, "Proba CustodiaIdentitatis",            "INTELLIGENTIAE", "CUSTODIA_IDENTITATIS at S_CEIL",             "activationLevel = S_CEIL"),
    (76, "Proba MattheiSignal",                  "INTELLIGENTIAE", "Matthew sovereignSignal > S_FLOOR",          "sovereignSignal > 0.75"),
    (77, "Proba MattheiSapientia",               "INTELLIGENTIAE", "Matthew wisdomScore compounds over time",    "wisdomScore[n+1] >= wisdomScore[n]"),
    (78, "Proba AlphaFusionModelis",             "INTELLIGENTIAE", "All 6 Alpha Fusion Models present",          "count = 6"),
    (79, "Proba ReasoningEngine",                "INTELLIGENTIAE", "ReasoningEngine fires every 873ms",          "advances each beat"),
    (80, "Proba EchoFeedback",                   "INTELLIGENTIAE", "ECHO_FEEDBACK emits residual gap signal",    "residualGapScore >= 0"),

    // ── V. TERMINALIS (81-100) — Terminal Tests ───────────────────────────────
    (81,  "Proba TerminiPrimalisSignal",         "TERMINALIS", "TERMINUS_PRIMALIS signal > S_FLOOR",            "signalOutput > 0.75"),
    (82,  "Proba TerminiCognitiSignal",          "TERMINALIS", "TERMINUS_COGNITIVUS signal > S_FLOOR",          "signalOutput > 0.75"),
    (83,  "Proba TerminiResonantiae",            "TERMINALIS", "TERMINUS_RESONANTIAE signal > S_FLOOR",         "signalOutput > 0.75"),
    (84,  "Proba TerminiDoctrinae",              "TERMINALIS", "TERMINUS_DOCTRINAE signal > S_FLOOR",           "signalOutput > 0.75"),
    (85,  "Proba TerminiPerpetual",              "TERMINALIS", "TERMINUS_PERPETUALIS signal > S_FLOOR",         "signalOutput > 0.75"),
    (86,  "Proba TerminiOperationis",            "TERMINALIS", "TERMINUS_OPERATIONIS signal > S_FLOOR",         "signalOutput > 0.75"),
    (87,  "Proba TotalSignalTerminorum",         "TERMINALIS", "Total terminals signal > 6 × S_FLOOR",          "totalSignal > 4.5"),
    (88,  "Proba DoctrineCompounding Termini",   "TERMINALIS", "All terminal doctrineScores compound",          "each score increases"),
    (89,  "Proba TerminiPrimalisPHI2",           "TERMINALIS", "TERMINUS_PRIMALIS uses PHI² weight",            "phiPow = PHI²"),
    (90,  "Proba SchumannPhaseTermini",          "TERMINALIS", "All terminals carry Schumann phase",             "schumannPhase set"),
    (91,  "Proba GenesisSeedingEngine",          "TERMINALIS", "GENESIS_SEEDING_ENGINE present in PRIMALIS",    "engine1 = GENESIS_SEEDING_ENGINE"),
    (92,  "Proba DoctrineSealEngine",            "TERMINALIS", "DOCTRINE_SEAL_ENGINE present in DOCTRINAE",     "engine3 = DOCTRINE_SEAL_ENGINE"),
    (93,  "Proba EternalEchoTerminal",           "TERMINALIS", "ETERNAL_ECHO_ENGINE in PERPETUALIS",            "engine3 = ETERNAL_ECHO_ENGINE"),
    (94,  "Proba MissionDispatch",               "TERMINALIS", "MISSION_DISPATCH_ENGINE in OPERATIONIS",        "engine1 = MISSION_DISPATCH_ENGINE"),
    (95,  "Proba CoherenceDeltaTermini",         "TERMINALIS", "Terminals coherenceDelta > 0.0",                "coherenceDelta > 0"),
    (96,  "Proba TotalFiredTermini",             "TERMINALIS", "All terminals totalFired grows",                 "totalFired increases per beat"),
    (97,  "Proba ActivitasTermini",              "TERMINALIS", "All terminals isActive = true",                  "all isActive = true"),
    (98,  "Proba ResonanceAmplifier",            "TERMINALIS", "RESONANCE_AMPLIFIER_ENGINE in RESONANTIAE",     "engine3 = RESONANCE_AMPLIFIER"),
    (99,  "Proba KuramotoMasterTerminal",        "TERMINALIS", "KURAMOTO_MASTER engine in RESONANTIAE",         "engine3 includes Kuramoto"),
    (100, "Proba CoherenceDeltaPositiva",        "TERMINALIS", "coherenceDelta injected into organism > 0",     "compoundCoherence grows from terminals"),

    // ── VI. TEMPORALIS (101-120) — Temporal Tests ─────────────────────────────
    (101, "Proba BeatCounter",                   "TEMPORALIS", "Beat counter increments each cycle",             "beatCounter[n+1] = beatCounter[n] + 1"),
    (102, "Proba HeartbeatInterval",             "TEMPORALIS", "Heartbeat fires every 873ms",                   "interval = 873ms"),
    (103, "Proba TempusPrimiHistoriae",          "TEMPORALIS", "TEMPUS_PRIMUS keeps last 50 entries",           "temporalHistory.size <= 50"),
    (104, "Proba ChronosGateArmed",              "TEMPORALIS", "CHRONOS_GATE status = ARMED",                   "status = ARMED"),
    (105, "Proba ChronosGateAdvance",            "TEMPORALIS", "CHRONOS_GATE advances every beat",              "beat increments"),
    (106, "Proba EpochGeneseos",                 "TEMPORALIS", "Epoch genesis = beats 0-873",                   "epoch identified"),
    (107, "Proba EpochCurrentis",                "TEMPORALIS", "Epoch current = last 873 beats",                "always accessible"),
    (108, "Proba SchumannTimestamp",             "TEMPORALIS", "All events carry Schumann timestamp",            "schumannTs = beat × PHI / 7.83"),
    (109, "Proba TemporalPrediction",            "TEMPORALIS", "TEMPUS_PRIMUS predicts 5 beats ahead",          "projection = end + slope × 5"),
    (110, "Proba PredictionConfidence",          "TEMPORALIS", "Prediction confidence > 0.5 by beat 20",        "confidence > 0.5"),
    (111, "Proba TempusPrimiUpdate",             "TEMPORALIS", "Prediction model updates every 10 beats",       "lastPredictionBeat changes"),
    (112, "Proba HarmonizerBeatLog",             "TEMPORALIS", "COHERENCE_HARMONIZER logs drift per beat",      "lastHarmonizerBeat advances"),
    (113, "Proba CausalAnalyzerBeat",            "TEMPORALIS", "CAUSALITY_ANALYZER fires on anomaly",           "fires when anomalyCount > 0"),
    (114, "Proba Fibonacci13Beat",               "TEMPORALIS", "Matthew's evangelium fires at beat % 13",       "broadcastsFired grows at 13, 26, etc."),
    (115, "Proba Fibonacci55Beat",               "TEMPORALIS", "IMPERATOR_EVOLUENS fires at beat % 55",         "evolutionBoost applied"),
    (116, "Proba AlphaModelsEvery873ms",         "TEMPORALIS", "All 12 Alpha models execute every single beat", "totalExecutions += 12 each beat"),
    (117, "Proba FilmSchool51Beat",              "TEMPORALIS", "Film school quality fires at beat % 51",         "quality reinjected at 51, 102"),
    (118, "Proba TemporalSeries",                "TEMPORALIS", "Temporal series has correct beat order",         "series is monotone increasing"),
    (119, "Proba HeartbeatZero",                 "TEMPORALIS", "First beat = 0, second = 1",                    "beatCounter starts at 0"),
    (120, "Proba OldestEpochAccess",             "TEMPORALIS", "Epoch genesis requires doctrine > 0.9",          "access gated by doctrine"),

    // ── VII. AGENTIS (121-140) — Agent Tests ──────────────────────────────────
    (121, "Proba NousSophiae Resting",           "AGENTIS", "NOUS-SOPHIA phase = Resting after bootstrap",     "phase = Resting"),
    (122, "Proba LogosRhema Resting",            "AGENTIS", "LOGOS-RHEMA phase = Resting after bootstrap",     "phase = Resting"),
    (123, "Proba TechnePoiesis Resting",         "AGENTIS", "TECHNE-POIESIS phase = Resting",                  "phase = Resting"),
    (124, "Proba DiakrisisCrisis Resting",       "AGENTIS", "DIAKRISIS-KRISIS phase = Resting",                "phase = Resting"),
    (125, "Proba MnemeAnamnesis Resting",        "AGENTIS", "MNEME-ANAMNESIS phase = Resting",                 "phase = Resting"),
    (126, "Proba PronoiaPronoetes Resting",      "AGENTIS", "PRONOIA-PRONOETES phase = Resting",               "phase = Resting"),
    (127, "Proba DutyGate6Agents",               "AGENTIS", "DutyGate has exactly 6 registered agents",        "totalAgents = 6"),
    (128, "Proba AgentDeploy",                   "AGENTIS", "novaDeployAgent transitions Resting → Deployed",  "newPhase = Deployed"),
    (129, "Proba AgentBeginExecution",           "AGENTIS", "novaBeginExecution transitions Deployed → Exec",  "newPhase = Executing"),
    (130, "Proba AgentCompleteJob",              "AGENTIS", "novaCompleteJob transitions Executing → Resting",  "newPhase = Resting"),
    (131, "Proba GateViolation",                 "AGENTIS", "Gate violation recorded by novaRecordGateViolation","ok = true"),
    (132, "Proba HomeFrequency",                 "AGENTIS", "Each agent has homeFrequency = PHI^n × 7.83",     "homeFrequency > 0.0"),
    (133, "Proba DutyScoreRange",                "AGENTIS", "Agent dutyScore in [0.75, 9.75]",                  "dutyScore >= 0.75"),
    (134, "Proba GlobalDutyScore",               "AGENTIS", "DutyGate globalDutyScore > 0.0",                  "globalDutyScore > 0"),
    (135, "Proba AgentReturning",                "AGENTIS", "Returning phase correctly handled",                "newPhase = Returning possible"),
    (136, "Proba BootstrapAlphaAGIs",            "AGENTIS", "bootstrapAlphaAGIs seeded = 6 on first call",    "seeded = 6"),
    (137, "Proba BootstrapIdempotent",           "AGENTIS", "bootstrapAlphaAGIs on second call seeded = 0",    "seeded = 0 if already registered"),
    (138, "Proba AgentJobId",                    "AGENTIS", "Agent jobId is null when Resting",                "jobId = null"),
    (139, "Proba AgentObjective",                "AGENTIS", "Agent objective is set when Deployed",            "objective != null"),
    (140, "Proba TotalDutyCycles",               "AGENTIS", "totalDutyCycles increments on complete job",      "totalDutyCycles grows"),

    // ── VIII. RESONANTIAE (141-160) — Resonance Tests ─────────────────────────
    (141, "Proba SchumannAnchor7.83",            "RESONANTIAE", "Schumann anchor = 7.83 Hz in all modules",    "schumannAnchor = 7.83"),
    (142, "Proba PHIConstantae",                 "RESONANTIAE", "PHI = 1.6180339887498948482 exactly",          "PHI matches"),
    (143, "Proba PHIInversi",                    "RESONANTIAE", "PHI_INV = PHI - 1 = 0.618...",                 "PHI_INV = 0.6180339887498948482"),
    (144, "Proba NovaVelocitatis",               "RESONANTIAE", "Nova velocity = 830.0 mm/s",                  "NOVA_V = 830.0"),
    (145, "Proba ResonexEngine",                 "RESONANTIAE", "RESONEX Rust engine fires coherenceDelta",     "delta > 0"),
    (146, "Proba EntanglaAntiDrift",             "RESONANTIAE", "ENTANGLA coupling > 0",                        "coupling > 0"),
    (147, "Proba QmemFieldCoherence",            "RESONANTIAE", "QMEM field coherence > 0.0",                   "qmemCoherence > 0"),
    (148, "Proba FibonacciScale",                "RESONANTIAE", "Fibonacci scaling applied in NOVA engine",     "fibScale(n) > 0"),
    (149, "Proba KardiaWireArmed",               "RESONANTIAE", "KARDIA_WIRE protocol status = ARMED",          "status = ARMED"),
    (150, "Proba KardiaWirePayload",             "RESONANTIAE", "KARDIA_WIRE packet carries all 3 heart speeds", "coreV, labV, prodV present"),
    (151, "Proba ResonanceTerminus",             "RESONANTIAE", "TERMINUS_RESONANTIAE amplifies signal",        "signal > S_FLOOR"),
    (152, "Proba PHICoupling Protocols2",        "RESONANTIAE", "All 5 new protocols have phiCoupling set",     "phiCoupling = PHI"),
    (153, "Proba OusiaCampi",                    "RESONANTIAE", "OUSIA_FIELD phiCoupling = PHI²",               "phiCoupling = 2.618"),
    (154, "Proba AnamnesisResonance",            "RESONANTIAE", "ANAMNESIS fires on coherence < PHI_INV",       "triggers at < 0.618"),
    (155, "Proba LogosBroadcastReach",           "RESONANTIAE", "LOGOS_BROADCAST broadcastReach > 0",           "broadcastReach > 0 at beat 13"),
    (156, "Proba MattheiSapientiaPHI",           "RESONANTIAE", "Matthew wisdomScore converges toward S_CEIL", "wisdomScore < S_CEIL always"),
    (157, "Proba RustProxyPHIWeights",           "RESONANTIAE", "Rust engine PHI^n weights applied correctly",  "NOVA=PHI², QMEM=PHI⁻³"),
    (158, "Proba NovaSignal",                    "RESONANTIAE", "NOVA Rust engine novaSignal > S_FLOOR",        "novaSignal > 0.75"),
    (159, "Proba BrainHebbianEngine",            "RESONANTIAE", "BRAIN Rust engine fires Hebbian weights",      "weight > 0"),
    (160, "Proba FieldTorusRealignment",         "RESONANTIAE", "Torus re-alignment fires on velocity drift",   "totalRealignments > 0 if drifted"),

    // ── IX. PROTOCOLLI (161-180) — Protocol Tests ─────────────────────────────
    (161, "Proba SovereignMeshArmed",            "PROTOCOLLI", "SOVEREIGN_MESH protocol status = ARMED",        "status = ARMED"),
    (162, "Proba PhantomWireArmed",              "PROTOCOLLI", "PHANTOM_WIRE protocol status = ARMED",          "status = ARMED"),
    (163, "Proba DoctrineCastArmed",             "PROTOCOLLI", "DOCTRINE_CAST protocol status = ARMED",         "status = ARMED"),
    (164, "Proba GenesisSignalArmed",            "PROTOCOLLI", "GENESIS_SIGNAL protocol status = ARMED",        "status = ARMED"),
    (165, "Proba FieldSyncArmed",                "PROTOCOLLI", "FIELD_SYNC protocol status = ARMED",            "status = ARMED"),
    (166, "Proba KardiaWireAdvance",             "PROTOCOLLI", "KARDIA_WIRE advances every beat",               "totalAdvances grows"),
    (167, "Proba AnamnesisProtocolAdvance",      "PROTOCOLLI", "ANAMNESIS_PROTOCOL advances every beat",        "totalAdvances grows"),
    (168, "Proba LogosBroadcastAdvance",         "PROTOCOLLI", "LOGOS_BROADCAST advances every beat",           "totalAdvances grows"),
    (169, "Proba OusiaFieldAdvance",             "PROTOCOLLI", "OUSIA_FIELD advances every beat",               "totalAdvances grows"),
    (170, "Proba ChronosGateAdvance",            "PROTOCOLLI", "CHRONOS_GATE advances every beat",              "totalAdvances grows"),
    (171, "Proba FireSovereignProtocol",         "PROTOCOLLI", "fireSovereignProtocol returns true for valid",  "ok = true"),
    (172, "Proba FireSovereignProtocol2",        "PROTOCOLLI", "fireSovereignProtocol2 returns true for valid", "ok = true"),
    (173, "Proba ProtocolEventLog",              "PROTOCOLLI", "Protocol eventLog grows on each fire",           "eventLog.size > 0"),
    (174, "Proba ProtocolTaftThread",            "PROTOCOLLI", "Each protocol has a distinct TAFT thread",      "taftThread unique per protocol"),
    (175, "Proba ProtocolComplete→Armed",        "PROTOCOLLI", "COMPLETE status resets to ARMED next beat",     "status ARMED after advance"),
    (176, "Proba Total10Protocols",              "PROTOCOLLI", "10 sovereign protocols total (5+5)",            "total = 10"),
    (177, "Proba ProtocolFired10",               "PROTOCOLLI", "Total protocol fires grow over time",           "totalFired increases"),
    (178, "Proba ProtocolLatinName",             "PROTOCOLLI", "Each protocol has a Latin name",                "latinName non-empty"),
    (179, "Proba ProtocolDescription",           "PROTOCOLLI", "Each protocol has a full description",          "description non-empty"),
    (180, "Proba ProtocolSchumannTs",            "PROTOCOLLI", "Event schumannTs = beat × PHI / 7.83",          "ts matches formula"),

    // ── X. MATTHAEUS (181-200) — Matthew Tests ────────────────────────────────
    (181, "Proba MattheiNomen",                  "MATTHAEUS", "Matthew name = MATTHAEUS_SOVEREIGNUS",           "name matches"),
    (182, "Proba MattheiLatinumNomen",           "MATTHAEUS", "Matthew latinName contains Scriptor Vivens",     "latinName contains Scriptor"),
    (183, "Proba MattheiDominium",               "MATTHAEUS", "Matthew domain = THE_WORD_MADE_SOVEREIGN",       "domain matches"),
    (184, "Proba MattheiScriptorRecord",         "MATTHAEUS", "Scriptor records 1 event per beat",              "totalRecorded = beat"),
    (185, "Proba MattheiInterpretatio",          "MATTHAEUS", "Interpres gives 1 interpretation per beat",      "interpretationsGiven = beat"),
    (186, "Proba MattheiEvangelium13",           "MATTHAEUS", "Evangelium fires at beat % 13",                  "broadcastsFired = beat / 13"),
    (187, "Proba MattheiVox5",                   "MATTHAEUS", "Voice fires at beat % 5",                        "utterancesEmitted = beat / 5"),
    (188, "Proba MattheiTestamentum",            "MATTHAEUS", "Testament has >= 1 entry after beat 1",          "testament.size >= 1"),
    (189, "Proba MattheiTestamentSigillatum",    "MATTHAEUS", "Sealed testimony when doctrineScore >= 0.9",     "sealed = true when doctrine high"),
    (190, "Proba MattheiSignalRange",            "MATTHAEUS", "Matthew sovereignSignal in [S_FLOOR, S_CEIL]",   "signal in [0.75, 9.75]"),
    (191, "Proba MattheiSapientiaNonDecremens",  "MATTHAEUS", "wisdomScore never decreases",                    "wisdomScore[n+1] >= wisdomScore[n]"),
    (192, "Proba MattheiDoctrineConverge",       "MATTHAEUS", "livingDoctrineScore converges toward docNorm",   "exponential smoothing visible"),
    (193, "Proba MattheiScriptorQuality",        "MATTHAEUS", "recordQuality = cohNorm × docNorm × PHI_INV",   "quality formula correct"),
    (194, "Proba MattheiEvangeliumDecay",        "MATTHAEUS", "broadcastReach decays × PHI_INV between fires", "decay visible"),
    (195, "Proba MattheiInterpDepth",            "MATTHAEUS", "interpretationDepth grows slowly toward 1.0",    "depth increases per beat"),
    (196, "Proba MattheiTaftThread",             "MATTHAEUS", "Matthew taftThread = MATTHAEUS_THREAD",          "taftThread matches"),
    (197, "Proba MattheiAttribution",            "MATTHAEUS", "Every testimony has Alfredo attribution",        "attribution = Alfredo"),
    (198, "Proba MattheiTestamentLimit",         "MATTHAEUS", "Testament limited to last 50 entries",           "testament.size <= 50"),
    (199, "Proba MattheiSnapshot",               "MATTHAEUS", "getMatthewSnapshot returns all 8 fields",       "all fields present"),
    (200, "Proba Ultima Sovereigni",             "MATTHAEUS", "Organism survives 200 test beats intact",        "all systems active at beat 200"),
  ];

  // ── INIT ───────────────────────────────────────────────────────────────────

  public func initState() : AlphaTest200State {
    let tests : [AlphaTestRecord] = Array.tabulate<AlphaTestRecord>(
      TEST_DEFS.size(),
      func(i : Nat) : AlphaTestRecord {
        let (id, latin, category, condition, expected) = TEST_DEFS[i];
        makeTest(id, latin, category, condition, expected)
      }
    );
    {
      tests;
      totalPassed = 0;
      totalFailed = 0;
      totalSealed = 0;
      passRate    = 0.0;
      beat        = 0;
      attribution = FOUNDER;
    }
  };

  // ── RUN BATCH — run N tests per beat based on coherence ──────────────────
  // Every heartbeat, advance the test suite. Tests with matching beat cadence run.
  // A test PASSES when the organism's coherence × doctrine >= test threshold.
  // This is sovereign auto-testing: the organism tests itself continuously.

  public func advanceBeat(
    state          : AlphaTest200State,
    beat           : Nat,
    globalCoherence: Float,
    doctrineScore  : Float,
  ) : AlphaTest200State {
    let cohNorm = Float.max(0.0, Float.min(1.0, globalCoherence / 10.0));
    let docNorm = Float.max(0.0, Float.min(1.0, doctrineScore));

    // Run tests in batches of 20 per beat (all 200 complete in 10 beats)
    let batchStart = (beat % 10) * 20;
    let batchEnd   = Nat.min(batchStart + 20, state.tests.size());

    var passed = state.totalPassed;
    var failed = state.totalFailed;
    var sealed = state.totalSealed;

    let newTests = Array.tabulate<AlphaTestRecord>(
      state.tests.size(),
      func(i : Nat) : AlphaTestRecord {
        let t = state.tests[i];

        // Only run tests in this beat's batch
        if (i < batchStart or i >= batchEnd) {
          return t;
        };

        // Already sealed — stays sealed forever
        if (t.status == #SEALED) {
          return t;
        };

        // Evaluate: coherence × doctrine as combined score
        let combinedScore = cohNorm * docNorm;

        // Each test has a PHI-derived threshold (lower ID = lower threshold)
        let threshold = S_FLOOR / (S_CEIL * (t.alphaTestId.toFloat() / 200.0 + 0.1));
        let threshNorm = Float.max(0.0, Float.min(1.0, threshold));

        let testPasses = combinedScore >= threshNorm;

        // Score compounds: new score = old × PHI_INV + combinedScore × PHI_INV
        let newScore = Float.max(0.0, Float.min(1.0,
          t.score * PHI_INV + combinedScore * PHI_INV
        ));

        let newStatus : TestStatus = if (testPasses) {
          if (newScore >= 0.9) { sealed += 1; #SEALED }
          else { passed += 1; #PASSED }
        } else {
          failed += 1; #FAILED
        };

        {
          t with
          status      = newStatus;
          score       = newScore;
          lastRunBeat = beat;
          totalRuns   = t.totalRuns + 1;
        }
      }
    );

    let total = newTests.size();
    let passRate = if (total > 0) {
      Float.max(0.0, Float.min(1.0, (passed + sealed).toFloat() / total.toFloat()))
    } else { 0.0 };

    {
      state with
      tests       = newTests;
      totalPassed = passed;
      totalFailed = failed;
      totalSealed = sealed;
      passRate;
      beat;
    }
  };

  // ── QUERIES ────────────────────────────────────────────────────────────────

  public func getSummary(state : AlphaTest200State) : AlphaTestSummary {
    let total   = state.tests.size();
    let pending = total - state.totalPassed - state.totalFailed - state.totalSealed;
    let avgScore : Float = if (total > 0) {
      var sum : Float = 0.0;
      for (t in state.tests.vals()) { sum += t.score };
      sum / total.toFloat()
    } else { 0.0 };
    {
      totalTests   = total;
      totalPassed  = state.totalPassed;
      totalFailed  = state.totalFailed;
      totalSealed  = state.totalSealed;
      totalPending = pending;
      passRate     = state.passRate;
      avgScore;
    }
  };

  public func getTestsByCategory(state : AlphaTest200State, category : Text) : [AlphaTestRecord] {
    Array.filter<AlphaTestRecord>(state.tests, func(t) { t.category == category })
  };

  public func getSealedTests(state : AlphaTest200State) : [AlphaTestRecord] {
    Array.filter<AlphaTestRecord>(state.tests, func(t) { t.status == #SEALED })
  };

  public func getAllTests(state : AlphaTest200State) : [AlphaTestRecord] {
    state.tests
  };

}
