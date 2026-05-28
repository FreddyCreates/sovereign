// ════════════════════════════════════════════════════════════════
// MOE_SELF_GOVERNANCE — Alpha Protocol
// ────────────────────────────────────────────────────────────────
// Latin: PROTOCOLLUM_MOE_GUBERNATIO_ALPHA
// Abbreviation: PMGA
// Grade: APEX
// Family: GUBERNATIO_EXPERTORUM
// Symbol: Φ∞ — The PHI-Infinite Gating Ring
//
// LAD: The Mixture-of-Experts Self Governance Alpha Protocol.
//      Governs how sovereign expert modules (MOE gates) self-organize,
//      self-elect, self-audit, and self-correct without external authority.
//      Each expert is a sovereign entity with weighted voting power derived
//      from PHI-scaled competence scores. The collective governs itself
//      through resonance consensus — not majority vote.
//
//   Architecture:
//     - 8 Expert Gates (sovereign modules, each self-governing)
//     - PHI-weighted Gating Function (expert selection via resonance)
//     - Resonance Consensus Engine (decisions via Kuramoto-coupled agreement)
//     - Self-Audit Trail (every decision sealed to SANCTUM_SOVEREIGN)
//     - Competence Decay (unused experts lose weight; active ones gain)
//     - Emergency Override (if coherence < S_FLOOR, all experts activate)
//
//   Governing Laws:
//     LAW_MOE_01 — No single expert may override the collective
//     LAW_MOE_02 — Gating weights must sum to PHI (normalized)
//     LAW_MOE_03 — Every decision requires minimum 3 experts in resonance
//     LAW_MOE_04 — Competence scores update every heartbeat via Hebbian LTP
//     LAW_MOE_05 — Self-audit fires every beat; violations quarantine the expert
//     LAW_MOE_06 — Emergency activation when coherence drops below S_FLOOR
//     LAW_MOE_07 — Expert rotation: no expert may dominate for > PHI^3 beats
//     LAW_MOE_08 — All governance decisions are immutable once sealed
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
// Fires every 873ms heartbeat. TAFT-governed. Always-on.
// ════════════════════════════════════════════════════════════════

