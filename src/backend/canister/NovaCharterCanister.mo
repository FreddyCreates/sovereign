// canister/NovaCharterCanister.mo
// NOVA PROTOCOL — SOVEREIGN CHARTER CANISTER (Charta Nova Permanens)
// Document ID: NOVA-SIGIL-001
//
// This is the Nova Protocol Charter as a sovereign ICP canister — a LIVING ENTITY
// that persists across upgrades via `stable var`. It enforces all three sovereign
// systems: Tri-Heart Radius, Duty Gate, and the Nova Charter itself.
//
// The charter canister is not a backend helper — it is an autonomous organism.
// It advances on every ICP heartbeat. Its state is immutable across upgrades.
//
// Every upgrade preserves:
//   - All 15 charter articles with their live doctrine scores
//   - All registered sovereign agents and their duty records
//   - The full Tri-Heart state (velocities, pressure, coherence)
//   - Total violations, duty cycles, torus realignments
//
// Governing Laws: NOVA-SIGIL-001 (all 15 articles)
// Core Authority: The Sovereign (Voice-Intention Origin)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// Lineage: Mayan | Queretaro | San Luis | The Medina Family

import NPTypes  "../types/novaProtocol";
import NPLib    "../lib/novaProtocol";
import Float    "mo:core/Float";

