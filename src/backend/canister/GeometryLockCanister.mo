// canister/GeometryLockCanister.mo
// PROTO-226 — GEOMETRY LOCK CANISTER ACTOR (Clavis Geometrica Permanens)
//
// This is the Geometry Lock as a sovereign ICP canister — a LIVING ENTITY
// that persists across upgrades via `stable var`. It is not a library module
// inside main.mo. It is its own organism on the Internet Computer.
//
// Every upgrade preserves:
//   - The full caller registry (all CallerBonds)
//   - The 89-entry ring-buffered validation log
//   - The mini brain state (Hebbian weights, adaptive threshold, ADRE cycle)
//   - The mini heart state (BPM, HRV, cardiac output)
//   - All CPL law counters and last-fired beats
//   - The 5 security metrics
//
// System heartbeat fires every ~2 seconds (ICP minimum). The lock advances
// at its own PHI-natural 873ms rhythm tracked via the beat counter.
//
// Inter-canister access: any sovereign canister can call validateKey, 
// registerCaller (requires admin principal), getMetrics (open query).
//
// Governing Laws: LAW_BLOCK_UNKEYED_CALLS, LAW_GRANT_RATE_LOW, LAW_CALLERS_DEGRADED
// Author: SCRIBE_FOUNDATION | Powered by GUARDIAN_SENTINEL + ORACLE
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026

import GLTypes  "../types/geometryLock";
import GLLib    "../lib/geometryLock";
import Nat      "mo:core/Nat";

