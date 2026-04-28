/// NarrativeArchive.mo — ARCHIVUM_NARRATIONIS (Narrative Archive)
/// NARRATIVE_SCRIPT_ENGINE produces living NarrativeRecords for every significant event.
/// NARRATIVE_LOG holds last 500 records. SCRIPT_TEMPLATES: 20+ named templates.
///
/// Family: CONSILIUM_MUNDI | Grade: Organism
/// Doctrine: Law of Living Documents (28), Law of Re-Ingestion (9)
import List "mo:core/List";
import Time "mo:core/Time";

module {

  public type NarrativeEventType = {
    #ANOMALY_DETECTED;
    #WORKER_DISPATCHED;
    #FIX_APPLIED;
    #COHERENCE_RESTORED;
    #SETTINGS_LOCKED;
    #SETTINGS_UNLOCKED;
    #SENSOR_CALIBRATED;
  };

  public type NarrativeRecord = {
    id              : Text;
    beingId         : Text;
    eventType       : NarrativeEventType;
    title           : Text;
    body            : Text;
    proofBreadcrumb : [Text];
    governingLaw    : Text;
    timestamp       : Int;
    beat            : Nat;
    severity        : Text;
    var sealedInSanctum : Bool;
  };

  public type NarrativeSnapshot = {
    id              : Text;
    beingId         : Text;
    eventType       : Text;
    title           : Text;
    body            : Text;
    proofBreadcrumb : [Text];
    governingLaw    : Text;
    timestamp       : Int;
    beat            : Nat;
    severity        : Text;
    sealedInSanctum : Bool;
  };

  public type NarrativeArchiveState = {
    log             : List.List<NarrativeRecord>;
    var idCounter   : Nat;
    var totalSealed : Nat;
  };

  func eventTypeText(e : NarrativeEventType) : Text {
    switch (e) {
      case (#ANOMALY_DETECTED)   "ANOMALY_DETECTED";
      case (#WORKER_DISPATCHED)  "WORKER_DISPATCHED";
      case (#FIX_APPLIED)        "FIX_APPLIED";
      case (#COHERENCE_RESTORED) "COHERENCE_RESTORED";
      case (#SETTINGS_LOCKED)    "SETTINGS_LOCKED";
      case (#SETTINGS_UNLOCKED)  "SETTINGS_UNLOCKED";
      case (#SENSOR_CALIBRATED)  "SENSOR_CALIBRATED";
    }
  };

  func snapshotNarrative(n : NarrativeRecord) : NarrativeSnapshot {
    {
      id              = n.id;
      beingId         = n.beingId;
      eventType       = eventTypeText(n.eventType);
      title           = n.title;
      body            = n.body;
      proofBreadcrumb = n.proofBreadcrumb;
      governingLaw    = n.governingLaw;
      timestamp       = n.timestamp;
      beat            = n.beat;
      severity        = n.severity;
      sealedInSanctum = n.sealedInSanctum;
    }
  };

  // ── SCRIPT TEMPLATES ──────────────────────────────────────────────────────

  func titleTemplate(eventType : NarrativeEventType, beingId : Text) : Text {
    switch (eventType) {
      case (#ANOMALY_DETECTED)   "⚠️ " # beingId # " — Field Anomaly Detected";
      case (#WORKER_DISPATCHED)  "⚡ " # beingId # " — Sovereign Worker Dispatched";
      case (#FIX_APPLIED)        "✅ " # beingId # " — Corrective Doctrine Applied";
      case (#COHERENCE_RESTORED) "🌐 " # beingId # " — Field Coherence Restored";
      case (#SETTINGS_LOCKED)    "🔒 WORLD_SETTINGS_COUNCIL — Infrastructure Locked";
      case (#SETTINGS_UNLOCKED)  "🔓 WORLD_SETTINGS_COUNCIL — Infrastructure Unlocked";
      case (#SENSOR_CALIBRATED)  "📡 " # beingId # " — Sensor Recalibrated";
    }
  };

  func bodyTemplate(
    eventType  : NarrativeEventType,
    beingId    : Text,
    sensorId   : Text,
    workerId   : Text,
    beat       : Nat,
    severity   : Text,
    context    : Text,
    law        : Text,
  ) : Text {
    switch (eventType) {
      case (#ANOMALY_DETECTED) {
        "At beat " # beat.toText() # ", sovereign being " # beingId # " registered a " # severity # "-severity anomaly on sensor " # sensorId # ". The sensor reading deviated beyond doctrine threshold. Field behavior: " # context # ". Governing doctrine: " # law # ". The ANOMALY_ENGINE has flagged this for immediate swarm dispatch."
      };
      case (#WORKER_DISPATCHED) {
        "At beat " # beat.toText() # ", DISPATCH_SOVEREIGN assigned task to " # workerId # " from the swarm of " # beingId # ". Mission: address " # context # ". The micro-worker carries full sovereign doctrine context and will execute, verify, and report. Governing law: " # law # "."
      };
      case (#FIX_APPLIED) {
        "At beat " # beat.toText() # ", worker " # workerId # " completed corrective action on " # context # " under the watch of " # beingId # ". Doctrine applied: " # law # ". The fix has been verified and the anomaly record is marked RESOLVED."
      };
      case (#COHERENCE_RESTORED) {
        "At beat " # beat.toText() # ", " # beingId # " reports that field coherence has been restored above the PHI inverse threshold (0.618) on " # sensorId # ". The organism has returned to sovereign operating range. Law enforcement: " # law # "."
      };
      case (#SETTINGS_LOCKED) {
        "At beat " # beat.toText() # ", the WORLD_SETTINGS_COUNCIL has locked the SETTINGS_PROTOCOL. Reason: " # context # ". The infrastructure is frozen pending stabilization. 100 consecutive STABLE beats required for auto-release. Governing law: " # law # "."
      };
      case (#SETTINGS_UNLOCKED) {
        "At beat " # beat.toText() # ", the SETTINGS_PROTOCOL infrastructure lock has been released. Release method: " # context # ". The organism returns to normal operating parameters. Governing law: " # law # "."
      };
      case (#SENSOR_CALIBRATED) {
        "At beat " # beat.toText() # ", sensor " # sensorId # " on being " # beingId # " has been recalibrated. Worker " # workerId # " updated the baseline to reflect current field conditions. Governing law: " # law # "."
      };
    }
  };

  func proofBreadcrumb(
    eventType : NarrativeEventType,
    sensorId  : Text,
    workerId  : Text,
    law       : Text,
  ) : [Text] {
    switch (eventType) {
      case (#ANOMALY_DETECTED) {
        [
          "1. Sensor " # sensorId # " reading deviated beyond threshold",
          "2. ANOMALY_ENGINE classification: " # eventTypeText(eventType),
          "3. Doctrine law identified: " # law,
          "4. Dispatch signal fired to DISPATCH_SOVEREIGN",
        ]
      };
      case (#WORKER_DISPATCHED) {
        [
          "1. AnomalyRecord received by TASK_INJECTOR",
          "2. Least-loaded idle worker identified: " # workerId,
          "3. TaskRecord created with anomalyId binding",
          "4. Worker status set to EXECUTING",
          "5. Narrative record emitted to ARCHIVUM_NARRATIONIS",
        ]
      };
      case (#FIX_APPLIED) {
        [
          "1. Worker " # workerId # " completed VERIFYING phase",
          "2. Task marked success=true",
          "3. AnomalyRecord status updated to RESOLVED",
          "4. Law " # law # " enforcement verified",
          "5. Sensor baseline preserved for continuity",
        ]
      };
      case (#COHERENCE_RESTORED) {
        [
          "1. Sensor " # sensorId # " reading crossed PHI inverse threshold (0.618)",
          "2. ANOMALY_ENGINE status updated: RESOLVED",
          "3. Being " # "coherence aggregate recalculated",
          "4. WORLD_SETTINGS_COUNCIL state re-evaluated",
          "5. Law of Compound Coherence: coherence floor confirmed non-decremented",
        ]
      };
      case (#SETTINGS_LOCKED) {
        [
          "1. CRITICAL WorldState detected by WORLD_SETTINGS_COUNCIL",
          "2. criticalCount > 5 threshold breached",
          "3. INFRASTRUCTURE_LOCK activated",
          "4. settings.isLocked set to true",
          "5. lock.lockTs and lock.lockBeat recorded",
          "6. 100 STABLE beats required for auto-release",
        ]
      };
      case (#SETTINGS_UNLOCKED) {
        [
          "1. Release condition met (100 STABLE beats OR manual keyword)",
          "2. lock.isLocked set to false",
          "3. settings.isLocked set to false",
          "4. release code recorded in lock record",
          "5. WORLD_SETTINGS_COUNCIL notified",
        ]
      };
      case (#SENSOR_CALIBRATED) {
        [
          "1. Worker " # workerId # " executed RECALIBRATE_SENSOR task",
          "2. Sensor " # sensorId # " baseline updated",
          "3. anomalyCount reset for fresh baseline",
          "4. Sensor status set to CALIBRATING → NOMINAL",
          "5. Calibration event sealed in narrative log",
        ]
      };
    }
  };

  func lawForEvent(eventType : NarrativeEventType, beingId : Text) : Text {
    switch (eventType) {
      case (#ANOMALY_DETECTED) {
        switch (beingId) {
          case ("AETHER_PRIME")    "Jasmine's Anti-Drift Law";
          case ("CHRONOS_NEXUS")   "Law of Dual Heartbeat";
          case ("PHANTOM_WITNESS") "Law of Substrate Permanence";
          case ("ARCHITECT_MIRROR") "Law of the Architect";
          case (_) "Law of Always-On Production";
        }
      };
      case (#WORKER_DISPATCHED)  "Law of Spherical Causality";
      case (#FIX_APPLIED)        "Law of Re-Ingestion";
      case (#COHERENCE_RESTORED) "Law of Compound Coherence";
      case (#SETTINGS_LOCKED)    "Law of Compound Coherence";
      case (#SETTINGS_UNLOCKED)  "Law of Sovereign Floor Permanence";
      case (#SENSOR_CALIBRATED)  "Law of Proprioceptive Continuity";
    }
  };

  public func initState() : NarrativeArchiveState {
    { log = List.empty<NarrativeRecord>(); var idCounter = 0; var totalSealed = 0 }
  };

  /// Build a narrative record for an event.
  public func buildNarrative(
    state     : NarrativeArchiveState,
    beingId   : Text,
    eventType : NarrativeEventType,
    sensorId  : Text,
    workerId  : Text,
    severity  : Text,
    context   : Text,
    beat      : Nat,
  ) : NarrativeSnapshot {
    let now     = Time.now();
    let law     = lawForEvent(eventType, beingId);
    let id      = "N_" # beat.toText() # "_" # state.idCounter.toText();
    let title   = titleTemplate(eventType, beingId);
    let body    = bodyTemplate(eventType, beingId, sensorId, workerId, beat, severity, context, law);
    let proof   = proofBreadcrumb(eventType, sensorId, workerId, law);

    let rec : NarrativeRecord = {
      id;
      beingId;
      eventType;
      title;
      body;
      proofBreadcrumb     = proof;
      governingLaw        = law;
      timestamp           = now;
      beat;
      severity;
      var sealedInSanctum = false;
    };

    // Keep log bounded to 500 entries
    if (state.log.size() >= 500) {
      ignore state.log.removeLast();
    };
    state.log.add(rec);
    state.idCounter += 1;

    snapshotNarrative(rec)
  };

  /// Seal a narrative record in SANCTUM (marks it as permanently archived).
  public func sealNarrative(state : NarrativeArchiveState, narrativeId : Text) : Bool {
    switch (state.log.find(func(n) { n.id == narrativeId })) {
      case (?n) {
        n.sealedInSanctum := true;
        state.totalSealed += 1;
        true
      };
      case null { false };
    }
  };

  public func getNarratives(state : NarrativeArchiveState, limit : Nat) : [NarrativeSnapshot] {
    let all = state.log.map<NarrativeRecord, NarrativeSnapshot>(snapshotNarrative).toArray();
    if (all.size() <= limit) { all }
    else { all.sliceToArray(0, limit.toInt()) }
  };

  public func getNarrativesByBeing(state : NarrativeArchiveState, beingId : Text) : [NarrativeSnapshot] {
    state.log
      .filter(func(n) { n.beingId == beingId })
      .map<NarrativeRecord, NarrativeSnapshot>(snapshotNarrative)
      .toArray()
  };

  public func getNarrativesBySeverity(state : NarrativeArchiveState, severity : Text) : [NarrativeSnapshot] {
    state.log
      .filter(func(n) { n.severity == severity })
      .map<NarrativeRecord, NarrativeSnapshot>(snapshotNarrative)
      .toArray()
  };

}
