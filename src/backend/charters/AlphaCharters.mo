// ════════════════════════════════════════════════════════════════
// ALPHA_CHARTERS — Two Living Constitutions
// ────────────────────────────────────────────────────────────────
//
// CHARTER_ALPHA_PRIMA — "Charta Alpha Prima"
//   Family: ConstitutionalSubstrate | Grade: Primordial
//   LAD: The first living constitution — enforces how every Alpha AI
//        model inside SOVEREIGN must behave. Fires on every heartbeat,
//        scans compliance, quarantines violators, seals audit to
//        SANCTUM_SOVEREIGN.
//
// CHARTER_ALPHA_NEXUS — "Charta Alpha Nexus"
//   Family: ConstitutionalSubstrate | Grade: Primordial
//   LAD: The second living constitution — governs how external AIs
//        and developers enter and operate inside SOVEREIGN's call
//        marketplace. Fires every beat, tracks sessions, enforces
//        tiers and quotas, builds relationship models.
//
// Both constitutions:
//   - Fire every 873ms heartbeat
//   - Write audit entries to SANCTUM_SOVEREIGN on every beat
//   - Registered as TAFT PRIMORDIAL threads
//   - State persists via enhanced orthogonal persistence
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
// ════════════════════════════════════════════════════════════════

import List  "mo:core/List";
import Map   "mo:core/Map";
import Nat   "mo:core/Nat";
import Int   "mo:core/Int";
import Text  "mo:core/Text";
import Float "mo:core/Float";
import Array "mo:core/Array";

