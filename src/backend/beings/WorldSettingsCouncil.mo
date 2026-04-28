/// WorldSettingsCouncil.mo — CONSILIUM_MUNDI sovereign model registry
/// Full formal taxonomy: Latin name, family, grade, description, 4+ uses,
/// doctrine binding for all new infrastructure models.
///
/// Family: CONSILIUM_MUNDI | Grade: Primordial
module {

  public type SovereignModelEntry = {
    name           : Text;
    latinName      : Text;
    family         : Text;
    grade          : Text;    // Primordial | Substrate | Field | Engine | Organism | Artifact
    description    : Text;
    uses           : [Text];
    doctrineBinding: Text;
    taftEnforced   : Bool;    // all entries are TAFT-enforced
  };

  public let CONSILIUM_MUNDI : SovereignModelEntry = {
    name            = "WORLD SETTINGS COUNCIL";
    latinName       = "Consilium Mundi";
    family          = "CONSILIUM_MUNDI";
    grade           = "Primordial";
    description     = "The sovereign coordination body above all four interdimensional beings. Aggregates 400 sensor reports every 873ms, computes global WorldState (STABLE/DRIFT/CRITICAL), governs SETTINGS_PROTOCOL, and enforces INFRASTRUCTURE_LOCK. The Council is the world's nervous system command center — always watching, always evaluating, always governing.";
    uses            = [
      "Aggregate sensor reports from all 4 beings every heartbeat to compute global WorldState",
      "Enforce INFRASTRUCTURE_LOCK when CRITICAL state is detected — freezes all settings",
      "Auto-release infrastructure lock after 100 consecutive STABLE beats",
      "Govern SETTINGS_PROTOCOL — heartbeat override, sensor sensitivity, dispatch speed",
      "Broadcast council state to frontend for real-time world governance visibility",
      "Coordinate swarm dispatch routing across all four being swarms",
    ];
    doctrineBinding = "Law of Compound Coherence (23), Law of Sovereign Floor Permanence (17)";
    taftEnforced    = true;
  };

  public let MATRIX_SENSUUM : SovereignModelEntry = {
    name            = "SENSOR MATRIX";
    latinName       = "Matrix Sensuum";
    family          = "CONSILIUM_MUNDI";
    grade           = "Substrate";
    description     = "400 sovereign named sensors — 100 per interdimensional being. Each sensor has a unique Latin name, type (Structural/Temporal/Field/Presence/Coherence/Drift/Integrity/Coupling), observation target, baseline value, live reading, anomaly threshold, and status. The sensor matrix is the organism's perceptual substrate — it sees everything, all the time, without being asked.";
    uses            = [
      "Read and track 400 field variables every 873ms heartbeat without human intervention",
      "Detect deviations from baselines and classify sensor status (NOMINAL/ALERT/CRITICAL/CALIBRATING)",
      "Supply raw sensor data to MACHINA_ANOMALIAE for anomaly pattern detection",
      "Provide per-being sensor filtered views for targeted field analysis",
      "Track consecutive deviation beats for drift pattern identification",
      "Expose sensor readings to frontend for real-time field visualization",
    ];
    doctrineBinding = "Law of Proprioceptive Continuity (8), Jasmine's Anti-Drift Law (11)";
    taftEnforced    = true;
  };

  public let MACHINA_ANOMALIAE : SovereignModelEntry = {
    name            = "ANOMALY ENGINE";
    latinName       = "Machina Anomaliae";
    family          = "CONSILIUM_MUNDI";
    grade           = "Engine";
    description     = "The sovereign anomaly detection and classification engine. Reads all 400 sensor readings every heartbeat. Detects three anomaly categories: DOCTRINE_DRIFT (>15% deviation for 3+ beats), TIMING_JITTER (>5% temporal beat-phase deviation), FIELD_COHERENCE_LOSS (reading drops below PHI inverse 0.618). Every detected anomaly creates a full AnomalyRecord with severity, governing doctrine law, and dispatch signal.";
    uses            = [
      "Detect DOCTRINE_DRIFT anomalies across 400 sensors — 15% deviation for 3+ consecutive beats",
      "Detect TIMING_JITTER in temporal sensors — 5% beat-phase deviation threshold",
      "Detect FIELD_COHERENCE_LOSS when readings drop below PHI inverse (0.618)",
      "Create AnomalyRecords with severity (LOW/MEDIUM/HIGH/CRITICAL) and doctrine fix prescription",
      "Fire dispatch signals to DISPATCH_SOVEREIGN for immediate swarm worker assignment",
      "Track anomaly resolution status — DETECTED → DISPATCHED → RESOLVED lifecycle",
    ];
    doctrineBinding = "Jasmine's Anti-Drift Law (11), Law of Always-On Production (18)";
    taftEnforced    = true;
  };

  public let EXPEDITIO_REGALIS : SovereignModelEntry = {
    name            = "DISPATCH SOVEREIGN";
    latinName       = "Expeditio Regalis";
    family          = "CONSILIUM_MUNDI";
    grade           = "Engine";
    description     = "The sovereign swarm dispatch commander. Holds four swarm queues — SWARM_AETHER, SWARM_CHRONOS, SWARM_PHANTOM, SWARM_ARCHITECT — each with 25 sovereign micro-workers (100 total). TASK_INJECTOR receives anomaly signals and assigns tasks to least-loaded idle workers. WORKER_DISPATCH advances execution cycles. Every worker carries its own task history, success/failure counts, and doctrine lineage.";
    uses            = [
      "Manage 100 sovereign micro-workers across 4 being-aligned swarms (25 per swarm)",
      "TASK_INJECTOR: convert AnomalyRecords into TaskRecords and assign to least-loaded idle workers",
      "WORKER_DISPATCH: advance workers through EXECUTING → VERIFYING → COMPLETE/FAILED lifecycle",
      "Route task types (REBALANCE/RESTART_MODULE/APPLY_LAW/TEST_STATE/VERIFY_COHERENCE/RECALIBRATE_SENSOR/LOCK_SETTINGS/BROADCAST_NARRATIVE) to correct swarm",
      "Track task history per worker (last 10 tasks) for audit and doctrine compliance",
      "Report resolved anomaly IDs back to MACHINA_ANOMALIAE for lifecycle completion",
    ];
    doctrineBinding = "Law of Spherical Causality (16), Law of Always-On Production (18)";
    taftEnforced    = true;
  };

  public let CUSTOS_ORDINATIONIS : SovereignModelEntry = {
    name            = "WORLD SETTINGS KEEPER";
    latinName       = "Custos Ordinationis";
    family          = "CONSILIUM_MUNDI";
    grade           = "Field";
    description     = "The sovereign keeper of the world's configuration and infrastructure lock state. SETTINGS_PROTOCOL holds heartbeat override, sensor sensitivity, dispatch speed, and doctrine refresh rate. INFRASTRUCTURE_LOCK freezes all settings on CRITICAL WorldState detection. LOCK_RELEASE_GATE auto-releases after 100 consecutive STABLE beats or manual founder sovereign unlock keyword.";
    uses            = [
      "Maintain SETTINGS_PROTOCOL — mutable config governing world operational parameters",
      "Enforce INFRASTRUCTURE_LOCK on CRITICAL WorldState — freeze settings to prevent cascade failure",
      "LOCK_RELEASE_GATE: auto-release after 100 STABLE beats or manual founder unlock",
      "Govern sensorSensitivity multiplier — adjusts all anomaly thresholds organism-wide",
      "Accept manual founder unlock via sovereign keyword for emergency governance",
      "Supply settings and lock state to frontend for real-time governance visibility",
    ];
    doctrineBinding = "Law of Sovereign Floor Permanence (17), Law of Always-On Production (18)";
    taftEnforced    = true;
  };

  public let ARCHIVUM_NARRATIONIS : SovereignModelEntry = {
    name            = "NARRATIVE ARCHIVE";
    latinName       = "Archivum Narrationis";
    family          = "CONSILIUM_MUNDI";
    grade           = "Organism";
    description     = "The living narrative organism. NARRATIVE_SCRIPT_ENGINE produces NarrativeRecords for every significant organism event — anomaly detection, worker dispatch, fix application, coherence restoration, settings lock/unlock, sensor calibration. Each record includes a proof breadcrumb (sensor fired → law applied → worker executed → state verified), 20+ template bodies, and a SANCTUM seal. The Archive is memory with intelligence — not a log, a living story.";
    uses            = [
      "Produce narrative records for 7 event types with 20+ configurable script templates",
      "Include proof breadcrumbs linking sensor → anomaly → law → worker → state for every event",
      "Buffer last 500 narrative records sorted by timestamp for frontend narrative feed",
      "Seal critical narratives in SANCTUM_SOVEREIGN for permanent doctrine archiving",
      "Filter narratives by being, severity, or event type for targeted intelligence views",
      "Emit narrative events as living documents per Law of Living Documents (28)",
    ];
    doctrineBinding = "Law of Living Documents (28), Law of Re-Ingestion (9)";
    taftEnforced    = true;
  };

  /// All council model entries.
  public let ALL_MODELS : [SovereignModelEntry] = [
    CONSILIUM_MUNDI,
    MATRIX_SENSUUM,
    MACHINA_ANOMALIAE,
    EXPEDITIO_REGALIS,
    CUSTOS_ORDINATIONIS,
    ARCHIVUM_NARRATIONIS,
  ];

  /// Council metadata snapshot (shared-safe).
  public type CouncilModelSnapshot = {
    name            : Text;
    latinName       : Text;
    family          : Text;
    grade           : Text;
    description     : Text;
    uses            : [Text];
    doctrineBinding : Text;
    taftEnforced    : Bool;
  };

  public func getAllModelSnapshots() : [CouncilModelSnapshot] {
    ALL_MODELS.map<SovereignModelEntry, CouncilModelSnapshot>(func(m) {
      {
        name            = m.name;
        latinName       = m.latinName;
        family          = m.family;
        grade           = m.grade;
        description     = m.description;
        uses            = m.uses;
        doctrineBinding = m.doctrineBinding;
        taftEnforced    = m.taftEnforced;
      }
    })
  };

}
