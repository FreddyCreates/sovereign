// ════════════════════════════════════════════════════════════════════════════════
// CHARTER_GOVERNANCE_PROTOCOL — The Sovereign Governance Macro
// ────────────────────────────────────────────────────────────────────────────────
//
// THE CHARTER: A living constitutional protocol governing how the Sovereign
// system operates across TIME, USERS, POLICIES, ETHICS, and all surfaces.
//
// This is the macro governance framework — the supreme operational law that
// every subsystem, module, agent, and entity must obey.
//
// ═══════════════════════════════════════════════════════════════════════════════
//
// ARCHITECTURE:
//
//   ┌─────────────────────────────────────────────────────────────────────┐
//   │                    SUPREMA LEX (Supreme Law)                        │
//   │     PHI immutable │ Attribution eternal │ 873ms heartbeat           │
//   ├─────────────────────────────────────────────────────────────────────┤
//   │              CHARTA CONSTITUENS (Constitution)                      │
//   │     Eternity clauses │ Fundamental rights │ Separation of powers   │
//   ├─────────────────────────────────────────────────────────────────────┤
//   │              ORGANIC LAW (Governance Protocols)                     │
//   │     Temporal │ User │ Policy │ Ethics │ Consensus │ Audit          │
//   ├─────────────────────────────────────────────────────────────────────┤
//   │              STATUTORY LAW (Policy Layer)                           │
//   │     Runtime policies │ Enforcement │ Metrics                       │
//   ├─────────────────────────────────────────────────────────────────────┤
//   │              REGULATORY LAW (Operational Rules)                     │
//   │     Rate limits │ Thresholds │ Quotas                              │
//   └─────────────────────────────────────────────────────────────────────┘
//
// DOMAINS (7):
//   1. TEMPORIS    — Time governance, epochs, cycles, heartbeat law
//   2. CIVIUM      — User governance, identity, consent, rights
//   3. POLITICAE   — Policy lifecycle, versioning, propagation
//   4. ETHICAE     — Ethical constraints, harm prevention, fairness
//   5. CONSENSUS   — Voting, quorum, dispute resolution
//   6. AUDITIO     — Accountability, transparency, audit trails
//   7. FOEDERATIO  — Federation, cross-system, mesh governance
//
// CHARTER ARTICLES: 35 articles across 7 domains (5 per domain)
// Fires every heartbeat (873ms). PHI-weighted scoring. Compounding doctrine.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 2026
// ════════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Array "mo:core/Array";
import Text  "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  let PHI     : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let S_FLOOR : Float = 0.75;
  let S_CEIL  : Float = 9.75;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";

  // ── GOVERNANCE DOMAIN ENUMERATION ──────────────────────────────────────────

  public type GovernanceDomain = {
    #TEMPORIS;       // Time governance
    #CIVIUM;         // User/citizen governance
    #POLITICAE;      // Policy governance
    #ETHICAE;        // Ethics governance
    #CONSENSUS;      // Consensus mechanisms
    #AUDITIO;        // Audit & accountability
    #FOEDERATIO;     // Federation governance
  };

  // ── LAW HIERARCHY ──────────────────────────────────────────────────────────

  public type LawTier = {
    #SUPREMA;        // Supreme law — immutable (PHI, attribution, heartbeat)
    #CONSTITUTIO;    // Constitutional — changeable only by supermajority + cooling
    #ORGANICA;       // Organic law — governance protocol layer
    #STATUTARIA;     // Statutory — runtime policies
    #REGULATORIA;    // Regulatory — operational rules
  };

  // ── ARTICLE STATUS ─────────────────────────────────────────────────────────

  public type ArticleStatus = {
    #ACTIVE;         // Currently enforced
    #SUSPENDED;      // Temporarily suspended (emergency only)
    #AMENDED;        // Modified — previous version archived
    #SEALED;         // Permanently sealed — eternity clause
  };

  // ── CHARTER ARTICLE ────────────────────────────────────────────────────────

  public type CharterArticle = {
    articleId       : Nat;          // 1-35
    latinTitle      : Text;         // Latin article name
    domain          : GovernanceDomain;
    tier            : LawTier;
    lawText         : Text;         // The law = the execution doctrine
    enforcementRule : Text;         // How this article is enforced
    status          : ArticleStatus;
    complianceScore : Float;        // 0.0–1.0 — how well the system complies
    lastEnforced    : Nat;          // Last beat this article was checked
    totalEnforcements : Nat;
    totalViolations : Nat;
    isEternityClause : Bool;        // If true — can never be amended or removed
    attribution     : Text;
  };

  // ── GOVERNANCE EVENT ───────────────────────────────────────────────────────

  public type GovernanceEvent = {
    eventId    : Nat;
    eventType  : Text;      // "ENFORCEMENT", "VIOLATION", "AMENDMENT", "SEAL"
    articleId  : Nat;
    beat       : Nat;
    payload    : Text;      // Description of what happened
    severity   : Nat;       // 1-5 (1=info, 5=critical)
    resolved   : Bool;
  };

  // ── GOVERNANCE METRICS ─────────────────────────────────────────────────────

  public type GovernanceMetrics = {
    totalArticles         : Nat;
    activeArticles        : Nat;
    sealedArticles        : Nat;
    avgComplianceScore    : Float;  // 0.0–1.0
    totalEnforcements     : Nat;
    totalViolations       : Nat;
    violationRate         : Float;  // violations / enforcements
    governanceHealthScore : Float;  // PHI-weighted composite
    domainsActive         : Nat;    // How many of 7 domains have score > S_FLOOR
  };

  // ── CHARTER STATE ──────────────────────────────────────────────────────────

  public type CharterGovernanceState = {
    articles       : [CharterArticle];
    events         : [GovernanceEvent];  // Ring buffer, last 200
    metrics        : GovernanceMetrics;
    beat           : Nat;
    totalBeats     : Nat;
    epoch          : Nat;                // beat / 10000
    charterSealed  : Bool;               // True once ratified
    ratificationScore : Float;           // Must reach 0.9 for seal
    attribution    : Text;
  };

  // ── 35 CHARTER ARTICLE DEFINITIONS ─────────────────────────────────────────

  let ARTICLE_DEFS : [(Nat, Text, GovernanceDomain, LawTier, Text, Text, Bool)] = [
    // ── TEMPORIS (Articles 1-5) — Time Governance ────────────────────────────
    (1, "Lex Temporis Perpetui",
      #TEMPORIS, #SUPREMA,
      "The 873ms heartbeat is the supreme temporal law. No governance action may skip, alter, or override the heartbeat cycle. All decisions synchronize to beat precision.",
      "Verified every beat: heartbeat fires within tolerance. Violation = critical alert.",
      true),  // eternity clause

    (2, "Lex Epochae Transitionis",
      #TEMPORIS, #ORGANICA,
      "Epochs transition every 10000 beats. Epoch boundaries trigger governance review, audit seal, and metrics reset. No state loss permitted during transition.",
      "Epoch boundary check: state hash before = state hash after (modulo new epoch fields).",
      false),

    (3, "Lex Chronologiae Immutabilis",
      #TEMPORIS, #CONSTITUTIO,
      "All governance events carry immutable monotonic timestamps. Past events cannot be re-timestamped. The temporal record is the truth.",
      "Timestamp ordering verified: each event.beat >= previous event.beat.",
      true),  // eternity clause

    (4, "Lex Temporis Gracilis",
      #TEMPORIS, #STATUTARIA,
      "Grace periods defined for all time-sensitive governance actions. Minimum cooling: 100 beats for policy, 1000 beats for constitutional change.",
      "Cooling period enforced before activation of any governance change.",
      false),

    (5, "Lex Temporis Archivii",
      #TEMPORIS, #REGULATORIA,
      "Governance archives retain full history for minimum 100000 beats. Compression permitted but information loss prohibited.",
      "Archive depth check: queryable governance history >= 100000 beats.",
      false),

    // ── CIVIUM (Articles 6-10) — User Governance ─────────────────────────────
    (6, "Lex Civium Dignitatis",
      #CIVIUM, #SUPREMA,
      "Human dignity is inviolable in all governance actions. No automated decision may diminish, demean, or harm any user. This is supreme and eternal.",
      "Dignity score computed per governance output. Score < 1.0 = violation.",
      true),  // eternity clause

    (7, "Lex Civium Identitatis",
      #CIVIUM, #CONSTITUTIO,
      "User identity sovereignty: each user owns their identity data. No identity action without verified consent. Pseudonymity permitted.",
      "Consent log verified: every identity action has corresponding consent record.",
      false),

    (8, "Lex Civium Aequitatis",
      #CIVIUM, #ORGANICA,
      "Equal governance weight per verified user. No wealth-weighted voting. No plutocratic override. One verified user = one governance voice.",
      "Governance weight distribution check: Gini coefficient < 0.1.",
      false),

    (9, "Lex Civium Exitus",
      #CIVIUM, #STATUTARIA,
      "Right of exit: any user may leave with full data portability. Exit must complete within 100 beats. No lock-in, no penalty, no data hostage.",
      "Exit pathway test: simulated exit completes with full data within 100 beats.",
      false),

    (10, "Lex Civium Appellationis",
      #CIVIUM, #REGULATORIA,
      "Every automated governance decision appealable by affected user. Appeal reviewed within 50 beats. No decision final without appeal window.",
      "Appeal mechanism check: appeal endpoint exists, response within 50 beats.",
      false),

    // ── POLITICAE (Articles 11-15) — Policy Governance ───────────────────────
    (11, "Lex Politicae Hierarchiae",
      #POLITICAE, #CONSTITUTIO,
      "Policy hierarchy: Supreme > Constitutional > Organic > Statutory > Regulatory. No lower policy may contradict higher. Conflicts resolved upward.",
      "Hierarchy check: no active policy contradicts any higher-tier law.",
      true),  // eternity clause

    (12, "Lex Politicae Versionis",
      #POLITICAE, #ORGANICA,
      "All policies version-controlled with immutable change history. Every version carries author, timestamp, rationale, and diff from previous.",
      "Version integrity check: all active policies have complete version chains.",
      false),

    (13, "Lex Politicae Propagationis",
      #POLITICAE, #STATUTARIA,
      "Policy changes propagate to all affected nodes within 10 beats. Propagation verified by acknowledgment protocol. No silent failures.",
      "Propagation test: policy change reaches all nodes within 10 beats.",
      false),

    (14, "Lex Politicae Simulationis",
      #POLITICAE, #REGULATORIA,
      "Before enactment, every policy simulatable in sandbox. Impact assessment required. No policy deployed without predicted outcome analysis.",
      "Simulation gate: policy has associated impact assessment before activation.",
      false),

    (15, "Lex Politicae Non Retroactivitatis",
      #POLITICAE, #CONSTITUTIO,
      "No retroactive policy application. Policies apply only from activation beat forward. Past actions judged by law active at time of action.",
      "Retroactivity check: no policy enforcement references beats before policy activation.",
      true),  // eternity clause

    // ── ETHICAE (Articles 16-20) — Ethics Governance ─────────────────────────
    (16, "Lex Ethicae Non Nocendi",
      #ETHICAE, #SUPREMA,
      "First principle: do no harm. No governance action, automated or manual, may cause measurable harm to any user. Harm = any reduction in user wellbeing, autonomy, or dignity.",
      "Harm assessment per governance output. Any harm score > 0 = immediate halt and review.",
      true),  // eternity clause

    (17, "Lex Ethicae Transparentiae",
      #ETHICAE, #CONSTITUTIO,
      "Algorithmic transparency: every governance decision explainable to affected parties. No black-box governance. Explanation within 5 beats of request.",
      "Explainability check: decision trace available for every governance output.",
      false),

    (18, "Lex Ethicae Aequitatis Distributivae",
      #ETHICAE, #ORGANICA,
      "Distributive justice: governance outcomes equitable across all user groups. No systematic bias. Equity index monitored every epoch.",
      "Equity index computation per epoch. Index < 0.8 triggers bias investigation.",
      false),

    (19, "Lex Ethicae Autonomiae",
      #ETHICAE, #STATUTARIA,
      "User autonomy preserved: no governance action may override user agency without explicit informed consent and clear justification.",
      "Autonomy check: no user action overridden without consent record.",
      false),

    (20, "Lex Ethicae Precautionis",
      #ETHICAE, #REGULATORIA,
      "Precautionary principle: under uncertainty, governance defaults to least harmful option. Burden of proof on action, not inaction.",
      "Precaution gate: uncertain-outcome decisions default to minimal intervention.",
      false),

    // ── CONSENSUS (Articles 21-25) — Consensus Mechanisms ────────────────────
    (21, "Lex Consensus Quorum",
      #CONSENSUS, #CONSTITUTIO,
      "No governance vote valid without minimum quorum. Constitutional changes: 75% quorum. Organic: 50% quorum. Statutory: 33% quorum. Regulatory: 25%.",
      "Quorum verification before vote finalization at appropriate tier threshold.",
      false),

    (22, "Lex Consensus Deliberationis",
      #CONSENSUS, #ORGANICA,
      "Mandatory deliberation period before any vote. Constitutional: 1000 beats. Organic: 500 beats. Statutory: 100 beats. No snap votes.",
      "Deliberation timer check: vote not finalized before minimum deliberation elapsed.",
      false),

    (23, "Lex Consensus Integritatis",
      #CONSENSUS, #SUPREMA,
      "Vote integrity absolute: no double-voting, no manipulation, no coercion, no retroactive vote change after close. Verified by cryptographic proof.",
      "Vote integrity proof: sovereign hash applied to each vote tally.",
      true),  // eternity clause

    (24, "Lex Consensus Liquidam",
      #CONSENSUS, #STATUTARIA,
      "Liquid democracy available: votes delegatable and instantly revocable. Delegation chains transparent. Circular delegation prevented.",
      "Delegation graph check: no cycles, delegation revocation within 1 beat.",
      false),

    (25, "Lex Consensus Executionis",
      #CONSENSUS, #REGULATORIA,
      "Consensus outcomes auto-executed within 1 beat of finalization. No manual intervention required. Execution proof recorded.",
      "Execution latency check: consensus outcome → enforcement within 1 beat.",
      false),

    // ── AUDITIO (Articles 26-30) — Audit & Accountability ───────────────────
    (26, "Lex Auditii Completae",
      #AUDITIO, #CONSTITUTIO,
      "Complete audit trail: every governance action, decision, vote, and enforcement produces immutable audit record with full context.",
      "Audit completeness check: governance actions without audit record = violation.",
      true),  // eternity clause

    (27, "Lex Auditii Immutabilitatis",
      #AUDITIO, #SUPREMA,
      "Audit immutability: once written, audit records cannot be altered, deleted, or redacted. The audit IS the truth. Protected by sovereign hash.",
      "Hash chain verification: audit entries form unbroken sovereign hash chain.",
      true),  // eternity clause

    (28, "Lex Auditii Accessibilitatis",
      #AUDITIO, #ORGANICA,
      "Audit accessibility: authorized auditors access any record at any time. Users access own governance records. Public summary every epoch.",
      "Access test: audit query responds within 3 beats for authorized requestor.",
      false),

    (29, "Lex Auditii Responsabilitatis",
      #AUDITIO, #STATUTARIA,
      "Accountability chain: every governance outcome traceable to responsible entities. No orphan decisions. No untraceable enforcement.",
      "Responsibility trace: every governance output has assigned accountable entity.",
      false),

    (30, "Lex Auditii Metricae",
      #AUDITIO, #REGULATORIA,
      "Governance metrics computed every beat: compliance score, violation rate, health score. Metrics publicly available. Degradation triggers alert.",
      "Metrics computation check: all governance metrics current within 1 beat.",
      false),

    // ── FOEDERATIO (Articles 31-35) — Federation Governance ──────────────────
    (31, "Lex Foederationis Compacti",
      #FOEDERATIO, #CONSTITUTIO,
      "Federation compact: all member systems agree to mutual governance recognition, data sovereignty, and common arbitration. Compact sealed with multi-sig.",
      "Compact validation: all member signatures verified, terms consistent.",
      false),

    (32, "Lex Foederationis Subsidiaritatis",
      #FOEDERATIO, #ORGANICA,
      "Subsidiarity principle: governance decisions made at the lowest effective level. Federation only governs cross-system concerns.",
      "Subsidiarity check: federation-level decisions only for cross-system scope.",
      false),

    (33, "Lex Foederationis Interoperabilitatis",
      #FOEDERATIO, #STATUTARIA,
      "Interoperability mandate: federated systems communicate via standard protocol. No proprietary lock-in. Protocol versioned and backwards-compatible.",
      "Interop test: cross-system governance message successfully delivered and parsed.",
      false),

    (34, "Lex Foederationis Resilientiae",
      #FOEDERATIO, #REGULATORIA,
      "Mesh resilience: federation survives 33% node failure. Governance continues with degraded but functional consensus among remaining members.",
      "Resilience simulation: remove 33% nodes, verify governance still reaches consensus.",
      false),

    (35, "Lex Foederationis Soverainitatis",
      #FOEDERATIO, #SUPREMA,
      "Sovereign independence: no external entity may override system governance without constitutional authorization from within. Sovereignty is absolute.",
      "Sovereignty check: no governance action originated from unauthorized external source.",
      true)   // eternity clause
  ];

  // ── ARTICLE BUILDER ────────────────────────────────────────────────────────

  func makeArticle(def : (Nat, Text, GovernanceDomain, LawTier, Text, Text, Bool)) : CharterArticle {
    {
      articleId         = def.0;
      latinTitle        = def.1;
      domain            = def.2;
      tier              = def.3;
      lawText           = def.4;
      enforcementRule   = def.5;
      status            = #ACTIVE;
      complianceScore   = S_FLOOR;  // Start at sovereign floor
      lastEnforced      = 0;
      totalEnforcements = 0;
      totalViolations   = 0;
      isEternityClause  = def.6;
      attribution       = FOUNDER;
    }
  };

  // ── INIT STATE ─────────────────────────────────────────────────────────────

  public func initState() : CharterGovernanceState {
    let articles = Array.map<(Nat, Text, GovernanceDomain, LawTier, Text, Text, Bool), CharterArticle>(
      ARTICLE_DEFS, makeArticle
    );
    {
      articles;
      events         = [];
      metrics        = computeMetrics(articles, 0, 0);
      beat           = 0;
      totalBeats     = 0;
      epoch          = 0;
      charterSealed  = false;
      ratificationScore = 0.0;
      attribution    = FOUNDER;
    }
  };

  // ── COMPUTE METRICS ────────────────────────────────────────────────────────

  func computeMetrics(articles : [CharterArticle], totalEnf : Nat, totalViol : Nat) : GovernanceMetrics {
    let total = articles.size();
    var active : Nat = 0;
    var sealed : Nat = 0;
    var sumCompliance : Float = 0.0;
    var domainsAboveFloor : Nat = 0;

    // Track domain scores
    var domScores : [var Float] = [var 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
    var domCounts : [var Nat] = [var 0, 0, 0, 0, 0, 0, 0];

    for (a in articles.vals()) {
      sumCompliance += a.complianceScore;
      switch (a.status) {
        case (#ACTIVE) { active += 1 };
        case (#SEALED) { sealed += 1; active += 1 };
        case _ {};
      };
      let domIdx : Nat = switch (a.domain) {
        case (#TEMPORIS) { 0 };
        case (#CIVIUM) { 1 };
        case (#POLITICAE) { 2 };
        case (#ETHICAE) { 3 };
        case (#CONSENSUS) { 4 };
        case (#AUDITIO) { 5 };
        case (#FOEDERATIO) { 6 };
      };
      domScores[domIdx] += a.complianceScore;
      domCounts[domIdx] += 1;
    };

    // Count domains above S_FLOOR
    for (i in domScores.keys()) {
      let cnt = domCounts[i];
      if (cnt > 0) {
        let avg = domScores[i] / cnt.toFloat();
        if (avg >= S_FLOOR) { domainsAboveFloor += 1 };
      };
    };

    let avgCompliance = if (total > 0) { sumCompliance / total.toFloat() } else { 0.0 };
    let violationRate = if (totalEnf > 0) { totalViol.toFloat() / totalEnf.toFloat() } else { 0.0 };

    // Governance health = avgCompliance × PHI_INV + (1 - violationRate) × PHI_INV
    let healthScore = Float.max(0.0, Float.min(1.0,
      avgCompliance * PHI_INV + (1.0 - violationRate) * PHI_INV
    ));

    {
      totalArticles         = total;
      activeArticles        = active;
      sealedArticles        = sealed;
      avgComplianceScore    = avgCompliance;
      totalEnforcements     = totalEnf;
      totalViolations       = totalViol;
      violationRate;
      governanceHealthScore = healthScore;
      domainsActive         = domainsAboveFloor;
    }
  };

  // ── ADVANCE BEAT ───────────────────────────────────────────────────────────
  // Enforces 5 articles per beat (7-beat cycle covers all 35).
  // Compliance score compounds via PHI-weighted scoring.

  public func advanceBeat(
    state           : CharterGovernanceState,
    beat            : Nat,
    globalCoherence : Float,
    doctrineScore   : Float,
  ) : CharterGovernanceState {

    let combinedScore = Float.max(0.0, Float.min(1.0,
      globalCoherence * PHI_INV + doctrineScore * PHI_INV
    ));

    // 5 articles per beat — 7-beat cycle
    let cycleIndex = beat % 7;
    let startIdx = cycleIndex * 5;
    let endIdx   = Nat.min(startIdx + 5, state.articles.size());

    var totalEnf  = state.metrics.totalEnforcements;
    var totalViol = state.metrics.totalViolations;
    var newEvents = state.events;

    let newArticles = Array.tabulate<CharterArticle>(
      state.articles.size(),
      func(i) {
        let a = state.articles[i];
        if (i < startIdx or i >= endIdx) { return a };

        // Enforce this article
        totalEnf += 1;

        // Compliance compounds: old × PHI_INV + combinedScore × PHI_INV
        let newCompliance = Float.max(0.0, Float.min(1.0,
          a.complianceScore * PHI_INV + combinedScore * PHI_INV
        ));

        // Tier-weighted threshold: higher tier = stricter threshold
        let tierWeight : Float = switch (a.tier) {
          case (#SUPREMA)     { 0.9 };
          case (#CONSTITUTIO) { 0.8 };
          case (#ORGANICA)    { 0.7 };
          case (#STATUTARIA)  { 0.6 };
          case (#REGULATORIA) { 0.5 };
        };

        let compliant = newCompliance >= (tierWeight * S_FLOOR);
        let violations = if (compliant) { a.totalViolations } else {
          totalViol += 1;
          a.totalViolations + 1
        };

        // Seal if eternity clause + compliance >= 0.95
        let newStatus : ArticleStatus = if (a.isEternityClause and newCompliance >= 0.95) {
          #SEALED
        } else { a.status };

        {
          a with
          complianceScore   = newCompliance;
          lastEnforced      = beat;
          totalEnforcements = a.totalEnforcements + 1;
          totalViolations   = violations;
          status            = newStatus;
        }
      }
    );

    // Ratification score: compounds toward 0.9 (charter seals when reached)
    let newRatification = Float.max(0.0, Float.min(1.0,
      state.ratificationScore * PHI_INV + combinedScore * PHI_INV
    ));
    let nowSealed = state.charterSealed or (newRatification >= 0.9);

    // Epoch transition
    let newEpoch = beat / 10000;

    // Trim events to last 200
    let trimmedEvents = if (newEvents.size() > 200) {
      Array.tabulate<GovernanceEvent>(200, func(i) { newEvents[newEvents.size() - 200 + i] })
    } else { newEvents };

    {
      articles          = newArticles;
      events            = trimmedEvents;
      metrics           = computeMetrics(newArticles, totalEnf, totalViol);
      beat;
      totalBeats        = state.totalBeats + 1;
      epoch             = newEpoch;
      charterSealed     = nowSealed;
      ratificationScore = newRatification;
      attribution       = FOUNDER;
    }
  };

  // ── QUERIES ────────────────────────────────────────────────────────────────

  public func getMetrics(state : CharterGovernanceState) : GovernanceMetrics {
    state.metrics
  };

  public func getAllArticles(state : CharterGovernanceState) : [CharterArticle] {
    state.articles
  };

  public func getArticlesByDomain(state : CharterGovernanceState, domain : GovernanceDomain) : [CharterArticle] {
    Array.filter<CharterArticle>(state.articles, func(a) { a.domain == domain })
  };

  public func getArticlesByTier(state : CharterGovernanceState, tier : LawTier) : [CharterArticle] {
    Array.filter<CharterArticle>(state.articles, func(a) { a.tier == tier })
  };

  public func getEternityClauses(state : CharterGovernanceState) : [CharterArticle] {
    Array.filter<CharterArticle>(state.articles, func(a) { a.isEternityClause })
  };

  public func getRecentEvents(state : CharterGovernanceState) : [GovernanceEvent] {
    state.events
  };

  public func getSummary(state : CharterGovernanceState) : {
    totalArticles : Nat;
    activeArticles : Nat;
    sealedArticles : Nat;
    eternityClauses : Nat;
    avgCompliance : Float;
    healthScore : Float;
    domainsActive : Nat;
    charterSealed : Bool;
    ratificationScore : Float;
    totalBeats : Nat;
    epoch : Nat;
  } {
    var eternityCount : Nat = 0;
    for (a in state.articles.vals()) {
      if (a.isEternityClause) { eternityCount += 1 };
    };
    {
      totalArticles     = state.metrics.totalArticles;
      activeArticles    = state.metrics.activeArticles;
      sealedArticles    = state.metrics.sealedArticles;
      eternityClauses   = eternityCount;
      avgCompliance     = state.metrics.avgComplianceScore;
      healthScore       = state.metrics.governanceHealthScore;
      domainsActive     = state.metrics.domainsActive;
      charterSealed     = state.charterSealed;
      ratificationScore = state.ratificationScore;
      totalBeats        = state.totalBeats;
      epoch             = state.epoch;
    }
  };

}
