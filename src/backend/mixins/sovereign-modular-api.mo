// mixins/sovereign-modular-api.mo
// Sovereign Modular Architecture — Public API Mixin
// Exposes query endpoints for the 11-pillar modular sovereign mesh.
// Attribution: Alfredo Medina Hernandez — immutable

import SMTypes "../types/sovereignModular";
import SMLib   "../lib/sovereignModular";

mixin (
  sovereignModularState : SMTypes.SovereignModularState,
) {

  // ── SNAPSHOT ──────────────────────────────────────────────────────────
  /// Returns the lightweight dashboard snapshot of the modular architecture.
  public query func getSovereignModularSnapshot() : async SMTypes.ModularSnapshot {
    SMLib.getSnapshot(sovereignModularState)
  };

  // ── METRICS ───────────────────────────────────────────────────────────
  /// Returns computed metrics: density, autonomy index, strongest/weakest pillars.
  public query func getSovereignModularMetrics() : async SMTypes.ModularMetrics {
    SMLib.getMetrics(sovereignModularState)
  };

  // ── FULL STATE ────────────────────────────────────────────────────────
  /// Returns the complete modular state (all pillars, links, interfaces).
  public query func getSovereignModularState() : async SMTypes.SovereignModularState {
    sovereignModularState
  };

  // ── PILLAR BY NAME ────────────────────────────────────────────────────
  /// Look up a single pillar by its human-readable name.
  public query func getSovereignModularPillar(name : Text) : async ?SMTypes.PillarState {
    SMLib.getPillarByName(sovereignModularState, name)
  };

  // ── LINKS ─────────────────────────────────────────────────────────────
  /// Returns the inter-module link topology.
  public query func getSovereignModularLinks() : async [SMTypes.ModuleLink] {
    SMLib.getLinks(sovereignModularState)
  };

  // ── INTERFACES ────────────────────────────────────────────────────────
  /// Returns all module interface definitions (endpoints, events, versions).
  public query func getSovereignModularInterfaces() : async [SMTypes.ModuleInterface] {
    SMLib.getInterfaces(sovereignModularState)
  };

}
