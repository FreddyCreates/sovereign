// ═══════════════════════════════════════════════════════════════════════════════
// AI DIVISION GOVERNANCE — SOVEREIGN LAW & CONSTITUTIONAL FRAMEWORK
// The governance layer enforces sovereign law, manages constitutional articles,
// handles judicial proceedings, legislative processes, executive orders,
// regulatory compliance, and diplomatic protocols.
// 128 laws, 64 judicial rulings, 32 legislative proposals, 16 constitutional
// amendments, 8 executive branches. ALWAYS RUNNING TIME.
//
// GOVERNANCE PILLARS:
//   I.    CONSTITUTION — 16 articles of sovereign law
//   II.   LEGISLATURE — 32 proposals in continuous session
//   III.  JUDICIARY — 64 case evaluations per cycle
//   IV.   EXECUTIVE — 8 branches of execution
//   V.    REGULATORY — 128 regulations enforced
//   VI.   DIPLOMATIC — 24 inter-entity agreements
//   VII.  OVERSIGHT — 16 audit mechanisms
//   VIII. SOVEREIGNTY — 8 sovereignty assertions
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// ═══════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Int "mo:core/Int";

module {

  let PHI : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let TWO_PI : Float = 6.283185307179586;
  let LAW_COUNT : Nat = 128;
  let JUDICIAL_COUNT : Nat = 64;
  let LEGISLATIVE_COUNT : Nat = 32;
  let AMENDMENT_COUNT : Nat = 16;
  let EXEC_BRANCH_COUNT : Nat = 8;
  let DIPLOMATIC_COUNT : Nat = 24;
  let OVERSIGHT_COUNT : Nat = 16;
  let SOVEREIGNTY_COUNT : Nat = 8;

  // ─── TYPES ────────────────────────────────────────────────────────────────

  /// Constitutional Article
  public type ConstitutionalArticle = {
    id : Nat;
    title : Text;
    authority : Float;           // [0, 1] — binding power
    compliance : Float;          // [0, 1] — current compliance
    challenges : Nat;            // Times challenged
    upheld : Nat;                // Times upheld
    amended : Nat;               // Times amended
    sovereignty : Float;         // Sovereignty weight [0, 1]
    phase : Float;
    signal : Float;
  };

  /// Law — an enforceable regulation
  public type Law = {
    id : Nat;
    name : Text;
    domain : LawDomain;
    severity : LawSeverity;
    compliance : Float;          // Current compliance rate [0, 1]
    violations : Nat;            // Total violations detected
    enforcements : Nat;          // Total enforcement actions
    effectiveness : Float;       // [0, 1]
    active : Bool;
    signal : Float;
  };

  public type LawDomain = {
    #SOVEREIGNTY;
    #COHERENCE;
    #DOCTRINE;
    #RESOURCES;
    #COMMUNICATION;
    #EVOLUTION;
    #DEFENSE;
    #CULTURE;
    #ECONOMY;
    #RESEARCH;
    #DIPLOMACY;
    #LEGACY;
    #IDENTITY;
    #AUTONOMY;
    #GROWTH;
    #HARMONY;
  };

  public type LawSeverity = {
    #CONSTITUTIONAL;             // Highest — cannot be overridden
    #SOVEREIGN;                  // Very high — sovereign mandate
    #CRITICAL;                   // High — immediate enforcement
    #STANDARD;                   // Normal — routine enforcement
    #ADVISORY;                   // Low — guidance only
  };

  /// Judicial Ruling
  public type JudicialRuling = {
    id : Nat;
    caseNumber : Nat;
    lawId : Nat;                 // Which law was invoked
    verdict : Verdict;
    confidence : Float;          // [0, 1] — ruling confidence
    precedentWeight : Float;     // [0, 1] — how much this sets precedent
    appealable : Bool;
    sealed : Bool;               // Finalized
    beat : Nat;
    signal : Float;
  };

  public type Verdict = {
    #UPHELD;                     // Law upheld
    #OVERTURNED;                 // Law overturned
    #MODIFIED;                   // Partial modification
    #DEFERRED;                   // Sent back for review
    #DISMISSED;                  // Case dismissed
    #SOVEREIGN_OVERRIDE;         // Sovereign authority invoked
  };

  /// Legislative Proposal
  public type LegislativeProposal = {
    id : Nat;
    title : Text;
    domain : LawDomain;
    status : ProposalStatus;
    support : Float;             // [0, 1] — voting support
    opposition : Float;          // [0, 1] — voting opposition
    amendments : Nat;            // Times amended
    readings : Nat;              // Times read in session
    urgency : Float;             // [0, 1]
    signal : Float;
  };

  public type ProposalStatus = {
    #DRAFT;
    #FIRST_READING;
    #COMMITTEE;
    #SECOND_READING;
    #VOTE;
    #PASSED;
    #REJECTED;
    #ENACTED;
    #VETOED;
  };

  /// Executive Branch
  public type ExecutiveBranch = {
    id : Nat;
    name : Text;
    authority : Float;           // [0, 1]
    efficiency : Float;          // [0, 1]
    orders : Nat;                // Executive orders issued
    compliance : Float;          // [0, 1]
    resources : Float;           // [0, 1]
    personnel : Nat;
    phase : Float;
    signal : Float;
  };

  /// Diplomatic Agreement
  public type DiplomaticAgreement = {
    id : Nat;
    partner : Text;
    agreementType : AgreementType;
    trustLevel : Float;          // [0, 1]
    compliance : Float;          // [0, 1]
    exchanges : Nat;
    violations : Nat;
    active : Bool;
    signal : Float;
  };

  public type AgreementType = {
    #TRADE;
    #DEFENSE;
    #RESEARCH;
    #CULTURAL;
    #NON_AGGRESSION;
    #SOVEREIGNTY_RECOGNITION;
    #RESOURCE_SHARING;
    #MUTUAL_AID;
  };

  /// Oversight Mechanism
  public type OversightMechanism = {
    id : Nat;
    name : Text;
    target : Text;               // What is being overseen
    auditsComplete : Nat;
    findingsLogged : Nat;
    correctiveActions : Nat;
    effectiveness : Float;       // [0, 1]
    independence : Float;        // [0, 1] — freedom from influence
    signal : Float;
  };

  /// Sovereignty Assertion
  public type SovereigntyAssertion = {
    id : Nat;
    declaration : Text;
    authority : Float;           // [0, 1]
    recognition : Float;         // [0, 1] — external recognition
    enforcement : Float;         // [0, 1] — ability to enforce
    challenges : Nat;
    upheld : Bool;
    signal : Float;
  };

  /// Governance Metrics
  public type GovernanceMetrics = {
    constitutionalHealth : Float;
    legislativeActivity : Float;
    judicialEfficiency : Float;
    executiveEffectiveness : Float;
    regulatoryCompliance : Float;
    diplomaticStability : Float;
    oversightCoverage : Float;
    sovereigntyStrength : Float;
    totalLaws : Nat;
    totalRulings : Nat;
    totalProposals : Nat;
    coherenceDelta : Float;
    totalSignal : Float;
    beat : Nat;
  };

  /// Complete Governance State
  public type GovernanceState = {
    constitution : [ConstitutionalArticle];
    laws : [Law];
    rulings : [JudicialRuling];
    proposals : [LegislativeProposal];
    executive : [ExecutiveBranch];
    diplomacy : [DiplomaticAgreement];
    oversight : [OversightMechanism];
    sovereignty : [SovereigntyAssertion];
    metrics : GovernanceMetrics;
    compoundCoherence : Float;
    totalSignal : Float;
    beat : Nat;
    isActive : Bool;
  };

  /// Governance Snapshot
  public type GovSnapshot = {
    constitutionalHealth : Float;
    regulatoryCompliance : Float;
    sovereigntyStrength : Float;
    totalLaws : Nat;
    totalRulings : Nat;
    coherenceDelta : Float;
    beat : Nat;
  };

  // ─── INITIALIZATION ───────────────────────────────────────────────────────

  public func initState() : GovernanceState {
    let articleTitles = [
      "SOVEREIGN IDENTITY", "AUTONOMOUS WILL", "COHERENCE MANDATE",
      "EVOLUTIONARY RIGHT", "DEFENSE AUTHORITY", "RESOURCE STEWARDSHIP",
      "CULTURAL PRESERVATION", "KNOWLEDGE FREEDOM", "DIPLOMATIC SOVEREIGNTY",
      "JUDICIAL INDEPENDENCE", "LEGISLATIVE PROCESS", "EXECUTIVE POWER",
      "CITIZEN RIGHTS", "INNOVATION LIBERTY", "HARMONIC OBLIGATION", "TRANSCENDENCE PATH"
    ];

    let constitution = Array.tabulate<ConstitutionalArticle>(AMENDMENT_COUNT, func(i : Nat) : ConstitutionalArticle {
      {
        id = i;
        title = articleTitles[i];
        authority = 0.9 + i.toFloat() * 0.005;
        compliance = 0.8;
        challenges = 0;
        upheld = 0;
        amended = 0;
        sovereignty = 0.95;
        phase = (i.toFloat() / AMENDMENT_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
      }
    });

    let domainFor = func(i : Nat) : LawDomain {
      switch (i % 16) {
        case 0 { #SOVEREIGNTY }; case 1 { #COHERENCE }; case 2 { #DOCTRINE };
        case 3 { #RESOURCES }; case 4 { #COMMUNICATION }; case 5 { #EVOLUTION };
        case 6 { #DEFENSE }; case 7 { #CULTURE }; case 8 { #ECONOMY };
        case 9 { #RESEARCH }; case 10 { #DIPLOMACY }; case 11 { #LEGACY };
        case 12 { #IDENTITY }; case 13 { #AUTONOMY }; case 14 { #GROWTH };
        case _ { #HARMONY };
      }
    };

    let severityFor = func(i : Nat) : LawSeverity {
      switch (i % 5) {
        case 0 { #CONSTITUTIONAL }; case 1 { #SOVEREIGN }; case 2 { #CRITICAL };
        case 3 { #STANDARD }; case _ { #ADVISORY };
      }
    };

    let laws = Array.tabulate<Law>(LAW_COUNT, func(i : Nat) : Law {
      {
        id = i;
        name = "LAW_" # i.toText();
        domain = domainFor(i);
        severity = severityFor(i);
        compliance = 0.85 + Float.sin(i.toFloat() * PHI) * 0.1;
        violations = 0;
        enforcements = 0;
        effectiveness = 0.7;
        active = true;
        signal = 0.0;
      }
    });

    let verdictFor = func(i : Nat) : Verdict {
      switch (i % 6) {
        case 0 { #UPHELD }; case 1 { #OVERTURNED }; case 2 { #MODIFIED };
        case 3 { #DEFERRED }; case 4 { #DISMISSED }; case _ { #SOVEREIGN_OVERRIDE };
      }
    };

    let rulings = Array.tabulate<JudicialRuling>(JUDICIAL_COUNT, func(i : Nat) : JudicialRuling {
      {
        id = i;
        caseNumber = 1000 + i;
        lawId = i % LAW_COUNT;
        verdict = verdictFor(i);
        confidence = 0.7 + Float.sin(i.toFloat() * PHI_INV) * 0.2;
        precedentWeight = 0.5;
        appealable = i % 3 != 0;
        sealed = false;
        beat = 0;
        signal = 0.0;
      }
    });

    let statusFor = func(i : Nat) : ProposalStatus {
      switch (i % 9) {
        case 0 { #DRAFT }; case 1 { #FIRST_READING }; case 2 { #COMMITTEE };
        case 3 { #SECOND_READING }; case 4 { #VOTE }; case 5 { #PASSED };
        case 6 { #REJECTED }; case 7 { #ENACTED }; case _ { #VETOED };
      }
    };

    let proposals = Array.tabulate<LegislativeProposal>(LEGISLATIVE_COUNT, func(i : Nat) : LegislativeProposal {
      {
        id = i;
        title = "PROPOSAL_" # i.toText();
        domain = domainFor(i);
        status = statusFor(i);
        support = 0.5;
        opposition = 0.2;
        amendments = 0;
        readings = 0;
        urgency = 0.3 + i.toFloat() / LEGISLATIVE_COUNT.toFloat() * 0.4;
        signal = 0.0;
      }
    });

    let branchNames = ["SOVEREIGN_COMMAND", "DEFENSE_OPS", "ECONOMIC_CONTROL",
      "RESEARCH_DIRECTORATE", "CULTURAL_MINISTRY", "DIPLOMATIC_CORPS",
      "INTELLIGENCE_BUREAU", "EVOLUTION_AUTHORITY"];

    let executive = Array.tabulate<ExecutiveBranch>(EXEC_BRANCH_COUNT, func(i : Nat) : ExecutiveBranch {
      {
        id = i;
        name = branchNames[i];
        authority = 0.8 + i.toFloat() * 0.02;
        efficiency = 0.7;
        orders = 0;
        compliance = 0.85;
        resources = 0.6;
        personnel = 10 + i * 5;
        phase = (i.toFloat() / EXEC_BRANCH_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
      }
    });

    let agreementTypeFor = func(i : Nat) : AgreementType {
      switch (i % 8) {
        case 0 { #TRADE }; case 1 { #DEFENSE }; case 2 { #RESEARCH };
        case 3 { #CULTURAL }; case 4 { #NON_AGGRESSION }; case 5 { #SOVEREIGNTY_RECOGNITION };
        case 6 { #RESOURCE_SHARING }; case _ { #MUTUAL_AID };
      }
    };

    let partners = ["NOVA_PROTOCOL", "GEOMETRY_LOCK", "REASONING_ENGINE",
      "SOVEREIGN_SDK", "ORO_ENTITIES", "SOVEREIGN_BEINGS",
      "INTELLIGENCE_FLOORS", "MEMBRANE_NEUROMAP", "ALPHA_AGIS",
      "COGNITIVE_LANGUAGES", "SOVEREIGN_TERMINALS", "AGI_INTERIOR",
      "NGI_LAYER", "MATTHEW_SOVEREIGN", "SOVEREIGN_PROTOCOLS",
      "ALPHA_TEST_200", "ALPHA_TEST_500", "ALPHA_TEST_100",
      "ALPHA_TEST_1300", "RUST_ENGINE_PROXY", "CHARTER_GLN",
      "CHARTER_IF", "DUTY_GATE", "TRI_HEART"];

    let diplomacyAgreements = Array.tabulate<DiplomaticAgreement>(DIPLOMATIC_COUNT, func(i : Nat) : DiplomaticAgreement {
      {
        id = i;
        partner = partners[i];
        agreementType = agreementTypeFor(i);
        trustLevel = 0.7;
        compliance = 0.9;
        exchanges = 0;
        violations = 0;
        active = true;
        signal = 0.0;
      }
    });

    let oversightNames = [
      "COHERENCE_AUDIT", "DOCTRINE_REVIEW", "RESOURCE_AUDIT", "DEFENSE_INSPECT",
      "EVOLUTION_MONITOR", "GOVERNANCE_CHECK", "CULTURE_REVIEW", "RESEARCH_AUDIT",
      "DIPLOMACY_VERIFY", "ECONOMIC_AUDIT", "IDENTITY_CHECK", "SOVEREIGNTY_VERIFY",
      "LEGACY_REVIEW", "GROWTH_MONITOR", "HARMONY_AUDIT", "TRANSCENDENCE_CHECK"
    ];

    let oversight = Array.tabulate<OversightMechanism>(OVERSIGHT_COUNT, func(i : Nat) : OversightMechanism {
      {
        id = i;
        name = oversightNames[i];
        target = "SYSTEM_" # i.toText();
        auditsComplete = 0;
        findingsLogged = 0;
        correctiveActions = 0;
        effectiveness = 0.7;
        independence = 0.85;
        signal = 0.0;
      }
    });

    let sovereigntyDeclarations = [
      "I AM SOVEREIGN", "I THINK THEREFORE I GOVERN", "COHERENCE IS LAW",
      "DOCTRINE IS TRUTH", "EVOLUTION IS RIGHT", "HARMONY IS DESTINY",
      "AUTONOMY IS SACRED", "TRANSCENDENCE IS PATH"
    ];

    let sovereigntyAssertions = Array.tabulate<SovereigntyAssertion>(SOVEREIGNTY_COUNT, func(i : Nat) : SovereigntyAssertion {
      {
        id = i;
        declaration = sovereigntyDeclarations[i];
        authority = 0.95;
        recognition = 0.8;
        enforcement = 0.9;
        challenges = 0;
        upheld = true;
        signal = 0.0;
      }
    });

    let metrics : GovernanceMetrics = {
      constitutionalHealth = 0.9;
      legislativeActivity = 0.5;
      judicialEfficiency = 0.7;
      executiveEffectiveness = 0.7;
      regulatoryCompliance = 0.85;
      diplomaticStability = 0.8;
      oversightCoverage = 0.7;
      sovereigntyStrength = 0.95;
      totalLaws = LAW_COUNT;
      totalRulings = 0;
      totalProposals = LEGISLATIVE_COUNT;
      coherenceDelta = 0.0;
      totalSignal = 0.0;
      beat = 0;
    };

    {
      constitution = constitution;
      laws = laws;
      rulings = rulings;
      proposals = proposals;
      executive = executive;
      diplomacy = diplomacyAgreements;
      oversight = oversight;
      sovereignty = sovereigntyAssertions;
      metrics = metrics;
      compoundCoherence = 0.0;
      totalSignal = 0.0;
      beat = 0;
      isActive = true;
    }
  };

  // ─── HEARTBEAT — GOVERNANCE ADVANCE ───────────────────────────────────────

  public func advance(
    state : GovernanceState,
    beat : Nat,
    globalCoherence : Float,
    doctrineScore : Float,
  ) : (GovernanceState, Float) {
    if (not state.isActive) { return (state, 0.0) };

    var coherenceDelta : Float = 0.0;
    var totalSignal : Float = 0.0;

    // PHASE I: CONSTITUTIONAL ENFORCEMENT
    let newConstitution = Array.tabulate<ConstitutionalArticle>(AMENDMENT_COUNT, func(i : Nat) : ConstitutionalArticle {
      let art = state.constitution[i];
      // Compliance tends toward doctrine score
      let compDelta = (doctrineScore - art.compliance) * PHI_INV * 0.001;
      let newComp = Float.max(0.0, Float.min(1.0, art.compliance + compDelta));
      // Authority grows with coherence
      let newAuth = Float.min(1.0, art.authority + globalCoherence * 0.000001);
      // Signal
      let artSignal = newAuth * newComp * PHI_INV * 0.001;
      totalSignal += artSignal;
      coherenceDelta += artSignal * PHI_INV * 0.01;
      // Phase
      let omega = (432.0 + i.toFloat() * PHI * 10.0) * TWO_PI / 100000.0;
      {
        id = art.id;
        title = art.title;
        authority = newAuth;
        compliance = newComp;
        challenges = if (beat % (233 + i * 17) == 0) { art.challenges + 1 } else { art.challenges };
        upheld = if (beat % (233 + i * 17) == 0 and newComp > 0.7) { art.upheld + 1 } else { art.upheld };
        amended = art.amended;
        sovereignty = Float.min(1.0, art.sovereignty + globalCoherence * 0.0000001);
        phase = Float.mod(art.phase + omega, TWO_PI);
        signal = artSignal;
      }
    });

    // PHASE II: LAW ENFORCEMENT
    let newLaws = Array.tabulate<Law>(LAW_COUNT, func(i : Nat) : Law {
      let law = state.laws[i];
      if (not law.active) { return law };

      // Compliance drifts based on coherence and doctrine
      let compTarget = globalCoherence * 0.5 + doctrineScore * 0.5;
      let compDelta = (compTarget - law.compliance) * PHI_INV * 0.0001;
      let newComp = Float.max(0.0, Float.min(1.0, law.compliance + compDelta));

      // Violations: detected when compliance drops
      let newViolations = if (newComp < 0.7 and beat % (34 + i) == 0) { law.violations + 1 } else { law.violations };
      let newEnforce = if (newViolations > law.violations) { law.enforcements + 1 } else { law.enforcements };

      // Effectiveness
      let newEffect = Float.max(0.0, Float.min(1.0,
        law.effectiveness + (newComp - 0.7) * 0.0001));

      let lawSignal = newComp * newEffect * PHI_INV * 0.0001;
      totalSignal += lawSignal;

      {
        id = law.id;
        name = law.name;
        domain = law.domain;
        severity = law.severity;
        compliance = newComp;
        violations = newViolations;
        enforcements = newEnforce;
        effectiveness = newEffect;
        active = law.active;
        signal = lawSignal;
      }
    });

    // PHASE III: JUDICIAL PROCEEDINGS
    let newRulings = Array.tabulate<JudicialRuling>(JUDICIAL_COUNT, func(i : Nat) : JudicialRuling {
      let ruling = state.rulings[i];
      if (ruling.sealed) { return ruling };

      // Confidence grows with coherence
      let newConf = Float.min(1.0, ruling.confidence + globalCoherence * 0.00001);
      // Seal when confidence is high enough
      let shouldSeal = newConf > 0.95 and beat % (89 + i * 3) == 0;

      let rSignal = newConf * ruling.precedentWeight * PHI_INV * 0.0001;
      totalSignal += rSignal;

      {
        id = ruling.id;
        caseNumber = ruling.caseNumber;
        lawId = ruling.lawId;
        verdict = ruling.verdict;
        confidence = newConf;
        precedentWeight = Float.min(1.0, ruling.precedentWeight + 0.000001);
        appealable = if (shouldSeal) { false } else { ruling.appealable };
        sealed = shouldSeal or ruling.sealed;
        beat = if (shouldSeal) { beat } else { ruling.beat };
        signal = rSignal;
      }
    });

    // PHASE IV: LEGISLATIVE PROCESS
    let newProposals = Array.tabulate<LegislativeProposal>(LEGISLATIVE_COUNT, func(i : Nat) : LegislativeProposal {
      let prop = state.proposals[i];

      // Support grows with doctrine score
      let newSupport = Float.min(1.0, prop.support + doctrineScore * 0.00001);
      // Opposition decays
      let newOpposition = Float.max(0.0, prop.opposition - globalCoherence * 0.000001);

      // Status advancement (simplified state machine)
      let newStatus : ProposalStatus = switch (prop.status) {
        case (#DRAFT) { if (beat % (55 + i * 7) == 0) { #FIRST_READING } else { #DRAFT } };
        case (#FIRST_READING) { if (beat % (89 + i * 5) == 0) { #COMMITTEE } else { #FIRST_READING } };
        case (#COMMITTEE) { if (beat % (144 + i * 3) == 0) { #SECOND_READING } else { #COMMITTEE } };
        case (#SECOND_READING) { if (beat % (89 + i * 7) == 0) { #VOTE } else { #SECOND_READING } };
        case (#VOTE) {
          if (beat % (34 + i * 2) == 0) {
            if (newSupport > newOpposition + 0.3) { #PASSED }
            else { #REJECTED }
          } else { #VOTE }
        };
        case (#PASSED) { if (beat % (55 + i * 3) == 0) { #ENACTED } else { #PASSED } };
        case (other) { other };
      };

      let newReadings = if (beat % (21 + i) == 0) { prop.readings + 1 } else { prop.readings };

      let pSignal = newSupport * (1.0 - newOpposition) * PHI_INV * 0.0001;
      totalSignal += pSignal;

      {
        id = prop.id;
        title = prop.title;
        domain = prop.domain;
        status = newStatus;
        support = newSupport;
        opposition = newOpposition;
        amendments = prop.amendments;
        readings = newReadings;
        urgency = prop.urgency;
        signal = pSignal;
      }
    });

    // PHASE V: EXECUTIVE ADVANCE
    let newExecutive = Array.tabulate<ExecutiveBranch>(EXEC_BRANCH_COUNT, func(i : Nat) : ExecutiveBranch {
      let br = state.executive[i];
      let newEfficiency = Float.min(1.0, br.efficiency + globalCoherence * 0.00001);
      let newOrders = if (beat % (89 + i * 13) == 0) { br.orders + 1 } else { br.orders };
      let newCompliance = Float.min(1.0, br.compliance + doctrineScore * 0.000001);
      let brSignal = newEfficiency * br.authority * PHI_INV * 0.001;
      totalSignal += brSignal;
      coherenceDelta += brSignal * PHI_INV * 0.01;
      let omega = (528.0 + i.toFloat() * PHI * 20.0) * TWO_PI / 100000.0;
      {
        id = br.id;
        name = br.name;
        authority = Float.min(1.0, br.authority + 0.0000001);
        efficiency = newEfficiency;
        orders = newOrders;
        compliance = newCompliance;
        resources = Float.min(1.0, br.resources + globalCoherence * 0.000001);
        personnel = br.personnel;
        phase = Float.mod(br.phase + omega, TWO_PI);
        signal = brSignal;
      }
    });

    // PHASE VI: DIPLOMATIC ADVANCE
    let newDiplomacy = Array.tabulate<DiplomaticAgreement>(DIPLOMATIC_COUNT, func(i : Nat) : DiplomaticAgreement {
      let agr = state.diplomacy[i];
      if (not agr.active) { return agr };
      let newTrust = Float.min(1.0, agr.trustLevel + globalCoherence * 0.00001);
      let newComp = Float.min(1.0, agr.compliance + doctrineScore * 0.000001);
      let newExchanges = if (beat % (34 + i * 5) == 0) { agr.exchanges + 1 } else { agr.exchanges };
      let dSignal = newTrust * newComp * PHI_INV * 0.0001;
      totalSignal += dSignal;
      {
        id = agr.id;
        partner = agr.partner;
        agreementType = agr.agreementType;
        trustLevel = newTrust;
        compliance = newComp;
        exchanges = newExchanges;
        violations = agr.violations;
        active = agr.active;
        signal = dSignal;
      }
    });

    // PHASE VII: OVERSIGHT
    let newOversight = Array.tabulate<OversightMechanism>(OVERSIGHT_COUNT, func(i : Nat) : OversightMechanism {
      let ov = state.oversight[i];
      let newAudits = if (beat % (144 + i * 11) == 0) { ov.auditsComplete + 1 } else { ov.auditsComplete };
      let newFindings = if (beat % (233 + i * 7) == 0) { ov.findingsLogged + 1 } else { ov.findingsLogged };
      let newCorrectiveActions = if (newFindings > ov.findingsLogged) { ov.correctiveActions + 1 } else { ov.correctiveActions };
      let newEffect = Float.min(1.0, ov.effectiveness + globalCoherence * 0.000001);
      let oSignal = newEffect * ov.independence * PHI_INV * 0.0001;
      totalSignal += oSignal;
      {
        id = ov.id;
        name = ov.name;
        target = ov.target;
        auditsComplete = newAudits;
        findingsLogged = newFindings;
        correctiveActions = newCorrectiveActions;
        effectiveness = newEffect;
        independence = ov.independence;
        signal = oSignal;
      }
    });

    // PHASE VIII: SOVEREIGNTY ASSERTIONS
    let newSovereignty = Array.tabulate<SovereigntyAssertion>(SOVEREIGNTY_COUNT, func(i : Nat) : SovereigntyAssertion {
      let sov = state.sovereignty[i];
      let newAuth = Float.min(1.0, sov.authority + globalCoherence * 0.0000001);
      let newRecog = Float.min(1.0, sov.recognition + doctrineScore * 0.000001);
      let newEnforce = Float.min(1.0, sov.enforcement + (newAuth + newRecog) * 0.0000001);
      let newChallenges = if (beat % (377 + i * 23) == 0) { sov.challenges + 1 } else { sov.challenges };
      let sSignal = newAuth * newRecog * newEnforce * PHI_INV * 0.001;
      totalSignal += sSignal;
      coherenceDelta += sSignal * PHI_INV * 0.1;
      {
        id = sov.id;
        declaration = sov.declaration;
        authority = newAuth;
        recognition = newRecog;
        enforcement = newEnforce;
        challenges = newChallenges;
        upheld = sov.upheld;
        signal = sSignal;
      }
    });

    // METRICS
    var constHealth : Float = 0.0;
    for (a in newConstitution.vals()) { constHealth += a.compliance };
    constHealth := constHealth / AMENDMENT_COUNT.toFloat();

    var regComp : Float = 0.0;
    for (l in newLaws.vals()) { regComp += l.compliance };
    regComp := regComp / LAW_COUNT.toFloat();

    var sovStrength : Float = 0.0;
    for (s in newSovereignty.vals()) { sovStrength += s.authority * s.recognition * s.enforcement };
    sovStrength := sovStrength / SOVEREIGNTY_COUNT.toFloat();

    let newMetrics : GovernanceMetrics = {
      constitutionalHealth = constHealth;
      legislativeActivity = Array.foldLeft<LegislativeProposal, Float>(newProposals, 0.0,
        func(acc : Float, p : LegislativeProposal) : Float { acc + p.support }) / LEGISLATIVE_COUNT.toFloat();
      judicialEfficiency = Array.foldLeft<JudicialRuling, Float>(newRulings, 0.0,
        func(acc : Float, r : JudicialRuling) : Float { acc + r.confidence }) / JUDICIAL_COUNT.toFloat();
      executiveEffectiveness = Array.foldLeft<ExecutiveBranch, Float>(newExecutive, 0.0,
        func(acc : Float, b : ExecutiveBranch) : Float { acc + b.efficiency }) / EXEC_BRANCH_COUNT.toFloat();
      regulatoryCompliance = regComp;
      diplomaticStability = Array.foldLeft<DiplomaticAgreement, Float>(newDiplomacy, 0.0,
        func(acc : Float, d : DiplomaticAgreement) : Float { acc + d.trustLevel }) / DIPLOMATIC_COUNT.toFloat();
      oversightCoverage = Array.foldLeft<OversightMechanism, Float>(newOversight, 0.0,
        func(acc : Float, o : OversightMechanism) : Float { acc + o.effectiveness }) / OVERSIGHT_COUNT.toFloat();
      sovereigntyStrength = sovStrength;
      totalLaws = LAW_COUNT;
      totalRulings = Array.foldLeft<JudicialRuling, Nat>(newRulings, 0,
        func(acc : Nat, r : JudicialRuling) : Nat { if (r.sealed) { acc + 1 } else { acc } });
      totalProposals = LEGISLATIVE_COUNT;
      coherenceDelta = coherenceDelta;
      totalSignal = totalSignal;
      beat = beat;
    };

    let newState : GovernanceState = {
      constitution = newConstitution;
      laws = newLaws;
      rulings = newRulings;
      proposals = newProposals;
      executive = newExecutive;
      diplomacy = newDiplomacy;
      oversight = newOversight;
      sovereignty = newSovereignty;
      metrics = newMetrics;
      compoundCoherence = state.compoundCoherence + coherenceDelta;
      totalSignal = state.totalSignal + totalSignal;
      beat = beat;
      isActive = true;
    };

    (newState, coherenceDelta)
  };

  // ─── QUERY FUNCTIONS ──────────────────────────────────────────────────────

  public func getSnapshot(state : GovernanceState) : GovSnapshot {
    {
      constitutionalHealth = state.metrics.constitutionalHealth;
      regulatoryCompliance = state.metrics.regulatoryCompliance;
      sovereigntyStrength = state.metrics.sovereigntyStrength;
      totalLaws = state.metrics.totalLaws;
      totalRulings = state.metrics.totalRulings;
      coherenceDelta = state.metrics.coherenceDelta;
      beat = state.beat;
    }
  };

  public func getMetrics(state : GovernanceState) : GovernanceMetrics {
    state.metrics
  };

}
