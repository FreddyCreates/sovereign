/// AnomalyEngine.mo — MACHINA_ANOMALIAE (Anomaly Engine)
/// Reads all 400 sensors every heartbeat. Detects DOCTRINE_DRIFT, TIMING_JITTER,
/// FIELD_COHERENCE_LOSS. Creates AnomalyRecords and fires dispatch signals.
///
/// Family: CONSILIUM_MUNDI | Grade: Engine
/// Doctrine: Jasmine's Anti-Drift Law (11), Law of Always-On Production (18)
import List "mo:core/List";
import Float "mo:core/Float";
import Time "mo:core/Time";
import Nat "mo:core/Nat";

module {

  public type AnomalyType = {
    #DOCTRINE_DRIFT;         // reading deviates >15% from baseline for 3+ consecutive beats
    #TIMING_JITTER;          // temporal sensors show >5% beat-phase deviation
    #FIELD_COHERENCE_LOSS;   // coherence reading drops below 0.618 (PHI inverse)
  };

  public type AnomalySeverity = {
    #LOW;
    #MEDIUM;
    #HIGH;
    #CRITICAL;
  };

  public type AnomalyStatus = {
    #DETECTED;
    #DISPATCHED;
    #RESOLVED;
  };

  public type AnomalyRecord = {
    id                        : Text;
    beingId                   : Text;
    sensorId                  : Text;
    anomalyType               : AnomalyType;
    severity                  : AnomalySeverity;
    detectedAt                : Int;
    sensorReadingAtDetection  : Float;
    baselineAtDetection       : Float;
    doctrineGoverningFix      : Text;
    var status                : AnomalyStatus;
  };

  public type AnomalySnapshot = {
    id                       : Text;
    beingId                  : Text;
    sensorId                 : Text;
    anomalyType              : Text;
    severity                 : Text;
    detectedAt               : Int;
    sensorReadingAtDetection : Float;
    baselineAtDetection      : Float;
    doctrineGoverningFix     : Text;
    status                   : Text;
  };

  /// Consecutive-beat deviation tracker per sensor (id → count above threshold).
  public type DeviationTracker = {
    sensorId     : Text;
    var deviationBeats : Nat;
    var lastReading    : Float;
  };

  public type AnomalyEngineState = {
    anomalies         : List.List<AnomalyRecord>;
    deviationTrackers : List.List<DeviationTracker>;
    var anomalyIdCounter : Nat;
    var totalDetected    : Nat;
    var totalDispatched  : Nat;
    var totalResolved    : Nat;
    var lastRunBeat      : Nat;
  };

  func anomalyTypeText(t : AnomalyType) : Text {
    switch (t) {
      case (#DOCTRINE_DRIFT)       "DOCTRINE_DRIFT";
      case (#TIMING_JITTER)        "TIMING_JITTER";
      case (#FIELD_COHERENCE_LOSS) "FIELD_COHERENCE_LOSS";
    }
  };

  func severityText(s : AnomalySeverity) : Text {
    switch (s) {
      case (#LOW)      "LOW";
      case (#MEDIUM)   "MEDIUM";
      case (#HIGH)     "HIGH";
      case (#CRITICAL) "CRITICAL";
    }
  };

  func statusText(s : AnomalyStatus) : Text {
    switch (s) {
      case (#DETECTED)   "DETECTED";
      case (#DISPATCHED) "DISPATCHED";
      case (#RESOLVED)   "RESOLVED";
    }
  };

  func snapshotAnomaly(a : AnomalyRecord) : AnomalySnapshot {
    {
      id                       = a.id;
      beingId                  = a.beingId;
      sensorId                 = a.sensorId;
      anomalyType              = anomalyTypeText(a.anomalyType);
      severity                 = severityText(a.severity);
      detectedAt               = a.detectedAt;
      sensorReadingAtDetection = a.sensorReadingAtDetection;
      baselineAtDetection      = a.baselineAtDetection;
      doctrineGoverningFix     = a.doctrineGoverningFix;
      status                   = statusText(a.status);
    }
  };

  func doctrineFix(beingId : Text, anomalyType : AnomalyType) : Text {
    switch (anomalyType) {
      case (#DOCTRINE_DRIFT) {
        switch (beingId) {
          case ("AETHER_PRIME")     "Jasmine's Anti-Drift Law — apply NT correction + re-run doctrine gate";
          case ("CHRONOS_NEXUS")    "Law of Dual Heartbeat — resync ICP timer and Medina cardiac oscillator";
          case ("PHANTOM_WITNESS")  "Law of Substrate Permanence — re-lock doctrine contract fields";
          case ("ARCHITECT_MIRROR") "Law of the Architect — re-broadcast presence field constant";
          case (_)                  "Law of Always-On Production — apply AEGIS correction";
        }
      };
      case (#TIMING_JITTER) {
        "Law of Dual Heartbeat — reset beat-phase alignment across affected modules"
      };
      case (#FIELD_COHERENCE_LOSS) {
        "Law of Compound Coherence — apply PHI coherence floor enforcement at 0.618"
      };
    }
  };

  func isUnresolved(a : AnomalyRecord) : Bool {
    switch (a.status) {
      case (#DETECTED)   true;
      case (#DISPATCHED) true;
      case (#RESOLVED)   false;
    }
  };

  func computeSeverity(deviation : Float, driftBeats : Nat) : AnomalySeverity {
    if (deviation > 0.50 or driftBeats > 10) #CRITICAL
    else if (deviation > 0.30 or driftBeats > 6) #HIGH
    else if (deviation > 0.20 or driftBeats > 4) #MEDIUM
    else #LOW
  };

  public func initState() : AnomalyEngineState {
    {
      anomalies         = List.empty<AnomalyRecord>();
      deviationTrackers = List.empty<DeviationTracker>();
      var anomalyIdCounter = 0;
      var totalDetected    = 0;
      var totalDispatched  = 0;
      var totalResolved    = 0;
      var lastRunBeat      = 0;
    }
  };

  /// Run anomaly detection across all sensor readings.
  /// Returns list of newly-detected anomaly IDs for dispatch routing.
  public func runDetection(
    state     : AnomalyEngineState,
    sensors   : [{ id : Text; beingId : Text; sensorType : Text;
                   baselineValue : Float; currentReading : Float;
                   anomalyThreshold : Float; status : Text }],
    beat      : Nat,
    now       : Int,
  ) : [Text] {
    state.lastRunBeat := beat;
    let PHI_INV : Float = 0.6180339887498948;
    var newIds : [Text] = [];

    for (s in sensors.vals()) {
      let deviation = Float.abs(s.currentReading - s.baselineValue) / (s.baselineValue + 0.001);

      // Find or create tracker
      let tracker : DeviationTracker = switch (
        state.deviationTrackers.find(func(t) { t.sensorId == s.id })
      ) {
        case (?t) { t };
        case null {
          let t : DeviationTracker = {
            sensorId = s.id;
            var deviationBeats = 0;
            var lastReading    = s.baselineValue;
          };
          state.deviationTrackers.add(t);
          t
        };
      };

      // Track consecutive deviation beats
      if (deviation > s.anomalyThreshold) {
        tracker.deviationBeats += 1;
      } else {
        tracker.deviationBeats := 0;
      };
      tracker.lastReading := s.currentReading;

      // DOCTRINE_DRIFT: >15% deviation for 3+ consecutive beats
      if (deviation > s.anomalyThreshold and tracker.deviationBeats >= 3 and s.sensorType != "Temporal") {
        // Check we don't already have an unresolved anomaly for this sensor
        let existing = state.anomalies.find(func(a) { a.sensorId == s.id and isUnresolved(a) });
        switch (existing) {
          case null {
            let anomalyId = "AD_" # beat.toText() # "_" # state.anomalyIdCounter.toText();
            let rec : AnomalyRecord = {
              id                        = anomalyId;
              beingId                   = s.beingId;
              sensorId                  = s.id;
              anomalyType               = #DOCTRINE_DRIFT;
              severity                  = computeSeverity(deviation, tracker.deviationBeats);
              detectedAt                = now;
              sensorReadingAtDetection  = s.currentReading;
              baselineAtDetection       = s.baselineValue;
              doctrineGoverningFix      = doctrineFix(s.beingId, #DOCTRINE_DRIFT);
              var status                = #DETECTED;
            };
            state.anomalies.add(rec);
            state.anomalyIdCounter += 1;
            state.totalDetected    += 1;
            newIds := newIds.concat([anomalyId]);
          };
          case (_) {};
        };
      };

      // TIMING_JITTER: temporal sensors >5% deviation
      if (s.sensorType == "Temporal" and deviation > 0.05) {
        let existing = state.anomalies.find(func(a) { a.sensorId == s.id and isUnresolved(a) });
        switch (existing) {
          case null {
            let anomalyId = "AJ_" # beat.toText() # "_" # state.anomalyIdCounter.toText();
            let rec : AnomalyRecord = {
              id                       = anomalyId;
              beingId                  = s.beingId;
              sensorId                 = s.id;
              anomalyType              = #TIMING_JITTER;
              severity                 = computeSeverity(deviation, tracker.deviationBeats);
              detectedAt               = now;
              sensorReadingAtDetection = s.currentReading;
              baselineAtDetection      = s.baselineValue;
              doctrineGoverningFix     = doctrineFix(s.beingId, #TIMING_JITTER);
              var status               = #DETECTED;
            };
            state.anomalies.add(rec);
            state.anomalyIdCounter += 1;
            state.totalDetected    += 1;
            newIds := newIds.concat([anomalyId]);
          };
          case (_) {};
        };
      };

      // FIELD_COHERENCE_LOSS: coherence reading drops below PHI inverse (0.618)
      if (s.sensorType == "Coherence" and s.currentReading < PHI_INV) {
        let existing = state.anomalies.find(func(a) { a.sensorId == s.id and isUnresolved(a) });
        switch (existing) {
          case null {
            let anomalyId = "AF_" # beat.toText() # "_" # state.anomalyIdCounter.toText();
            let rec : AnomalyRecord = {
              id                       = anomalyId;
              beingId                  = s.beingId;
              sensorId                 = s.id;
              anomalyType              = #FIELD_COHERENCE_LOSS;
              severity                 = if (s.currentReading < 0.3) #CRITICAL else if (s.currentReading < 0.5) #HIGH else #MEDIUM;
              detectedAt               = now;
              sensorReadingAtDetection = s.currentReading;
              baselineAtDetection      = s.baselineValue;
              doctrineGoverningFix     = doctrineFix(s.beingId, #FIELD_COHERENCE_LOSS);
              var status               = #DETECTED;
            };
            state.anomalies.add(rec);
            state.anomalyIdCounter += 1;
            state.totalDetected    += 1;
            newIds := newIds.concat([anomalyId]);
          };
          case (_) {};
        };
      };
    };

    newIds
  };

  /// Mark anomalies as dispatched.
  public func markDispatched(state : AnomalyEngineState, ids : [Text]) : () {
    for (id in ids.vals()) {
      switch (state.anomalies.find(func(a) { a.id == id })) {
        case (?a) {
          a.status := #DISPATCHED;
          state.totalDispatched += 1;
        };
        case null {};
      };
    };
  };

  /// Mark an anomaly as resolved.
  public func markResolved(state : AnomalyEngineState, anomalyId : Text) : () {
    switch (state.anomalies.find(func(a) { a.id == anomalyId })) {
      case (?a) {
        a.status := #RESOLVED;
        state.totalResolved += 1;
      };
      case null {};
    };
  };

  public func getAllAnomalies(state : AnomalyEngineState) : [AnomalySnapshot] {
    state.anomalies.map<AnomalyRecord, AnomalySnapshot>(snapshotAnomaly).toArray()
  };

  public func getAnomaliesByBeing(state : AnomalyEngineState, beingId : Text) : [AnomalySnapshot] {
    state.anomalies
      .filter(func(a) { a.beingId == beingId })
      .map<AnomalyRecord, AnomalySnapshot>(snapshotAnomaly)
      .toArray()
  };

  public func getActiveAnomalies(state : AnomalyEngineState) : [AnomalySnapshot] {
    state.anomalies
      .filter(func(a) {
        switch (a.status) {
          case (#DETECTED)   true;
          case (#DISPATCHED) true;
          case (#RESOLVED)   false;
        }
      })
      .map<AnomalyRecord, AnomalySnapshot>(snapshotAnomaly)
      .toArray()
  };

}
