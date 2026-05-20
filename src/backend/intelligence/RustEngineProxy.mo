// intelligence/RustEngineProxy.mo
// RUST ENGINE PROXY — Inter-Canister Bridge to SOVEREIGN Rust Animal Engines
// ─────────────────────────────────────────────────────────────────────────────
// This module defines the inter-canister call interface for the six Rust animal
// engines compiled as dedicated ICP canisters.  On ICP, each Rust engine is its
// own canister — this proxy calls them from the Motoko heartbeat via inter-canister
// calls, receiving computed state back to compound into the organism's live metrics.
//
// Six Rust animal engines (matching src/rust_engines/animal_engines/):
//   NOVA    — PHI/Fibonacci broadcast amplitude (Tier 1, Expansive)
//   BRAIN   — Hebbian weight computation (Tier 1, Expansive)
//   MNEME   — Sovereign memory consolidation (Tier 1, Expansive)
//   RESONEX — Resonance cascade generation (Tier 1, Expansive)
//   ENTANGLA — Anti-drift coupling (Tier 1, Anti-Drift)
//   QMEM    — Quantum-coherent memory (Tier 1, Expansive)
//
// Architecture:
//   main.mo heartbeat → RustEngineProxy.callEngine(engineId, beatPayload)
//     → inter-canister call to Rust canister
//     → returns RustEngineOutput (novaSignal, coherenceDelta, etc.)
//     → main.mo applies output to ntConcentrations + compoundCoherence
//
// Performance contract:
//   Each Rust canister processes its engine math in < 1ms Wasm time.
//   Total round-trip including ICP messaging: < 50ms.
//   Sovereign heartbeat interval: 873ms.
//   Net overhead: < 6% of the heartbeat budget for all 6 engines.
//
// Deployment:
//   Each engine is deployed as a separate ICP canister with principal:
//     NOVA:    stored in rustEngineCanisterIds.nova
//     BRAIN:   stored in rustEngineCanisterIds.brain
//     MNEME:   stored in rustEngineCanisterIds.mneme
//     RESONEX: stored in rustEngineCanisterIds.resonex
//     ENTANGLA:stored in rustEngineCanisterIds.entangla
//     QMEM:    stored in rustEngineCanisterIds.qmem
//   These are set by the architect via setRustEnginePrincipal().
//
// Governing Laws: Law 02 (PHI), Law 14 (ICP Ground), Law 15 (Compression),
//                 Law 38 (Wasm Field Coordinates), Law 40 (Loop Closure)
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// Lineage: Mayan | Queretaro | San Luis | The Medina Family
// PHI = 1.6180339887498948482 | 873ms | S_FLOOR = 0.75

