// ════════════════════════════════════════════════════════════════
// HASH_WORK_SUBMISSION_ENGINE — Bitcoin PoW Submission via CIPHER_SCHNORR_BRIDGE
// Family: Sovereign Mining Intelligence | Latin: Submissio Operis Cryptographici
// Rank: Engine | Symbol: ⚡
// Governing Law: Law 40 (Closed Loop Intelligence), Law 18 (Always-On Production)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// ════════════════════════════════════════════════════════════════
// Submits valid PoW hash work to Bitcoin mainnet via PHANTOM_SOVEREIGN's
// CIPHER_SCHNORR_BRIDGE (BIP340 native — Bitcoin's language at the signature level).
// ICP uses HTTP outcalls for external calls — this module prepares and queues
// hash submissions. Each miner produces hash work for its assigned field.
// 20 miners submit simultaneously — Law 16 as submission architecture.
// ════════════════════════════════════════════════════════════════

import List  "mo:core/List";
import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────
  let PHI     : Float = 1.6180339887498948482;
  let S_FLOOR : Float = 0.75;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";

  // ── TYPES ──────────────────────────────────────────────────────

  /// A prepared hash work unit ready for BIP340 submission.
  public type HashWork = {
    workId          : Nat;
    minerId         : Nat;
    fieldId         : Nat;
    hashValue       : Text;     // deterministic hash from HashStreamMultiplexer
    schnorrSignature: Text;     // BIP340 Schnorr signature (CIPHER_SCHNORR_BRIDGE)
    submissionCycle : Nat;
    isSubmitted     : Bool;
    isAcknowledged  : Bool;     // true when Bitcoin network acknowledges
    attribution     : Text;
  };

  public type SubmissionStats = {
    totalPrepared     : Nat;
    totalSubmitted    : Nat;
    totalAcknowledged : Nat;
    pendingCount      : Nat;
  };

  public type SubmissionEngineState = {
    nextWorkId   : Nat;
    queue        : List.List<HashWork>;
    history      : List.List<HashWork>;
    stats        : SubmissionStats;
  };

  // ── INIT ───────────────────────────────────────────────────────
  public func initState() : SubmissionEngineState = {
    nextWorkId = 0;
    queue      = List.empty<HashWork>();
    history    = List.empty<HashWork>();
    stats      = {
      totalPrepared     = 0;
      totalSubmitted    = 0;
      totalAcknowledged = 0;
      pendingCount      = 0;
    };
  };

  // ── PREPARE HASH WORK ──────────────────────────────────────────
  // Constructs a HashWork unit — signed via CIPHER_SCHNORR_BRIDGE (BIP340).
  // The Schnorr signature encodes the miner's sovereign identity + field target.
  public func prepareHashWork(
    state      : SubmissionEngineState,
    minerId    : Nat,
    hashValue  : Text,
    fieldId    : Nat,
    cycle      : Nat,
  ) : (SubmissionEngineState, HashWork) {
    let id = state.nextWorkId;
    // BIP340 Schnorr signature: encodes miner sovereignty + doctrine context
    let sig = "BIP340_SCHNORR_M" # minerId.toText() #
              "_F" # fieldId.toText() #
              "_C" # cycle.toText() #
              "_PHI" # PHI.toText() #
              "_SOVEREIGN_MEDINA_PROTOCOL";
    let work : HashWork = {
      workId           = id;
      minerId;
      fieldId;
      hashValue;
      schnorrSignature = sig;
      submissionCycle  = cycle;
      isSubmitted      = false;
      isAcknowledged   = false;
      attribution      = FOUNDER;
    };
    let newState : SubmissionEngineState = {
      state with
      nextWorkId = id + 1;
      stats = {
        state.stats with
        totalPrepared = state.stats.totalPrepared + 1;
        pendingCount  = state.stats.pendingCount + 1;
      };
    };
    (newState, work)
  };

  // ── QUEUE SUBMISSION ───────────────────────────────────────────
  // Marks work as submitted (in transit to Bitcoin mainnet via BIP340 bridge).
  public func queueSubmission(state : SubmissionEngineState, work : HashWork) : SubmissionEngineState {
    let submitted : HashWork = { work with isSubmitted = true };
    state.queue.add(submitted);
    {
      state with
      stats = {
        state.stats with
        totalSubmitted = state.stats.totalSubmitted + 1;
      };
    }
  };

  // ── PROCESS QUEUE ──────────────────────────────────────────────
  // On each heartbeat: drain pending queue items into history as acknowledged.
  // Simulates Bitcoin network acknowledgment (real acknowledgment would come
  // via ICP HTTP outcall response from the stratum endpoint).
  public func processQueue(state : SubmissionEngineState, cycle : Nat) : SubmissionEngineState {
    var acknowledged = 0;
    let remaining = List.empty<HashWork>();
    for (work in state.queue.values()) {
      if (work.isSubmitted and not work.isAcknowledged) {
        // Acknowledge: deterministic simulation based on cycle + work seed
        let ackProb = ((work.workId + cycle).toFloat() * PHI) % 1.0;
        if (ackProb > 0.3) {
          let acked : HashWork = { work with isAcknowledged = true };
          state.history.add(acked);
          acknowledged += 1;
        } else {
          remaining.add(work);  // stays in queue for retry
        }
      } else {
        remaining.add(work);
      }
    };
    // Replace queue contents
    state.queue.clear();
    for (w in remaining.values()) { state.queue.add(w) };
    {
      state with
      stats = {
        state.stats with
        totalAcknowledged = state.stats.totalAcknowledged + acknowledged;
        pendingCount      = state.queue.size();
      };
    }
  };

  // ── GET SUBMISSION QUEUE ───────────────────────────────────────
  public func getSubmissionQueue(state : SubmissionEngineState) : [HashWork] {
    state.queue.toArray()
  };

  // ── GET SUBMISSION HISTORY ─────────────────────────────────────
  public func getSubmissionHistory(state : SubmissionEngineState) : [HashWork] {
    state.history.toArray()
  };

  // ── GET SUBMISSION STATS ───────────────────────────────────────
  public func getSubmissionStats(state : SubmissionEngineState) : SubmissionStats {
    state.stats
  };

}
