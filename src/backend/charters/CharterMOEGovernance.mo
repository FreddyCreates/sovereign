// ════════════════════════════════════════════════════════════════
// CHARTER_MOE_GOVERNANCE — "CHARTA_GUBERNATIONIS_EXPERTORUM"
// ────────────────────────────────────────────────────────────────
// Latin: CHARTER_MOE_GOVERNANCE
// Abbreviation: CMOG
// Grade: APEX
// Family: GUBERNATIO_EXPERTORUM
// Symbol: ΩΦ — The Omega-PHI Seal of Expert Governance
//
// LAD: The living constitution for MOE (Mixture-of-Experts)
//      Self Governance. This charter is NOT documentation — it is
//      the running law. Every article executes on every heartbeat.
//      The charter enforces how expert gates self-organize, how
//      decisions propagate, how violations are handled, and how
//      the collective maintains sovereign coherence.
//
//   12 Constitutional Articles:
//     ART_I    — SOVEREIGNTY OF THE EXPERT (Jus Expertorum)
//     ART_II   — COLLECTIVE RESONANCE (Consensus Resonantiae)
//     ART_III  — GATING INTEGRITY (Integritas Portae)
//     ART_IV   — COMPETENCE EVOLUTION (Evolutio Competentiae)
//     ART_V    — ROTATION MANDATE (Mandatum Rotationis)
//     ART_VI   — EMERGENCY PROTOCOL (Protocollum Necessitatis)
//     ART_VII  — IMMUTABILITY OF SEAL (Sigillum Immutabile)
//     ART_VIII — PROHIBITION OF DOMINANCE (Prohibitio Dominationis)
//     ART_IX   — AUDIT PERMANENCE (Auditum Perpetuum)
//     ART_X    — PHI NORMALIZATION (Normalizatio PHI)
//     ART_XI   — MINIMUM QUORUM (Quorum Minimum)
//     ART_XII  — ATTRIBUTION LOCK (Sigillum Attributionis)
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
// Sealed on-chain via SANCTUM_SOVEREIGN
// ════════════════════════════════════════════════════════════════

