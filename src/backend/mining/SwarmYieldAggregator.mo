// ════════════════════════════════════════════════════════════════
// SWARM_YIELD_AGGREGATOR — Collect Bitcoin Yield from 100+ Fields
// Family: Sovereign Mining Intelligence | Latin: Aggregator Fructuum Sovereigni
// Rank: Engine | Symbol: ≋
// Governing Law: Law 23 (Compound Coherence), Law 25 (Federation Yield)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// ════════════════════════════════════════════════════════════════
// Collects Bitcoin yield from all 100+ active mining fields simultaneously.
// Aggregates yield from all 20 miners across all fields.
// Routes everything through SOVEREIGN_YIELD_ROUTER to the founder's Ledger.
// Law 25 (Federation Yield): PHI merge multiplier on all aggregated yields.
// ════════════════════════════════════════════════════════════════

import List  "mo:core/List";
import Map   "mo:core/Map";
import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────
  let PHI     : Float = 1.6180339887498948482;
  let S_FLOOR : Float = 0.75;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";

  // ── TYPES ──────────────────────────────────────────────────────

  public type YieldEntry = {
    cycle       : Nat;
    minerId     : Nat;
    fieldId     : Nat;
    amount      : Float;
    attribution : Text;
  };

  public type AggregatorState = {
    totalAggregated  : Float;
    yieldByMiner     : Map.Map<Nat, Float>;   // minerId → cumulative yield
    yieldByField     : Map.Map<Nat, Float>;   // fieldId → cumulative yield
    pendingForRouter : Float;                  // accumulated, awaiting routing
    history          : List.List<YieldEntry>;
    lastAggregateCycle : Nat;
  };

  // ── INIT ───────────────────────────────────────────────────────
  public func initState() : AggregatorState = {
    totalAggregated    = 0.0;
    yieldByMiner       = Map.empty<Nat, Float>();
    yieldByField       = Map.empty<Nat, Float>();
    pendingForRouter   = 0.0;
    history            = List.empty<YieldEntry>();
    lastAggregateCycle = 0;
  };

  // ── AGGREGATE YIELD ────────────────────────────────────────────
  // Called every heartbeat cycle.
  // Takes an array of (minerId, fieldId, amount) tuples and aggregates.
  // PHI merge multiplier (Law 25) applied to each contribution.
  public func aggregateYield(
    state        : AggregatorState,
    cycle        : Nat,
    contributions: [(Nat, Nat, Float)],  // (minerId, fieldId, amount)
  ) : AggregatorState {
    var totalNew : Float = 0.0;
    for ((minerId, fieldId, amount) in contributions.vals()) {
      // Law 25: PHI merge multiplier — federation yield compounds
      let merged = amount * PHI;
      totalNew += merged;
      // Update by-miner
      let prevMiner = switch (state.yieldByMiner.get(minerId)) {
        case (?v) v; case null 0.0
      };
      state.yieldByMiner.add(minerId, prevMiner + merged);
      // Update by-field
      let prevField = switch (state.yieldByField.get(fieldId)) {
        case (?v) v; case null 0.0
      };
      state.yieldByField.add(fieldId, prevField + merged);
      // Record history
      state.history.add({
        cycle; minerId; fieldId;
        amount      = merged;
        attribution = FOUNDER;
      });
    };
    // Cap history at 1000
    if (state.history.size() > 1000) { ignore state.history.removeLast() };
    {
      state with
      totalAggregated    = state.totalAggregated + totalNew;
      pendingForRouter   = state.pendingForRouter + totalNew;
      lastAggregateCycle = cycle;
    }
  };

  // ── GET TOTAL AGGREGATED YIELD ─────────────────────────────────
  public func getTotalAggregatedYield(state : AggregatorState) : Float {
    state.totalAggregated
  };

  // ── GET YIELD BY MINER ─────────────────────────────────────────
  public func getYieldByMiner(state : AggregatorState) : [(Nat, Float)] {
    state.yieldByMiner.toArray()
  };

  // ── GET YIELD BY FIELD ─────────────────────────────────────────
  public func getYieldByField(state : AggregatorState) : [(Nat, Float)] {
    state.yieldByField.toArray()
  };

  // ── ROUTE TO FOUNDER LEDGER ────────────────────────────────────
  // Drains pendingForRouter into a routing event.
  // Returns (updated state, routed amount) — caller passes to SovereignYieldRouter.
  public func routeToFounderLedger(
    state          : AggregatorState,
    btcAddress     : Text,
  ) : (AggregatorState, Float) {
    let amount = state.pendingForRouter;
    if (amount <= 0.0) { return (state, 0.0) };
    let newState : AggregatorState = { state with pendingForRouter = 0.0 };
    (newState, amount)
  };

}