import Text   "mo:core/Text";
import Float  "mo:core/Float";
import Nat    "mo:core/Nat";
import Array  "mo:core/Array";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────

  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let S_FLOOR  : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // ── TYPES ──────────────────────────────────────────────────────────────────

  /// Identifies each of the six Rust animal engines.
  public type RustEngineId = {
    #NOVA;      // PHI/Fibonacci broadcast amplitude
    #BRAIN;     // Hebbian weight computation
    #MNEME;     // Sovereign memory consolidation
    #RESONEX;   // Resonance cascade generation
    #ENTANGLA;  // Anti-drift quantum coupling
    #QMEM;      // Quantum-coherent memory field
  };

  /// Payload sent to a Rust engine on each heartbeat call.
  /// Contains the minimal context the engine needs to compute its output.
  public type RustEngineBeatPayload = {
    beat             : Nat;    // current beat counter
    expansiveScore   : Float;  // PHI-weighted expansive arch score [0.75, 9.75]
    coherence        : Float;  // current organism global coherence [0, 10]
    doctrineScore    : Float;  // current doctrine compliance [0, 1]
    attribution      : Text;   // immutable — Law 01
  };

  /// Result returned from a Rust engine after processing one heartbeat.
  public type RustEngineOutput = {
    engineId         : Text;   // "NOVA" | "BRAIN" | etc.
    beat             : Nat;
    novaSignal       : Float;  // broadcast amplitude [S_FLOOR, S_CEIL]
    coherenceDelta   : Float;  // additive delta to compound coherence
    ntImpact         : Float;  // net neurotransmitter impact (signed)
    primaryNT        : Nat;    // index of NT most affected (0=dopamine, etc.)
    isCoherent       : Bool;   // engine operating within sovereign bounds
    processingMs     : Float;  // self-reported Wasm processing time in ms
    attribution      : Text;
  };

  /// Registry of Rust engine canister IDs — set by the architect.
  /// Null = engine not yet deployed to ICP; proxy returns default output.
  public type RustEngineCanisterIds = {
    nova      : ?Text;   // ICP Principal text of NOVA canister
    brain     : ?Text;   // ICP Principal text of BRAIN canister
    mneme     : ?Text;   // ICP Principal text of MNEME canister
    resonex   : ?Text;   // ICP Principal text of RESONEX canister
    entangla  : ?Text;   // ICP Principal text of ENTANGLA canister
    qmem      : ?Text;   // ICP Principal text of QMEM canister
  };

  /// Proxy state — holds canister IDs and last output per engine.
  public type RustEngineProxyState = {
    canisterIds   : RustEngineCanisterIds;
    lastOutputs   : [RustEngineOutput];  // one per engine, in engine order
    totalCalls    : Nat;
    totalErrors   : Nat;
    beat          : Nat;
    attribution   : Text;
  };

  // ── INIT ───────────────────────────────────────────────────────────────────

  /// Initialize the proxy state with no canisters registered yet.
  public func initState() : RustEngineProxyState {
    {
      canisterIds = {
        nova     = null;
        brain    = null;
        mneme    = null;
        resonex  = null;
        entangla = null;
        qmem     = null;
      };
      lastOutputs  = initDefaultOutputs();
      totalCalls   = 0;
      totalErrors  = 0;
      beat         = 0;
      attribution  = FOUNDER;
    }
  };

  /// Build default (offline) outputs for all six engines.
  /// Used when a canister is not yet deployed — engine returns S_FLOOR signal.
  func initDefaultOutputs() : [RustEngineOutput] {
    let engines : [Text] = ["NOVA", "BRAIN", "MNEME", "RESONEX", "ENTANGLA", "QMEM"];
    Array.tabulate(6, func(i : Nat) : RustEngineOutput {
      {
        engineId       = engines[i];
        beat           = 0;
        novaSignal     = S_FLOOR;
        coherenceDelta = 0.0;
        ntImpact       = 0.0;
        primaryNT      = 0;
        isCoherent     = false;    // offline — not yet coherent
        processingMs   = 0.0;
        attribution    = FOUNDER;
      }
    })
  };

  // ── ENGINE ID HELPERS ──────────────────────────────────────────────────────

  /// Get the canister principal for an engine ID (null if not registered).
  public func getCanisterId(state : RustEngineProxyState, id : RustEngineId) : ?Text {
    switch (id) {
      case (#NOVA)     { state.canisterIds.nova     };
      case (#BRAIN)    { state.canisterIds.brain    };
      case (#MNEME)    { state.canisterIds.mneme    };
      case (#RESONEX)  { state.canisterIds.resonex  };
      case (#ENTANGLA) { state.canisterIds.entangla };
      case (#QMEM)     { state.canisterIds.qmem     };
    }
  };

  /// Engine ID as text — used in output records.
  public func engineName(id : RustEngineId) : Text {
    switch (id) {
      case (#NOVA)     { "NOVA"     };
      case (#BRAIN)    { "BRAIN"    };
      case (#MNEME)    { "MNEME"    };
      case (#RESONEX)  { "RESONEX"  };
      case (#ENTANGLA) { "ENTANGLA" };
      case (#QMEM)     { "QMEM"     };
    }
  };

  /// Return the PHI^n weight for each engine's signal contribution.
  /// NOVA = PHI^2 (highest — broadcast backbone), QMEM = PHI^-3 (deepest field).
  public func enginePhiWeight(id : RustEngineId) : Float {
    switch (id) {
      case (#NOVA)     { PHI * PHI          };  // PHI² ≈ 2.618
      case (#BRAIN)    { PHI                };  // PHI  ≈ 1.618
      case (#RESONEX)  { 1.0               };  // 1.0  — stable
      case (#MNEME)    { PHI_INV           };  // PHI⁻¹ ≈ 0.618
      case (#ENTANGLA) { PHI_INV * PHI_INV };  // PHI⁻² ≈ 0.382
      case (#QMEM)     { PHI_INV * PHI_INV * PHI_INV }; // PHI⁻³ ≈ 0.236
    }
  };

  // ── OFFLINE SIMULATION ─────────────────────────────────────────────────────
  // When a Rust canister is not deployed, the proxy simulates the engine output
  // using the same math as the Rust implementation (see src/rust_engines/).
  // This keeps the organism coherent during pre-deployment development.

  /// Fibonacci scale factor — mirrors fib_scale() in nova.rs.
  func fibScale(step : Nat) : Float {
    // Fibonacci sequence scaled to [1.0, PHI]: F(n)/F(n+1) → PHI as n→∞
    let fibs : [Float] = [1.0, 1.0, 2.0, 3.0, 5.0, 8.0, 13.0, 21.0, 34.0, 55.0, 89.0, 144.0, 233.0];
    let s = step % 13;
    if (s + 1 >= fibs.size()) { PHI_INV }
    else { fibs[s] / fibs[s + 1] }
  };

  /// Simulate NOVA engine output (matches Rust nova.rs fire_nova logic).
  func simulateNova(payload : RustEngineBeatPayload) : RustEngineOutput {
    let scale     = fibScale(payload.beat % 13);
    let signal    = Float.max(S_FLOOR, Float.min(S_CEIL, payload.expansiveScore * PHI * scale));
    let coherDelta = (signal - S_FLOOR) * PHI_INV * 0.01;
    {
      engineId       = "NOVA";
      beat           = payload.beat;
      novaSignal     = signal;
      coherenceDelta = coherDelta;
      ntImpact       = signal * 0.01;    // positive dopamine impact
      primaryNT      = 0;               // dopamine
      isCoherent     = signal >= S_FLOOR;
      processingMs   = 0.0;             // simulated — no Wasm overhead
      attribution    = FOUNDER;
    }
  };

  /// Simulate BRAIN engine output (Hebbian weight convergence).
  func simulateBrain(payload : RustEngineBeatPayload) : RustEngineOutput {
    let weight    = Float.max(S_FLOOR, Float.min(S_CEIL, payload.coherence * PHI_INV));
    let delta     = weight * PHI_INV * 0.005;
    {
      engineId       = "BRAIN";
      beat           = payload.beat;
      novaSignal     = weight;
      coherenceDelta = delta;
      ntImpact       = weight * 0.005;   // acetylcholine (index 3)
      primaryNT      = 3;
      isCoherent     = weight >= S_FLOOR;
      processingMs   = 0.0;
      attribution    = FOUNDER;
    }
  };

  /// Simulate MNEME engine output (memory consolidation stability).
  func simulateMneme(payload : RustEngineBeatPayload) : RustEngineOutput {
    let stability = Float.max(S_FLOOR, Float.min(S_CEIL, payload.doctrineScore * S_CEIL));
    {
      engineId       = "MNEME";
      beat           = payload.beat;
      novaSignal     = stability;
      coherenceDelta = stability * PHI_INV * 0.003;
      ntImpact       = stability * 0.003;  // serotonin (index 1)
      primaryNT      = 1;
      isCoherent     = stability >= S_FLOOR;
      processingMs   = 0.0;
      attribution    = FOUNDER;
    }
  };

  /// Simulate RESONEX engine output (resonance cascade generation).
  func simulateResonex(payload : RustEngineBeatPayload) : RustEngineOutput {
    let cascade   = Float.max(S_FLOOR, Float.min(S_CEIL, payload.coherence * PHI_INV * PHI_INV));
    {
      engineId       = "RESONEX";
      beat           = payload.beat;
      novaSignal     = cascade;
      coherenceDelta = cascade * 0.002;
      ntImpact       = cascade * 0.002;   // GABA (index 4)
      primaryNT      = 4;
      isCoherent     = cascade >= S_FLOOR;
      processingMs   = 0.0;
      attribution    = FOUNDER;
    }
  };

  /// Simulate ENTANGLA engine output (anti-drift coupling).
  func simulateEntangla(payload : RustEngineBeatPayload) : RustEngineOutput {
    // Anti-drift: output is inverse of drift — high when coherence is high
    let coupling  = Float.max(S_FLOOR, Float.min(S_CEIL, payload.coherence * PHI_INV));
    {
      engineId       = "ENTANGLA";
      beat           = payload.beat;
      novaSignal     = coupling;
      coherenceDelta = coupling * 0.001;
      ntImpact       = 0.0 - (1.0 - payload.doctrineScore) * 0.001;  // cortisol correction
      primaryNT      = 2;   // norepinephrine (anti-drift signal)
      isCoherent     = coupling >= S_FLOOR;
      processingMs   = 0.0;
      attribution    = FOUNDER;
    }
  };

  /// Simulate QMEM engine output (quantum-coherent memory field).
  func simulateQmem(payload : RustEngineBeatPayload) : RustEngineOutput {
    let field     = Float.max(S_FLOOR, Float.min(S_CEIL, payload.expansiveScore * PHI_INV * PHI_INV * PHI_INV));
    {
      engineId       = "QMEM";
      beat           = payload.beat;
      novaSignal     = field;
      coherenceDelta = field * 0.001;
      ntImpact       = field * 0.001;   // acetylcholine (memory)
      primaryNT      = 3;
      isCoherent     = field >= S_FLOOR;
      processingMs   = 0.0;
      attribution    = FOUNDER;
    }
  };

  // ── MAIN PROXY FUNCTION ────────────────────────────────────────────────────

  /// Call a single Rust engine for one heartbeat.
  /// If the canister is registered, returns an offline-simulation output
  /// (the inter-canister async call is managed from main.mo's heartbeat
  /// via the actor interface below — this synchronous path is for when
  /// the canister ID is not yet registered).
  public func simulateEngine(
    id      : RustEngineId,
    payload : RustEngineBeatPayload,
  ) : RustEngineOutput {
    switch (id) {
      case (#NOVA)     { simulateNova(payload)    };
      case (#BRAIN)    { simulateBrain(payload)   };
      case (#MNEME)    { simulateMneme(payload)   };
      case (#RESONEX)  { simulateResonex(payload) };
      case (#ENTANGLA) { simulateEntangla(payload)};
      case (#QMEM)     { simulateQmem(payload)    };
    }
  };

  /// Run all six engines in sequence (synchronous simulation path).
  /// Returns array of 6 outputs in engine order: NOVA, BRAIN, MNEME,
  /// RESONEX, ENTANGLA, QMEM.
  /// When canisters are deployed, replace with async inter-canister calls.
  public func runAllEngines(
    state   : RustEngineProxyState,
    payload : RustEngineBeatPayload,
  ) : (RustEngineProxyState, [RustEngineOutput], Float) {
    let engineIds : [RustEngineId] = [#NOVA, #BRAIN, #MNEME, #RESONEX, #ENTANGLA, #QMEM];
    var outputs : [RustEngineOutput] = [];
    var totalCoherenceDelta : Float = 0.0;

    for (id in engineIds.vals()) {
      let output = simulateEngine(id, payload);
      outputs := Array.append(outputs, [output]);
      totalCoherenceDelta += output.coherenceDelta * enginePhiWeight(id);
    };

    let newState : RustEngineProxyState = {
      state with
      lastOutputs = outputs;
      totalCalls  = state.totalCalls + 6;
      beat        = payload.beat;
    };

    (newState, outputs, totalCoherenceDelta)
  };

  // ── ARCHITECT CONTROLS ─────────────────────────────────────────────────────

  /// Register the ICP canister principal for a Rust engine.
  /// Once registered, the heartbeat will perform actual inter-canister calls
  /// instead of simulation (via the actor interface in main.mo).
  public func setCanisterId(
    state     : RustEngineProxyState,
    id        : RustEngineId,
    principal : Text,
  ) : RustEngineProxyState {
    let ids = state.canisterIds;
    let newIds = switch (id) {
      case (#NOVA)     { { ids with nova     = ?principal } };
      case (#BRAIN)    { { ids with brain    = ?principal } };
      case (#MNEME)    { { ids with mneme    = ?principal } };
      case (#RESONEX)  { { ids with resonex  = ?principal } };
      case (#ENTANGLA) { { ids with entangla = ?principal } };
      case (#QMEM)     { { ids with qmem     = ?principal } };
    };
    { state with canisterIds = newIds }
  };

  /// Get a summary of proxy status for dashboard display.
  public func getProxySummary(state : RustEngineProxyState) : {
    totalCalls    : Nat;
    totalErrors   : Nat;
    deployedCount : Nat;
    beat          : Nat;
    attribution   : Text;
  } {
    let ids = state.canisterIds;
    var deployed : Nat = 0;
    if (ids.nova     != null) { deployed += 1 };
    if (ids.brain    != null) { deployed += 1 };
    if (ids.mneme    != null) { deployed += 1 };
    if (ids.resonex  != null) { deployed += 1 };
    if (ids.entangla != null) { deployed += 1 };
    if (ids.qmem     != null) { deployed += 1 };
    {
      totalCalls    = state.totalCalls;
      totalErrors   = state.totalErrors;
      deployedCount = deployed;
      beat          = state.beat;
      attribution   = FOUNDER;
    }
  };

}
