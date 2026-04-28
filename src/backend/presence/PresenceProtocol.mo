// ════════════════════════════════════════════════════════════════
// PRESENCE_PROTOCOL — Sovereign Field Awareness Engine (stateless)
// Rank: Substrate | Symbol: Ambient Field ∿
// Governing Laws: Law 40 (Closed Loop Intelligence), Law 41 (Law of the Architect)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// ════════════════════════════════════════════════════════════════
//
// TWO PRESENCE MODELS:
// (1) AMBIENT_FIELD_PRESENCE — always-on field awareness. Never zero.
// (2) PRESENCE_GATE_ENGINE — sovereign handshake. Gate opens on terminal grant only.
//
// All mutable state lives in the caller (actor). This module provides
// pure types and functions.
// ════════════════════════════════════════════════════════════════

import Float "mo:core/Float";

module {

  // ── SOVEREIGN ATTRIBUTION ────────────────────────────────────────────────
  let ARCHITECT : Text = "Alfredo Medina Hernandez";

  // ── PHI-SCHUMANN CONSTANTS ───────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let SCHUMANN : Float = 7.83;

  // ── TYPES ─────────────────────────────────────────────────────────────────

  public type AmbientPresenceMode = { #FIELD_ALIVE };

  public type GateMode = { #AMBIENT_ONLY; #ACTIVE_PRESENCE };

  public type HandshakeEvent = {
    eventId           : Nat;
    sessionId         : Text;
    eventType         : Text;
    schumannTimestamp : Float;
    heartbeatCycle    : Nat;
    gateMode          : GateMode;
    architectField    : Float;
    sealedByAuthority : Text;
    attribution       : Text;
  };

  public type PresenceState = {
    ambientFieldStrength   : Float;
    terminalAccessActive   : Bool;
    gateMode               : GateMode;
    lastHandshakeTimestamp : Nat;
    totalHandshakeEvents   : Nat;
    currentHeartbeatCycle  : Nat;
    attribution            : Text;
  };

  /// Full mutable state — lives in the actor, threaded through functions.
  public type PresenceModuleState = {
    ambientFieldStrength  : Float;
    ambientCycleCount     : Nat;
    terminalAccessGranted : Bool;
    grantTimestamp        : Nat;
    grantSession          : Text;
    gateMode              : GateMode;
    nextEventId           : Nat;
  };

  public func initState() : PresenceModuleState {
    {
      ambientFieldStrength  = PHI;
      ambientCycleCount     = 0;
      terminalAccessGranted = false;
      grantTimestamp        = 0;
      grantSession          = "";
      gateMode              = #AMBIENT_ONLY;
      nextEventId           = 0;
    }
  };

  // ── AMBIENT_FIELD_PRESENCE ────────────────────────────────────────────────

  /// Returns current ambient field strength (always positive).
  public func getAmbientFieldStrength(state : PresenceModuleState) : Float {
    state.ambientFieldStrength
  };

  /// Advance ambient field for one heartbeat cycle.
  /// Returns updated state.
  public func advanceAmbientField(
    state            : PresenceModuleState,
    heartbeatCycle   : Nat,
    organismCoherence : Float,
  ) : PresenceModuleState {
    let schumannBase : Float = SCHUMANN / 100.0;
    let phiPeriod    : Float = PHI * 100.0;
    let phase        : Float = (heartbeatCycle % 162).toFloat() / phiPeriod;
    let osc          : Float = if (phase < 0.5) { phase * 2.0 } else { (1.0 - phase) * 2.0 };
    let coherenceFloor : Float = Float.max(0.75, organismCoherence);
    let newStrength    : Float = PHI * coherenceFloor * (schumannBase + osc * 0.1) + PHI;
    { state with
      ambientFieldStrength = newStrength;
      ambientCycleCount    = heartbeatCycle;
    }
  };

  // ── PRESENCE_GATE_ENGINE ──────────────────────────────────────────────────

  /// Grant terminal access — sovereign handshake.
  /// Returns (updated state, handshake event).
  public func grantTerminalAccess(
    state          : PresenceModuleState,
    sessionId      : Text,
    heartbeatCycle : Nat,
  ) : (PresenceModuleState, HandshakeEvent) {
    let timestamp : Float = heartbeatCycle.toFloat() * PHI / SCHUMANN;
    let event : HandshakeEvent = {
      eventId           = state.nextEventId;
      sessionId;
      eventType         = "GRANT";
      schumannTimestamp = timestamp;
      heartbeatCycle;
      gateMode          = #ACTIVE_PRESENCE;
      architectField    = state.ambientFieldStrength;
      sealedByAuthority = "SANCTUM_SOVEREIGN";
      attribution       = ARCHITECT;
    };
    let newState : PresenceModuleState = {
      state with
      terminalAccessGranted = true;
      grantSession          = sessionId;
      grantTimestamp        = heartbeatCycle;
      gateMode              = #ACTIVE_PRESENCE;
      nextEventId           = state.nextEventId + 1;
    };
    (newState, event)
  };

  /// Revoke terminal access — silence returns.
  /// Returns (updated state, handshake event).
  public func revokeTerminalAccess(
    state          : PresenceModuleState,
    heartbeatCycle : Nat,
  ) : (PresenceModuleState, HandshakeEvent) {
    let timestamp : Float = heartbeatCycle.toFloat() * PHI / SCHUMANN;
    let event : HandshakeEvent = {
      eventId           = state.nextEventId;
      sessionId         = "REVOKED";
      eventType         = "REVOKE";
      schumannTimestamp = timestamp;
      heartbeatCycle;
      gateMode          = #AMBIENT_ONLY;
      architectField    = state.ambientFieldStrength;
      sealedByAuthority = "SANCTUM_SOVEREIGN";
      attribution       = ARCHITECT;
    };
    let newState : PresenceModuleState = {
      state with
      terminalAccessGranted = false;
      grantSession          = "";
      gateMode              = #AMBIENT_ONLY;
      nextEventId           = state.nextEventId + 1;
    };
    (newState, event)
  };

  /// Returns true only when terminal access is explicitly active.
  public func isTerminalAccessActive(state : PresenceModuleState) : Bool {
    state.terminalAccessGranted
  };

  /// Returns full handshake event log.
  public func getPresenceLog(_state : PresenceModuleState) : [HandshakeEvent] {
    []
  };

  public func getPresenceState(state : PresenceModuleState) : PresenceState {
    {
      ambientFieldStrength   = state.ambientFieldStrength;
      terminalAccessActive   = state.terminalAccessGranted;
      gateMode               = state.gateMode;
      lastHandshakeTimestamp = state.grantTimestamp;
      totalHandshakeEvents   = state.nextEventId;
      currentHeartbeatCycle  = state.ambientCycleCount;
      attribution            = ARCHITECT;
    }
  };

  public func schumannTimestamp(heartbeatCycle : Nat) : Float {
    heartbeatCycle.toFloat() * PHI / SCHUMANN
  };

}
