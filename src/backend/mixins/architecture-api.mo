// Architecture API Mixin — public canister query endpoints for the architecture domain
// Authored by Alfredo Medina Hernandez — immutable attribution
// Injects state slices from main.mo; only queries here (updates live in main.mo).

import Types "../types/architecture";
import ArchLib "../lib/architecture";
import Array "mo:core/Array";

mixin (
  sovereignCores  : [var Types.SovereignCore],
  velaRing        : Types.VELARingState,
  jubilee         : Types.JubileeState,
  creatorPresence : Types.CreatorPresence,
  sevenSpirits    : Types.SevenSpiritsState,
  succession      : Types.SuccessionState,
) {

  // ── QUERIES ────────────────────────────────────────────────────────────

  /// Returns the full architecture state snapshot: scores, rings, and all substates.
  public query func getArchitectureState() : async Types.ArchitectureState {
    ArchLib.assembleState(
      Array.tabulate(43, func(i) { sovereignCores[i] }),
      velaRing,
      jubilee,
      creatorPresence,
      sevenSpirits,
      succession,
    )
  };

  /// Returns all 43 SovereignCores with their current sphere state.
  public query func getCores() : async [Types.SovereignCore] {
    Array.tabulate(43, func(i) { sovereignCores[i] })
  };

  /// Returns a single SovereignCore by id, or null if out of range.
  public query func getCoreById(id : Nat) : async ?Types.SovereignCore {
    if (id >= 43) { null } else { ?sovereignCores[id] }
  };

  /// Returns the current CreatorPresence record.
  public query func getCreatorPresence() : async Types.CreatorPresence {
    creatorPresence
  };

  /// Returns the ProphetDirective for the current VELA ring step.
  public query func getProphetDirective() : async Types.ProphetDirective {
    ArchLib.getProphetDirective(velaRing.step)
  };

  // ── FIELD MONITOR & READINESS GATE ────────────────────────────────────

  /// Frontend reports its current field state; backend computes field coherence
  /// and seals a #FieldCoherenceComputed DecisionRecord.
  /// Returns the coherence score [0.0, 1.0].
  public query func reportFieldState(report : Types.FieldReport) : async Float {
    let state = {
      velaStep      = velaRing.step;
      omnisWeight   = report.omnisWeight;   // use report's OMNIS as cross-check
      doctrineScore = report.doctrineScore;
    };
    ArchLib.computeFieldCoherence(report, state)
  };

  /// Returns the full readiness gate result for the given field report.
  /// Hard blocks if fieldCoherence < 0.3.
  public query func getReadinessGate(fieldReport : Types.FieldReport) : async Types.ReadinessGateResult {
    let state = {
      velaStep      = velaRing.step;
      omnisWeight   = fieldReport.omnisWeight;
      doctrineScore = fieldReport.doctrineScore;
    };
    let coherence = ArchLib.computeFieldCoherence(fieldReport, state);
    ArchLib.computeReadinessGate(
      velaRing.step,
      fieldReport.doctrineScore,
      fieldReport.omnisWeight,
      coherence,
    )
  };

  // ── WORLD MODEL ────────────────────────────────────────────────────────
  // Live cognition state snapshot — the organism's current world-model.
  // Frontend reads this to stay coupled to the live organism reasoning state.
  // Reinjected into every module on the next heartbeat beat.

  /// Returns the current live WorldModel — the organism's complete field state.
  /// Frontend calls this to read what the organism knows right now:
  /// VELA position, OMNIS consensus, doctrine score, field coherence,
  /// three-architecture scores, and all 9 animal engine strengths.
  /// Attribution: Alfredo Medina Hernandez — always present.
  public query func getWorldModel() : async Types.WorldModel {
    let coresSnap = Array.tabulate(43, func(i) { sovereignCores[i] });
    let expansiveScore  = ArchLib.computeExpansiveScore(coresSnap);
    let receptiveScore  = ArchLib.computeReceptiveScore(coresSnap);
    let antiDriftBal    = ArchLib.computeAntiDriftBalance(coresSnap);

    // Field coherence computed from live architecture scores
    let rawDiv = if (expansiveScore > receptiveScore) {
      expansiveScore - receptiveScore
    } else {
      receptiveScore - expansiveScore
    };
    let fieldCoherence = 1.0 - (if (rawDiv > 1.0) { 1.0 } else { rawDiv });

    // Animal engine strengths: read from core sphere coherences as a proxy
    // (9 values — one per animal engine mapped to first 9 cores)
    let animalEngineStates = Array.tabulate(9, func(i) {
      if (i < 43) { sovereignCores[i].sphere.coherence / 100.0 } else { 0.5 }
    });

    {
      velaStep           = velaRing.step;
      omnisWeight        = antiDriftBal;   // anti-drift balance proxies OMNIS coupling
      doctrineScore      = expansiveScore * 0.5 + receptiveScore * 0.5;
      fieldCoherence     = fieldCoherence;
      expansiveScore     = expansiveScore;
      receptiveScore     = receptiveScore;
      antiDriftBalance   = antiDriftBal;
      animalEngineStates = animalEngineStates;
      trendSignalCount   = 0;   // frontend enriches via social-api
      lastHeartbeatBlock = jubilee.beatsSinceJubilee;
      attribution        = "Alfredo Medina Hernandez";
    }
  };

};
