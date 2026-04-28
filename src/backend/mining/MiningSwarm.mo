// ════════════════════════════════════════════════════════════════
// MINING_SWARM_ENGINE — Sovereign Mining Organism Coordinator
// Family: Sovereign Mining Intelligence | Latin: Machina Agminis Sovereigna
// Rank: Organism | Symbol: ⬡
// Governing Law: Law 18 (Always-On Production), Law 16 (Spherical Causality)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// ════════════════════════════════════════════════════════════════
// The sovereign mining organism. Coordinates all 20 parallel miners.
// Beats at 873ms via the main heartbeat. Always-on. Always producing.
// All 20 miners advance on every heartbeat — Law 16 (spherical, not sequential).
// 100+ mining fields auto-discovered and entered via MINING_FIELD_ROUTER.
// swarmCoherence: PHI-derived coherence across all 20 miners.
// ════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";
import List  "mo:core/List";

import TwinEngine         "../mining/TwinEngine";
import MiningFieldRouter  "../mining/MiningFieldRouter";
import SovereignMiners    "../mining/SovereignMiners";
import HashWorkSubmissionEngine "../mining/HashWorkSubmissionEngine";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────
  let PHI     : Float = 1.6180339887498948482;
  let PHI4    : Float = 6.8541019662496845446;
  let PHI_INV : Float = 0.6180339887498948482;
  let S_FLOOR : Float = 0.75;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";

  // ── TYPES ──────────────────────────────────────────────────────

  /// Full mining swarm state — all sub-engines held here.
  public type MiningSwarmState = {
    swarmId              : Text;
    activeMinerCount     : Nat;
    totalHashesSubmitted : Nat;
    totalYieldRouted     : Float;
    activeFieldCount     : Nat;
    swarmCoherence       : Float;    // PHI-derived coherence across all miners
    lastHeartbeat        : Nat;      // last heartbeat cycle
    attribution          : Text;

    // Sub-engine states
    twinState   : TwinEngine.TwinEngineState;
    fieldState  : MiningFieldRouter.FieldRouterState;
  };

  /// Public snapshot for frontend/query — all shared types.
  public type SwarmSnapshot = {
    swarmId              : Text;
    activeMinerCount     : Nat;
    totalHashesSubmitted : Nat;
    totalYieldRouted     : Float;
    activeFieldCount     : Nat;
    swarmCoherence       : Float;
    lastHeartbeat        : Nat;
    totalCyclesRun       : Nat;
    routerActive         : Bool;
    attribution          : Text;
  };

  /// Miner status snapshot — shareable.
  public type MinerSnapshot = {
    id                : Nat;
    name              : Text;
    latinName         : Text;
    currentFieldId    : Nat;
    hashesThisSession : Nat;
    yieldContribution : Float;
    coherenceScore    : Float;
  };

  /// Field status snapshot — shareable.
  public type FieldSnapshot = {
    fieldId    : Nat;
    fieldName  : Text;
    protocol   : Text;
    isActive   : Bool;
    difficulty : Float;
    qualScore  : Float;
  };

  // ── INIT ───────────────────────────────────────────────────────
  public func initState() : MiningSwarmState = {
    swarmId              = "MINING_SWARM_ENGINE_SOVEREIGN";
    activeMinerCount     = 0;
    totalHashesSubmitted = 0;
    totalYieldRouted     = 0.0;
    activeFieldCount     = 0;
    swarmCoherence       = S_FLOOR;
    lastHeartbeat        = 0;
    attribution          = FOUNDER;
    twinState            = TwinEngine.initState();
    fieldState           = MiningFieldRouter.initState();
  };

  // ── COMPUTE SWARM COHERENCE ────────────────────────────────────
  // PHI-derived: average miner coherence × PHI_INV coupling
  func computeSwarmCoherence(miners : [SovereignMiners.SovereignMiner]) : Float {
    if (miners.size() == 0) return S_FLOOR;
    let sum = miners.foldLeft(0.0, func(acc : Float, m : SovereignMiners.SovereignMiner) : Float { acc + m.coherenceScore });
    Float.max(S_FLOOR, (sum / miners.size().toFloat()) * PHI_INV)
  };

  // ── ADVANCE SWARM ──────────────────────────────────────────────
  // Called on every heartbeat beat. Advances the full TWIN_ENGINE sequence
  // and auto-discovers new mining fields. Law 16: all 20 miners advance together.
  public func advanceSwarm(state : MiningSwarmState, cycle : Nat) : MiningSwarmState {
    // Auto-discover and enter new mining fields
    let fieldState = MiningFieldRouter.autoDiscoverFields(state.fieldState, cycle);
    let activeFields = MiningFieldRouter.getActiveFields(fieldState);

    // Assign miners to active fields (round-robin)
    var twinState = state.twinState;
    if (activeFields.size() > 0) {
      var i = 1;
      while (i <= 20) {
        let fieldIdx = (i - 1) % activeFields.size();
        let fieldId = activeFields[fieldIdx].fieldId;
        twinState := {
          twinState with
          minersState = SovereignMiners.assignMinerToField(
            twinState.minersState, i, fieldId
          );
        };
        i += 1;
      };
    };

    // Run the full TWIN_ENGINE sequence — all 20 miners × all active fields
    twinState := TwinEngine.runFullSequence(twinState, cycle);

    // Compute updated swarm metrics
    let miners = SovereignMiners.getAllMiners(twinState.minersState);
    let coherence = computeSwarmCoherence(miners);
    let totalHashes = twinState.submissionState.stats.totalSubmitted;
    let totalYield  = twinState.routerState.totalRouted;

    {
      state with
      activeMinerCount     = 20;
      totalHashesSubmitted = totalHashes;
      totalYieldRouted     = totalYield;
      activeFieldCount     = activeFields.size();
      swarmCoherence       = coherence;
      lastHeartbeat        = cycle;
      twinState;
      fieldState;
    }
  };

  // ── GET SWARM STATE ────────────────────────────────────────────
  public func getSwarmState(state : MiningSwarmState) : SwarmSnapshot {
    let seqState = TwinEngine.getSequenceState(state.twinState);
    {
      swarmId              = state.swarmId;
      activeMinerCount     = state.activeMinerCount;
      totalHashesSubmitted = state.totalHashesSubmitted;
      totalYieldRouted     = state.totalYieldRouted;
      activeFieldCount     = state.activeFieldCount;
      swarmCoherence       = state.swarmCoherence;
      lastHeartbeat        = state.lastHeartbeat;
      totalCyclesRun       = seqState.totalCyclesRun;
      routerActive         = seqState.routerActive;
      attribution          = state.attribution;
    }
  };

  // ── GET MINER STATUS ───────────────────────────────────────────
  public func getMinerStatus(state : MiningSwarmState, minerId : Nat) : ?MinerSnapshot {
    switch (SovereignMiners.getMiner(state.twinState.minersState, minerId)) {
      case null null;
      case (?m) ?{
        id                = m.id;
        name              = m.name;
        latinName         = m.latinName;
        currentFieldId    = m.currentFieldId;
        hashesThisSession = m.hashesThisSession;
        yieldContribution = m.yieldContribution;
        coherenceScore    = m.coherenceScore;
      };
    }
  };

  // ── GET ACTIVE FIELDS ──────────────────────────────────────────
  public func getActiveFields(state : MiningSwarmState) : [FieldSnapshot] {
    MiningFieldRouter.getActiveFields(state.fieldState).map<
      MiningFieldRouter.MiningField,
      FieldSnapshot
    >(func(f) = {
      fieldId    = f.fieldId;
      fieldName  = f.fieldName;
      protocol   = f.protocol;
      isActive   = true;
      difficulty = f.difficulty;
      qualScore  = f.qualScore;
    })
  };

  // ── GET TOTAL YIELD ────────────────────────────────────────────
  public func getTotalYield(state : MiningSwarmState) : Float {
    state.totalYieldRouted
  };

  // ── SET FOUNDER LEDGER ADDRESS ─────────────────────────────────
  public func setFounderLedgerAddress(state : MiningSwarmState, btcAddress : Text) : MiningSwarmState {
    { state with twinState = TwinEngine.setFounderLedgerAddress(state.twinState, btcAddress) }
  };

  // ── GET YIELD STATS ────────────────────────────────────────────
  public func getYieldStats(state : MiningSwarmState) : {
    totalYieldRouted  : Float;
    totalIssued       : Float;
    aggregatedYield   : Float;
    submissionStats   : HashWorkSubmissionEngine.SubmissionStats;
  } = {
    totalYieldRouted  = state.totalYieldRouted;
    totalIssued       = state.twinState.issuanceState.totalIssued;
    aggregatedYield   = state.twinState.aggregatorState.totalAggregated;
    submissionStats   = state.twinState.submissionState.stats;
  };

}
