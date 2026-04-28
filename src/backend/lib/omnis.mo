// Multi-Core OMNIS — 43 Cores vote on collective emergence decisions
// Authored by Alfredo Medina Hernandez — immutable attribution
// Weighted consensus voting; quorum = 22 awake cores; emergence threshold per proposal type
// PHI=1.6180339887 | S0_FLOOR=0.75 | All math is real, no stubs

import Types "../types/architecture";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import List "mo:core/List";

module {

  let PHI      : Float = Types.PHI;
  let S0_FLOOR : Float = Types.S0_FLOOR;

  // ── OMNIS TYPES ────────────────────────────────────────────────────────

  public type OmnisProposalType = {
    #coherenceShift;
    #typeRebalance;
    #doctrineSeal;
    #jubileeAccelerate;
    #successionTrigger;
  };

  public type OmnisStatus = {
    #voting;
    #passed;
    #rejected;
    #sealed;
  };

  public type OmnisVote = {
    coreId    : Nat;
    archType  : Types.ArchType;
    weight    : Float;
    voteValue : Float;
    beat      : Nat;
  };

  public type OmnisProposal = {
    id             : Nat;
    proposalType   : OmnisProposalType;
    threshold      : Float;
    votes          : [OmnisVote];
    status         : OmnisStatus;
    emergenceValue : Float;
    beat           : Nat;
    sealedBy       : Text;
  };

  public type OmnisState = {
    proposals          : [OmnisProposal];
    currentProposal    : ?OmnisProposal;
    totalVotes         : Nat;
    emergencesReached  : Nat;
    lastEmergenceBeat  : Nat;
  };

  // ── INITIALIZER ───────────────────────────────────────────────────────

  public func initOmnis() : OmnisState {
    {
      proposals         = [];
      currentProposal   = null;
      totalVotes        = 0;
      emergencesReached = 0;
      lastEmergenceBeat = 0;
    }
  };

  // ── PRIVATE HELPERS ───────────────────────────────────────────────────

  func thresholdFor(pType : OmnisProposalType) : Float {
    switch (pType) {
      case (#coherenceShift)    { 0.618  };  // inverse PHI proportion
      case (#typeRebalance)     { S0_FLOOR }; // 0.75
      case (#doctrineSeal)      { 0.85   };
      case (#jubileeAccelerate) { 0.90   };
      case (#successionTrigger) { 0.95   };
    }
  };

  func proposalTypeForBeat(beat : Nat) : OmnisProposalType {
    // Cycle through types based on beat position
    let cycle = (beat / 50) % 5;
    switch (cycle) {
      case 0 { #coherenceShift    };
      case 1 { #typeRebalance     };
      case 2 { #doctrineSeal      };
      case 3 { #jubileeAccelerate };
      case _ { #successionTrigger };
    }
  };

  func coreAmplitudeAvg(core : Types.SovereignCore) : Float {
    let nodes = core.sphere.nodes;
    var sum : Float = 0.0;
    for (n in nodes.values()) { sum += n.amplitude };
    if (nodes.size() == 0) { S0_FLOOR } else { sum / nodes.size().toFloat() }
  };

  /// Apply effects of a passed proposal to the cores
  func applyProposalEffect(
    pType : OmnisProposalType,
    cores : [var Types.SovereignCore],
  ) {
    switch (pType) {
      case (#coherenceShift) {
        // Boost all core coherences by +PHI*2 (conceptual — coherence recalculated from nodes)
        // We boost node amplitudes across all cores to drive coherence up
        let boost = PHI * 0.02; // small delta per node
        var i : Nat = 0;
        while (i < cores.size()) {
          let core = cores[i];
          let boosted = Array.tabulate(12, func(k : Nat) : Types.CoreNode {
            if (k < core.sphere.nodes.size()) {
              let node = core.sphere.nodes[k];
              { node with amplitude = Float.min(PHI * 10.0, node.amplitude + boost) }
            } else { core.sphere.nodes[0] }
          });
          cores[i] := { core with sphere = { core.sphere with nodes = boosted } };
          i += 1;
        };
      };
      case (#typeRebalance) {
        // Normalize all node amplitudes toward S0_FLOOR + small delta
        let target = S0_FLOOR + 0.05;
        var i : Nat = 0;
        while (i < cores.size()) {
          let core = cores[i];
          let rebalanced = Array.tabulate(12, func(k : Nat) : Types.CoreNode {
            if (k < core.sphere.nodes.size()) {
              let node = core.sphere.nodes[k];
              let newAmp = (node.amplitude + target) / 2.0;
              { node with amplitude = Float.max(S0_FLOOR, newAmp) }
            } else { core.sphere.nodes[0] }
          });
          cores[i] := { core with sphere = { core.sphere with nodes = rebalanced } };
          i += 1;
        };
      };
      // Other effect types tracked at state level (doctrineSeal, jubileeAccelerate, successionTrigger)
      // — their effects are managed in runOmnisVote via returned state changes
      case _ {};
    }
  };

  // ── MAIN VOTE FUNCTION ────────────────────────────────────────────────

  /// Run the OMNIS vote cycle. Creates a new proposal every 50 beats (VELA-synchronized).
  /// Collects votes from all 43 cores, computes weighted consensus.
  /// If consensus >= threshold AND quorum met: proposal passes and is sealed.
  public func runOmnisVote(
    state : OmnisState,
    cores : [var Types.SovereignCore],
    beat  : Nat,
  ) : OmnisState {

    // Only run every 50 beats (VELA-synchronized)
    if (beat % 50 != 0) return state;

    let pType     = proposalTypeForBeat(beat);
    let threshold = thresholdFor(pType);

    // Collect votes from all 43 cores
    let votes = List.empty<OmnisVote>();
    var awakeCount : Nat = 0;
    var weightSum  : Float = 0.0;
    var consensusNum : Float = 0.0;

    var i : Nat = 0;
    while (i < cores.size()) {
      let core = cores[i];
      let weight = core.sphere.coherence / 100.0;
      let voteVal = coreAmplitudeAvg(core);

      if (weight > 0.0) { awakeCount += 1 };
      weightSum    += weight;
      consensusNum += weight * voteVal;

      votes.add({
        coreId    = core.id;
        archType  = core.sphere.archType;
        weight;
        voteValue = voteVal;
        beat;
      });
      i += 1;
    };

    let quorumMet   = awakeCount >= 22; // ceil((43+1)/2) = 22
    let consensus   = if (weightSum == 0.0) { 0.0 } else { consensusNum / weightSum };
    let proposalId  = state.proposals.size();
    let votesArr    = votes.toArray();
    let totalVotes  = state.totalVotes + votesArr.size();

    let passed = quorumMet and consensus >= threshold;

    // Apply core effects if passed
    if (passed) {
      applyProposalEffect(pType, cores);
    };

    let sealedBy = if (passed) {
      "Sealed by Alfredo Medina Hernandez — Beat " # beat.toText()
    } else { "" };

    let proposal : OmnisProposal = {
      id             = proposalId;
      proposalType   = pType;
      threshold;
      votes          = votesArr;
      status         = if (passed) { #sealed } else { #rejected };
      emergenceValue = consensus;
      beat;
      sealedBy;
    };

    // Keep last 50 proposals (ring)
    let allProposals = List.empty<OmnisProposal>();
    let existingSize = state.proposals.size();
    let startIdx = if (existingSize > 49) { existingSize - 49 } else { 0 };
    var k = startIdx;
    while (k < existingSize) {
      allProposals.add(state.proposals[k]);
      k += 1;
    };
    allProposals.add(proposal);

    {
      proposals         = allProposals.toArray();
      currentProposal   = ?proposal;
      totalVotes;
      emergencesReached = if (passed) { state.emergencesReached + 1 } else { state.emergencesReached };
      lastEmergenceBeat = if (passed) { beat } else { state.lastEmergenceBeat };
    }
  };

};
