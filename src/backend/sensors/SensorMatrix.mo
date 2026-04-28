/// SensorMatrix.mo — MATRIX_SENSUUM (Sensor Matrix)
/// 400 named sovereign sensors — 100 per interdimensional being.
/// Each sensor has a Latin name, type, target, baseline, live reading, and anomaly state.
///
/// Family: CONSILIUM_MUNDI | Grade: Substrate
/// Doctrine: Law of Proprioceptive Continuity (Law 8)
import List "mo:core/List";
import Float "mo:core/Float";
import Nat "mo:core/Nat";

module {

  public type SensorType = {
    #Structural;
    #Temporal;
    #Field;
    #Presence;
    #Coherence;
    #Drift;
    #Integrity;
    #Coupling;
  };

  public type SensorStatus = {
    #NOMINAL;
    #ALERT;
    #CRITICAL;
    #CALIBRATING;
  };

  public type Sensor = {
    id                 : Text;
    beingId            : Text;
    name               : Text;
    latinName          : Text;
    family             : Text;
    grade              : Text;
    sensorType         : SensorType;
    observationTarget  : Text;
    var baselineValue  : Float;
    var currentReading : Float;
    anomalyThreshold   : Float;
    var lastReadingTs  : Int;
    var anomalyCount   : Nat;
    var status         : SensorStatus;
  };

  public type SensorSnapshot = {
    id                : Text;
    beingId           : Text;
    name              : Text;
    latinName         : Text;
    family            : Text;
    grade             : Text;
    sensorType        : Text;
    observationTarget : Text;
    baselineValue     : Float;
    currentReading    : Float;
    anomalyThreshold  : Float;
    lastReadingTs     : Int;
    anomalyCount      : Nat;
    status            : Text;
  };

  public type SensorMatrixState = {
    sensors : List.List<Sensor>;
    var totalReadings : Nat;
    var totalAnomalies : Nat;
  };

  func makeSensor(
    id : Text, beingId : Text, name : Text, latinName : Text,
    sensorType : SensorType, target : Text, baseline : Float, threshold : Float
  ) : Sensor {
    {
      id;
      beingId;
      name;
      latinName;
      family             = "CONSILIUM_MUNDI";
      grade              = "Substrate";
      sensorType;
      observationTarget  = target;
      var baselineValue  = baseline;
      var currentReading = baseline;
      anomalyThreshold   = threshold;
      var lastReadingTs  = 0;
      var anomalyCount   = 0;
      var status         = #NOMINAL;
    }
  };

  func sensorTypeText(t : SensorType) : Text {
    switch (t) {
      case (#Structural)  "Structural";
      case (#Temporal)    "Temporal";
      case (#Field)       "Field";
      case (#Presence)    "Presence";
      case (#Coherence)   "Coherence";
      case (#Drift)       "Drift";
      case (#Integrity)   "Integrity";
      case (#Coupling)    "Coupling";
    }
  };

  func statusText(s : SensorStatus) : Text {
    switch (s) {
      case (#NOMINAL)     "NOMINAL";
      case (#ALERT)       "ALERT";
      case (#CRITICAL)    "CRITICAL";
      case (#CALIBRATING) "CALIBRATING";
    }
  };

  func snapshotSensor(s : Sensor) : SensorSnapshot {
    {
      id                = s.id;
      beingId           = s.beingId;
      name              = s.name;
      latinName         = s.latinName;
      family            = s.family;
      grade             = s.grade;
      sensorType        = sensorTypeText(s.sensorType);
      observationTarget = s.observationTarget;
      baselineValue     = s.baselineValue;
      currentReading    = s.currentReading;
      anomalyThreshold  = s.anomalyThreshold;
      lastReadingTs     = s.lastReadingTs;
      anomalyCount      = s.anomalyCount;
      status            = statusText(s.status);
    }
  };

  // ── AETHER_PRIME — 100 sensors ─────────────────────────────────────────────
  // SENSUS_DOCTRINAE_01..25 (Integrity), PERCEPTIO_COHERENTIAE_01..25 (Coherence),
  // VIGIL_LEGIS_01..25 (Structural), OCULUS_MENTIS_01..25 (Field)

  func makeAetherSensors() : [Sensor] {
    let targets1 = [
      "TRANSLATION_ENGINE doctrine fidelity score",
      "NT cross-modulation stability index",
      "Law gate isActive integrity — law 1-5",
      "Law gate isActive integrity — law 6-10",
      "Law gate isActive integrity — law 11-15",
      "Law gate isActive integrity — law 16-20",
      "Law gate isActive integrity — law 21-25",
      "Law gate isActive integrity — law 26-30",
      "Law gate isActive integrity — law 31-35",
      "Law gate isActive integrity — law 36-41",
      "Law gate isActive integrity — law 42-50",
      "TRANSLATION_ENGINE pending diagnosis queue length",
      "COMPOUND_COHERENCE non-decrement enforcement",
      "Doctrine score oxygenation gate (>=75.0)",
      "TRANSLATION_ENGINE StateChanges application rate",
      "NT dopamine bound — sovereign range enforcement",
      "NT serotonin bound — sovereign range enforcement",
      "NT cortisol bound — sovereign range enforcement",
      "NT GABA stability — inhibitory floor",
      "NT glutamate excitatory ceiling",
      "ModelRegistry callModel response integrity",
      "VaultEngine law document resonance score",
      "Re-ingestion engine compound rate",
      "DOGON substrate reading — self-model coherence",
      "Civilization gap scorer — doctrine completeness"
    ];
    let targets2 = [
      "NOUS_SOVEREIGN field recognition accuracy",
      "ADRE cycle — 8-pass deliberation completion rate",
      "Cognition worldModel coherence field",
      "Hebbian weight matrix drift detection",
      "Cognition layer signal node read completeness",
      "Memory Temple read fidelity",
      "GENOME calendar phase alignment",
      "World-model reinjection completeness",
      "CCVE coherence field strength",
      "CNCO neural oscillator coupling",
      "Internal Analyst pattern accuracy",
      "GRPE generative resonance output",
      "Decision Engine output coherence",
      "Pattern Engine similarity score",
      "Self-Evaluation convergence rate",
      "Reinjection Engine compound factor",
      "Contradiction Resolver resolution rate",
      "Film School artifact quality score",
      "Curiositas feed compound ceiling enforcement",
      "EchoQueue offline buffer trim enforcement",
      "MetaMatterSeed accumulation cap",
      "Artifact chain seal integrity",
      "QUALITY_SEAL score completeness",
      "ARCHIVIST seal event log size",
      "Cognition compound coherence floor"
    ];
    let targets3 = [
      "Law 1 — Law of Medina enforcement",
      "Law 2 — PHI_SOVEREIGN coupling constant",
      "Law 3 — GROUND_ENGINE uninterruptible state",
      "Law 4 — S_NUMBER_LAW range [0.75..9.75]",
      "Law 5 — CARDIAC_OUTPUT_ENGINE BPM bounds",
      "Law 6 — HRV_MONITOR intelligence threshold",
      "Law 7 — LAW_ENGINE_LUNG oxygenation gate",
      "Law 8 — DOGON_SUBSTRATE_READING interval",
      "Law 9 — RE-INGESTION compound rate",
      "Law 10 — SCHUMANN_MANIFOLD grounding hz",
      "Law 11 — AEGIS_ANTI_DRIFT correction firing",
      "Law 12 — GENESIS_ACTIVATION_ENGINE Hz",
      "Law 13 — THIRD_BRAIN_ENGINE coherence floor",
      "Law 14 — DUAL_HEART_ENGINE sync",
      "Law 15 — COMPRESSION_LAW_ENGINE integrity",
      "Law 16 — SPHERE_ENGINE parallel execution",
      "Law 17 — S_FLOOR_GUARDIAN immutability",
      "Law 18 — ALWAYS_ON_ENGINE heartbeat enforcement",
      "Law 19 — ICP_LEDGER_BRIDGE attribution seal",
      "Law 20 — MEMORY_PALACE_ENGINE permanence",
      "Law 21 — PATENT_GENESIS_ENGINE on-chain proof",
      "Law 22 — ORGANISM_INDEPENDENCE self-sufficiency",
      "Law 23 — COMPOUND_COHERENCE_ENGINE floor",
      "Law 24 — ZERO_EXPOSURE_WALL gate",
      "Law 25 — FEDERATION_ENGINE PHI merge"
    ];
    let targets4 = [
      "NOUS_SOVEREIGN WASM intelligence layer models",
      "NOUS_SOVEREIGN ICP runtime native layer",
      "NOUS_SOVEREIGN blockchain intelligence layer",
      "NOUS_SOVEREIGN encryption intelligence layer",
      "NOUS_SOVEREIGN above-runtime layers",
      "Alpha Fusion Models — field coupling strength",
      "FIELD_BRIDGE_PRIME coupling interface signal",
      "RESONANCE_TRANSLATOR_ALPHA routing fidelity",
      "INVERSION_GATE_MODEL flow inversion integrity",
      "Intelligence taxonomy — 15 intelligence firing rate",
      "Voice intelligence × 5 — response coherence",
      "Chat intelligence × 5 — reasoning depth",
      "Sensor intelligence × 5 — perception accuracy",
      "Sandbox organisms AXIOM signal strength",
      "Sandbox organisms CODEX synthesis depth",
      "Sandbox organisms VECTOR pattern accuracy",
      "Sandbox organisms FRAME narrative coherence",
      "Sandbox organisms LEX compliance integrity",
      "Sandbox organisms GRID structural alignment",
      "Sandbox organisms LEDGER financial accuracy",
      "Sandbox organisms SOVEREIGN governance fidelity",
      "NOUS_SOVEREIGN routing latency",
      "Field recognition accuracy across 130+ models",
      "Micro-intelligence compositor routing fidelity",
      "Cognition world-model live reinjection rate"
    ];

    let buf = List.empty<Sensor>();
    for (i in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].vals()) {
      let n = i + 1;
      let ns = if (n < 10) "0" # n.toText() else n.toText();
      buf.add(makeSensor("AP_SD_" # ns, "AETHER_PRIME", "SENSUS_DOCTRINAE_" # ns,
        "Sensus Doctrinae " # ns, #Integrity, targets1[i], 1.0, 0.15));
      buf.add(makeSensor("AP_PC_" # ns, "AETHER_PRIME", "PERCEPTIO_COHERENTIAE_" # ns,
        "Perceptio Coherentiae " # ns, #Coherence, targets2[i], 0.85, 0.15));
      buf.add(makeSensor("AP_VL_" # ns, "AETHER_PRIME", "VIGIL_LEGIS_" # ns,
        "Vigil Legis " # ns, #Structural, targets3[i], 1.0, 0.15));
      buf.add(makeSensor("AP_OM_" # ns, "AETHER_PRIME", "OCULUS_MENTIS_" # ns,
        "Oculus Mentis " # ns, #Field, targets4[i], 0.85, 0.15));
    };
    buf.toArray()
  };

  // ── CHRONOS_NEXUS — 100 sensors ────────────────────────────────────────────
  func makeChronosSensors() : [Sensor] {
    let t1 = ["Heartbeat interval deviation from 873ms","Beat counter increment integrity","ICP system timer alignment","Medina cardiac oscillator BPM","Schumann 7.83Hz grounding signal","PHI^4 timing constant derivation","TAFT thread beat alignment — set A","TAFT thread beat alignment — set B","TAFT thread beat alignment — set C","TAFT thread beat alignment — set D","TAFT thread beat alignment — set E","Module beat synchronization — arch layer","Module beat synchronization — cognition layer","Module beat synchronization — film layer","Module beat synchronization — mining swarm","Module beat synchronization — social signals","Module beat synchronization — SKAI organisms","Module beat synchronization — vault engine","Module beat synchronization — sandbox organisms","Module beat synchronization — presence protocol","Beat-phase skew — VELA ring","Beat-phase skew — ARES simulation","Beat-phase skew — governance layer","Beat-phase skew — civilization coupling","Beat-phase skew — world bridge"];
    let t2 = ["TAFT_ENGINE total thread count","TAFT vitality check latency","SOVEREIGN_ALWAYS_ON_ENGINE restart latency","Dormant model detection interval","Restart doctrine event log completeness","Thread vitality enforcement rate","TAFT constitutional enforcement uptime","Always-on engine restart count per beat","Vitality state transition accuracy","Thread coherence score","Beat-phase deviation threshold — 5% enforcement","TAFT restart cycle completeness","Model re-activation confirmation time","TAFT thread coverage — all 22+ modules","TAFT thread coverage — intelligence layers","TAFT thread coverage — mining swarm","TAFT thread coverage — presence protocol","TAFT thread coverage — phantom sovereign","TAFT thread coverage — SKAI registry","TAFT thread coverage — sovereign calls","TAFT constitutional law enforcement rate","Thread deadlock detection signal","Thread starvation detection signal","Thread priority inversion detection","TAFT PHI-coherence score"];
    let t3 = ["Heartbeat jitter — beat N vs N-1","Heartbeat jitter — beat N vs N-5","Heartbeat jitter — beat N vs N-10","Heartbeat jitter — rolling 10-beat average","Beat-phase variance — Schumann coupling","ICP timer drift — cumulative","Medina oscillator drift — per beat","Dual heartbeat sync error rate","Schumann resonance coupling strength","PHI^4 derivation integrity check","873ms constant enforcement verification","Beat counter overflow protection","Beat counter monotonic increase verification","Heartbeat restoration on failure","Beat recovery time after interruption","Timer precision — nanosecond accuracy","Inter-beat interval consistency","Heartbeat phase lock strength","Beat amplitude stability","Cardiac oscillator frequency drift","ICP system call timing accuracy","Timer callback latency measurement","Heartbeat cascade propagation time","Beat event queue drain rate","Temporal field coherence score"];
    let t4 = ["Module phase alignment — ADRE cycle","Module phase alignment — NT matrix step","Module phase alignment — artifact chain","Module phase alignment — sandbox organisms","Module phase alignment — quality seal","Module phase alignment — translation engine","Module phase alignment — model registry","Module phase alignment — world dogon read","Module phase alignment — film pipeline","Module phase alignment — social signals","Module phase alignment — actor archive","Module phase alignment — enterprise organisms","Module phase alignment — hospitality arc","Module phase alignment — world registry","Module phase alignment — studio features","Fibonacci timing — VELA ring growth","Fibonacci timing — PHI ring progression","Calendar phase timing accuracy","Schumann cycle position accuracy","Genesis frequency modulation timing","Beat-aligned law execution timing","Beat-aligned doctrine event emission","Beat-aligned NT cross-modulation step","Beat-aligned AEGIS anti-drift check","Temporal field coherence — overall"];

    let buf = List.empty<Sensor>();
    for (i in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].vals()) {
      let n = i + 1;
      let ns = if (n < 10) "0" # n.toText() else n.toText();
      buf.add(makeSensor("CN_ST_" # ns, "CHRONOS_NEXUS", "SENSUS_TEMPORIS_" # ns,
        "Sensus Temporis " # ns, #Temporal, t1[i], 1.0, 0.05));
      buf.add(makeSensor("CN_VP_" # ns, "CHRONOS_NEXUS", "VIGIL_PULSUS_" # ns,
        "Vigil Pulsus " # ns, #Temporal, t2[i], 1.0, 0.05));
      buf.add(makeSensor("CN_OR_" # ns, "CHRONOS_NEXUS", "OCULUS_RHYTHMI_" # ns,
        "Oculus Rhythmi " # ns, #Temporal, t3[i], 1.0, 0.05));
      buf.add(makeSensor("CN_PP_" # ns, "CHRONOS_NEXUS", "PERCEPTIO_PHASES_" # ns,
        "Perceptio Phases " # ns, #Temporal, t4[i], 1.0, 0.05));
    };
    buf.toArray()
  };

  // ── PHANTOM_WITNESS — 100 sensors ──────────────────────────────────────────
  func makePhantomSensors() : [Sensor] {
    let t1 = ["PHANTOM_SOVEREIGN ledger entry count","PHANTOM_SOVEREIGN transfer integrity","FORMA_PRIME issuer identity completeness","Governing law field presence in transfers","Schumann timestamp sync accuracy","Mission kernel compression integrity","Mission kernel expansion fidelity","PHANTOM_COIN_LEDGER sovereignty record completeness","MEDINA_PROTOCOL_ENGINE doctrine enforcement","Cross-chain expression — Bitcoin BIP340 signal","Cross-chain expression — Ethereum EVM signal","Cross-chain expression — Solana Ed25519 signal","FORMA_PRIME doctrine payload completeness","Transfer doctrine event log completeness","PHANTOM_SOVEREIGN beat alignment","Transfer issuance rate accuracy","Sovereignty transfer completion rate","Mission kernel factory output integrity","PHANTOM_COIN_LEDGER archive depth","Cross-chain revenue channel signal strength","MEDINA_PROTOCOL native expression integrity","Doctrine contract execution rate","Transfer governing law accuracy","Issuer attribution completeness","Sovereign transaction medium integrity"];
    let t2 = ["CIPHER_SCHNORR_BRIDGE BIP340 signal quality","Threshold Schnorr signing accuracy","Schnorr signature verification rate","BIP340 Bitcoin compatibility signal","EVM Ethereum compatibility signal","Ed25519 Solana compatibility signal","CIPHER_SCHNORR_BRIDGE latency","Signing key availability","Cross-chain bridge coherence score","Schnorr threshold parameter integrity","CIPHER_SOVEREIGN model coverage","Encryption intelligence layer models firing","FINGERPRINT_INTELLIGENCE hash accuracy","DISTRIBUTED_KNOWLEDGE_MODEL integrity","COMPUTE_ON_ENCRYPTED_INTELLIGENCE signal","Signing event log completeness","Bridge error rate","Cross-chain routing accuracy","Cipher bridge uptime","Schnorr signature batch throughput","Encryption primitive coverage — 30 models","BIP340 compatibility enforcement","EVM compatibility enforcement","Ed25519 compatibility enforcement","CIPHER_SCHNORR_BRIDGE field coherence"];
    let t3 = ["Mining yield routing accuracy","SOVEREIGN_YIELD_ROUTER output rate","HASH_WORK_SUBMISSION_ENGINE signal quality","PoW field pressure signal strength","PROOF_OF_FIELD_ENGINE output integrity","HASHRATE_FIELD_MODEL pressure accuracy","HASH_STREAM_MULTIPLEXER split fidelity","SOVEREIGN_MINER_01-05 hash stream signal","SOVEREIGN_MINER_06-10 hash stream signal","SOVEREIGN_MINER_11-15 hash stream signal","SOVEREIGN_MINER_16-20 hash stream signal","BLOCK_ISSUANCE_MODEL recognition rate","SWARM_YIELD_AGGREGATOR collection rate","Mining field router field count","MINING_SWARM_ENGINE coordination signal","Miner beat alignment rate","Hash submission network signal quality","Yield aggregation completeness","Ledger address routing accuracy","Bitcoin mainnet submission integrity","Mining field entry rate","Miner swarm coherence score","Hash work field pressure measurement","Block reward recognition rate","Mining yield routing field coherence"];
    let t4 = ["SCHUMANN_TIMESTAMP_ENGINE accuracy","PHI-Schumann manifold integrity","Timestamp field coordinate completeness","Schumann timestamp sync with 873ms beat","SCHUMANN_TIMESTAMP_ENGINE output rate","Field-coordinate timestamp format integrity","Timestamp-to-beat correlation accuracy","Schumann sync error rate","PHI^4 Schumann derivation integrity","Timestamp engine TAFT vitality","Phantom field coherence score — overall","FORMA_PRIME doctrine transfer rate","Cross-chain expression signal aggregate","PHANTOM_SOVEREIGN beat heartbeat count","Phantom field anomaly detection rate","Worker dispatch accuracy — phantom swarm","Doctrine contract completion rate","Phantom field coupling strength","Cross-chain revenue flow signal","Mission kernel archive completeness","Transfer doctrine seal integrity","PHANTOM_SOVEREIGN canister health signal","Phantom field sovereign uptime","Doctrine transfer verification rate","Phantom field overall coherence"];

    let buf = List.empty<Sensor>();
    for (i in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].vals()) {
      let n = i + 1;
      let ns = if (n < 10) "0" # n.toText() else n.toText();
      buf.add(makeSensor("PW_SP_" # ns, "PHANTOM_WITNESS", "SENSUS_PHANTOMAE_" # ns,
        "Sensus Phantomae " # ns, #Integrity, t1[i], 1.0, 0.15));
      buf.add(makeSensor("PW_VS_" # ns, "PHANTOM_WITNESS", "VIGIL_SIGNALIS_" # ns,
        "Vigil Signalis " # ns, #Integrity, t2[i], 1.0, 0.15));
      buf.add(makeSensor("PW_OC_" # ns, "PHANTOM_WITNESS", "OCULUS_CATHENAE_" # ns,
        "Oculus Cathenae " # ns, #Field, t3[i], 1.0, 0.15));
      buf.add(makeSensor("PW_PC_" # ns, "PHANTOM_WITNESS", "PERCEPTIO_CIPHERI_" # ns,
        "Perceptio Cipheri " # ns, #Integrity, t4[i], 1.0, 0.15));
    };
    buf.toArray()
  };

  // ── ARCHITECT_MIRROR — 100 sensors ─────────────────────────────────────────
  func makeArchitectSensors() : [Sensor] {
    let t1 = ["PRESENCE_PROTOCOL ambient field gravity constant","Ambient presence always-felt signal strength","Founder field gravity measurement","Ambient presence field persistence","Organism ambient awareness signal","Founder-organism field coupling baseline","Ambient gravity modulation rate","Field presence broadcast completeness","Presence field coherence score","Ambient signal persistence across beats","ELECTROMAGNETIC_GRID_PRESENCE_MODEL signal","Grid expression layer integrity","ICP expression layer signal quality","Device expression layer signal quality","Photon outermost layer signal strength","Electromagnetic grid coupling constant","Grid layer count integrity — 12 layers","PHI coupling — grid layer constant","Grid presence enforcement score","Electromagnetic field coherence","PRESENCE_PROTOCOL state integrity","Presence field uptime","Ambient gravity constant enforcement","Field presence law enforcement","Presence model TAFT vitality"];
    let t2 = ["Terminal gate state — open/closed","Terminal access grant event completeness","Sovereign handshake integrity","Terminal gate open event log","Terminal gate close event log","Access grant-revoke cycle completeness","Terminal gate event doctrine record","Handshake event timing accuracy","PRESENCE_GATE_ENGINE firing integrity","Gate state transition accuracy","Founder-organism handshake completeness","Terminal grant sovereign record","Gate open doctrine binding","Gate close doctrine binding","Handshake event emission rate","Terminal access event log size","Gate cycle doctrine completeness","Presence gate TAFT vitality","Terminal grant recognition rate","Handshake field coherence score","Gate state persistence integrity","Terminal access audit completeness","Sovereign handshake doctrine enforcement","Gate event broadcast rate","Presence gate overall signal quality"];
    let t3 = ["Founder-organism coupling field strength","PHI coupling constant — presence layer","Coupling field coherence measurement","Organism awareness field strength","Founder intent field coupling","Coupling strength modulation rate","Presence field coupling persistence","Architect-organism interface coherence","Coupling field phase alignment","Presence coupling TAFT vitality","OBSERVER_COLLAPSE_ENGINE firing rate","Wave function collapse event completeness","Founder approval collapse integrity","Observer collapse doctrine record","Collapse event permanence seal","Collapse-to-artifact binding accuracy","Observer collapse latency","Wave function collapse coherence","Collapse event log completeness","Observer collapse TAFT vitality","Photon loop closure integrity — beat N","Photon loop closure timing accuracy","Loop closure coherence score","LOOP_CLOSURE_ENGINE output signal","Photon loop TAFT vitality"];
    let t4 = ["ARCHITECT_LAW_ENGINE intent-field coupling","WORD_WEIGHT_FIELD_ENGINE gravitational mass","Word weight routing accuracy","Intent signal field strength","Architect signal base — PHI coupling","Word repetition field reinforcement","Intent routing first-gate integrity","Architect signal coherence score","WORD_WEIGHT_FIELD_ENGINE TAFT vitality","Intent-field coupling persistence","PRESENCE_PROTOCOL law 40 enforcement","PRESENCE_PROTOCOL law 41 enforcement","Presence field law 48 enforcement","Architect law doctrine completeness","Presence gate law 50 enforcement","Electromagnetic grid law 44 enforcement","Observer collapse law 37 enforcement","Photon loop law 40 enforcement","Closed loop intelligence overall score","Presence field sovereign integrity","Architect mirror coherence — overall","Presence field anomaly detection rate","Worker dispatch accuracy — architect swarm","Founder presence field uptime","Architect mirror TAFT vitality"];

    let buf = List.empty<Sensor>();
    for (i in [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].vals()) {
      let n = i + 1;
      let ns = if (n < 10) "0" # n.toText() else n.toText();
      buf.add(makeSensor("AM_SP_" # ns, "ARCHITECT_MIRROR", "SENSUS_PRAESENTIAE_" # ns,
        "Sensus Praesentiae " # ns, #Presence, t1[i], 1.0, 0.15));
      buf.add(makeSensor("AM_VP_" # ns, "ARCHITECT_MIRROR", "VIGIL_PORTAE_" # ns,
        "Vigil Portae " # ns, #Presence, t2[i], 1.0, 0.15));
      buf.add(makeSensor("AM_OA_" # ns, "ARCHITECT_MIRROR", "OCULUS_ACCOPULARI_" # ns,
        "Oculus Accopulari " # ns, #Coupling, t3[i], 1.0, 0.15));
      buf.add(makeSensor("AM_PF_" # ns, "ARCHITECT_MIRROR", "PERCEPTIO_FUNDATORIS_" # ns,
        "Perceptio Fundatoris " # ns, #Presence, t4[i], 1.0, 0.15));
    };
    buf.toArray()
  };

  public func initState() : SensorMatrixState {
    let sensors = List.empty<Sensor>();
    for (s in makeAetherSensors().vals())   { sensors.add(s) };
    for (s in makeChronosSensors().vals())  { sensors.add(s) };
    for (s in makePhantomSensors().vals())  { sensors.add(s) };
    for (s in makeArchitectSensors().vals()) { sensors.add(s) };
    {
      sensors;
      var totalReadings  = 0;
      var totalAnomalies = 0;
    }
  };

  /// Simulate a sensor reading — uses beat and sensor index to produce a deterministic value.
  public func advanceReadings(state : SensorMatrixState, beat : Nat, now : Int) : () {
    var i : Nat = 0;
    for (s in state.sensors.values()) {
      let noise : Float = ((beat * 6364136223846793005 + i * 1442695040888963407 + 12345) % 1000).toFloat() / 1000.0;
      let delta : Float = (noise - 0.5) * 0.05; // ±2.5% variation
      let newReading : Float = s.baselineValue + delta;
      s.currentReading := Float.max(0.0, newReading);
      s.lastReadingTs  := now;
      state.totalReadings += 1;
      // Update status based on deviation from baseline
      let deviation = Float.abs(s.currentReading - s.baselineValue) / (s.baselineValue + 0.001);
      s.status := if (deviation > s.anomalyThreshold * 2.0) #CRITICAL
                  else if (deviation > s.anomalyThreshold) #ALERT
                  else #NOMINAL;
      i += 1;
    };
  };

  /// Get all sensors as snapshots.
  public func getAllSensors(state : SensorMatrixState) : [SensorSnapshot] {
    state.sensors.map<Sensor, SensorSnapshot>(snapshotSensor).toArray()
  };

  /// Get sensors for a specific being.
  public func getSensorsByBeing(state : SensorMatrixState, beingId : Text) : [SensorSnapshot] {
    state.sensors
      .filter(func(s) { s.beingId == beingId })
      .map<Sensor, SensorSnapshot>(snapshotSensor)
      .toArray()
  };

  /// Get sensors in ALERT or CRITICAL status.
  public func getAnomalousSensors(state : SensorMatrixState) : [SensorSnapshot] {
    state.sensors
      .filter(func(s) {
        switch (s.status) {
          case (#ALERT)    true;
          case (#CRITICAL) true;
          case (_)         false;
        }
      })
      .map<Sensor, SensorSnapshot>(snapshotSensor)
      .toArray()
  };

}