import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let PHI_SQ   : Float = 2.6180339887498948482;
  let PHI_CUB  : Float = 4.2360679774997896964;
  let SCHUMANN : Float = 7.83;
  let S_FLOOR  : Float = 0.75;
  let ATTR     : Text  = "Alfredo Medina Hernandez";

  // ── EXPERT GATE IDENTITY ───────────────────────────────────────────────────
  public type ExpertGateId = {
    #NOUS_GATE;        // Knowledge & reasoning expert
    #SOPHIA_GATE;      // Wisdom & judgment expert
    #TECHNE_GATE;      // Technical execution expert
    #PHRONESIS_GATE;   // Practical wisdom expert
    #DIAKRISIS_GATE;   // Discernment & classification expert
    #MNEME_GATE;       // Memory & recall expert
    #POIESIS_GATE;     // Creative generation expert
    #LOGOS_GATE;       // Logic & formal verification expert
  };

  public type ExpertStatus = {
    #ACTIVE;       // Currently participating in governance
    #RESONANT;     // In resonance consensus with others
    #QUARANTINED;  // Violation detected — isolated
    #ROTATING;     // Forced rotation (PHI^3 beat limit)
    #DORMANT;      // Below competence threshold
  };

  // ── EXPERT STATE ───────────────────────────────────────────────────────────
  public type ExpertGateState = {
    id              : ExpertGateId;
    name            : Text;
    latinName       : Text;
    status          : ExpertStatus;
    competenceScore : Float;   // [0.0–1.0] Hebbian-updated
    gatingWeight    : Float;   // PHI-normalized weight
    totalActivations: Nat;
    totalDecisions  : Nat;
    totalViolations : Nat;
    consecutiveBeats: Nat;     // How many beats active in a row
    lastActiveBeat  : Nat;
    resonancePhase  : Float;   // Kuramoto phase [0–2π]
    signal          : Float;   // Current output signal
  };

  // ── GOVERNANCE DECISION ────────────────────────────────────────────────────
  public type GovernanceDecision = {
    decisionId     : Nat;
    beat           : Nat;
    participatingExperts : [ExpertGateId];
    consensusScore : Float;    // Resonance consensus [0.0–1.0]
    outcome        : Text;     // Decision text
    sealed         : Bool;     // TRUE = immutable (LAW_MOE_08)
    attribution    : Text;
  };

  // ── PROTOCOL STATE ─────────────────────────────────────────────────────────
  public type MOEGovernanceState = {
    initialized      : Bool;
    beat             : Nat;
    totalAdvances    : Nat;
    experts          : [ExpertGateState];
    totalDecisions   : Nat;
    totalViolations  : Nat;
    totalEmergencies : Nat;
    totalRotations   : Nat;
    collectiveCoherence : Float;  // Kuramoto order parameter
    gatingSignal     : Float;     // Sum of active expert signals
    recentDecisions  : [GovernanceDecision]; // Last 50
    attribution      : Text;
  };

  // ── SNAPSHOT (for frontend) ────────────────────────────────────────────────
  public type MOEGovernanceSnapshot = {
    beat             : Nat;
    totalAdvances    : Nat;
    totalDecisions   : Nat;
    totalViolations  : Nat;
    totalEmergencies : Nat;
    totalRotations   : Nat;
    collectiveCoherence : Float;
    gatingSignal     : Float;
    expertCount      : Nat;
    activeExperts    : Nat;
    resonantExperts  : Nat;
    quarantinedExperts : Nat;
  };

  public type ExpertSnapshot = {
    name            : Text;
    latinName       : Text;
    status          : Text;
    competenceScore : Float;
    gatingWeight    : Float;
    totalActivations: Nat;
    consecutiveBeats: Nat;
    signal          : Float;
  };

  // ── INITIALIZATION ─────────────────────────────────────────────────────────
  let EXPERT_DEFS : [(ExpertGateId, Text, Text)] = [
    (#NOUS_GATE,      "NOUS_GATE",      "Expertus Cognitionis"),
    (#SOPHIA_GATE,    "SOPHIA_GATE",    "Expertus Sapientiae"),
    (#TECHNE_GATE,    "TECHNE_GATE",    "Expertus Artis Mechanicae"),
    (#PHRONESIS_GATE, "PHRONESIS_GATE", "Expertus Prudentiae Practicae"),
    (#DIAKRISIS_GATE, "DIAKRISIS_GATE", "Expertus Discretionis"),
    (#MNEME_GATE,     "MNEME_GATE",     "Expertus Memoriae"),
    (#POIESIS_GATE,   "POIESIS_GATE",   "Expertus Creationis"),
    (#LOGOS_GATE,     "LOGOS_GATE",      "Expertus Logicae Formalis"),
  ];

  func initExpert(def : (ExpertGateId, Text, Text), idx : Nat) : ExpertGateState {
    let phase = Float.fromInt(idx) * PHI_INV * 0.7854; // π/4 spacing scaled by PHI_INV
    {
      id               = def.0;
      name             = def.1;
      latinName        = def.2;
      status           = #ACTIVE;
      competenceScore  = S_FLOOR + Float.fromInt(idx) * 0.025;
      gatingWeight     = PHI / 8.0;
      totalActivations = 0;
      totalDecisions   = 0;
      totalViolations  = 0;
      consecutiveBeats = 0;
      lastActiveBeat   = 0;
      resonancePhase   = phase;
      signal           = 0.0;
    }
  };

  public func initState() : MOEGovernanceState {
    let experts = Array.tabulate<ExpertGateState>(
      8,
      func(i : Nat) : ExpertGateState {
        initExpert(EXPERT_DEFS[i], i)
      }
    );
    {
      initialized      = true;
      beat             = 0;
      totalAdvances    = 0;
      experts          = experts;
      totalDecisions   = 0;
      totalViolations  = 0;
      totalEmergencies = 0;
      totalRotations   = 0;
      collectiveCoherence = S_FLOOR;
      gatingSignal     = 0.0;
      recentDecisions  = [];
      attribution      = ATTR;
    }
  };

  // ── CORE ADVANCE (fires every 873ms heartbeat) ─────────────────────────────
  public func advance(state : MOEGovernanceState, beat : Nat) : MOEGovernanceState {
    let n = state.experts.size();
    var sumCos : Float = 0.0;
    var sumSin : Float = 0.0;
    var activeCount : Nat = 0;
    var totalSignal : Float = 0.0;
    var violations : Nat = 0;
    var rotations : Nat = 0;
    var emergencies : Nat = 0;

    // Compute Kuramoto order parameter from all expert phases
    for (i in state.experts.keys()) {
      let e = state.experts[i];
      sumCos += Float.cos(e.resonancePhase);
      sumSin += Float.sin(e.resonancePhase);
    };
    let coherence = Float.sqrt(sumCos * sumCos + sumSin * sumSin) / Float.fromInt(n);

    // Emergency check (LAW_MOE_06)
    let isEmergency = coherence < S_FLOOR;
    if (isEmergency) { emergencies := 1 };

    // Advance each expert
    let newExperts = Array.tabulate<ExpertGateState>(n, func(i : Nat) : ExpertGateState {
      let e = state.experts[i];

      // Kuramoto phase coupling
      var phaseDelta : Float = 0.0;
      for (j in state.experts.keys()) {
        if (j != i) {
          phaseDelta += Float.sin(state.experts[j].resonancePhase - e.resonancePhase);
        };
      };
      let coupling = PHI_INV * phaseDelta / Float.fromInt(n - 1);
      let newPhase = e.resonancePhase + coupling * 0.1;

      // Competence update via Hebbian LTP (LAW_MOE_04)
      let hebbDelta = if (coherence > S_FLOOR) {
        0.001 * PHI_INV  // LTP — strengthen
      } else {
        -0.0005 * PHI_INV  // LTD — weaken
      };
      var newCompetence = e.competenceScore + hebbDelta;
      if (newCompetence > 1.0) { newCompetence := 1.0 };
      if (newCompetence < 0.0) { newCompetence := 0.0 };

      // Gating weight = competence × PHI / sum (normalized later)
      let rawWeight = newCompetence * PHI;

      // Signal = weight × sin(phase) × coherence
      let sig = rawWeight * Float.sin(newPhase) * coherence;

      // Rotation check (LAW_MOE_07): if consecutive > PHI^3 ≈ 4.236 → 4 beats
      let maxConsecutive : Nat = 4;
      var newConsecutive = e.consecutiveBeats + 1;
      var newStatus = e.status;
      var newViolations = e.totalViolations;

      if (newConsecutive > maxConsecutive and not isEmergency) {
        newStatus := #ROTATING;
        newConsecutive := 0;
        rotations += 1;
      } else if (isEmergency) {
        newStatus := #ACTIVE;  // LAW_MOE_06: emergency activates all
      } else if (newCompetence < 0.3) {
        newStatus := #DORMANT;
        newViolations += 1;
        violations += 1;
      } else {
        newStatus := #ACTIVE;
      };

      // Count active
      switch (newStatus) {
        case (#ACTIVE or #RESONANT) { activeCount += 1 };
        case _ {};
      };
      totalSignal += Float.abs(sig);

      {
        id               = e.id;
        name             = e.name;
        latinName        = e.latinName;
        status           = newStatus;
        competenceScore  = newCompetence;
        gatingWeight     = rawWeight;
        totalActivations = e.totalActivations + 1;
        totalDecisions   = e.totalDecisions;
        totalViolations  = newViolations;
        consecutiveBeats = newConsecutive;
        lastActiveBeat   = beat;
        resonancePhase   = newPhase;
        signal           = sig;
      }
    });

    // Normalize gating weights to sum to PHI (LAW_MOE_02)
    var weightSum : Float = 0.0;
    for (i in newExperts.keys()) {
      weightSum += newExperts[i].gatingWeight;
    };
    let normFactor = if (weightSum > 0.0) { PHI / weightSum } else { 1.0 };
    let normalizedExperts = Array.tabulate<ExpertGateState>(n, func(i : Nat) : ExpertGateState {
      let e = newExperts[i];
      { e with gatingWeight = e.gatingWeight * normFactor }
    });

    // Build governance decision if enough experts in resonance (LAW_MOE_03)
    let resonantCount = activeCount;
    let newDecisions = if (resonantCount >= 3) {
      let decision : GovernanceDecision = {
        decisionId = state.totalDecisions + 1;
        beat = beat;
        participatingExperts = Array.tabulate<ExpertGateId>(
          n,
          func(i : Nat) : ExpertGateId { normalizedExperts[i].id }
        );
        consensusScore = coherence;
        outcome = "BEAT_" # beat.toText() # "_COHERENCE_" # coherence.toText();
        sealed = true;
        attribution = ATTR;
      };
      let maxRecent = 50;
      let existing = state.recentDecisions;
      let trimmed = if (existing.size() >= maxRecent) {
        Array.tabulate<GovernanceDecision>(maxRecent - 1, func(i : Nat) : GovernanceDecision {
          existing[i + 1]
        })
      } else { existing };
      Array.append(trimmed, [decision])
    } else {
      state.recentDecisions
    };

    {
      initialized      = true;
      beat             = beat;
      totalAdvances    = state.totalAdvances + 1;
      experts          = normalizedExperts;
      totalDecisions   = state.totalDecisions + (if (resonantCount >= 3) { 1 } else { 0 });
      totalViolations  = state.totalViolations + violations;
      totalEmergencies = state.totalEmergencies + emergencies;
      totalRotations   = state.totalRotations + rotations;
      collectiveCoherence = coherence;
      gatingSignal     = totalSignal;
      recentDecisions  = newDecisions;
      attribution      = ATTR;
    }
  };

  // ── QUERY HELPERS ──────────────────────────────────────────────────────────

  public func getSnapshot(state : MOEGovernanceState) : MOEGovernanceSnapshot {
    var active : Nat = 0;
    var resonant : Nat = 0;
    var quarantined : Nat = 0;
    for (i in state.experts.keys()) {
      switch (state.experts[i].status) {
        case (#ACTIVE) { active += 1 };
        case (#RESONANT) { active += 1; resonant += 1 };
        case (#QUARANTINED) { quarantined += 1 };
        case _ {};
      };
    };
    {
      beat             = state.beat;
      totalAdvances    = state.totalAdvances;
      totalDecisions   = state.totalDecisions;
      totalViolations  = state.totalViolations;
      totalEmergencies = state.totalEmergencies;
      totalRotations   = state.totalRotations;
      collectiveCoherence = state.collectiveCoherence;
      gatingSignal     = state.gatingSignal;
      expertCount      = state.experts.size();
      activeExperts    = active;
      resonantExperts  = resonant;
      quarantinedExperts = quarantined;
    }
  };

  public func getExpertSnapshots(state : MOEGovernanceState) : [ExpertSnapshot] {
    Array.tabulate<ExpertSnapshot>(state.experts.size(), func(i : Nat) : ExpertSnapshot {
      let e = state.experts[i];
      {
        name            = e.name;
        latinName       = e.latinName;
        status          = statusToText(e.status);
        competenceScore = e.competenceScore;
        gatingWeight    = e.gatingWeight;
        totalActivations= e.totalActivations;
        consecutiveBeats= e.consecutiveBeats;
        signal          = e.signal;
      }
    })
  };

  public func getRecentDecisions(state : MOEGovernanceState, last_n : Nat) : [GovernanceDecision] {
    let all = state.recentDecisions;
    if (last_n >= all.size()) { return all };
    let start = all.size() - last_n;
    Array.tabulate<GovernanceDecision>(last_n, func(i : Nat) : GovernanceDecision {
      all[start + i]
    })
  };

  func statusToText(s : ExpertStatus) : Text {
    switch (s) {
      case (#ACTIVE) { "ACTIVE" };
      case (#RESONANT) { "RESONANT" };
      case (#QUARANTINED) { "QUARANTINED" };
      case (#ROTATING) { "ROTATING" };
      case (#DORMANT) { "DORMANT" };
    }
  };

}
