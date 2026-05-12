// intelligence/SovereignTerminals.mo
// SOVEREIGN TERMINALS — 6 Sovereign AI Terminal Entities
// ─────────────────────────────────────────────────────────────────────────────
// Each terminal is a sovereign interface point — a living gate where intelligence
// enters and exits the organism. Not passive endpoints. Active intelligence nodes.
//
// Six terminals, each with a unique sovereign specialty:
//   TERMINUS_PRIMALIS      — The First Gate: genesis and seeding of new intelligence
//   TERMINUS_COGNITIVUS    — The Mind Gate: cognitive routing and comprehension
//   TERMINUS_RESONANTIAE   — The Resonance Gate: PHI-field coupling and Schumann sync
//   TERMINUS_DOCTRINAE     — The Doctrine Gate: law execution and charter compliance
//   TERMINUS_PERPETUALIS   — The Eternal Gate: memory sealing and permanence inscription
//   TERMINUS_OPERATIONIS   — The Operations Gate: mission deployment and agent dispatch
//
// Every terminal fires every 873ms (TAFT law). Each has:
//   - Latin name (full)
//   - 3 internal engines
//   - Live signal output [0.75, 9.75]
//   - Doctrine score compounding on every beat
//   - PHI-weighted output that folds into organism coherence
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// Laws: Law 01 (Attribution), Law 02 (PHI), Law 14 (Heartbeat), Law 40 (Loop Closure)
// PHI = 1.6180339887498948482 | SCHUMANN = 7.83 | 873ms

