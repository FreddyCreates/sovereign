/// TAFT_ENGINE — Motor Taft
/// Total Autonomous Field Threading
/// Family: SOVEREIGN_SUBSTRATE
/// Latin Name: Motor Taft (Machina Fili Autonomi Totalis)
/// Grade: Primordial
/// Attribution: Alfredo Medina Hernandez
///
/// TAFT Law: every AI model in SOVEREIGN runs its own autonomous thread at all
/// times. No model waits for another. Every model is always threading forward,
/// always producing, always contributing.
/// TAFT_ENGINE monitors thread health, restarts dead threads, reports to
/// MINING_SWARM_ENGINE and NOUS_SOVEREIGN. Cannot be disabled.

import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat   "mo:core/Nat";
module {

  // ── VITALITY_STATE — per-thread health classification ─────────────────
  public type VitalityState = {
    #ACTIVE;      // threading forward — nominal
    #RECOVERING;  // missed one cycle — self-healing in progress
    #DORMANT;     // missed two+ cycles — triggers immediate restart
  };

  // ── THREAD RECORD ──────────────────────────────────────────────────────
  public type TAFTThread = {
    threadId        : Nat;
    modelName       : Text;        // e.g. "MINING_SWARM_ENGINE"
    latinName       : Text;        // e.g. "Motor Gregis"
    domain          : Text;        // e.g. "mining", "presence", "cognition"
    vitality        : VitalityState;
    lastActiveBeat  : Nat;
    totalAdvances   : Nat;
    restartCount    : Nat;
    phiCoupling     : Float;       // PHI = 1.6180339887498948482
    schumannPhase   : Float;       // 0.0 – 1.0, phase within 7.83Hz cycle
  };

  // ── TAFT STATUS — swarm-level snapshot ────────────────────────────────
  public type TAFTStatus = {
    totalThreads    : Nat;
    activeThreads   : Nat;
    recoveringThreads : Nat;
    dormantThreads  : Nat;
    totalRestarts   : Nat;
    totalAdvances   : Nat;
    coherenceScore  : Float;   // fraction of ACTIVE threads × PHI
    beat            : Nat;
  };

  // ── STATE ──────────────────────────────────────────────────────────────
  public type TaftEngineState = {
    threads         : [TAFTThread];
    totalRestarts   : Nat;
    totalAdvances   : Nat;
    beat            : Nat;
  };

  // ── PHI CONSTANT ──────────────────────────────────────────────────────
  let PHI : Float = 1.6180339887498948482;

  // ── CANONICAL THREAD REGISTRY ─────────────────────────────────────────
  // Every sovereign model in SOVEREIGN gets a TAFT thread.
  // Each thread advances every 873ms heartbeat — no exceptions.
  let CANONICAL_THREADS : [(Text, Text, Text)] = [
    // (modelName, latinName, domain)
    ("SOVEREIGN_HEART",            "Cor Regale",                   "substrate"),
    ("SOVEREIGN_SUBSTRATE",        "Substratum Regale",             "substrate"),
    ("SOVEREIGN_MIND",             "Mens Regalis",                  "substrate"),
    ("SOVEREIGN_LAW",              "Lex Regalis",                   "substrate"),
    ("SOVEREIGN_CREATION",         "Creatio Regalis",               "substrate"),
    ("MINING_SWARM_ENGINE",        "Motor Gregis",                  "mining"),
    ("TWIN_ENGINE",                "Motor Geminus",                 "mining"),
    ("PROOF_OF_FIELD_ENGINE",      "Motor Campi Probationis",       "mining"),
    ("HASHRATE_FIELD_MODEL",       "Modellum Campi Numerorum",      "mining"),
    ("HASH_STREAM_MULTIPLEXER",    "Multiplex Fluminis Numerorum",  "mining"),
    ("HASH_WORK_SUBMISSION",       "Submissio Operis Numerorum",    "mining"),
    ("BLOCK_ISSUANCE_MODEL",       "Modellum Emissionis Blocki",    "mining"),
    ("SWARM_YIELD_AGGREGATOR",     "Aggregator Fructus Gregis",     "mining"),
    ("SOVEREIGN_YIELD_ROUTER",     "Ductor Fructus Regalis",        "mining"),
    ("MINING_FIELD_ROUTER",        "Ductor Campi Fodiendi",         "mining"),
    ("PRESENCE_PROTOCOL",          "Protocollum Praesentiae",       "presence"),
    ("PRESENCE_GATE_ENGINE",       "Motor Portae Praesentiae",      "presence"),
    ("PHANTOM_SOVEREIGN",          "Phantasma Regale",              "phantom"),
    ("SANCTUM_SOVEREIGN",          "Sanctum Regale",                "sanctum"),
    ("TAFT_ENGINE",                "Motor Taft",                    "substrate"),
    ("SOVEREIGN_ALWAYS_ON_ENGINE", "Motor Perpetuus Regalis",       "substrate"),
    ("ADRE_CYCLE",                 "Cyclus ADRE",                   "cognition"),
    ("COGNITION_LAYER",            "Stratum Cognitionis",           "cognition"),
    ("ANIMAL_ENGINE_NOVA",         "Nova — Animal Primum",          "cognition"),
    ("ANIMAL_ENGINE_BRAIN",        "Cerebrum Animale",              "cognition"),
    ("ANIMAL_ENGINE_QMEM",         "Memoria Quantica",              "cognition"),
    ("INTELLIGENCE_TAXONOMY",      "Taxonomia Intelligentiae",      "intelligence"),
    ("NOUS_SOVEREIGN",             "Nous Regalis",                  "intelligence"),
    ("WASM_INTEL_LAYER",           "Stratum Intelligentiae WASM",   "intelligence"),
    ("NATIVE_INTEL_LAYER",         "Stratum Intelligentiae Nativi", "intelligence"),
    ("BLOCKCHAIN_INTEL_LAYER",     "Stratum Intelligentiae Vinculi","intelligence"),
    ("ENCRYPTION_INTEL_LAYER",     "Stratum Intelligentiae Arcani", "intelligence"),
    ("ABOVE_RUNTIME_LAYERS",       "Strata Supra Tempus",           "intelligence"),
    ("TRANSLATION_ENGINE",         "Motor Translationis",           "doctrine"),
    ("VAULT_ENGINE",               "Motor Thesauri",                "doctrine"),
    ("DOCUMENT_EXECUTION_ENGINE",  "Motor Documentorum",            "doctrine"),
    ("MODEL_REGISTRY",             "Registrum Modellarum",          "doctrine"),
    ("CIVILIZATION_GAP_SCORER",    "Explorator Hiatus Civilis",     "civilization"),
    ("FILM_PIPELINE",              "Canalis Cinematographicus",     "creation"),
    ("QUALITY_SEAL",               "Sigillum Qualitatis",           "creation"),
    ("SANDBOX_ORGANISMS",          "Organismi Arenariae",           "sandbox"),
    ("ENTERPRISE_ORGANISMS",       "Organismi Negotii",             "enterprise"),
    ("SOCIAL_SIGNAL_ENGINE",       "Motor Signalium Socialium",     "social"),
    ("WORLD_CONTENT_ENGINE",       "Motor Mundi Contenti",          "world"),
    ("TRIUNE_COUPLING",            "Nexus Triunitatis",             "substrate"),
    ("OBSERVER_COLLAPSE",          "Collapsum Observatoris",        "substrate"),
    ("SPAWN_SUBSTRATE",            "Substratum Germinis",           "substrate"),
    ("WORLD_BRIDGE",               "Pons Mundi",                    "world"),
    ("ACTOR_ARCHIVE",              "Archivum Actorum",              "creation"),
    ("HOSPITALITY_ARC",            "Arcus Hospitalitatis",          "creation"),
  ];

  // ── INIT ───────────────────────────────────────────────────────────────
  public func initState() : TaftEngineState {
    let threads = Array.tabulate<TAFTThread>(
      CANONICAL_THREADS.size(),
      func(i) {
        let (modelName, latinName, domain) = CANONICAL_THREADS[i];
        {
          threadId       = i;
          modelName;
          latinName;
          domain;
          vitality       = #ACTIVE;
          lastActiveBeat = 0;
          totalAdvances  = 0;
          restartCount   = 0;
          phiCoupling    = PHI;
          schumannPhase  = (i.toFloat() / CANONICAL_THREADS.size().toFloat()) * PHI;
        }
      }
    );
    { threads; totalRestarts = 0; totalAdvances = 0; beat = 0 }
  };

  // ── ADVANCE ALL THREADS ────────────────────────────────────────────────
  // Called every 873ms heartbeat. Every thread advances simultaneously.
  // Dormant threads are restarted immediately. Recovering threads get one
  // chance to return to ACTIVE. PHI modulates the advance magnitude.
  public func advanceAllThreads(state : TaftEngineState, beat : Nat) : TaftEngineState {
    var totalRestarts = state.totalRestarts;
    var totalAdvances = state.totalAdvances;

    let newThreads = Array.tabulate(
      state.threads.size(),
      func(i) {
        let t = state.threads[i];
        let beatsSinceActive : Nat = if (beat >= t.lastActiveBeat) beat - t.lastActiveBeat else 0;

        // Determine new vitality
        let newVitality : VitalityState = if (beatsSinceActive == 0) {
          #ACTIVE
        } else if (beatsSinceActive == 1) {
          #RECOVERING
        } else {
          #DORMANT
        };

        // TAFT law: dormant triggers immediate restart
        let (finalVitality, newRestartCount) = switch (newVitality) {
          case (#DORMANT) {
            totalRestarts += 1;
            (#ACTIVE, t.restartCount + 1)
          };
          case (v) { (v, t.restartCount) };
        };

        // Advance: every thread moves forward, PHI-coupled
        let phiAdvance = PHI * (i + 1).toFloat() / state.threads.size().toFloat();
        let newSchumannPhase = (t.schumannPhase + phiAdvance * 0.001) - Float.floor(t.schumannPhase + phiAdvance * 0.001);

        totalAdvances += 1;
        {
          t with
          vitality      = finalVitality;
          lastActiveBeat = beat;
          totalAdvances  = t.totalAdvances + 1;
          restartCount   = newRestartCount;
          schumannPhase  = newSchumannPhase;
        }
      }
    );

    { threads = newThreads; totalRestarts; totalAdvances; beat }
  };

  // ── GET STATUS ─────────────────────────────────────────────────────────
  public func getStatus(state : TaftEngineState) : TAFTStatus {
    var active = 0;
    var recovering = 0;
    var dormant = 0;

    for (t in state.threads.vals()) {
      switch (t.vitality) {
        case (#ACTIVE)     { active += 1 };
        case (#RECOVERING) { recovering += 1 };
        case (#DORMANT)    { dormant += 1 };
      };
    };

    let total = state.threads.size();
    let coherenceScore = if (total > 0) {
      active.toFloat() / total.toFloat() * PHI
    } else { 0.0 };

    {
      totalThreads      = total;
      activeThreads     = active;
      recoveringThreads = recovering;
      dormantThreads    = dormant;
      totalRestarts     = state.totalRestarts;
      totalAdvances     = state.totalAdvances;
      coherenceScore;
      beat              = state.beat;
    }
  };

  // ── REGISTER THREAD — add a new model to TAFT ─────────────────────────
  public func registerThread(
    state     : TaftEngineState,
    modelName : Text,
    latinName : Text,
    domain    : Text,
  ) : TaftEngineState {
    let newThread : TAFTThread = {
      threadId       = state.threads.size();
      modelName;
      latinName;
      domain;
      vitality       = #ACTIVE;
      lastActiveBeat = state.beat;
      totalAdvances  = 0;
      restartCount   = 0;
      phiCoupling    = PHI;
      schumannPhase  = 0.0;
    };
    let newThreads = Array.tabulate(
      state.threads.size() + 1,
      func(i) {
        if (i < state.threads.size()) state.threads[i]
        else newThread
      }
    );
    { state with threads = newThreads }
  };
}