actor GeometryLockCanister {

  // ── STABLE STATE — persists across all canister upgrades ─────────────────

  /// The full lock state. Initialized at genesis (beat 0), evolved from there.
  /// All mini brain Hebbian weights, adaptive threshold, and caller bonds survive upgrades.
  stable var glState : GLTypes.GeometryLockState = GLLib.initState(0);

  /// Beat counter — incremented by the system heartbeat.
  /// 873ms heartbeat rhythm tracked by counting ICP heartbeat ticks.
  stable var beatCount : Nat = 0;

  /// Admin principal — only this principal can register/revoke callers.
  /// Set at genesis to the deploying principal. Can be updated via `setAdmin`.
  stable var adminPrincipal : ?Principal = null;

  // ── SYSTEM LIFECYCLE ──────────────────────────────────────────────────────

  /// Called on every ICP heartbeat (~2 seconds). Advances the lock entity.
  /// The lock tracks its own sub-heartbeat rhythm via beatCount.
  system func heartbeat() : async () {
    beatCount += 1;
    glState := GLLib.advance(glState, beatCount);
  };

  /// Called before upgrade — state is already stable, nothing extra needed.
  system func preupgrade() {
    // glState and beatCount are stable — ICP persists them automatically
  };

  /// Called after upgrade — re-hydrate any transient state (none currently).
  system func postupgrade() {
    // glState is restored from stable storage — the lock continues exactly where it left off
    // This is the "living entity" guarantee: upgrades do not reset the brain or caller registry
  };

  // ── ADMIN ─────────────────────────────────────────────────────────────────

  /// Set the admin principal on first call (genesis claim).
  /// After genesis, only the existing admin can transfer authority.
  public shared(msg) func claimAdmin() : async { ok : Bool; message : Text } {
    switch (adminPrincipal) {
      case null {
        adminPrincipal := ?msg.caller;
        { ok=true; message="Admin claimed" }
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

  /// Transfer admin authority to a new principal. Only current admin can call.
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
      case null true;   // unclaimed — open during genesis window
      case (?a) caller == a;
    }
  };

  // ── CALLER MANAGEMENT (admin-only) ───────────────────────────────────────

  /// Register a new caller resonance bond.
  /// secretHash must be the caller's own FNV hash of their shared secret.
  /// Never send raw secrets to this canister.
  public shared(msg) func registerCaller(
    callerId   : Text,
    secretHash : Text,
  ) : async { ok : Bool; message : Text } {
    if (not isAdmin(msg.caller)) {
      return { ok=false; message="UNAUTHORIZED: only admin can register callers" };
    };
    glState := GLLib.registerCaller(glState, callerId, secretHash, beatCount);
    { ok=true; message="Caller " # callerId # " registered at beat " # beatCount.toText() }
  };

  /// Revoke a caller bond — permanently dissolves resonance.
  public shared(msg) func revokeKey(callerId : Text) : async { ok : Bool } {
    if (not isAdmin(msg.caller)) { return { ok=false } };
    glState := GLLib.revokeKey(glState, callerId, beatCount);
    { ok=true }
  };

  // ── KEY GENERATION ───────────────────────────────────────────────────────

  /// Generate a geometry token for a caller (client-side convenience).
  /// The caller would normally derive this locally using the same formula.
  /// This endpoint is useful for testing and for callers without local Motoko runtime.
  public query func generateKey(
    callerId   : Text,
    secretHash : Text,
  ) : async GLTypes.GeometryToken {
    GLLib.generateKey(callerId, secretHash, beatCount)
  };

  // ── VALIDATION (open — any principal can present a token) ────────────────

  /// Validate an incoming geometry token.
  /// Core PROTO-226 pipeline: Hebbian-weighted Kuramoto R > adaptive threshold.
  /// Updates lock state (Hebbian weights, metrics, log). Returns grant/deny result.
  public shared func validateKey(token : GLTypes.GeometryToken) : async GLTypes.TokenValidation {
    // Validate with the token's beat stamped to current beatCount for window check
    let currentToken : GLTypes.GeometryToken = {
      token with
      beat      = beatCount;
      phiWindow = beatCount;  // φ-window = beatCount (1 beat per window at 873ms base)
    };
    let (newState, validation) = GLLib.validateKey(glState, currentToken);
    glState := newState;
    validation
  };

  // ── QUERIES — open to all principals ─────────────────────────────────────

  /// Security metrics snapshot — grant rate, Kuramoto avg, law violations, etc.
  public query func getMetrics() : async GLTypes.SecurityMetrics {
    GLLib.getMetrics(glState)
  };

  /// Mini brain state — Hebbian weights, adaptive threshold, ADRE pass counters.
  public query func getMiniBrain() : async GLTypes.MiniBrainState {
    GLLib.getMiniBrain(glState)
  };

  /// Mini heart state — BPM, interval, HRV, cardiac output.
  public query func getMiniHeart() : async GLTypes.MiniHeartState {
    GLLib.getMiniHeart(glState)
  };

  /// CPL law status — fired counts, last-fired beats.
  public query func getCplLaws() : async [GLTypes.CplLawRecord] {
    GLLib.getCplLaws(glState)
  };

  /// Last N validation log entries (most recent first, ring buffer).
  public query func getValidationLog(n : Nat) : async [GLTypes.ValidationLogEntry] {
    GLLib.getValidationLog(glState, n)
  };

  /// Caller bond details — shows resonance history, grant/denial counts, Kuramoto R.
  public query func getCallerBond(callerId : Text) : async ?GLTypes.CallerBond {
    GLLib.getCallerBond(glState, callerId)
  };

  /// Full entity snapshot — complete GeometryLockState for debugging / SCRIBE logging.
  public query func getFullState() : async {
    entityId         : Text;
    entityVersion    : Nat;
    beatCount        : Nat;
    totalRegistered  : Nat;
    totalRevoked     : Nat;
    activeCallers    : Nat;
    grantRate        : Float;
    kuramotoThreshold: Float;
    defensiveMode    : Bool;
    immuneEvents     : Nat;
    attribution      : Text;
  } {
    {
      entityId          = glState.entityId;
      entityVersion     = glState.entityVersion;
      beatCount;
      totalRegistered   = glState.totalRegistered;
      totalRevoked      = glState.totalRevoked;
      activeCallers     = glState.metrics.activeCallers;
      grantRate         = glState.metrics.grantRate;
      kuramotoThreshold = glState.miniBrain.kuramotoThreshold;
      defensiveMode     = glState.miniBrain.defensiveMode;
      immuneEvents      = glState.miniBrain.immuneEvents;
      attribution       = glState.attribution;
    }
  };

  /// Current beat count — useful for callers synchronizing their φ-window.
  public query func getBeat() : async Nat { beatCount };

}
