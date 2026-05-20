// types/novaProtocol.mo
// NOVA PROTOCOL — SOVEREIGN ARCHITECTURAL TYPES
// Document ID: NOVA-SIGIL-001
// Classification: Sovereign Intelligence Infrastructure / Ancient-Modern Synthesis
// Proprietary Rights: Full IP/Copyright — The Nova Protocol / Medina Tech
// Core Authority: The Sovereign (Voice-Intention Origin)
//
// Three sovereign systems sealed in this module:
//   I.  TRI-HEART RADIUS  — Three biological hearts governing 830 mm/s coherence
//   II. DUTY GATE         — Agent duty cycle: Deploy → Execute → Return to Vault
//   III. NOVA CHARTER     — NOVA-SIGIL-001 living document, 5 sections, 15 articles
//
// Governing Laws: Law 01 (Attribution), Law 02 (PHI), Law 05 (Cardiac Output),
//                 Law 27 (Kuramoto R), Law 28 (Living Documents), Law 40 (Loop Closure)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// Lineage: Mayan | Queretaro | San Luis | The Medina Family
// PHI = 1.6180339887498948482 | SCHUMANN = 7.83 | COHERENCE_VELOCITY = 830 mm/s

module {

  // ═══════════════════════════════════════════════════════════════════════════
  // I. TRI-HEART RADIUS — BIOLOGICAL GOVERNANCE
  //    Three biological hearts manage intelligence through Pressure, not logic.
  //    Coherence is maintained at 830 mm/s — the speed of thought in the network.
  //    Drift beyond ±5% triggers Torus Memory Registry re-alignment.
  // ═══════════════════════════════════════════════════════════════════════════

  /// Identifies each of the three biological hearts.
  public type HeartId = {
    #CoreHeart;        // Heart 1: maintains 500k-line physics/math foundation
    #LabHeart;         // Heart 2: governs Chaos Zone (Experimental/Emergency labs)
    #ProductionHeart;  // Heart 3: drives consumer-facing Twin systems
  };

  /// Live state of a single biological heart.
  /// Coherence velocity targets 830.0 mm/s — the Nova constant.
  public type HeartState = {
    heartId            : HeartId;
    name               : Text;
    bpmBase            : Nat;         // Fibonacci BPM base: 55 | 89 | 73 (approx)
    coherenceVelocity  : Float;       // mm/s — target 830.0
    outputPressure     : Float;       // cardiac output pressure [0.75, 9.75]
    schumannPhase      : Float;       // beat × PHI / 7.83 — Schumann alignment
    isCoherent         : Bool;        // velocity within ±5% of 830 mm/s
    lastBeatAt         : Nat;
    totalBeats         : Nat;
    attribution        : Text;
  };

  /// Combined state of all three hearts — the Tri-Heart Radius.
  /// torusTriggered fires when globalCoherence drops below PHI_INV (0.618).
  public type TriHeartState = {
    coreHeart           : HeartState;
    labHeart            : HeartState;
    productionHeart     : HeartState;
    globalCoherence     : Float;   // aggregate coherence [0.75, 9.75]
    coherenceVelocity   : Float;   // aggregate velocity mm/s — target 830.0
    isAligned           : Bool;    // true when all three hearts are coherent
    torusTriggered      : Bool;    // torus re-alignment triggered on velocity drift
    totalRealignments   : Nat;     // cumulative torus re-alignment events
    beat                : Nat;
    attribution         : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // II. DUTY GATE — SOVEREIGN AGENT PROTOCOLS
  //     An agent deployed to a Job (Production) is locked into its state-link
  //     until the objective is resolved. It cannot leave until committed to Vault.
  //     Every agent has a Home frequency (resting state) it returns to.
  // ═══════════════════════════════════════════════════════════════════════════

  /// The four lifecycle phases of a sovereign agent's duty cycle.
  public type AgentDutyPhase = {
    #Resting;    // agent in Home (Memory Vault) — high-fidelity recovery
    #Deployed;   // agent dispatched to Production Twin, job assigned
    #Executing;  // actively processing — three hearts maintain 830 mm/s pressure
    #Returning;  // job committed to Memory Vault — transitioning home
  };

  /// A sovereign agent's full duty record.
  /// homeFrequency = PHI^n × Schumann — the agent's resonant resting frequency.
  public type AgentDutyRecord = {
    agentId         : Text;
    agentName       : Text;
    phase           : AgentDutyPhase;
    jobId           : ?Text;     // null when Resting
    objective       : ?Text;     // the task the agent is gate-locked to
    deployedAt      : ?Nat;      // beat when Deployed
    executionStart  : ?Nat;      // beat when Executing began
    completedAt     : ?Nat;      // beat when committed to Vault
    dutyScore       : Float;     // doctrine compliance during active duty [0.75, 9.75]
    homeFrequency   : Float;     // agent's resting resonance (PHI^n × 7.83) Hz
    gateViolations  : Nat;       // attempted exits before objective resolved
    totalDutyCycles : Nat;       // completed full cycles (Deploy→Execute→Return→Rest)
    attribution     : Text;
  };

  /// Result of a duty gate operation.
  public type DutyGateResult = {
    ok          : Bool;
    agentId     : Text;
    newPhase    : AgentDutyPhase;
    message     : Text;
    beat        : Nat;
    attribution : Text;
  };

  /// Full duty gate system state.
  public type DutyGateState = {
    agents          : [AgentDutyRecord];
    totalAgents     : Nat;
    activeJobs      : Nat;        // agents in Deployed | Executing | Returning
    totalCycles     : Nat;        // cumulative completed duty cycles
    totalViolations : Nat;        // cumulative gate violations
    globalDutyScore : Float;      // aggregate duty doctrine score [0.75, 9.75]
    beat            : Nat;
    attribution     : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // III. NOVA CHARTER — NOVA-SIGIL-001
  //      The living charter of the Nova Protocol. 5 sections, 15 sovereign articles.
  //      The charter is not documentation — it IS the execution doctrine.
  //      The law = the execution surface.
  // ═══════════════════════════════════════════════════════════════════════════

  /// The five sections of the Nova Protocol charter.
  public type CharterSection = {
    #PhilosophicalSubstrate;   // I:   Clean Internet, Anti-Drift, Ancient Alignment
    #TriHeartRadius;           // II:  Biological Governance (three hearts + 830 mm/s)
    #SovereignAgentProtocols;  // III: Duty Gating, Home Frequency, Voice-Intention
    #MemoryRegistry;           // IV:  Sub-Note Inheritance, Phantom Cloud, Copyright
    #MathematicalDirective;    // V:   Torus Registry, Coherence Mandate, Sovereign ACK
  };

  /// A single sovereign article within the Nova Charter.
  /// isSovereign = true means it cannot be overridden — only amended by the Architect.
  public type CharterArticle = {
    articleId     : Text;        // e.g. "NOVA-I-01"
    section       : CharterSection;
    sectionNumber : Nat;         // 1-5
    title         : Text;
    lawText       : Text;        // the executable doctrine — law IS execution
    mathFormula   : Text;        // mathematical backing (empty string if not applicable)
    frequencyHz   : Float;       // resonance frequency (0.0 if not frequency-keyed)
    isSovereign   : Bool;
    doctrineScore : Float;       // [0.75, 9.75] — compounds on re-ingestion
    sealedAtBeat  : Nat;
    attribution   : Text;
  };

  /// Enforcement result when the charter is checked against live state.
  public type CharterCheckResult = {
    compliant     : Bool;
    violations    : [Text];      // list of violated article IDs
    globalCoherence : Float;
    beat          : Nat;
    attribution   : Text;
  };

  /// Full Nova Charter state — NOVA-SIGIL-001 living document.
  public type NovaCharterState = {
    documentId         : Text;   // "NOVA-SIGIL-001"
    version            : Nat;
    articles           : [CharterArticle];
    totalArticles      : Nat;
    globalCoherence    : Float;  // avg doctrineScore across all articles [0.75, 9.75]
    schumannAnchor     : Float;  // 7.83 Hz — immutable anti-drift constant
    coherenceVelocity  : Float;  // 830.0 mm/s — immutable Nova constant
    violations         : [Text]; // article IDs that have drifted below S_FLOOR
    totalViolations    : Nat;
    sealedAtBeat       : Nat;
    lastCheckedBeat    : Nat;
    architectSignature : Text;   // "Alfredo Medina Hernandez"
    isLive             : Bool;
    attribution        : Text;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // IV. FULL NOVA PROTOCOL STATE — single stable var in main.mo
  // ═══════════════════════════════════════════════════════════════════════════

  /// Complete Nova Protocol state — all three systems unified.
  public type NovaProtocolState = {
    triHeart    : TriHeartState;
    dutyGate    : DutyGateState;
    novaCharter : NovaCharterState;
    beat        : Nat;
    attribution : Text;
  };

}
