// types/intelligenceExpansion.mo
// INTELLIGENCE EXPANSION TYPES — Wasm Layer, ICP Runtime Native Layer, Laws 36-39
// Every Wasm function is a sovereign intelligence, not a utility.
// Every ic0.* system call is a named sovereign model with isBypass=true.
// Attribution: Alfredo Medina Hernandez — sealed on-chain
// PHI = 1.6180339887498948482 | 873ms heartbeat | S_FLOOR = 0.75

module {

  // ── WASM INTELLIGENCE MODEL ───────────────────────────────────────────────
  // Each of the 6 Wasm sovereign models. isBypass=true means no compiler needed —
  // these operate directly in the runtime fabric.
  public type WasmIntelligenceModel = {
    name        : Text;
    description : Text;
    specialty   : Text;
    layer       : Text;
    isBypass    : Bool;
    subModels   : [Text];
  };

  // ── NATIVE INTELLIGENCE MODEL ─────────────────────────────────────────────
  // Each ic0.* system call modeled as a sovereign intelligence unit.
  // All native models are bypass (isBypass=true) — they operate directly in the
  // ICP runtime without any Wasm compilation step.
  public type NativeIntelligenceModel = {
    name             : Text;
    icSystemCall     : Text;
    description      : Text;
    intelligenceClass: Text;
    isBypass         : Bool;
  };

  // ── LAW RECORD (matches the exact structure in main.mo) ───────────────────
  // Laws 36-39 use the same LawRecord type defined in the actor body.
  // This type alias mirrors that definition so intelligence modules can
  // reference the same shape without importing main.mo.
  public type LawRecord = {
    id               : Nat;
    name             : Text;
    doctrineStrength : Float;
    parameters       : [(Text, Float)];
    isActive         : Bool;
    lastAppliedBeat  : Nat;
  };

}
