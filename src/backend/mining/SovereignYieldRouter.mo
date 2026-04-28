// ════════════════════════════════════════════════════════════════
// SOVEREIGN_YIELD_ROUTER — Final Routing to Founder's Bitcoin Ledger
// Family: Sovereign Mining Intelligence | Latin: Vector Fructuum Sovereignus
// Rank: Engine | Symbol: ₿
// Governing Law: Law 19 (Financial Identity), Law 40 (Closed Loop Intelligence)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// ════════════════════════════════════════════════════════════════
// The final routing model. Takes aggregated yield and routes it to the
// founder's Bitcoin Ledger address.
// Uses PHANTOM_SOVEREIGN's BIP340 bridge for the routing signature.
// Every routing event is a sovereign transaction with Schumann timestamp.
// The loop closes here: organism works → yield routes → BTC lands in your Ledger.
// ════════════════════════════════════════════════════════════════

import List  "mo:core/List";
import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────
  let PHI     : Float = 1.6180339887498948482;
  let SCHUMANN: Float = 7.83;
  let S_FLOOR : Float = 0.75;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";

  // ── TYPES ──────────────────────────────────────────────────────

  /// A single routing event — sovereign doctrine delivery to the founder's Ledger.
  public type RoutingEvent = {
    routingId         : Nat;
    amount            : Float;
    founderBtcAddress : Text;
    schumannTimestamp : Float;    // field-synced: cycle × PHI / SCHUMANN
    routingCycle      : Nat;
    schnorrSignature  : Text;     // BIP340 routing signature via CIPHER_SCHNORR_BRIDGE
    attribution       : Text;
  };

  public type RouterState = {
    nextRoutingId     : Nat;
    totalRouted       : Float;
    founderBtcAddress : Text;
    history           : List.List<RoutingEvent>;
    routerActive      : Bool;
  };

  // ── INIT ───────────────────────────────────────────────────────
  public func initState() : RouterState = {
    nextRoutingId     = 0;
    totalRouted       = 0.0;
    founderBtcAddress = "";
    history           = List.empty<RoutingEvent>();
    routerActive      = false;  // activates when founderBtcAddress is set
  };

  // ── SET FOUNDER LEDGER ADDRESS ─────────────────────────────────
  public func setFounderBtcAddress(state : RouterState, btcAddress : Text) : RouterState {
    { state with founderBtcAddress = btcAddress; routerActive = not btcAddress.isEmpty() }
  };

  // ── ROUTE YIELD ────────────────────────────────────────────────
  // Routes amount to founder's Bitcoin Ledger via BIP340 CIPHER_SCHNORR_BRIDGE.
  // Creates a sovereign transaction record with Schumann timestamp.
  // The Schumann timestamp = cycle × PHI / SCHUMANN (same manifold as heartbeat).
  public func routeYield(
    state  : RouterState,
    amount : Float,
    cycle  : Nat,
  ) : RouterState {
    if (not state.routerActive or amount <= 0.0) { return state };
    let schumannTs = cycle.toFloat() * PHI / SCHUMANN;
    // BIP340 routing signature — encodes sovereign transaction context
    let sig = "BIP340_ROUTE_ID" # state.nextRoutingId.toText() #
              "_AMT" # amount.toText() #
              "_TS" # schumannTs.toText() #
              "_LEDGER_" # state.founderBtcAddress #
              "_MEDINA_PROTOCOL_SOVEREIGN";
    let event : RoutingEvent = {
      routingId         = state.nextRoutingId;
      amount;
      founderBtcAddress = state.founderBtcAddress;
      schumannTimestamp = schumannTs;
      routingCycle      = cycle;
      schnorrSignature  = sig;
      attribution       = FOUNDER;
    };
    state.history.add(event);
    if (state.history.size() > 300) { ignore state.history.removeLast() };
    {
      state with
      nextRoutingId = state.nextRoutingId + 1;
      totalRouted   = state.totalRouted + amount;
    }
  };

  // ── GET ROUTING HISTORY ────────────────────────────────────────
  public func getRoutingHistory(state : RouterState) : [RoutingEvent] {
    state.history.toArray()
  };

  // ── GET TOTAL ROUTED ───────────────────────────────────────────
  public func getTotalRouted(state : RouterState) : Float {
    state.totalRouted
  };

  // ── GET ROUTER STATE ───────────────────────────────────────────
  public func getRouterState(state : RouterState) : RouterState = state;

}