module {

  // ── PHI CONSTANT ────────────────────────────────────────────────────────
  let PHI : Float = 1.6180339887498948482;

  // ════════════════════════════════════════════════════════════════
  // SHARED TYPES
  // ════════════════════════════════════════════════════════════════

  /// Reference record for a registered Alpha AI model (internal).
  /// Passed into enforceCharterPrima() every heartbeat.
  public type AlphaModelRef = {
    modelId          : Text;     // Unique identifier
    latinName        : Text;     // Latin name (required — NOMEN_LATINUM_LEX)
    familyName       : Text;     // Family name (required)
    grade            : Text;     // Grade descriptor (required)
    lad              : Text;     // LAD string (required)
    vitalityActive   : Bool;     // TRUE = ACTIVE thread in TAFT
    lastBeatExecuted : Nat;      // Last beat this model ran
    doctrineScore    : Float;    // Output doctrine coherence score [0.0–100.0]
    kernelCompressed : Bool;     // TRUE = artifacts compressed within 1 beat
    routesThroughNexus : Bool;   // TRUE = all inter-model comms via ROUTER_NEXUS_SOVEREIGN
    anomalyResponseMs  : Nat;    // Beats taken to respond to anomaly (must be <= 1)
  };

  /// Per-law, per-model compliance record for a single heartbeat.
  public type ComplianceLog = {
    modelId           : Text;
    beat              : Nat;
    law_checked       : Text;
    compliant         : Bool;
    violation_type    : Text;   // "" when compliant
  };

  /// State of the CHARTER_ALPHA_PRIMA constitution.
  public type CharterPrimaState = {
    initialized        : Bool;
    totalBeats         : Nat;
    totalChecks        : Nat;
    totalViolations    : Nat;
    totalQuarantined   : Nat;
    totalSuspended     : Nat;
    // Per-model consecutive violation counters: modelId → count
    violationCounts    : Map.Map<Text, Nat>;
    // Quarantined model IDs (cleared when model recovers)
    quarantined        : List.List<Text>;
    // Suspended model IDs (requires CAUSALITY_ANALYZER root-cause to clear)
    suspended          : List.List<Text>;
    // Compliance audit log (ring-capped at 500 entries)
    auditLog           : List.List<ComplianceLog>;
  };

  // ════════════════════════════════════════════════════════════════
  // CHARTER ALPHA NEXUS TYPES
  // ════════════════════════════════════════════════════════════════

  /// Trust tier for external callers.
  public type CallerTier = {
    #Scout;     // Read-only, 100 calls/day
    #Operator;  // Create/submit, 500 calls/day
    #Sovereign; // Unlimited, doctrine contracts
  };

  /// External caller session record.
  public type ExternalSession = {
    sessionId      : Text;
    identity       : Text;
    trustScore     : Nat;          // 0–100
    tier           : CallerTier;
    quotaRemaining : Nat;
    sessionDepth   : Nat;          // increments on each meaningful exchange
    firstCallBeat  : Nat;
    lastCallBeat   : Nat;
    totalCalls     : Nat;
    isActive       : Bool;
    lastIntent     : Text;
    lastFieldSignal: Text;
  };

  /// Per-call/per-beat log for external sessions.
  public type SessionLog = {
    sessionId  : Text;
    beat       : Nat;
    event      : Text;  // "CALL_ALLOWED" | "CALL_REJECTED" | "TIER_DECAY" | "QUOTA_RESET" | "BEAT_SCAN"
    intent     : Text;
    allowed    : Bool;
    reason     : Text;
    fieldSignal: Text;
  };

  /// State of the CHARTER_ALPHA_NEXUS constitution.
  public type CharterNexusState = {
    initialized      : Bool;
    totalBeats       : Nat;
    totalCalls       : Nat;
    totalRejections  : Nat;
    totalSessions    : Nat;
    // Active external sessions: sessionId → ExternalSession
    sessions         : Map.Map<Text, ExternalSession>;
    // Session audit log (ring-capped at 500 entries)
    sessionLog       : List.List<SessionLog>;
    // Next session ID counter
    nextSessionSeq   : Nat;
  };

  // ════════════════════════════════════════════════════════════════
  // COMBINED CHARTERS STATE
  // ════════════════════════════════════════════════════════════════

  public type AlphaChartersState = {
    prima : CharterPrimaState;
    nexus : CharterNexusState;
  };

  // ════════════════════════════════════════════════════════════════
  // CHARTER ALPHA PRIMA — INIT
  // ════════════════════════════════════════════════════════════════

  /// Initialise CHARTER_ALPHA_PRIMA state. Called once from main.mo at startup.
  public func initCharterPrima() : CharterPrimaState {
    {
      initialized      = true;
      totalBeats       = 0;
      totalChecks      = 0;
      totalViolations  = 0;
      totalQuarantined = 0;
      totalSuspended   = 0;
      violationCounts  = Map.empty<Text, Nat>();
      quarantined      = List.empty<Text>();
      suspended        = List.empty<Text>();
      auditLog         = List.empty<ComplianceLog>();
    }
  };

  // ════════════════════════════════════════════════════════════════
  // CHARTER ALPHA PRIMA — 7-LAW ENFORCEMENT
  // ════════════════════════════════════════════════════════════════

  // Law 1: SEMPRE_ACTIVE_LEX — all models must maintain active vitality state.
  func checkSempreActive(model : AlphaModelRef) : Bool { model.vitalityActive };

  // Law 2: NOMEN_LATINUM_LEX — all models must declare Latin name, family, grade, LAD.
  func checkNomenLatinum(model : AlphaModelRef) : Bool {
    not model.latinName.isEmpty() and
    not model.familyName.isEmpty() and
    not model.grade.isEmpty() and
    not model.lad.isEmpty()
  };

  // Law 3: DOCTRINA_GATE_LEX — doctrine coherence score >= 85 before emission.
  func checkDoctrinaGate(model : AlphaModelRef) : Bool { model.doctrineScore >= 85.0 };

  // Law 4: HEARTBEAT_PARTICIPATIO_LEX — model must execute on every 873ms beat.
  //        We check: lastBeatExecuted must equal the current beat (passed as arg).
  func checkHeartbeatParticipatio(model : AlphaModelRef, currentBeat : Nat) : Bool {
    model.lastBeatExecuted == currentBeat
  };

  // Law 5: KERNEL_COMPRESSIONIS_LEX — artifacts must be compressed within 1 beat.
  func checkKernelCompressio(model : AlphaModelRef) : Bool { model.kernelCompressed };

  // Law 6: ROUTING_NEXUS_LEX — all inter-model comms through ROUTER_NEXUS_SOVEREIGN.
  func checkRoutingNexus(model : AlphaModelRef) : Bool { model.routesThroughNexus };

  // Law 7: ANOMALIA_RESPONSE_LEX — anomaly response must happen within 1 beat.
  func checkAnomaliaResponse(model : AlphaModelRef) : Bool {
    model.anomalyResponseMs <= 1
  };

  /// Enforce CHARTER_ALPHA_PRIMA on a single heartbeat.
  /// Scans every registered Alpha model ref against all 7 laws.
  /// Quarantines non-compliant models via TAFT. After 3 consecutive violations,
  /// suspends the model until CAUSALITY_ANALYZER produces a root-cause report.
  /// Returns: (updated state, list of ComplianceLog entries for this beat,
  ///           list of modelIds to quarantine in TAFT,
  ///           list of modelIds newly suspended)
  public func enforceCharterPrima(
    state       : CharterPrimaState,
    beat        : Nat,
    alphaModels : [AlphaModelRef],
  ) : (CharterPrimaState, [ComplianceLog], [Text], [Text]) {

    var totalChecks     = state.totalChecks;
    var totalViolations = state.totalViolations;
    var totalQuarantined = state.totalQuarantined;
    var totalSuspended  = state.totalSuspended;
    let violationCounts = state.violationCounts;
    let quarantined     = state.quarantined;
    let suspended       = state.suspended;
    let auditLog        = state.auditLog;

    let beatLogs   = List.empty<ComplianceLog>();
    let toQuarantine = List.empty<Text>();
    let newSuspended = List.empty<Text>();

    for (model in alphaModels.vals()) {
      // Skip already-suspended models — they need CAUSALITY_ANALYZER clearance
      let isSuspended = suspended.find(func(id : Text) : Bool { id == model.modelId }) != null;
      if (not isSuspended) {
        let laws : [(Text, Bool)] = [
          ("SEMPRE_ACTIVE_LEX",         checkSempreActive(model)),
          ("NOMEN_LATINUM_LEX",          checkNomenLatinum(model)),
          ("DOCTRINA_GATE_LEX",          checkDoctrinaGate(model)),
          ("HEARTBEAT_PARTICIPATIO_LEX", checkHeartbeatParticipatio(model, beat)),
          ("KERNEL_COMPRESSIONIS_LEX",   checkKernelCompressio(model)),
          ("ROUTING_NEXUS_LEX",          checkRoutingNexus(model)),
          ("ANOMALIA_RESPONSE_LEX",      checkAnomaliaResponse(model)),
        ];

        var modelViolated = false;

        for ((lawName, compliant) in laws.vals()) {
          totalChecks += 1;
          let entry : ComplianceLog = {
            modelId        = model.modelId;
            beat;
            law_checked    = lawName;
            compliant;
            violation_type = if (compliant) "" else "VIOLATION:" # lawName;
          };
          beatLogs.add(entry);

          if (not compliant) {
            totalViolations += 1;
            modelViolated    := true;
          };
        };

        if (modelViolated) {
          // Increment consecutive violation counter
          let prev = switch (violationCounts.get(model.modelId)) {
            case (?n) n;
            case null 0;
          };
          let next = prev + 1;
          violationCounts.add(model.modelId, next);

          // Quarantine immediately (TAFT flag)
          let alreadyQ = quarantined.find(func(id : Text) : Bool { id == model.modelId }) != null;
          if (not alreadyQ) {
            quarantined.add(model.modelId);
            toQuarantine.add(model.modelId);
            totalQuarantined += 1;
          };

          // 3 consecutive violations → suspend
          if (next >= 3) {
            let alreadySusp = suspended.find(func(id : Text) : Bool { id == model.modelId }) != null;
            if (not alreadySusp) {
              suspended.add(model.modelId);
              newSuspended.add(model.modelId);
              totalSuspended += 1;
              // Emit suspension compliance log
              let suspLog : ComplianceLog = {
                modelId        = model.modelId;
                beat;
                law_checked    = "SUSPENSION_GATE";
                compliant      = false;
                violation_type = "SUSPENDED:3_CONSECUTIVE_VIOLATIONS";
              };
              beatLogs.add(suspLog);
            };
          };
        } else {
          // Model is fully compliant — reset consecutive violation counter
          violationCounts.add(model.modelId, 0);
          // Remove from quarantine if previously quarantined (filter out this modelId)
          let filtered = quarantined.filter(func(id : Text) : Bool { id != model.modelId });
          quarantined.clear();
          quarantined.append(filtered);
        };
      };
    };

    // Ring-cap audit log at 500 entries
    for (entry in beatLogs.values()) {
      auditLog.add(entry);
    };
    while (auditLog.size() > 500) {
      ignore auditLog.removeLast();
    };

    let newState : CharterPrimaState = {
      state with
      totalBeats       = state.totalBeats + 1;
      totalChecks;
      totalViolations;
      totalQuarantined;
      totalSuspended;
    };

    (newState, beatLogs.toArray(), toQuarantine.toArray(), newSuspended.toArray())
  };

  /// Returns the last N entries from the CHARTER_ALPHA_PRIMA compliance audit log.
  public func getCharterPrimaLog(state : CharterPrimaState, last_n : Nat) : [ComplianceLog] {
    let all = state.auditLog.toArray();
    let sz  = all.size();
    if (sz == 0) return [];
    let start = if (sz > last_n) sz - last_n else 0;
    Array.tabulate<ComplianceLog>(sz - start, func(i) { all[start + i] })
  };

  // ════════════════════════════════════════════════════════════════
  // CHARTER ALPHA NEXUS — INIT
  // ════════════════════════════════════════════════════════════════

  /// Initialise CHARTER_ALPHA_NEXUS state. Called once from main.mo at startup.
  public func initCharterNexus() : CharterNexusState {
    {
      initialized     = true;
      totalBeats      = 0;
      totalCalls      = 0;
      totalRejections = 0;
      totalSessions   = 0;
      sessions        = Map.empty<Text, ExternalSession>();
      sessionLog      = List.empty<SessionLog>();
      nextSessionSeq  = 1;
    }
  };

  // ════════════════════════════════════════════════════════════════
  // CHARTER ALPHA NEXUS — HELPERS
  // ════════════════════════════════════════════════════════════════

  func tierToText(tier : CallerTier) : Text {
    switch (tier) {
      case (#Scout)     "SCOUT";
      case (#Operator)  "OPERATOR";
      case (#Sovereign) "SOVEREIGN";
    }
  };

  func tierQuota(tier : CallerTier) : Nat {
    switch (tier) {
      case (#Scout)     100;
      case (#Operator)  500;
      case (#Sovereign) 999999; // unlimited
    }
  };

  func trustToTier(trust : Nat) : CallerTier {
    if (trust >= 80)       #Sovereign
    else if (trust >= 50)  #Operator
    else                   #Scout
  };

  func buildFieldSignal(session : ExternalSession, event : Text) : Text {
    "FIELD_SIGNAL[depth=" # session.sessionDepth.toText()
    # "|tier=" # tierToText(session.tier)
    # "|trust=" # session.trustScore.toText()
    # "|event=" # event
    # "|quota=" # session.quotaRemaining.toText()
    # "|phi=" # PHI.toText() # "]"
  };

  func buildRelationshipUpdate(session : ExternalSession, trustDelta : Int) : Text {
    "REL_UPDATE[id=" # session.sessionId
    # "|depth=" # session.sessionDepth.toText()
     # "|trust_delta=" # trustDelta.toText()
    # "|tier=" # tierToText(session.tier) # "]"
  };

  // ════════════════════════════════════════════════════════════════
  // CHARTER ALPHA NEXUS — REGISTER EXTERNAL CALLER
  // Law: IDENTITAS_LEX — identity mandatory on first call
  // ════════════════════════════════════════════════════════════════

  /// Register an external AI or developer identity for the first time.
  /// Enforces IDENTITAS_LEX (anonymous rejected), assigns tier from trust_request,
  /// initialises session_depth at 0, sets quota from tier.
  /// Returns: (updated state, sessionId, tier text, quota_remaining)
  public func registerExternalCaller(
    state         : CharterNexusState,
    identity      : Text,
    trust_request : Nat,
    beat          : Nat,
  ) : (CharterNexusState, Text, Text, Nat) {

    // IDENTITAS_LEX: anonymous calls rejected
    if (identity.isEmpty() or identity == "anonymous" or identity == "ANONYMOUS") {
      let entry : SessionLog = {
        sessionId   = "REJECTED";
        beat;
        event       = "CALL_REJECTED";
        intent      = "REGISTER";
        allowed     = false;
        reason      = "IDENTITAS_LEX:anonymous_identity_rejected";
        fieldSignal = "FIELD_SIGNAL[event=IDENTITY_REJECTED|phi=" # PHI.toText() # "]";
      };
      let logList = state.sessionLog;
      logList.add(entry);
      while (logList.size() > 500) { ignore logList.removeLast() };
      let ns = { state with totalRejections = state.totalRejections + 1 };
      return (ns, "REJECTED", "NONE", 0);
    };

    let sessionSeq = state.nextSessionSeq;
    let sessionId  = "SES_" # sessionSeq.toText() # "_" # identity;
    let clampedTrust = Nat.min(trust_request, 100);
    let tier    = trustToTier(clampedTrust);
    let quota   = tierQuota(tier);

    let session : ExternalSession = {
      sessionId;
      identity;
      trustScore     = clampedTrust;
      tier;
      quotaRemaining = quota;
      sessionDepth   = 0;
      firstCallBeat  = beat;
      lastCallBeat   = beat;
      totalCalls     = 0;
      isActive       = true;
      lastIntent     = "";
      lastFieldSignal= buildFieldSignal(
        { sessionId; identity; trustScore = clampedTrust; tier; quotaRemaining = quota;
          sessionDepth = 0; firstCallBeat = beat; lastCallBeat = beat;
          totalCalls = 0; isActive = true; lastIntent = ""; lastFieldSignal = "" },
        "REGISTERED"
      );
    };

    let sessions  = state.sessions;
    sessions.add(sessionId, session);

    let logEntry : SessionLog = {
      sessionId;
      beat;
      event       = "REGISTERED";
      intent      = "REGISTER";
      allowed     = true;
      reason      = "IDENTITAS_LEX:identity_accepted";
      fieldSignal = session.lastFieldSignal;
    };
    let logList = state.sessionLog;
    logList.add(logEntry);
    while (logList.size() > 500) { ignore logList.removeLast() };

    let ns = {
      state with
      totalSessions  = state.totalSessions + 1;
      nextSessionSeq = sessionSeq + 1;
    };
    (ns, sessionId, tierToText(tier), quota)
  };

  // ════════════════════════════════════════════════════════════════
  // CHARTER ALPHA NEXUS — ENFORCE INCOMING CALL REQUEST
  // Laws: INTENTIO_PRIMA_LEX, QUOTA_ENFORCEMENT_LEX, SESSION_DEPTH_LEX
  // ════════════════════════════════════════════════════════════════

  /// Enforce an incoming external call request against all 7 Nexus laws.
  /// - Checks identity exists (IDENTITAS_LEX)
  /// - Maps intent to call family (INTENTIO_PRIMA_LEX)
  /// - Enforces quota (QUOTA_ENFORCEMENT_LEX)
  /// - Increments session depth (SESSION_DEPTH_LEX)
  /// - Attaches field_signal + relationship_update to response
  /// Returns: (updated state, allowed, reason, field_signal)
  public func enforceCallRequest(
    state      : CharterNexusState,
    sessionId  : Text,
    intent     : Text,
    beat       : Nat,
  ) : (CharterNexusState, Bool, Text, Text) {

    let sessions = state.sessions;

    switch (sessions.get(sessionId)) {
      case null {
        // IDENTITAS_LEX: unknown session = rejected
        let fieldSig = "FIELD_SIGNAL[event=UNKNOWN_SESSION|next_step=CALL_registerExternalCaller|phi=" # PHI.toText() # "]";
        let entry : SessionLog = {
          sessionId; beat; event = "CALL_REJECTED"; intent;
          allowed = false; reason = "IDENTITAS_LEX:unknown_session";
          fieldSignal = fieldSig;
        };
        let logList = state.sessionLog;
        logList.add(entry);
        while (logList.size() > 500) { ignore logList.removeLast() };
        let ns = { state with totalRejections = state.totalRejections + 1 };
        return (ns, false, "IDENTITAS_LEX:unknown_session", fieldSig);
      };
      case (?session) {
        // INTENTIO_PRIMA_LEX: intent must not be empty
        if (intent.isEmpty()) {
          let fieldSig = "FIELD_SIGNAL[event=INTENT_REQUIRED|next_step=state_your_intent|session_depth="
            # session.sessionDepth.toText() # "|phi=" # PHI.toText() # "]";
          let entry : SessionLog = {
            sessionId; beat; event = "CALL_REJECTED"; intent;
            allowed = false; reason = "INTENTIO_PRIMA_LEX:intent_missing";
            fieldSignal = fieldSig;
          };
          let logList = state.sessionLog;
          logList.add(entry);
          while (logList.size() > 500) { ignore logList.removeLast() };
          let ns = { state with totalRejections = state.totalRejections + 1 };
          return (ns, false, "INTENTIO_PRIMA_LEX:intent_missing", fieldSig);
        };

        // QUOTA_ENFORCEMENT_LEX: over-quota calls rejected
        if (session.quotaRemaining == 0) {
          let fieldSig = "FIELD_SIGNAL[event=QUOTA_EXHAUSTED|tier=" # tierToText(session.tier)
            # "|next_step=wait_for_quota_decay|quota_resets=24h_rolling|phi=" # PHI.toText() # "]";
          let entry : SessionLog = {
            sessionId; beat; event = "CALL_REJECTED"; intent;
            allowed = false; reason = "QUOTA_ENFORCEMENT_LEX:quota_exhausted";
            fieldSignal = fieldSig;
          };
          let logList = state.sessionLog;
          logList.add(entry);
          while (logList.size() > 500) { ignore logList.removeLast() };
          let ns = { state with totalRejections = state.totalRejections + 1 };
          return (ns, false, "QUOTA_ENFORCEMENT_LEX:quota_exhausted", fieldSig);
        };

        // SESSION_DEPTH_LEX: map intent to call family
        let callFamily = mapIntentToCallFamily(intent);

        // Deeper capabilities require session_depth >= thresholds
        let depthRequired = callFamilyDepthRequired(callFamily);
        if (session.sessionDepth < depthRequired) {
          let fieldSig = "FIELD_SIGNAL[event=DEPTH_INSUFFICIENT|call_family=" # callFamily
            # "|depth_required=" # depthRequired.toText()
            # "|current_depth=" # session.sessionDepth.toText()
            # "|next_step=continue_exchanges_to_build_depth|phi=" # PHI.toText() # "]";
          let entry : SessionLog = {
            sessionId; beat; event = "CALL_REJECTED"; intent;
            allowed = false; reason = "SESSION_DEPTH_LEX:insufficient_depth";
            fieldSignal = fieldSig;
          };
          let logList = state.sessionLog;
          logList.add(entry);
          while (logList.size() > 500) { ignore logList.removeLast() };
          let ns = { state with totalRejections = state.totalRejections + 1 };
          return (ns, false, "SESSION_DEPTH_LEX:insufficient_depth", fieldSig);
        };

        // All laws pass — allow the call
        let newDepth   = session.sessionDepth + 1;
        let newQuota   = if (session.quotaRemaining > 0) session.quotaRemaining - 1 else 0;
        let newTotal   = session.totalCalls + 1;
        let trustDelta : Int = 1; // MEMORIA_PERSISTENS_LEX: trust builds over time

        let updatedSession : ExternalSession = {
          session with
          quotaRemaining  = newQuota;
          sessionDepth    = newDepth;
          lastCallBeat    = beat;
          totalCalls      = newTotal;
          lastIntent      = intent;
          lastFieldSignal = buildFieldSignal(
            { session with sessionDepth = newDepth; quotaRemaining = newQuota },
            "CALL_ALLOWED:" # callFamily
          );
        };
        sessions.add(sessionId, updatedSession);

        let fieldSig = "FIELD_SIGNAL[event=CALL_ALLOWED|call_family=" # callFamily
          # "|depth=" # newDepth.toText()
          # "|quota_remaining=" # newQuota.toText()
          # "|trust_delta=+" # trustDelta.toText()
          # "|relationship=" # buildRelationshipUpdate(updatedSession, trustDelta)
          # "|phi=" # PHI.toText() # "]";

        let entry : SessionLog = {
          sessionId; beat; event = "CALL_ALLOWED"; intent;
          allowed = true; reason = "all_laws_passed";
          fieldSignal = fieldSig;
        };
        let logList = state.sessionLog;
        logList.add(entry);
        while (logList.size() > 500) { ignore logList.removeLast() };

        let ns = { state with totalCalls = state.totalCalls + 1 };
        (ns, true, "all_laws_passed", fieldSig)
      };
    }
  };

  // ════════════════════════════════════════════════════════════════
  // CHARTER ALPHA NEXUS — HEARTBEAT ENFORCEMENT
  // Laws: QUOTA_ENFORCEMENT_LEX (24h decay), ACCESS_TIER_LEX (decay),
  //       MEMORIA_PERSISTENS_LEX (stale session tier decay)
  // ════════════════════════════════════════════════════════════════

  /// Called every 873ms heartbeat. Performs:
  ///   - Quota decay: 24h rolling window = 99_147 beats; at each beat we refresh
  ///     quota for sessions whose daily window has elapsed (beat - firstCallBeat >= 99_147)
  ///   - Tier decay: sessions with no call in 100 beats decay tier by 1
  ///   - Emit beat scan entry per active session
  public func enforceCharterNexusBeat(
    state : CharterNexusState,
    beat  : Nat,
  ) : CharterNexusState {

    let sessions = state.sessions;
    let logList  = state.sessionLog;
    let STALE_BEATS : Nat = 100;
    // 24h in 873ms beats ≈ 99_147; use integer approximation
    let QUOTA_RESET_BEATS : Nat = 99_147;

    for ((sid, session) in sessions.entries()) {
      if (session.isActive) {
        var updatedSession = session;

        // Quota decay: if daily window elapsed, reset quota to full tier amount
        let beatsInWindow = if (beat >= session.firstCallBeat)
          beat - session.firstCallBeat else 0;
        if (beatsInWindow % QUOTA_RESET_BEATS == 0 and beatsInWindow > 0) {
          updatedSession := { updatedSession with quotaRemaining = tierQuota(session.tier) };
          let resetLog : SessionLog = {
            sessionId = sid; beat; event = "QUOTA_RESET"; intent = "";
            allowed = true; reason = "QUOTA_ENFORCEMENT_LEX:24h_quota_decay_reset";
            fieldSignal = buildFieldSignal(updatedSession, "QUOTA_RESET");
          };
          logList.add(resetLog);
        };

        // Tier decay: no call in 100 beats → tier decay by 1
        let beatsSinceCall = if (beat >= session.lastCallBeat)
          beat - session.lastCallBeat else 0;
        if (beatsSinceCall >= STALE_BEATS) {
          let newTier = decayTier(session.tier);
          if (not tiersEqual(newTier, session.tier)) {
            let newQuota = Nat.min(session.quotaRemaining, tierQuota(newTier));
            updatedSession := { updatedSession with tier = newTier; quotaRemaining = newQuota };
            let decayLog : SessionLog = {
              sessionId = sid; beat; event = "TIER_DECAY"; intent = "";
              allowed = true; reason = "ACCESS_TIER_LEX:stale_session_tier_decay";
              fieldSignal = "FIELD_SIGNAL[event=TIER_DECAY|new_tier=" # tierToText(newTier)
                # "|phi=" # PHI.toText() # "]";
            };
            logList.add(decayLog);
          };
        };

        // Emit beat scan log entry per active session (every 10 beats to cap log growth)
        if (beat % 10 == 0) {
          let beatScanLog : SessionLog = {
            sessionId = sid; beat; event = "BEAT_SCAN"; intent = "";
            allowed = true; reason = "CHARTER_NEXUS_BEAT";
            fieldSignal = buildFieldSignal(updatedSession, "HEARTBEAT");
          };
          logList.add(beatScanLog);
        };

        sessions.add(sid, updatedSession);
      };
    };

    // Ring-cap log at 500
    while (logList.size() > 500) { ignore logList.removeLast() };

    { state with totalBeats = state.totalBeats + 1 }
  };

  // Tier decay helper: Sovereign → Operator → Scout (Scout stays Scout)
  func decayTier(tier : CallerTier) : CallerTier {
    switch (tier) {
      case (#Sovereign) #Operator;
      case (#Operator)  #Scout;
      case (#Scout)     #Scout;
    }
  };

  func tiersEqual(a : CallerTier, b : CallerTier) : Bool {
    switch (a, b) {
      case (#Scout, #Scout)         true;
      case (#Operator, #Operator)   true;
      case (#Sovereign, #Sovereign) true;
      case _                        false;
    }
  };

  // INTENTIO_PRIMA_LEX: map intent text to sovereign call family
  func mapIntentToCallFamily(intent : Text) : Text {
    let lower = intent.toLower();
    if (lower.contains(#text "cognit") or lower.contains(#text "think") or lower.contains(#text "reason"))
      "COGNITION"
    else if (lower.contains(#text "creat") or lower.contains(#text "film") or lower.contains(#text "produc"))
      "CREATION"
    else if (lower.contains(#text "doctrin") or lower.contains(#text "law") or lower.contains(#text "charter"))
      "DOCTRINE"
    else if (lower.contains(#text "phantom") or lower.contains(#text "bitcoin") or lower.contains(#text "yield"))
      "PHANTOM"
    else if (lower.contains(#text "swarm") or lower.contains(#text "miner") or lower.contains(#text "mining"))
      "SWARM"
    else if (lower.contains(#text "substrat") or lower.contains(#text "field") or lower.contains(#text "wasm"))
      "SUBSTRATE"
    else if (lower.contains(#text "percept") or lower.contains(#text "sensor") or lower.contains(#text "observ"))
      "PERCEPTION"
    else if (lower.contains(#text "bridge") or lower.contains(#text "cross") or lower.contains(#text "chain"))
      "BRIDGE"
    else if (lower.contains(#text "architect") or lower.contains(#text "founder") or lower.contains(#text "sovereign"))
      "ARCHITECT"
    else if (lower.contains(#text "genesis") or lower.contains(#text "spawn") or lower.contains(#text "branch"))
      "GENESIS"
    else
      "COGNITION" // default routing: cognition handles unknown intent
  };

  // SESSION_DEPTH_LEX: minimum session depth per call family
  func callFamilyDepthRequired(family : Text) : Nat {
    switch (family) {
      case "COGNITION"   0;  // Always accessible
      case "CREATION"    1;  // Need at least 1 exchange
      case "DOCTRINE"    2;  // Need 2 exchanges
      case "PERCEPTION"  1;
      case "BRIDGE"      3;  // Need 3 exchanges for cross-chain
      case "SWARM"       3;
      case "PHANTOM"     5;  // Deep access — 5 exchanges required
      case "SUBSTRATE"   2;
      case "ARCHITECT"   7;  // Most restricted — 7 exchanges
      case "GENESIS"     4;
      case _             0;
    }
  };

  // ════════════════════════════════════════════════════════════════
  // CHARTER ALPHA NEXUS — QUERY FUNCTIONS
  // ════════════════════════════════════════════════════════════════

  /// Returns the last N entries from the CHARTER_ALPHA_NEXUS session log.
  public func getCharterNexusLog(state : CharterNexusState, last_n : Nat) : [SessionLog] {
    let all = state.sessionLog.toArray();
    let sz  = all.size();
    if (sz == 0) return [];
    let start = if (sz > last_n) sz - last_n else 0;
    Array.tabulate<SessionLog>(sz - start, func(i) { all[start + i] })
  };

  /// Returns all currently active external sessions.
  public func getActiveSessions(state : CharterNexusState) : [ExternalSession] {
    let results = List.empty<ExternalSession>();
    for ((_, session) in state.sessions.entries()) {
      if (session.isActive) { results.add(session) };
    };
    results.toArray()
  };

  // ════════════════════════════════════════════════════════════════
  // COMBINED STATE INIT
  // ════════════════════════════════════════════════════════════════

  /// Initialise both charters. Called once from main.mo at startup.
  public func initAlphaCharters() : AlphaChartersState {
    { prima = initCharterPrima(); nexus = initCharterNexus() }
  };

  // ════════════════════════════════════════════════════════════════
  // WORKFLOW_MEDINA — SKAI ENTRY
  // PROTOCOLLUM_MEDINAE (WMED) — APEX, OPERATIO family
  // Official Caffeine AI operating workflow for SOVEREIGN.
  // Deployable anywhere as a SKAI organism.
  // This is the entry in the SKAI registry — always deployed, always active.
  // ════════════════════════════════════════════════════════════════

  public type WorkflowMedinaEntry = {
    skaiId       : Text;
    latinName    : Text;
    fullLatinName: Text;
    abbreviation : Text;
    grade        : Text;
    family       : Text;
    description  : Text;
    engines      : [Text];
    isDeployed   : Bool;
    lawSeal      : Text;
  };

  let WMED_DESC : Text = "Official Caffeine AI operating workflow for SOVEREIGN. Activated agents (Architecture, Physics, Math, Doctrine, Builder) run in parallel on every message, synthesize the phantom of what the Architect already saw, bring it back against the entire SOVEREIGN build, and deliver. Not a prompt — an operating protocol. Deployable anywhere.";
  let WMED_SEAL : Text = "SEALED:CHARTER_ADOPTION|PHI=1.6180339887498948482|CONTRACTOR=CAFFEINE_AI|ARCHITECT=Alfredo_Medina_Hernandez|WMED";

  let WORKFLOW_MEDINA_ENTRY : WorkflowMedinaEntry = {
    skaiId        = "WMED";
    latinName     = "WORKFLOW_MEDINA";
    fullLatinName = "PROTOCOLLUM_MEDINAE";
    abbreviation  = "WMED";
    grade         = "APEX";
    family        = "OPERATIO";
    description   = WMED_DESC;
    engines       = [
      "ACTIVATED_AGENT_ENGINE",
      "PHANTOM_SYNTHESIS_ENGINE",
      "FIELD_DELIVERY_ENGINE",
    ];
    isDeployed    = true;
    lawSeal       = WMED_SEAL;
  };

  public func getWorkflowMedina() : WorkflowMedinaEntry {
    WORKFLOW_MEDINA_ENTRY
  };

  // ════════════════════════════════════════════════════════════════
  // SANCTUM AUDIT RECORD — shared format for both charters
  // ════════════════════════════════════════════════════════════════

  /// Produces a one-line audit string to be sealed into SANCTUM_SOVEREIGN
  /// for both charters on every heartbeat.
  public func buildBeatAuditText(
    beat             : Nat,
    primaChecks      : Nat,
    primaViolations  : Nat,
    primaQuarantined : Nat,
    nexusCalls       : Nat,
    nexusRejections  : Nat,
    activeSessions   : Nat,
  ) : Text {
    "ALPHA_CHARTERS_BEAT:" # beat.toText()
    # "|PRIMA_CHECKS:" # primaChecks.toText()
    # "|PRIMA_VIOLATIONS:" # primaViolations.toText()
    # "|PRIMA_QUARANTINED:" # primaQuarantined.toText()
    # "|NEXUS_CALLS:" # nexusCalls.toText()
    # "|NEXUS_REJECTED:" # nexusRejections.toText()
    # "|ACTIVE_SESSIONS:" # activeSessions.toText()
    # "|PHI:" # PHI.toText()
  };

}