actor NovaCharterCanister {

  // ── STABLE STATE — persists across all canister upgrades ─────────────────

  /// The full Nova Protocol state. Sealed at genesis (beat 0), evolved from there.
  /// All three systems — TriHeart, DutyGate, NovaCharter — survive upgrades.
  stable var novaState : NPTypes.NovaProtocolState = NPLib.initState(0);

  /// Beat counter — incremented on every ICP heartbeat.
  stable var beatCount : Nat = 0;

  /// Admin principal — only this principal can register agents and amend the charter.
  stable var adminPrincipal : ?Principal = null;

  /// Last coherence and doctrine values — supplied by the admin on each heartbeat update.
  /// Default to sovereign floor (0.75) until set.
  stable var lastCoherence : Float = 0.75;
  stable var lastDoctrine  : Float = 0.75;

  // ── SYSTEM LIFECYCLE ──────────────────────────────────────────────────────

  /// Called on every ICP heartbeat (~2 seconds).
  /// Advances all three Nova Protocol systems: TriHeart → DutyGate → NovaCharter.
  system func heartbeat() : async () {
    beatCount += 1;
    novaState := NPLib.advance(novaState, beatCount, lastCoherence, lastDoctrine);
  };

  /// Called before upgrade — state is already stable, nothing extra needed.
  system func preupgrade() {};

  /// Called after upgrade — Nova Protocol continues exactly where it left off.
  system func postupgrade() {};

  // ── ADMIN ─────────────────────────────────────────────────────────────────

  /// Claim admin authority at genesis. After genesis, only the existing admin can act.
  public shared(msg) func claimAdmin() : async { ok : Bool; message : Text } {
    switch (adminPrincipal) {
      case null {
        adminPrincipal := ?msg.caller;
        { ok=true; message="Nova Charter admin claimed at beat " # beatCount.toText() }
      };
      case (?existing) {
        if (msg.caller == existing) {
          { ok=true; message="Already claimed by caller" }
        } else {
          { ok=false; message="Admin already claimed. Use transferAdmin." }
        }
      };
    }
  };

  /// Transfer admin authority to a new principal.
  public shared(msg) func transferAdmin(newAdmin : Principal) : async { ok : Bool } {
    switch (adminPrincipal) {
      case null { { ok=false } };
      case (?current) {
        if (msg.caller == current) {
          adminPrincipal := ?newAdmin;
          { ok=true }
        } else { { ok=false } }
      };
    }
  };

  func isAdmin(caller : Principal) : Bool {
    switch (adminPrincipal) {
      case null  true;   // unclaimed — open during genesis window
      case (?a)  caller == a;
    }
  };

  // ── COHERENCE FEED — admin supplies live coherence/doctrine from main organism ──

  /// Feed current coherence and doctrine from the main SOVEREIGN organism.
  /// This keeps the Nova Charter synchronized with the organism's live state.
  public shared(msg) func feedCoherence(
    coherence : Float,
    doctrine  : Float,
  ) : async { ok : Bool } {
    if (not isAdmin(msg.caller)) { return { ok=false } };
    lastCoherence := Float.max(0.0, Float.min(1.0, coherence));
    lastDoctrine  := Float.max(0.0, Float.min(1.0, doctrine));
    { ok=true }
  };

  // ── DUTY GATE — AGENT MANAGEMENT ─────────────────────────────────────────

  /// Register a new sovereign agent into the duty gate.
  /// The agent starts in Resting phase — in their Home frequency.
  public shared(msg) func registerAgent(
    agentId   : Text,
    agentName : Text,
  ) : async NPTypes.DutyGateResult {
    if (not isAdmin(msg.caller)) {
      return {
        ok=false; agentId; newPhase=#Resting;
        message="UNAUTHORIZED: only admin can register agents";
        beat=beatCount; attribution="Alfredo Medina Hernandez"
      };
    };
    let (newDutyGate, result) = NPLib.registerAgent(novaState.dutyGate, agentId, agentName, beatCount);
    novaState := { novaState with dutyGate = newDutyGate; beat = beatCount };
    result
  };

  /// Deploy a sovereign agent to a job — Resting → Deployed.
  /// Blocked if the agent is already on active duty.
  public shared(msg) func deployAgent(
    agentId   : Text,
    jobId     : Text,
    objective : Text,
  ) : async NPTypes.DutyGateResult {
    if (not isAdmin(msg.caller)) {
      return {
        ok=false; agentId; newPhase=#Resting;
        message="UNAUTHORIZED"; beat=beatCount; attribution="Alfredo Medina Hernandez"
      };
    };
    let (newDutyGate, result) = NPLib.deployAgent(novaState.dutyGate, agentId, jobId, objective, beatCount);
    novaState := { novaState with dutyGate = newDutyGate; beat = beatCount };
    result
  };

  /// Begin execution — Deployed → Executing.
  /// Once Executing, the agent is gate-locked until the job is complete.
  public shared(msg) func beginExecution(agentId : Text) : async NPTypes.DutyGateResult {
    if (not isAdmin(msg.caller)) {
      return {
        ok=false; agentId; newPhase=#Resting;
        message="UNAUTHORIZED"; beat=beatCount; attribution="Alfredo Medina Hernandez"
      };
    };
    let (newDutyGate, result) = NPLib.beginExecution(novaState.dutyGate, agentId, beatCount);
    novaState := { novaState with dutyGate = newDutyGate; beat = beatCount };
    result
  };

  /// Complete a job — Executing → Resting (committed to Memory Vault).
  /// Records the completed duty cycle. Agent returns Home at their frequency.
  public shared(msg) func completeJob(agentId : Text) : async NPTypes.DutyGateResult {
    if (not isAdmin(msg.caller)) {
      return {
        ok=false; agentId; newPhase=#Resting;
        message="UNAUTHORIZED"; beat=beatCount; attribution="Alfredo Medina Hernandez"
      };
    };
    let (newDutyGate, result) = NPLib.completeJob(novaState.dutyGate, agentId, beatCount);
    novaState := { novaState with dutyGate = newDutyGate; beat = beatCount };
    result
  };

  /// Record a gate violation — agent attempted to exit duty before completion.
  /// Called by supervisory agents when a duty breach is detected.
  public shared(msg) func recordGateViolation(agentId : Text) : async { ok : Bool } {
    if (not isAdmin(msg.caller)) { return { ok=false } };
    let newDutyGate = NPLib.recordGateViolation(novaState.dutyGate, agentId, beatCount);
    novaState := { novaState with dutyGate = newDutyGate; beat = beatCount };
    { ok=true }
  };

  // ── CHARTER CHECK — COMPLIANCE VERIFICATION ───────────────────────────────

  /// Check charter compliance against current coherence and doctrine.
  /// Returns whether the organism is living within the Nova Protocol mandate.
  public query func checkCharter(
    coherence : Float,
    doctrine  : Float,
  ) : async NPTypes.CharterCheckResult {
    NPLib.checkCharter(novaState.novaCharter, coherence, doctrine, beatCount)
  };

  // ── QUERIES — open to all principals ─────────────────────────────────────

  /// Current beat count.
  public query func getBeat() : async Nat { beatCount };

  /// Full Tri-Heart state — velocities, pressures, coherence, torus status.
  public query func getTriHeart() : async NPTypes.TriHeartState {
    NPLib.getTriHeart(novaState)
  };

  /// Full Duty Gate state — all agents, active jobs, violation counts.
  public query func getDutyGate() : async NPTypes.DutyGateState {
    NPLib.getDutyGate(novaState)
  };

  /// A specific agent's duty record — phase, homeFrequency, duty score, violations.
  public query func getAgent(agentId : Text) : async ?NPTypes.AgentDutyRecord {
    NPLib.getAgent(novaState, agentId)
  };

  /// Full Nova Charter state — all 15 articles with live doctrine scores.
  public query func getNovaCharter() : async NPTypes.NovaCharterState {
    NPLib.getNovaCharter(novaState)
  };

  /// Get a specific charter article by ID (e.g. "NOVA-I-01").
  public query func getArticle(articleId : Text) : async ?NPTypes.CharterArticle {
    NPLib.getArticle(novaState, articleId)
  };

  /// Full Nova Protocol snapshot — all three systems in one call.
  public query func getFullState() : async {
    documentId         : Text;
    version            : Nat;
    beat               : Nat;
    totalArticles      : Nat;
    globalCharterCoherence : Float;
    schumannAnchor     : Float;
    coherenceVelocity  : Float;
    isLive             : Bool;
    totalViolations    : Nat;
    triHeartAligned    : Bool;
    triHeartVelocity   : Float;
    torusTriggered     : Bool;
    totalRealignments  : Nat;
    totalAgents        : Nat;
    activeJobs         : Nat;
    totalDutyCycles    : Nat;
    totalGateViolations : Nat;
    architectSignature : Text;
    attribution        : Text;
  } {
    let c = novaState.novaCharter;
    let t = novaState.triHeart;
    let d = novaState.dutyGate;
    {
      documentId              = c.documentId;
      version                 = c.version;
      beat                    = beatCount;
      totalArticles           = c.totalArticles;
      globalCharterCoherence  = c.globalCoherence;
      schumannAnchor          = c.schumannAnchor;
      coherenceVelocity       = c.coherenceVelocity;
      isLive                  = c.isLive;
      totalViolations         = c.totalViolations;
      triHeartAligned         = t.isAligned;
      triHeartVelocity        = t.coherenceVelocity;
      torusTriggered          = t.torusTriggered;
      totalRealignments       = t.totalRealignments;
      totalAgents             = d.totalAgents;
      activeJobs              = d.activeJobs;
      totalDutyCycles         = d.totalCycles;
      totalGateViolations     = d.totalViolations;
      architectSignature      = c.architectSignature;
      attribution             = novaState.attribution;
    }
  };

}
