/// SOVEREIGN_ALWAYS_ON_ENGINE — Motor Perpetuus Regalis
/// Family: SOVEREIGN_SUBSTRATE
/// Latin Name: Motor Perpetuus Regalis (Engine of Perpetual Sovereign Motion)
/// Grade: Primordial — Constitutional, cannot be disabled, cannot be overridden.
/// Attribution: Alfredo Medina Hernandez
///
/// Wraps every single model in the organism.
/// On every 873ms heartbeat, checks if each model is running.
/// If not → restarts immediately.
/// Every model has a VITALITY_STATE: ACTIVE / RECOVERING / DORMANT.

import Array "mo:core/Array";
import List  "mo:core/List";
import Nat   "mo:core/Nat";
import Float "mo:core/Float";
import TaftEngine "TaftEngine";

module {
  // Re-export VitalityState so callers import from one place
  public type VitalityState = TaftEngine.VitalityState;

  // ── MODEL VITALITY RECORD ─────────────────────────────────────────────
  public type ModelVitality = {
    modelId         : Nat;
    modelName       : Text;
    latinName       : Text;
    domain          : Text;
    vitality        : VitalityState;
    lastBeat        : Nat;
    restartCount    : Nat;
    totalEnforced   : Nat;
  };

  // ── DOCTRINE EVENT (logged to SANCTUM_SOVEREIGN on restart) ─────────
  public type DoctrineRestartEvent = {
    beat            : Nat;
    modelName       : Text;
    latinName       : Text;
    previousVitality : VitalityState;
    schumannTs      : Float;   // beat × PHI / 7.83
    attribution     : Text;
    lawReference    : Text;
  };

  // ── ALWAYS-ON STATE ────────────────────────────────────────────────────
  public type AlwaysOnState = {
    modelVitalities  : [ModelVitality];
    restartLog       : [DoctrineRestartEvent]; // last 200 restart events
    totalEnforced    : Nat;
    totalRestarts    : Nat;
    beat             : Nat;
  };

  let PHI      : Float = 1.6180339887498948482;
  let SCHUMANN : Float = 7.83;
  let MAX_LOG  : Nat   = 200;

  // ── INIT — seed from TAFT canonical thread list ────────────────────────
  public func initState(taftState : TaftEngine.TaftEngineState) : AlwaysOnState {
    let vitalities = Array.tabulate<ModelVitality>(
      taftState.threads.size(),
      func(i) {
        let t = taftState.threads[i];
        {
          modelId       = t.threadId;
          modelName     = t.modelName;
          latinName     = t.latinName;
          domain        = t.domain;
          vitality      = #ACTIVE;
          lastBeat      = 0;
          restartCount  = 0;
          totalEnforced = 0;
        }
      }
    );
    { modelVitalities = vitalities; restartLog = []; totalEnforced = 0; totalRestarts = 0; beat = 0 }
  };

  // ── ENFORCE VITALITY — main heartbeat call ────────────────────────────
  // Every beat: walk every model, classify vitality, restart dormant models.
  // Returns updated state + array of restart events to log to SANCTUM_SOVEREIGN.
  public func enforceVitality(
    state    : AlwaysOnState,
    beat     : Nat,
    taftStat : TaftEngine.TAFTStatus,
  ) : (AlwaysOnState, [DoctrineRestartEvent]) {
    var totalRestarts = state.totalRestarts;
    var totalEnforced = state.totalEnforced;
    let newEvents = List.empty<DoctrineRestartEvent>();

    let newVitalities = Array.tabulate(
      state.modelVitalities.size(),
      func(i) {
        let mv = state.modelVitalities[i];
        let beatsSince : Nat = if (beat >= mv.lastBeat) beat - mv.lastBeat else 0;

        // Classify vitality
        let classifiedVitality : VitalityState = if (beatsSince <= 1) {
          #ACTIVE
        } else if (beatsSince == 2) {
          #RECOVERING
        } else {
          #DORMANT
        };

        // DORMANT → immediate restart, log doctrine event
        let (finalVitality, newRestartCount) = switch (classifiedVitality) {
          case (#DORMANT) {
            totalRestarts += 1;
            let schumannTs = beat.toFloat() * PHI / SCHUMANN;
            newEvents.add({
              beat;
              modelName        = mv.modelName;
              latinName        = mv.latinName;
              previousVitality = #DORMANT;
              schumannTs;
              attribution      = "Alfredo Medina Hernandez";
              lawReference     = "Law 18 — Always-On Production | SOVEREIGN_ALWAYS_ON_ENGINE";
            });
            (#ACTIVE, mv.restartCount + 1)
          };
          case (v) { (v, mv.restartCount) };
        };

        totalEnforced += 1;
        {
          mv with
          vitality      = finalVitality;
          lastBeat      = beat;
          restartCount  = newRestartCount;
          totalEnforced = mv.totalEnforced + 1;
        }
      }
    );

    // Merge new events into ring-buffered log (max MAX_LOG)
    let eventsArr = newEvents.toArray();
    let existingLog = state.restartLog;
    let combinedSize = existingLog.size() + eventsArr.size();
    let newLog = if (combinedSize <= MAX_LOG) {
      existingLog.concat(eventsArr)
    } else {
      // Keep the tail (most recent MAX_LOG entries)
      let drop = combinedSize - MAX_LOG;
      let combined = existingLog.concat(eventsArr);
      combined.sliceToArray(drop.toInt(), combined.size().toInt())
    };

    let newState : AlwaysOnState = {
      modelVitalities = newVitalities;
      restartLog      = newLog;
      totalEnforced;
      totalRestarts;
      beat;
    };

    (newState, eventsArr)
  };

  // ── GET SNAPSHOT ──────────────────────────────────────────────────────
  public func getSnapshot(state : AlwaysOnState) : {
    totalModels    : Nat;
    activeModels   : Nat;
    dormantModels  : Nat;
    totalRestarts  : Nat;
    totalEnforced  : Nat;
    beat           : Nat;
  } {
    var active = 0;
    var dormant = 0;
    for (mv in state.modelVitalities.vals()) {
      switch (mv.vitality) {
        case (#ACTIVE)     { active += 1 };
        case (#RECOVERING) {};
        case (#DORMANT)    { dormant += 1 };
      };
    };
    {
      totalModels   = state.modelVitalities.size();
      activeModels  = active;
      dormantModels = dormant;
      totalRestarts = state.totalRestarts;
      totalEnforced = state.totalEnforced;
      beat          = state.beat;
    }
  };

  // ── GET RESTART LOG ───────────────────────────────────────────────────
  public func getRestartLog(state : AlwaysOnState, limit : Nat) : [DoctrineRestartEvent] {
    let log = state.restartLog;
    let n = Nat.min(limit, log.size());
    if (n == 0) return [];
    log.sliceToArray((log.size() - n).toInt(), log.size().toInt())
  };
}