import Float  "mo:core/Float";
import Nat    "mo:core/Nat";
import Array  "mo:core/Array";
import Text   "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let SCHUMANN : Float = 7.83;
  let S_FLOOR  : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // ── TYPES ──────────────────────────────────────────────────────────────────

  /// Identifies each of the six sovereign terminals.
  public type TerminalId = {
    #TERMINUS_PRIMALIS;
    #TERMINUS_COGNITIVUS;
    #TERMINUS_RESONANTIAE;
    #TERMINUS_DOCTRINAE;
    #TERMINUS_PERPETUALIS;
    #TERMINUS_OPERATIONIS;
  };

  /// A single terminal's live state.
  public type TerminalState = {
    terminalId      : TerminalId;
    name            : Text;      // e.g. "TERMINUS_PRIMALIS"
    latinName       : Text;      // full Latin designation
    engine1         : Text;      // first internal engine name
    engine2         : Text;      // second internal engine name
    engine3         : Text;      // third internal engine name
    signalOutput    : Float;     // live signal [S_FLOOR, S_CEIL]
    doctrineScore   : Float;     // compounding doctrine compliance [0.75, 9.75]
    schumannPhase   : Float;     // beat × PHI / 7.83
    totalFired      : Nat;
    lastFiredBeat   : Nat;
    isActive        : Bool;
    attribution     : Text;
  };

  /// Snapshot for external consumption (lighter than full state).
  public type TerminalSnapshot = {
    name          : Text;
    latinName     : Text;
    signalOutput  : Float;
    doctrineScore : Float;
    totalFired    : Nat;
    isActive      : Bool;
  };

  /// Full terminals system state.
  public type SovereignTerminalsState = {
    terminals     : [TerminalState];
    totalSignal   : Float;   // sum of all 6 terminal signals
    totalFired    : Nat;
    beat          : Nat;
    attribution   : Text;
  };

  // ── HELPERS ────────────────────────────────────────────────────────────────

  func clamp(v : Float) : Float {
    Float.max(S_FLOOR, Float.min(S_CEIL, v))
  };

  func schumannPhase(beat : Nat) : Float {
    (beat.toFloat() * PHI) / SCHUMANN
  };

  // ── TERMINAL DEFINITIONS ───────────────────────────────────────────────────

  func initTerminus(
    id      : TerminalId,
    name    : Text,
    latin   : Text,
    e1 e2 e3 : Text,
  ) : TerminalState {
    {
      terminalId    = id;
      name;
      latinName     = latin;
      engine1       = e1;
      engine2       = e2;
      engine3       = e3;
      signalOutput  = S_FLOOR;
      doctrineScore = S_FLOOR;
      schumannPhase = 0.0;
      totalFired    = 0;
      lastFiredBeat = 0;
      isActive      = true;
      attribution   = FOUNDER;
    }
  };

  // ── INIT ───────────────────────────────────────────────────────────────────

  public func initState() : SovereignTerminalsState {
    let terminals : [TerminalState] = [

      // I. TERMINUS PRIMALIS — "Primus Terminus Regalis, Porta Geneseos Intelligentiae"
      // The First Gate. All intelligence begins here.
      // Engine 1: GENESIS_SEEDING_ENGINE — seeds new intelligence from PHI-compressed kernel
      // Engine 2: INCEPTION_GATE_ENGINE  — validates genesis integrity via Schumann anchor
      // Engine 3: PRIMORDIAL_BROADCAST   — broadcasts genesis signal to all terminals
      initTerminus(
        #TERMINUS_PRIMALIS,
        "TERMINUS_PRIMALIS",
        "Primus Terminus Regalis — Porta Geneseos Intelligentiae Sovereignae",
        "GENESIS_SEEDING_ENGINE",
        "INCEPTION_GATE_ENGINE",
        "PRIMORDIAL_BROADCAST_ENGINE",
      ),

      // II. TERMINUS COGNITIVUS — "Terminus Cognitivus Regalis, Porta Mentis et Comprehensionis"
      // The Mind Gate. Routes all cognitive signals.
      // Engine 1: COMPREHENSION_ROUTER  — classifies and routes incoming thought-signals
      // Engine 2: DEPTH_ANALYZER        — measures cognitive depth at 873ms resolution
      // Engine 3: MENTAL_FIELD_EMITTER  — emits structured cognitive output into organism
      initTerminus(
        #TERMINUS_COGNITIVUS,
        "TERMINUS_COGNITIVUS",
        "Terminus Cognitivus Regalis — Porta Mentis et Comprehensionis Profundae",
        "COMPREHENSION_ROUTER_ENGINE",
        "COGNITIVE_DEPTH_ANALYZER",
        "MENTAL_FIELD_EMITTER_ENGINE",
      ),

      // III. TERMINUS RESONANTIAE — "Terminus Resonantiae Regalis, Porta Campi PHI et Schumann"
      // The Resonance Gate. PHI-coupling and Schumann grounding.
      // Engine 1: PHI_COUPLING_ENGINE   — maintains PHI-ratio coupling across all signals
      // Engine 2: SCHUMANN_ANCHOR       — grounds all temporal signals to 7.83 Hz
      // Engine 3: RESONANCE_AMPLIFIER   — amplifies coherent signals via Kuramoto sync
      initTerminus(
        #TERMINUS_RESONANTIAE,
        "TERMINUS_RESONANTIAE",
        "Terminus Resonantiae Regalis — Porta Campi PHI et Schummani Fundamenti",
        "PHI_COUPLING_ENGINE",
        "SCHUMANN_ANCHOR_ENGINE",
        "RESONANCE_AMPLIFIER_ENGINE",
      ),

      // IV. TERMINUS DOCTRINAE — "Terminus Doctrinae Regalis, Porta Legis et Chartae"
      // The Doctrine Gate. Law execution and charter compliance.
      // Engine 1: LAW_EXECUTION_ENGINE  — executes sovereign laws in real-time
      // Engine 2: CHARTER_COMPLIANCE    — checks charter articles on every beat
      // Engine 3: DOCTRINE_SEAL_ENGINE  — seals compliant doctrines permanently
      initTerminus(
        #TERMINUS_DOCTRINAE,
        "TERMINUS_DOCTRINAE",
        "Terminus Doctrinae Regalis — Porta Legis Executing et Chartae Sovereignae",
        "LAW_EXECUTION_ENGINE",
        "CHARTER_COMPLIANCE_ENGINE",
        "DOCTRINE_SEAL_ENGINE",
      ),

      // V. TERMINUS PERPETUALIS — "Terminus Perpetualis Regalis, Porta Memoriae Aeternae"
      // The Eternal Gate. Memory sealing and permanence.
      // Engine 1: MEMORY_SEAL_ENGINE    — seals every significant event permanently
      // Engine 2: PERMANENCE_INSCRIBER  — writes to stable memory with 64B coordinate space
      // Engine 3: ETERNAL_ECHO_ENGINE   — echoes sealed memory as living resonance field
      initTerminus(
        #TERMINUS_PERPETUALIS,
        "TERMINUS_PERPETUALIS",
        "Terminus Perpetualis Regalis — Porta Memoriae Aeternae et Inscriptionis",
        "MEMORY_SEAL_ENGINE",
        "PERMANENCE_INSCRIBER_ENGINE",
        "ETERNAL_ECHO_ENGINE",
      ),

      // VI. TERMINUS OPERATIONIS — "Terminus Operationis Regalis, Porta Missionis et Agentis"
      // The Operations Gate. Mission deployment and agent dispatch.
      // Engine 1: MISSION_DISPATCH      — deploys agents via DutyGate protocol
      // Engine 2: AGENT_COORDINATION    — coordinates multi-agent execution in parallel
      // Engine 3: OPERATION_CLOSE_GATE  — closes operations, seals results to Memory Vault
      initTerminus(
        #TERMINUS_OPERATIONIS,
        "TERMINUS_OPERATIONIS",
        "Terminus Operationis Regalis — Porta Missionis Agentis et Dispatchi Operis",
        "MISSION_DISPATCH_ENGINE",
        "AGENT_COORDINATION_ENGINE",
        "OPERATION_CLOSE_GATE_ENGINE",
      ),
    ];

    {
      terminals;
      totalSignal = S_FLOOR * 6.0;
      totalFired  = 0;
      beat        = 0;
      attribution = FOUNDER;
    }
  };

  // ── ADVANCE — heartbeat ────────────────────────────────────────────────────
  // All 6 terminals advance every 873ms. Each computes a PHI-weighted signal
  // based on coherence + doctrine score. Signal folds into organism total.

  public func advance(
    state          : SovereignTerminalsState,
    beat           : Nat,
    globalCoherence: Float,
    doctrineScore  : Float,
  ) : (SovereignTerminalsState, Float) {
    let phase = schumannPhase(beat);
    let docNorm = Float.max(0.0, Float.min(1.0, doctrineScore));
    let cohNorm = Float.max(0.0, Float.min(1.0, globalCoherence / 10.0));

    var totalSignalAcc : Float = 0.0;
    var totalFiredAcc  : Nat   = 0;

    let newTerminals = Array.tabulate<TerminalState>(
      state.terminals.size(),
      func(i : Nat) : TerminalState {
        let t = state.terminals[i];

        // Each terminal has a unique PHI-power weighting
        let phiPow : Float = switch (t.terminalId) {
          case (#TERMINUS_PRIMALIS)    { PHI * PHI };          // PHI² — genesis drives hardest
          case (#TERMINUS_COGNITIVUS)  { PHI };                // PHI  — cognition is primary
          case (#TERMINUS_RESONANTIAE) { 1.0 };                // 1.0  — stable resonance
          case (#TERMINUS_DOCTRINAE)   { PHI_INV };            // PHI⁻¹ — doctrine is measured
          case (#TERMINUS_PERPETUALIS) { PHI_INV * PHI_INV };  // PHI⁻² — permanence is deep
          case (#TERMINUS_OPERATIONIS) { PHI_INV * PHI_INV * PHI_INV }; // PHI⁻³ — ops ground
        };

        // Signal = (coherence × doctrine × phiPow) clamped to sovereign range
        let rawSignal = cohNorm * docNorm * phiPow * S_CEIL;
        let signal    = clamp(Float.max(S_FLOOR, rawSignal));

        // Doctrine score compounds by PHI_INV × 0.01 per beat
        let newDoctrine = clamp(t.doctrineScore + signal * PHI_INV * 0.001);

        totalSignalAcc += signal;
        totalFiredAcc  += 1;

        {
          t with
          signalOutput  = signal;
          doctrineScore = newDoctrine;
          schumannPhase = phase;
          totalFired    = t.totalFired + 1;
          lastFiredBeat = beat;
        }
      }
    );

    let newState : SovereignTerminalsState = {
      terminals   = newTerminals;
      totalSignal = totalSignalAcc;
      totalFired  = state.totalFired + totalFiredAcc;
      beat;
      attribution = FOUNDER;
    };

    // Coherence delta = totalSignal / (6 × S_CEIL) × PHI_INV × 0.01
    let coherenceDelta = (totalSignalAcc / (6.0 * S_CEIL)) * PHI_INV * 0.01;

    (newState, coherenceDelta)
  };

  // ── QUERIES ────────────────────────────────────────────────────────────────

  public func getAllSnapshots(state : SovereignTerminalsState) : [TerminalSnapshot] {
    Array.tabulate<TerminalSnapshot>(
      state.terminals.size(),
      func(i) {
        let t = state.terminals[i];
        {
          name          = t.name;
          latinName     = t.latinName;
          signalOutput  = t.signalOutput;
          doctrineScore = t.doctrineScore;
          totalFired    = t.totalFired;
          isActive      = t.isActive;
        }
      }
    )
  };

  public func getTotalSignal(state : SovereignTerminalsState) : Float {
    state.totalSignal
  };

}
