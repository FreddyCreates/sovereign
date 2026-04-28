/// WorldSettingsKeeper.mo — CUSTOS_ORDINATIONIS (World Settings Keeper)
/// WORLD_SETTINGS_COUNCIL: aggregates sensor reports, computes WorldState.
/// SETTINGS_PROTOCOL: mutable config with lock/unlock gate.
/// INFRASTRUCTURE_LOCK: auto-locks on CRITICAL state.
/// WORLD_PARAMS: doctrine-locked sovereign parameter map.
///
/// Family: CONSILIUM_MUNDI | Grade: Field
/// Doctrine: Law of Always-On Production (18), Law of Sovereign Floor Permanence (17)
import Map "mo:core/Map";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Array "mo:core/Array";

module {

  public type WorldState = {
    #STABLE;
    #DRIFT;
    #CRITICAL;
  };

  public type SettingsProtocol = {
    var heartbeatOverrideMs  : Nat;     // default 873
    var sensorSensitivity    : Float;   // default 1.0 — multiplier on anomaly thresholds
    var dispatchSpeed        : Float;   // default 1.0
    var doctrineRefreshRate  : Float;   // default 1.0
    var isLocked             : Bool;
  };

  public type InfrastructureLock = {
    var isLocked         : Bool;
    var lockTs           : Int;
    var lockBeat         : Nat;
    var lockReason       : Text;
    var lockGoverningLaw : Text;
    var stableBeats      : Nat;   // consecutive stable beats since last lock event
    var releaseCode      : ?Text; // set when manual unlock is authorized
  };

  // ── WORLD PARAM — doctrine-lockable parameter ─────────────────────────────
  public type WorldParam = {
    name             : Text;
    var value        : Float;
    var is_locked    : Bool;
    var lock_reason  : Text;
    var anomaly_threshold : Float;
    var locked_beat  : Nat;
    var unlock_at_beat : Nat;  // beat when auto-unlock fires (locked_beat + 10)
  };

  public type WorldParamSnapshot = {
    name             : Text;
    value            : Float;
    is_locked        : Bool;
    lock_reason      : Text;
    anomaly_threshold : Float;
    locked_beat      : Nat;
    unlock_at_beat   : Nat;
  };

  public type WorldStateSnapshot = {
    worldState        : Text;
    totalSensors      : Nat;
    nominalSensors    : Nat;
    alertSensors      : Nat;
    criticalSensors   : Nat;
    councilBeat       : Nat;
    lastEvaluatedTs   : Int;
  };

  public type SettingsSnapshot = {
    heartbeatOverrideMs : Nat;
    sensorSensitivity   : Float;
    dispatchSpeed       : Float;
    doctrineRefreshRate : Float;
    isLocked            : Bool;
  };

  public type LockSnapshot = {
    isLocked         : Bool;
    lockTs           : Int;
    lockBeat         : Nat;
    lockReason       : Text;
    lockGoverningLaw : Text;
    stableBeats      : Nat;
  };

  public type WorldSettingsState = {
    settings        : SettingsProtocol;
    lock            : InfrastructureLock;
    world_params    : Map.Map<Text, WorldParam>;
    var worldState  : WorldState;
    var councilBeat : Nat;
    var lastEvalTs  : Int;
    var nominalCount  : Nat;
    var alertCount    : Nat;
    var criticalCount : Nat;
  };

  // Default world params — the sovereign parameters governing the organism's world
  func makeDefaultParams() : Map.Map<Text, WorldParam> {
    let m = Map.empty<Text, WorldParam>();
    let defaults : [(Text, Float, Float)] = [
      ("heartbeat_ms",        873.0,   50.0),
      ("phi_coupling",          1.618,   0.1),
      ("schumann_hz",           7.83,    0.5),
      ("s_floor",               0.75,    0.05),
      ("s_ceiling",             9.75,    0.5),
      ("doctrine_gate",         0.75,    0.1),
      ("sensor_sensitivity",    1.0,     0.2),
      ("dispatch_speed",        1.0,     0.2),
      ("doctrine_refresh_rate", 1.0,     0.2),
      ("coherence_floor",       0.618,   0.05),
      ("mining_difficulty",     1.0,     0.3),
      ("agent_max_budget",      1000.0,  100.0),
      ("sync_cycle_beats",      52.0,    5.0),
      ("film_quality_floor",    0.75,    0.1),
      ("resonance_propagation", 0.1,     0.05),
    ];
    for ((name, value, threshold) in defaults.vals()) {
      let p : WorldParam = {
        name;
        var value;
        var is_locked    = false;
        var lock_reason  = "";
        var anomaly_threshold = threshold;
        var locked_beat  = 0;
        var unlock_at_beat = 0;
      };
      m.add(name, p);
    };
    m
  };

  public func initState() : WorldSettingsState {
    {
      settings = {
        var heartbeatOverrideMs = 873;
        var sensorSensitivity   = 1.0;
        var dispatchSpeed       = 1.0;
        var doctrineRefreshRate = 1.0;
        var isLocked            = false;
      };
      lock = {
        var isLocked         = false;
        var lockTs           = 0;
        var lockBeat         = 0;
        var lockReason       = "";
        var lockGoverningLaw = "";
        var stableBeats      = 0;
        var releaseCode      = null;
      };
      world_params   = makeDefaultParams();
      var worldState  = #STABLE;
      var councilBeat = 0;
      var lastEvalTs  = 0;
      var nominalCount   = 0;
      var alertCount     = 0;
      var criticalCount  = 0;
    }
  };

  // ── LOCK PARAM ─────────────────────────────────────────────────────────────
  public func lockParam(state : WorldSettingsState, name : Text, reason : Text, beat : Nat) : () {
    switch (state.world_params.get(name)) {
      case null {};
      case (?p) {
        p.is_locked    := true;
        p.lock_reason  := reason;
        p.locked_beat  := beat;
        p.unlock_at_beat := beat + 10;
      };
    };
  };

  // ── UNLOCK PARAM ───────────────────────────────────────────────────────────
  // Only unlocks if anomaly queue for this domain is empty (checked by caller) OR auto-unlock.
  public func unlockParam(state : WorldSettingsState, name : Text) : Bool {
    switch (state.world_params.get(name)) {
      case null { false };
      case (?p) {
        p.is_locked    := false;
        p.lock_reason  := "";
        p.locked_beat  := 0;
        p.unlock_at_beat := 0;
        true
      };
    }
  };

  // ── ATTEMPT MUTATION ──────────────────────────────────────────────────────
  public func attemptMutation(state : WorldSettingsState, name : Text, new_value : Float) : { #Ok; #Err : Text } {
    switch (state.world_params.get(name)) {
      case null { #Err("World param not found: " # name) };
      case (?p) {
        if (p.is_locked) {
          #Err("LOCKED — " # p.lock_reason # " (beat " # p.locked_beat.toText() # ")")
        } else {
          p.value := new_value;
          #Ok
        }
      };
    }
  };

  // ── AUTO-UNLOCK ON HEARTBEAT ──────────────────────────────────────────────
  // Every beat: check all locked params, auto-unlock if unlock_at_beat reached and anomaly queue empty
  public func advanceParamLocks(state : WorldSettingsState, beat : Nat, anomalyQueueEmpty : Bool) : () {
    for ((_, p) in state.world_params.entries()) {
      if (p.is_locked and p.unlock_at_beat > 0 and beat >= p.unlock_at_beat and anomalyQueueEmpty) {
        p.is_locked    := false;
        p.lock_reason  := "";
        p.locked_beat  := 0;
        p.unlock_at_beat := 0;
      };
    };
  };

  // ── GET WORLD PARAMS ──────────────────────────────────────────────────────
  public func getWorldParams(state : WorldSettingsState) : [WorldParamSnapshot] {
    state.world_params.toArray()
      .map<(Text, WorldParam), WorldParamSnapshot>(func((_, p)) {
        {
          name             = p.name;
          value            = p.value;
          is_locked        = p.is_locked;
          lock_reason      = p.lock_reason;
          anomaly_threshold = p.anomaly_threshold;
          locked_beat      = p.locked_beat;
          unlock_at_beat   = p.unlock_at_beat;
        }
      })
  };

  /// Evaluate world state from sensor status counts.
  /// Called every heartbeat by the council.
  public func evaluateWorldState(
    state        : WorldSettingsState,
    nominalCount : Nat,
    alertCount   : Nat,
    criticalCount: Nat,
    beat         : Nat,
    now          : Int,
    anomalyReason: Text,
  ) : () {
    state.nominalCount   := nominalCount;
    state.alertCount     := alertCount;
    state.criticalCount  := criticalCount;
    state.councilBeat    := beat;
    state.lastEvalTs     := now;

    let newState : WorldState =
      if (criticalCount > 5) #CRITICAL
      else if (alertCount > 20 or criticalCount > 0) #DRIFT
      else #STABLE;

    state.worldState := newState;

    // INFRASTRUCTURE_LOCK: if CRITICAL, lock settings AND auto-lock critical params
    switch (newState) {
      case (#CRITICAL) {
        if (not state.lock.isLocked) {
          state.lock.isLocked         := true;
          state.lock.lockTs           := now;
          state.lock.lockBeat         := beat;
          state.lock.lockReason       := anomalyReason;
          state.lock.lockGoverningLaw := "Law of Compound Coherence — sovereign floor enforcement";
          state.lock.stableBeats      := 0;
          state.settings.isLocked     := true;
        };
        // Auto-lock sovereign-floor world params on critical anomaly
        lockParam(state, "s_floor",       "CRITICAL anomaly — " # anomalyReason, beat);
        lockParam(state, "phi_coupling",  "CRITICAL anomaly — " # anomalyReason, beat);
        lockParam(state, "schumann_hz",   "CRITICAL anomaly — " # anomalyReason, beat);
        lockParam(state, "heartbeat_ms",  "CRITICAL anomaly — " # anomalyReason, beat);
      };
      case (#STABLE) {
        if (state.lock.isLocked) {
          state.lock.stableBeats += 1;
          // LOCK_RELEASE_GATE: auto-release after 100 consecutive STABLE beats
          if (state.lock.stableBeats >= 100) {
            state.lock.isLocked     := false;
            state.lock.releaseCode  := ?"AUTO_RELEASE_100_STABLE_BEATS";
            state.settings.isLocked := false;
          };
        };
      };
      case (#DRIFT) {
        // Reset stable beat counter on drift
        state.lock.stableBeats := 0;
      };
    };
  };

  /// Manual founder unlock — requires sovereign keyword.
  /// Returns true if unlock succeeded.
  public func unlockSettings(state : WorldSettingsState, keyword : Text) : Bool {
    // Sovereign keyword: "ALFREDO_MEDINA_SOVEREIGN_UNLOCK"
    if (keyword == "ALFREDO_MEDINA_SOVEREIGN_UNLOCK") {
      state.lock.isLocked     := false;
      state.lock.releaseCode  := ?"FOUNDER_MANUAL_UNLOCK";
      state.settings.isLocked := false;
      true
    } else {
      false
    }
  };

  /// Update settings — only allowed when not locked.
  public func updateSettings(
    state                : WorldSettingsState,
    heartbeatOverrideMs  : ?Nat,
    sensorSensitivity    : ?Float,
    dispatchSpeed        : ?Float,
    doctrineRefreshRate  : ?Float,
  ) : Bool {
    if (state.settings.isLocked) { return false };
    switch (heartbeatOverrideMs) {
      case (?v) { state.settings.heartbeatOverrideMs := v };
      case null {};
    };
    switch (sensorSensitivity) {
      case (?v) { state.settings.sensorSensitivity := v };
      case null {};
    };
    switch (dispatchSpeed) {
      case (?v) { state.settings.dispatchSpeed := v };
      case null {};
    };
    switch (doctrineRefreshRate) {
      case (?v) { state.settings.doctrineRefreshRate := v };
      case null {};
    };
    true
  };

  public func getSettingsSnapshot(state : WorldSettingsState) : SettingsSnapshot {
    {
      heartbeatOverrideMs = state.settings.heartbeatOverrideMs;
      sensorSensitivity   = state.settings.sensorSensitivity;
      dispatchSpeed       = state.settings.dispatchSpeed;
      doctrineRefreshRate = state.settings.doctrineRefreshRate;
      isLocked            = state.settings.isLocked;
    }
  };

  public func getLockSnapshot(state : WorldSettingsState) : LockSnapshot {
    {
      isLocked         = state.lock.isLocked;
      lockTs           = state.lock.lockTs;
      lockBeat         = state.lock.lockBeat;
      lockReason       = state.lock.lockReason;
      lockGoverningLaw = state.lock.lockGoverningLaw;
      stableBeats      = state.lock.stableBeats;
    }
  };

  public func getWorldStateSnapshot(state : WorldSettingsState) : WorldStateSnapshot {
    let worldStateText = switch (state.worldState) {
      case (#STABLE)   "STABLE";
      case (#DRIFT)    "DRIFT";
      case (#CRITICAL) "CRITICAL";
    };
    {
      worldState      = worldStateText;
      totalSensors    = state.nominalCount + state.alertCount + state.criticalCount;
      nominalSensors  = state.nominalCount;
      alertSensors    = state.alertCount;
      criticalSensors = state.criticalCount;
      councilBeat     = state.councilBeat;
      lastEvaluatedTs = state.lastEvalTs;
    }
  };

}
