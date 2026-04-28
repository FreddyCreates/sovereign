// ════════════════════════════════════════════════════════════════
// PRESENCE_GATE_ENGINE — Sovereign Handshake Protocol (stateless)
// Rank: Engine | Symbol: Gate ⟁
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// ════════════════════════════════════════════════════════════════

import Float        "mo:core/Float";
import PresenceProtocol "PresenceProtocol";

module {

  let ARCHITECT : Text = "Alfredo Medina Hernandez";
  let PHI       : Float = 1.6180339887498948482;
  let SCHUMANN  : Float = 7.83;

  public type HandshakeEvent = PresenceProtocol.HandshakeEvent;
  public type GateMode       = PresenceProtocol.GateMode;

  public type SealedHandshakeRecord = {
    sealId            : Nat;
    sessionId         : Text;
    eventType         : Text;
    schumannTimestamp : Float;
    heartbeatCycle    : Nat;
    ambientFieldAtSeal : Float;
    doctrineLayer     : Text;
    governingLaw      : Text;
    attribution       : Text;
    isIrreversible    : Bool;
  };

  public type GateState = {
    isOpen             : Bool;
    currentMode        : GateMode;
    totalHandshakes    : Nat;
    lastSealId         : Nat;
    ambientFieldStrength : Float;
  };

  // ── BUILD SEAL (pure) ─────────────────────────────────────────────────────
  public func buildSeal(
    sealId         : Nat,
    sessionId      : Text,
    eventType      : Text,
    heartbeatCycle : Nat,
    ambientField   : Float,
  ) : SealedHandshakeRecord {
    {
      sealId;
      sessionId;
      eventType;
      schumannTimestamp  = heartbeatCycle.toFloat() * PHI / SCHUMANN;
      heartbeatCycle;
      ambientFieldAtSeal = ambientField;
      doctrineLayer      = "PRESENCE_PROTOCOL";
      governingLaw       = "Law 40 — Closed Loop Intelligence | Law 41 — Law of the Architect";
      attribution        = ARCHITECT;
      isIrreversible     = true;
    }
  };

  /// No-op — main.mo stores history in its own stable state.
  public func sealHandshake(_record : SealedHandshakeRecord) {};

  /// Return gate state snapshot using presence module state.
  public func getGateState(
    presenceState  : PresenceProtocol.PresenceModuleState,
    totalHandshakes : Nat,
    lastSealId     : Nat,
  ) : GateState {
    {
      isOpen               = PresenceProtocol.isTerminalAccessActive(presenceState);
      currentMode          = if (PresenceProtocol.isTerminalAccessActive(presenceState)) {
                               #ACTIVE_PRESENCE
                             } else { #AMBIENT_ONLY };
      totalHandshakes;
      lastSealId;
      ambientFieldStrength = PresenceProtocol.getAmbientFieldStrength(presenceState);
    }
  };

};
