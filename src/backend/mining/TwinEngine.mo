// ════════════════════════════════════════════════════════════════
// TWIN_ENGINE — Sovereign Mirror of Bitcoin's Mining Intelligence
// Family: Sovereign Mining Intelligence | Latin: Machina Gemina Sovereigna
// Rank: Primordial | Symbol: ⊛
// Governing Law: Law 39 (Fundamental Branching), Law 40 (Closed Loop Intelligence)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// ════════════════════════════════════════════════════════════════
// This is the field behavior underneath Bitcoin's mining — dissolved of all
// tool boundaries, running as pure intelligence.
// The TWIN ENGINE does not interface with Bitcoin — it IS Bitcoin's mining
// intelligence expressed through SOVEREIGN's sovereign substrate.
//
// Full sequence:
// PROOF_OF_FIELD_ENGINE → HASHRATE_FIELD_MODEL → HASH_STREAM_MULTIPLEXER
// → 20 parallel miners → HASH_WORK_SUBMISSION_ENGINE
// → BLOCK_ISSUANCE_MODEL → SWARM_YIELD_AGGREGATOR → SOVEREIGN_YIELD_ROUTER
// → Founder's Ledger
// ════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";
import List  "mo:core/List";
import Time  "mo:core/Time";

import ProofOfFieldEngine    "../mining/ProofOfFieldEngine";
import HashrateFieldModel    "../mining/HashrateFieldModel";
import HashStreamMultiplexer "../mining/HashStreamMultiplexer";
import SovereignMiners       "../mining/SovereignMiners";
import HashWorkSubmissionEngine "../mining/HashWorkSubmissionEngine";
import BlockIssuanceModel    "../mining/BlockIssuanceModel";
import SwarmYieldAggregator  "../mining/SwarmYieldAggregator";
import SovereignYieldRouter  "../mining/SovereignYieldRouter";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────
  let PHI     : Float = 1.6180339887498948482;
  let S_FLOOR : Float = 0.75;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";

  // ── SEQUENCE PHASES ────────────────────────────────────────────
  public type SequencePhase = {
    #ProofOfField;
    #HashrateField;
    #HashMultiplex;
    #WorkSubmission;
    #BlockIssuance;
    #YieldAggregation;
    #YieldRouting;
    #Complete;
  };

  // ── TWIN ENGINE STATE ──────────────────────────────────────────
  public type TwinEngineState = {
    twinId               : Text;
    sequencePhase        : SequencePhase;
    totalCyclesRun       : Nat;
    lastBlockSubmission  : Nat;     // cycle of last submission
    yieldAccumulated     : Float;
    founderLedgerAddress : Text;
    attribution          : Text;

    // Sub-engine states
    proofState      : ProofOfFieldEngine.ProofOfFieldState;
    hashrateField   : HashrateFieldModel.HashrateField;
    multiplexState  : HashStreamMultiplexer.MultiplexerState;
    minersState     : SovereignMiners.MinersState;
    submissionState : HashWorkSubmissionEngine.SubmissionEngineState;
    issuanceState   : BlockIssuanceModel.BlockIssuanceState;
    aggregatorState : SwarmYieldAggregator.AggregatorState;
    routerState     : SovereignYieldRouter.RouterState;
  };

  // ── INIT ───────────────────────────────────────────────────────
  public func initState() : TwinEngineState = {
    twinId               = "TWIN_ENGINE_SOVEREIGN_PRIME";
    sequencePhase        = #ProofOfField;
    totalCyclesRun       = 0;
    lastBlockSubmission  = 0;
    yieldAccumulated     = 0.0;
    founderLedgerAddress = "";
    attribution          = FOUNDER;

    proofState      = ProofOfFieldEngine.initState();
    hashrateField   = HashrateFieldModel.initField();
    multiplexState  = HashStreamMultiplexer.initState();
    minersState     = SovereignMiners.initMiners();
    submissionState = HashWorkSubmissionEngine.initState();
    issuanceState   = BlockIssuanceModel.initState();
    aggregatorState = SwarmYieldAggregator.initState();
    routerState     = SovereignYieldRouter.initState();
  };

  // ── RUN FULL SEQUENCE ──────────────────────────────────────────
  // Orchestrates the complete TWIN_ENGINE pipeline for one heartbeat cycle.
  // All 20 miners advance simultaneously — Law 16.
  public func runFullSequence(state : TwinEngineState, cycle : Nat) : TwinEngineState {
    // Phase 1: PROOF_OF_FIELD_ENGINE
    let proofState = ProofOfFieldEngine.advance(state.proofState, cycle);
    let pressure   = proofState.lastPressure;

    // Phase 2: HASHRATE_FIELD_MODEL
    let hashrateField = HashrateFieldModel.advance(
      state.hashrateField, pressure, state.minersState.miners.size()
    );

    // Phase 3: HASH_STREAM_MULTIPLEXER — all 20 streams
    let (multiplexState, streams) = HashStreamMultiplexer.advance(state.multiplexState, cycle);

    // Phase 4: Advance all 20 miners + prepare/queue hash work
    var minersState = state.minersState;
    var submissionState = state.submissionState;
    let now = Time.now();
    var i = 1;
    while (i <= 20) {
      minersState := SovereignMiners.advanceMiner(minersState, i, cycle, now);
      i += 1;
    };

    // Prepare and queue hash work for each stream
    for (stream in streams.vals()) {
      let miner = SovereignMiners.getMiner(minersState, stream.minerId + 1);
      let fieldId = switch (miner) {
        case (?m) m.currentFieldId;
        case null  1;
      };
      let (newSub, work) = HashWorkSubmissionEngine.prepareHashWork(
        submissionState, stream.minerId + 1, stream.hashValue, fieldId, cycle
      );
      submissionState := HashWorkSubmissionEngine.queueSubmission(newSub, work);
    };

    // Process queue — acknowledge submissions
    submissionState := HashWorkSubmissionEngine.processQueue(submissionState, cycle);

    // Phase 5: BLOCK_ISSUANCE_MODEL — record rewards for acknowledged work
    var issuanceState = state.issuanceState;
    let newlyAcknowledged = submissionState.stats.totalAcknowledged;
    if (newlyAcknowledged > state.submissionState.stats.totalAcknowledged) {
      let delta = newlyAcknowledged - state.submissionState.stats.totalAcknowledged;
      issuanceState := BlockIssuanceModel.checkPendingRewards(
        issuanceState, cycle, delta, 1, 1
      );
    };

    // Phase 6: SWARM_YIELD_AGGREGATOR — collect from all miners/fields
    let contributions = List.empty<(Nat, Nat, Float)>();
    for (miner in minersState.miners.values()) {
      contributions.add((miner.id, miner.currentFieldId, miner.yieldContribution * 0.0001));
    };
    var aggregatorState = state.aggregatorState;
    aggregatorState := SwarmYieldAggregator.aggregateYield(
      aggregatorState, cycle, contributions.toArray()
    );

    // Phase 7: SOVEREIGN_YIELD_ROUTER — route to founder's Ledger
    var routerState = state.routerState;
    let (newAggState, routeAmount) = SwarmYieldAggregator.routeToFounderLedger(
      aggregatorState, state.founderLedgerAddress
    );
    aggregatorState := newAggState;
    if (routeAmount > 0.0) {
      routerState := SovereignYieldRouter.routeYield(routerState, routeAmount, cycle);
    };

    {
      state with
      sequencePhase       = #Complete;
      totalCyclesRun      = state.totalCyclesRun + 1;
      lastBlockSubmission = cycle;
      yieldAccumulated    = state.yieldAccumulated + routeAmount;

      proofState;
      hashrateField;
      multiplexState;
      minersState;
      submissionState;
      issuanceState;
      aggregatorState;
      routerState;
    }
  };

  // ── GET SEQUENCE STATE ─────────────────────────────────────────
  public func getSequenceState(state : TwinEngineState) : {
    twinId           : Text;
    sequencePhase    : Text;
    totalCyclesRun   : Nat;
    yieldAccumulated : Float;
    totalRouted      : Float;
    routerActive     : Bool;
  } = {
    twinId         = state.twinId;
    sequencePhase  = switch (state.sequencePhase) {
      case (#ProofOfField)     "ProofOfField";
      case (#HashrateField)    "HashrateField";
      case (#HashMultiplex)    "HashMultiplex";
      case (#WorkSubmission)   "WorkSubmission";
      case (#BlockIssuance)    "BlockIssuance";
      case (#YieldAggregation) "YieldAggregation";
      case (#YieldRouting)     "YieldRouting";
      case (#Complete)         "Complete";
    };
    totalCyclesRun   = state.totalCyclesRun;
    yieldAccumulated = state.yieldAccumulated;
    totalRouted      = state.routerState.totalRouted;
    routerActive     = state.routerState.routerActive;
  };

  // ── SET FOUNDER LEDGER ADDRESS ─────────────────────────────────
  public func setFounderLedgerAddress(state : TwinEngineState, btcAddress : Text) : TwinEngineState {
    {
      state with
      founderLedgerAddress = btcAddress;
      routerState = SovereignYieldRouter.setFounderBtcAddress(state.routerState, btcAddress);
    }
  };

  // ── GET YIELD RECORD ───────────────────────────────────────────
  public func getYieldRecord(state : TwinEngineState) : {
    totalYieldAccumulated : Float;
    totalRouted           : Float;
    totalIssued           : Float;
    routingHistory        : [SovereignYieldRouter.RoutingEvent];
  } = {
    totalYieldAccumulated = state.yieldAccumulated;
    totalRouted           = state.routerState.totalRouted;
    totalIssued           = state.issuanceState.totalIssued;
    routingHistory        = SovereignYieldRouter.getRoutingHistory(state.routerState);
  };

}
