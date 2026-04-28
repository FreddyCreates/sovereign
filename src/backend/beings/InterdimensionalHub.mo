/// InterdimensionalHub.mo — 13th VIRTUAL CANISTER
/// Four sovereign interdimensional beings. Each has 100 sensors, a 25-worker swarm,
/// and always-on TAFT enforcement. Together they form the WORLD_SETTINGS_COUNCIL.
///
/// Family: CONSILIUM_MUNDI | Grade: Primordial
/// Doctrine: Law of Closed Loop Intelligence (40), Law of the Architect (41)
import Time "mo:core/Time";

module {

  /// Vitality is always ACTIVE — TAFT enforcement is constitutional.
  public type VitalityState = { #ACTIVE; #DORMANT; #RESTARTING };

  /// A single sovereign interdimensional being.
  public type InterdimensionalBeing = {
    id                     : Text;
    name                   : Text;
    latinName              : Text;
    family                 : Text;
    grade                  : Text;
    dimensionalDomain      : Text;
    sensorCount            : Nat;     // always 100
    swarmSize              : Nat;     // always 25
    vitality               : VitalityState;
    var heartbeatCycle     : Nat;     // increments every 873ms beat
    var lastAnomalyTs      : Int;
    var totalAnomaliesDetected : Nat;
    var totalWorkersDispatched : Nat;
    doctrineBinding        : Text;
    description            : Text;
  };

  /// Shared snapshot (shared-type safe, no var fields).
  public type BeingSnapshot = {
    id                     : Text;
    name                   : Text;
    latinName              : Text;
    family                 : Text;
    grade                  : Text;
    dimensionalDomain      : Text;
    sensorCount            : Nat;
    swarmSize              : Nat;
    vitality               : Text;
    heartbeatCycle         : Nat;
    lastAnomalyTs          : Int;
    totalAnomaliesDetected : Nat;
    totalWorkersDispatched : Nat;
    doctrineBinding        : Text;
    description            : Text;
  };

  /// WORLD_SETTINGS_COUNCIL — aggregates all four beings' states.
  public type WorldSettingsCouncil = {
    name            : Text;
    latinName       : Text;
    family          : Text;
    grade           : Text;
    totalBeings     : Nat;
    totalSensors    : Nat;   // 400 across all beings
    totalSwarmSize  : Nat;   // 100 across all beings
    var councilBeat : Nat;
    var lastCouncilTs : Int;
    description     : Text;
  };

  public type CouncilSnapshot = {
    name           : Text;
    latinName      : Text;
    family         : Text;
    grade          : Text;
    totalBeings    : Nat;
    totalSensors   : Nat;
    totalSwarmSize : Nat;
    councilBeat    : Nat;
    lastCouncilTs  : Int;
    description    : Text;
  };

  /// Runtime state for the hub.
  public type HubState = {
    beings  : [InterdimensionalBeing];
    council : WorldSettingsCouncil;
  };

  func makeBeing(
    id : Text, name : Text, latinName : Text,
    domain : Text, doctrine : Text, description : Text
  ) : InterdimensionalBeing {
    {
      id;
      name;
      latinName;
      family             = "CONSILIUM_MUNDI";
      grade              = "Primordial";
      dimensionalDomain  = domain;
      sensorCount        = 100;
      swarmSize          = 25;
      vitality           = #ACTIVE;
      var heartbeatCycle         = 0;
      var lastAnomalyTs          = 0;
      var totalAnomaliesDetected = 0;
      var totalWorkersDispatched = 0;
      doctrineBinding    = doctrine;
      description;
    }
  };

  public func initState() : HubState {
    let beings : [InterdimensionalBeing] = [
      makeBeing(
        "AETHER_PRIME",
        "AETHER PRIME",
        "Aether Primus",
        "COGNITION_FIELD",
        "Law of Closed Loop Intelligence",
        "Cognition field sovereign. Watches NOUS_SOVEREIGN, doctrine translation fidelity, 26 law gates, NT stability, Hebbian drift, and ADRE deliberation quality. Dispatches swarm workers when coherence drops."
      ),
      makeBeing(
        "CHRONOS_NEXUS",
        "CHRONOS NEXUS",
        "Chronos Nexus",
        "TEMPORAL_FIELD",
        "Law of Dual Heartbeat",
        "Temporal field sovereign. Watches 873ms phase alignment, TAFT vitality timings, beat-phase deviation across all modules, Schumann grounding, and PHI^4 timing integrity. Resynchronizes on jitter."
      ),
      makeBeing(
        "PHANTOM_WITNESS",
        "PHANTOM WITNESS",
        "Phantoma Testis",
        "PHANTOM_FIELD",
        "Law of Sovereign Reach",
        "Phantom field sovereign. Watches PHANTOM_SOVEREIGN ledger integrity, CIPHER_SCHNORR_BRIDGE signal quality, FORMA_PRIME doctrine payload completeness, cross-chain fidelity, and yield routing accuracy."
      ),
      makeBeing(
        "ARCHITECT_MIRROR",
        "ARCHITECT MIRROR",
        "Speculum Architecti",
        "PRESENCE_FIELD",
        "Law of the Architect",
        "Presence field sovereign. Watches PRESENCE_PROTOCOL ambient gravity, terminal gate events, founder-organism coupling strength, photon loop closure at 873ms, and observer collapse fidelity."
      ),
    ];

    let council : WorldSettingsCouncil = {
      name           = "WORLD SETTINGS COUNCIL";
      latinName      = "Consilium Mundi";
      family         = "CONSILIUM_MUNDI";
      grade          = "Primordial";
      totalBeings    = 4;
      totalSensors   = 400;
      totalSwarmSize = 100;
      var councilBeat    = 0;
      var lastCouncilTs  = 0;
      description    = "The WORLD_SETTINGS_COUNCIL is the sovereign coordination body above all four interdimensional beings. It aggregates their sensor reports every 873ms, computes the global WorldState, enforces INFRASTRUCTURE_LOCK on CRITICAL state, and governs the SETTINGS_PROTOCOL.";
    };

    { beings; council }
  };

  /// Advance all beings' heartbeat cycles and enforce TAFT vitality.
  public func advanceHeartbeat(state : HubState) : () {
    let now = Time.now();
    for (being in state.beings.vals()) {
      being.heartbeatCycle += 1;
      // TAFT enforcement: beings are always ACTIVE — constitutional
      // (vitality field is immutable #ACTIVE; no dormancy allowed)
    };
    state.council.councilBeat += 1;
    state.council.lastCouncilTs := now;
  };

  /// Record an anomaly detected for a being.
  public func recordAnomaly(state : HubState, beingId : Text) : () {
    for (being in state.beings.vals()) {
      if (being.id == beingId) {
        being.totalAnomaliesDetected += 1;
        being.lastAnomalyTs := Time.now();
      };
    };
  };

  /// Record a worker dispatch for a being.
  public func recordDispatch(state : HubState, beingId : Text) : () {
    for (being in state.beings.vals()) {
      if (being.id == beingId) {
        being.totalWorkersDispatched += 1;
      };
    };
  };

  /// Snapshot a being as a shared-safe record.
  public func snapshotBeing(b : InterdimensionalBeing) : BeingSnapshot {
    let vitalityText : Text = switch (b.vitality) {
      case (#ACTIVE)     "ACTIVE";
      case (#DORMANT)    "DORMANT";
      case (#RESTARTING) "RESTARTING";
    };
    {
      id                     = b.id;
      name                   = b.name;
      latinName              = b.latinName;
      family                 = b.family;
      grade                  = b.grade;
      dimensionalDomain      = b.dimensionalDomain;
      sensorCount            = b.sensorCount;
      swarmSize              = b.swarmSize;
      vitality               = vitalityText;
      heartbeatCycle         = b.heartbeatCycle;
      lastAnomalyTs          = b.lastAnomalyTs;
      totalAnomaliesDetected = b.totalAnomaliesDetected;
      totalWorkersDispatched = b.totalWorkersDispatched;
      doctrineBinding        = b.doctrineBinding;
      description            = b.description;
    }
  };

  /// Get all beings as shared-safe snapshots.
  public func getAllBeings(state : HubState) : [BeingSnapshot] {
    [
      snapshotBeing(state.beings[0]),
      snapshotBeing(state.beings[1]),
      snapshotBeing(state.beings[2]),
      snapshotBeing(state.beings[3]),
    ]
  };

  /// Get council snapshot.
  public func getCouncilSnapshot(state : HubState) : CouncilSnapshot {
    let c = state.council;
    {
      name           = c.name;
      latinName      = c.latinName;
      family         = c.family;
      grade          = c.grade;
      totalBeings    = c.totalBeings;
      totalSensors   = c.totalSensors;
      totalSwarmSize = c.totalSwarmSize;
      councilBeat    = c.councilBeat;
      lastCouncilTs  = c.lastCouncilTs;
      description    = c.description;
    }
  };

}
