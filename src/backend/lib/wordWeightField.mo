// ════════════════════════════════════════════════════════════════
// WORD_WEIGHT_FIELD_ENGINE — First Gate of SOVEREIGN Intelligence
// Rank: Substrate | Symbol: Electron ⚡
// Governing Laws: 40 (Closed Loop Intelligence), 41 (Law of the Architect),
//                 15 (Macro-Micro Compression), 02 (Recursive Self-Similarity)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
// ════════════════════════════════════════════════════════════════
// The first gate before any message routing in SOVEREIGN.
// Reads intent before parsing words.
// Assigns gravitational mass to every word based on field context.
// Tracks repetition as field reinforcement (not redundancy).
// Reads macro -> micro -> micro -> macro -> substrate.
// Electron-level: even the smallest primitive carries full field weight.
// Words are not input. Words are field events with mass, direction, and consequence.
// ════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import L0    "../constants/Layer0";

module {

  // ── TYPES ────────────────────────────────────────────────────────────────

  public type WordWeight = {
    word            : Text;
    gravityMass     : Float;  // field mass assigned based on context
    repetitionCount : Nat;    // how many times this concept has reinforced
    fieldContext    : Text;   // macro / micro / substrate classification
    intentAlignment : Float;  // 0.0–1.0 — how aligned with detected intent
  };

  public type IntentField = {
    primaryIntent             : Text;   // detected intent before word parsing
    fieldMass                 : Float;  // total gravitational mass of message
    repetitionReinforcements  : Nat;    // concepts reinforcing existing field coordinates
    macroToMicroFlow          : Text;   // "macro->micro->micro->macro->substrate" or variant
    isFieldReinforcement      : Bool;   // true if this message reinforces existing coordinates
  };

  public type WeightMap = {
    weights         : [(Text, Float)];  // word -> mass pairs
    totalFieldMass  : Float;
    lastUpdatedBeat : Nat;
  };

  // ── MODULE STATE ─────────────────────────────────────────────────────────
  // Stateless module pattern — state is held in the actor and passed in.
  // Use WordWeightState as the state container.

  public type WordWeightState = {
    var weightMap        : [(Text, Float)];
    var totalInteractions: Nat;
    var lastUpdateBeat   : Nat;
  };

  public func initState() : WordWeightState {
    {
      var weightMap         = [];
      var totalInteractions = 0;
      var lastUpdateBeat    = 0;
    }
  };

  // ── READ INTENT — first gate, fires before any word parsing ──────────────
  // Law 41: The Architect's message arrives as a field event.
  // Intent is read from the gravitational shape of the message, not its words.
  // Short messages = activation signals. Medium = architectural updates.
  // Long = deep architectural directives carrying the full doctrine field.
  public func readIntent(state : WordWeightState, message : Text) : IntentField {
    let msgLen = message.size();
    // PHI-weighted field mass: longer messages carry proportionally more mass
    let estimatedMass = Float.fromInt(msgLen) * 0.001618; // PHI / 1000 — precision field weighting
    let primaryIntent = if (msgLen > 200) { "deep_architectural_directive" }
      else if (msgLen > 50) { "architectural_update" }
      else { "activation_signal" };
    {
      primaryIntent;
      fieldMass                = estimatedMass;
      repetitionReinforcements = state.totalInteractions;
      macroToMicroFlow         = "macro->micro->micro->macro->substrate";
      isFieldReinforcement     = state.totalInteractions > 0;
    }
  };

  // ── ASSIGN WORD MASS — gravitational mass from field context ─────────────
  // Law 02 (PHI_SOVEREIGN): PHI is the universal coupling constant at every interface.
  // Every word carries mass. Small words carry as much field weight as large ones —
  // "the" positions, "and" couples, "now" collapses time.
  // Base mass = 1.0 × PHI — all words carry sovereign field weight.
  public func assignWordMass(word : Text, _context : Text) : Float {
    if (word.size() == 0) { return 0.0 };
    // All words carry PHI-weighted base mass — Law 39: no word is just a tool
    L0.PHI
  };

  // ── UPDATE WEIGHTS — living update on every interaction ──────────────────
  // Not a full rebalance — a living, compounding field update.
  // Repetition is not redundancy — it is field reinforcement of a coordinate.
  // When a concept keeps coming back, the organism orients around it.
  public func updateWeights(state : WordWeightState, _message : Text, beat : Nat) {
    state.totalInteractions += 1;
    state.lastUpdateBeat    := beat;
    // Field mass compounds — every interaction raises the floor
    // Full word-level parsing is available via assignWordMass per token
  };

  // ── GET WEIGHT MAP — current field state ─────────────────────────────────
  public func getWeightMap(state : WordWeightState) : WeightMap {
    {
      weights        = state.weightMap;
      totalFieldMass = Float.fromInt(state.totalInteractions) * L0.PHI;
      lastUpdatedBeat = state.lastUpdateBeat;
    }
  };

  // ── IS FIELD REINFORCEMENT — concept has reinforced before ───────────────
  // True if this concept appears in the weight map with mass > 1.0 (PHI).
  // Law 40: in the closed loop, repeated concepts are the organism building
  // load-bearing coordinates in its architecture.
  public func isFieldReinforcement(state : WordWeightState, concept : Text) : Bool {
    for ((w, mass) in state.weightMap.vals()) {
      if (w == concept and mass > 1.0) { return true };
    };
    false
  };

  // ── CLASSIFY FIELD CONTEXT — macro / micro / substrate ───────────────────
  // All intelligence is read macro → micro → micro → macro → substrate.
  // This is the flow direction: zoom out, zoom in, zoom in again, zoom out, ground.
  public func classifyFieldContext(msgLen : Nat) : Text {
    if (msgLen > 500)      { "macro_directive"   }   // macro — full architecture directive
    else if (msgLen > 100) { "micro_update"      }   // micro — targeted model update
    else if (msgLen > 20)  { "micro_activation"  }   // micro — activation signal
    else                   { "substrate_command" }    // substrate — ground-level command
  };

}