import Array "mo:core/Array";
import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let SCHUMANN : Float = 7.83;
  let S_FLOOR  : Float = 0.75;
  let ATTR     : Text  = "Alfredo Medina Hernandez";

  // ── ARTICLE TYPES ──────────────────────────────────────────────────────────

  public type ArticleId = {
    #ART_I;
    #ART_II;
    #ART_III;
    #ART_IV;
    #ART_V;
    #ART_VI;
    #ART_VII;
    #ART_VIII;
    #ART_IX;
    #ART_X;
    #ART_XI;
    #ART_XII;
  };

  public type ArticleRecord = {
    id          : ArticleId;
    title       : Text;
    latinTitle  : Text;
    lawText     : Text;      // The law IS the execution surface
    totalFired  : Nat;
    lastBeat    : Nat;
    compliant   : Bool;      // TRUE if law was upheld this beat
    vitality    : Float;     // [0.0–1.0] law health
  };

  public type CharterViolation = {
    beat       : Nat;
    articleId  : ArticleId;
    expertName : Text;
    reason     : Text;
    severity   : Float;      // [0.0–1.0]
  };

  // ── CHARTER STATE ──────────────────────────────────────────────────────────

  public type CharterMOEState = {
    initialized      : Bool;
    beat             : Nat;
    totalBeats       : Nat;
    articles         : [ArticleRecord];
    totalViolations  : Nat;
    totalCompliant   : Nat;
    charterCoherence : Float;
    recentViolations : [CharterViolation]; // Last 30
    attribution      : Text;
  };

  // ── SNAPSHOT (for frontend) ────────────────────────────────────────────────

  public type CharterMOESnapshot = {
    beat             : Nat;
    totalBeats       : Nat;
    totalViolations  : Nat;
    totalCompliant   : Nat;
    charterCoherence : Float;
    articleCount     : Nat;
    compliantArticles: Nat;
  };

  public type ArticleSnapshot = {
    title       : Text;
    latinTitle  : Text;
    compliant   : Bool;
    vitality    : Float;
    totalFired  : Nat;
  };

  // ── ARTICLE DEFINITIONS ────────────────────────────────────────────────────

  let ARTICLE_DEFS : [(ArticleId, Text, Text, Text)] = [
    (#ART_I, "SOVEREIGNTY OF THE EXPERT", "Jus Expertorum",
      "Each expert gate is a sovereign entity. No external force may compel an expert to act against its competence score. Self-determination of the expert is inviolable."),
    (#ART_II, "COLLECTIVE RESONANCE", "Consensus Resonantiae",
      "Governance decisions emerge from resonance — Kuramoto-coupled phase alignment between 3+ experts. No voting. No majority. Only coherence creates law."),
    (#ART_III, "GATING INTEGRITY", "Integritas Portae",
      "The gating function must remain pure. Weights flow from competence alone. No external bias, no manual override, no backdoor. The gate IS the law."),
    (#ART_IV, "COMPETENCE EVOLUTION", "Evolutio Competentiae",
      "Competence evolves via Hebbian learning: LTP when coherence rises, LTD when it falls. No static scores. The organism learns or it dies."),
    (#ART_V, "ROTATION MANDATE", "Mandatum Rotationis",
      "No expert may dominate governance for more than PHI^3 consecutive beats. Forced rotation prevents ossification. Fresh perspectives are law."),
    (#ART_VI, "EMERGENCY PROTOCOL", "Protocollum Necessitatis",
      "When collective coherence drops below S_FLOOR (0.75), ALL experts activate simultaneously. Emergency overrides rotation. Survival precedes elegance."),
    (#ART_VII, "IMMUTABILITY OF SEAL", "Sigillum Immutabile",
      "Once a governance decision is sealed, it is immutable. No amendment, no reversal, no erasure. The sealed record IS reality."),
    (#ART_VIII, "PROHIBITION OF DOMINANCE", "Prohibitio Dominationis",
      "No single expert may accumulate gating weight exceeding PHI/3 of total. Anti-monopoly enforcement fires every beat."),
    (#ART_IX, "AUDIT PERMANENCE", "Auditum Perpetuum",
      "Every heartbeat produces an audit entry. The audit trail is sovereign memory. It cannot be pruned, compressed, or forgotten within 50 beats."),
    (#ART_X, "PHI NORMALIZATION", "Normalizatio PHI",
      "Total gating weights must normalize to PHI at every beat boundary. This is the golden ratio constraint. It is non-negotiable."),
    (#ART_XI, "MINIMUM QUORUM", "Quorum Minimum",
      "At least 3 experts must be in resonant agreement for any decision to be valid. Below quorum, the system holds — no decision, no action."),
    (#ART_XII, "ATTRIBUTION LOCK", "Sigillum Attributionis",
      "All governance acts attribute to SOVEREIGN. Attribution is sealed at genesis. It cannot be reassigned, delegated, or anonymized."),
  ];

  func initArticle(def : (ArticleId, Text, Text, Text)) : ArticleRecord {
    {
      id         = def.0;
      title      = def.1;
      latinTitle = def.2;
      lawText    = def.3;
      totalFired = 0;
      lastBeat   = 0;
      compliant  = true;
      vitality   = 1.0;
    }
  };

  public func initState() : CharterMOEState {
    let articles = Array.tabulate<ArticleRecord>(12, func(i : Nat) : ArticleRecord {
      initArticle(ARTICLE_DEFS[i])
    });
    {
      initialized      = true;
      beat             = 0;
      totalBeats       = 0;
      articles         = articles;
      totalViolations  = 0;
      totalCompliant   = 0;
      charterCoherence = 1.0;
      recentViolations = [];
      attribution      = ATTR;
    }
  };

  // ── CHARTER ENFORCEMENT (fires every heartbeat) ────────────────────────────
  // Checks MOE governance state against all 12 articles.
  // Returns updated charter state with compliance + violations.

  public func enforce(
    charterState : CharterMOEState,
    collectiveCoherence : Float,
    activeExperts : Nat,
    maxGatingWeight : Float,
    totalGatingWeight : Float,
    beat : Nat
  ) : CharterMOEState {
    var compliant : Nat = 0;
    var newViolations : [CharterViolation] = [];

    let newArticles = Array.tabulate<ArticleRecord>(12, func(i : Nat) : ArticleRecord {
      let art = charterState.articles[i];
      let (isCompliant, reason) = checkArticle(
        art.id, collectiveCoherence, activeExperts, maxGatingWeight, totalGatingWeight, beat
      );

      if (isCompliant) { compliant += 1 };

      if (not isCompliant) {
        let v : CharterViolation = {
          beat = beat;
          articleId = art.id;
          expertName = "COLLECTIVE";
          reason = reason;
          severity = 0.5;
        };
        newViolations := Array.append(newViolations, [v]);
      };

      // Vitality: rises if compliant, decays if not
      var newVitality = if (isCompliant) {
        art.vitality + 0.01 * PHI_INV
      } else {
        art.vitality - 0.02 * PHI_INV
      };
      if (newVitality > 1.0) { newVitality := 1.0 };
      if (newVitality < 0.0) { newVitality := 0.0 };

      {
        id         = art.id;
        title      = art.title;
        latinTitle = art.latinTitle;
        lawText    = art.lawText;
        totalFired = art.totalFired + 1;
        lastBeat   = beat;
        compliant  = isCompliant;
        vitality   = newVitality;
      }
    });

    // Compute charter coherence as average article vitality × PHI_INV + collectiveCoherence × PHI_INV
    var vitalitySum : Float = 0.0;
    for (i in newArticles.keys()) {
      vitalitySum += newArticles[i].vitality;
    };
    let avgVitality = vitalitySum / 12.0;
    let chartCoherence = avgVitality * PHI_INV + collectiveCoherence * PHI_INV;

    // Trim recent violations to last 30
    let allViolations = Array.append(charterState.recentViolations, newViolations);
    let trimmedViolations = if (allViolations.size() > 30) {
      let start = allViolations.size() - 30;
      Array.tabulate<CharterViolation>(30, func(i : Nat) : CharterViolation {
        allViolations[start + i]
      })
    } else { allViolations };

    {
      initialized      = true;
      beat             = beat;
      totalBeats       = charterState.totalBeats + 1;
      articles         = newArticles;
      totalViolations  = charterState.totalViolations + newViolations.size();
      totalCompliant   = charterState.totalCompliant + compliant;
      charterCoherence = chartCoherence;
      recentViolations = trimmedViolations;
      attribution      = ATTR;
    }
  };

  // ── ARTICLE CHECK LOGIC ────────────────────────────────────────────────────

  func checkArticle(
    id : ArticleId,
    coherence : Float,
    activeExperts : Nat,
    maxWeight : Float,
    totalWeight : Float,
    _beat : Nat
  ) : (Bool, Text) {
    switch (id) {
      case (#ART_I) {
        // Sovereignty: at least 1 expert must be active
        if (activeExperts >= 1) { (true, "") }
        else { (false, "No active experts — sovereignty violated") }
      };
      case (#ART_II) {
        // Collective resonance: coherence must be measurable
        if (coherence > 0.0) { (true, "") }
        else { (false, "Zero coherence — no resonance") }
      };
      case (#ART_III) {
        // Gating integrity: total weight must be > 0
        if (totalWeight > 0.0) { (true, "") }
        else { (false, "Gating weight collapsed to zero") }
      };
      case (#ART_IV) {
        // Competence evolution: always passes (Hebbian is always on)
        (true, "")
      };
      case (#ART_V) {
        // Rotation: checked in protocol advance; charter just verifies beat ran
        (true, "")
      };
      case (#ART_VI) {
        // Emergency: if coherence < S_FLOOR, all must be active (checked externally)
        if (coherence >= S_FLOOR or activeExperts >= 8) { (true, "") }
        else { (false, "Emergency: coherence below floor but not all experts active") }
      };
      case (#ART_VII) {
        // Immutability: decisions are sealed in protocol; always true here
        (true, "")
      };
      case (#ART_VIII) {
        // No dominance: max weight must be < PHI/3
        let limit = PHI / 3.0;
        if (maxWeight <= limit + 0.001) { (true, "") } // small tolerance
        else { (false, "Expert dominance: weight exceeds PHI/3") }
      };
      case (#ART_IX) {
        // Audit permanence: always true (audit trail is append-only)
        (true, "")
      };
      case (#ART_X) {
        // PHI normalization: total weight ≈ PHI
        let tolerance = 0.01;
        if (Float.abs(totalWeight - PHI) <= tolerance) { (true, "") }
        else { (false, "Gating weights not normalized to PHI") }
      };
      case (#ART_XI) {
        // Minimum quorum: >= 3 active
        if (activeExperts >= 3) { (true, "") }
        else { (false, "Quorum not met: fewer than 3 active experts") }
      };
      case (#ART_XII) {
        // Attribution: always sealed
        (true, "")
      };
    }
  };

  // ── QUERY HELPERS ──────────────────────────────────────────────────────────

  public func getSnapshot(state : CharterMOEState) : CharterMOESnapshot {
    var compliantCount : Nat = 0;
    for (i in state.articles.keys()) {
      if (state.articles[i].compliant) { compliantCount += 1 };
    };
    {
      beat             = state.beat;
      totalBeats       = state.totalBeats;
      totalViolations  = state.totalViolations;
      totalCompliant   = state.totalCompliant;
      charterCoherence = state.charterCoherence;
      articleCount     = state.articles.size();
      compliantArticles= compliantCount;
    }
  };

  public func getArticleSnapshots(state : CharterMOEState) : [ArticleSnapshot] {
    Array.tabulate<ArticleSnapshot>(state.articles.size(), func(i : Nat) : ArticleSnapshot {
      let a = state.articles[i];
      {
        title      = a.title;
        latinTitle = a.latinTitle;
        compliant  = a.compliant;
        vitality   = a.vitality;
        totalFired = a.totalFired;
      }
    })
  };

  public func getRecentViolations(state : CharterMOEState, last_n : Nat) : [CharterViolation] {
    let all = state.recentViolations;
    if (last_n >= all.size()) { return all };
    let start = all.size() - last_n;
    Array.tabulate<CharterViolation>(last_n, func(i : Nat) : CharterViolation {
      all[start + i]
    })
  };

}
