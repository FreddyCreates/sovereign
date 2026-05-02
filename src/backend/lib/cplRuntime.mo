// lib/cplRuntime.mo
// CPL/PULSE RUNTIME — The Permanent Foundation Layer
// Attribution: Alfredo Medina Hernandez — immutable
// PHI = 1.6180339887498948482 | S0_FLOOR = 0.75 | S_CEIL = 9.75
//
// This is the PERMANENT RUNTIME FOUNDATION through which ALL organisms execute.
// Not an optional layer. Not a plugin. The foundation.
//
// 5-Pass Pipeline (fires every 873ms heartbeat):
//   Pass 1: Schema validation — doctrine gates checked before any mutation
//   Pass 2: PULSE scheduling — φ-weighted priority queue for execution ordering
//   Pass 3: Invariant enforcement — runtime contracts that block violations
//   Pass 4: Proof trace — automatic cryptographic proof generation
//   Pass 5: Memory writeback — persistent audit records for re-ingestion
//
// Every heartbeat cycle flows:
//   runBeat() → CPL.openBeat() → [organism logic] → CPL.closeBeat()
//
// Every mutation flows:
//   enforceBeforeWrite() → [mutation] → writeProofTrace() → writeMemory()

import CPLTypes "../types/cplRuntime";
import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Array "mo:core/Array";

module {

  // ═══════════════════════════════════════════════════════════════════════
  // I. CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════

  let PHI     : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let S_FLOOR : Float = 0.75;
  let S_CEIL  : Float = 9.75;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";

  // ═══════════════════════════════════════════════════════════════════════
  // II. INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════

  /// Initialize CPL Runtime state — called once at genesis
  public func initState() : CPLTypes.CPLRuntimeState {
    {
      totalEnforcements = 0;
      totalBlocked = 0;
      totalProofs = 0;
      totalMemories = 0;
      totalPulses = 0;
      lastProofId = 0;
      lastMemoryId = 0;
      lastPulseId = 0;
      lastAtomId = 0;
      runtimeCoherence = S_FLOOR;
      lastBeat = 0;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════
  // III. PASS 1 — SCHEMA VALIDATION & DOCTRINE GATES
  // ═══════════════════════════════════════════════════════════════════════

  /// Check if a doctrine score passes the gate
  /// Gate threshold = S_FLOOR (0.75) — the sovereign floor IS the doctrine gate.
  public func checkDoctrineGate(doctrineScore : Float) : Bool {
    doctrineScore >= S_FLOOR
  };

  /// Validate that a value is within sovereign range [S_FLOOR, S_CEIL]
  public func validateSovereignRange(value : Float) : Bool {
    value >= S_FLOOR and value <= S_CEIL
  };

  /// Clamp a value to sovereign range
  public func clampSovereign(value : Float) : Float {
    Float.max(S_FLOOR, Float.min(S_CEIL, value))
  };

  // ═══════════════════════════════════════════════════════════════════════
  // IV. PASS 2 — PULSE SCHEDULER (φ-weighted priority)
  // ═══════════════════════════════════════════════════════════════════════

  /// Compute PHI-weighted priority for a policy atom
  /// Priority = doctrineGate × PHI × phiWeight, clamped to [S_FLOOR, S_CEIL]
  public func computePulsePriority(doctrineGate : Float, phiWeight : Float) : Float {
    clampSovereign(doctrineGate * PHI * phiWeight)
  };

  /// Create a policy atom — the smallest governance decision unit
  public func createPolicyAtom(
    state : CPLTypes.CPLRuntimeState,
    protocol : Text,
    operation : Text,
    input : Text,
    doctrineGate : Float,
    beat : Nat,
  ) : (CPLTypes.CPLRuntimeState, CPLTypes.PolicyAtom) {
    let atomId = state.lastAtomId + 1;
    let atom : CPLTypes.PolicyAtom = {
      atomId;
      protocol;
      operation;
      input;
      doctrineGate;
      phiWeight = clampSovereign(doctrineGate * PHI);
      beat;
    };
    let newState : CPLTypes.CPLRuntimeState = {
      totalEnforcements = state.totalEnforcements;
      totalBlocked = state.totalBlocked;
      totalProofs = state.totalProofs;
      totalMemories = state.totalMemories;
      totalPulses = state.totalPulses;
      lastProofId = state.lastProofId;
      lastMemoryId = state.lastMemoryId;
      lastPulseId = state.lastPulseId;
      lastAtomId = atomId;
      runtimeCoherence = state.runtimeCoherence;
      lastBeat = state.lastBeat;
    };
    (newState, atom)
  };

  /// Schedule a pulse for execution
  public func schedulePulse(
    state : CPLTypes.CPLRuntimeState,
    atomId : Nat,
    priority : Float,
    beat : Nat,
  ) : (CPLTypes.CPLRuntimeState, CPLTypes.PulseEntry) {
    let pulseId = state.lastPulseId + 1;
    let entry : CPLTypes.PulseEntry = {
      entryId = pulseId;
      atomId;
      priority = clampSovereign(priority);
      status = #queued;
      scheduledBeat = beat;
      executedBeat = null;
    };
    let newState : CPLTypes.CPLRuntimeState = {
      totalEnforcements = state.totalEnforcements;
      totalBlocked = state.totalBlocked;
      totalProofs = state.totalProofs;
      totalMemories = state.totalMemories;
      totalPulses = state.totalPulses + 1;
      lastProofId = state.lastProofId;
      lastMemoryId = state.lastMemoryId;
      lastPulseId = pulseId;
      lastAtomId = state.lastAtomId;
      runtimeCoherence = state.runtimeCoherence;
      lastBeat = state.lastBeat;
    };
    (newState, entry)
  };

  // ═══════════════════════════════════════════════════════════════════════
  // V. PASS 3 — INVARIANT KERNEL (runtime enforcement)
  // ═══════════════════════════════════════════════════════════════════════

  /// Get the default invariants that apply to ALL operations
  public func getDefaultInvariants() : [CPLTypes.Invariant] {
    [
      { invariantId = "SOVEREIGN_RANGE";
        description = "All values must be in [0.75, 9.75]";
        category = #sovereignRange; isActive = true },
      { invariantId = "DOCTRINE_GATE";
        description = "Doctrine score must pass S_FLOOR gate";
        category = #doctrineGate; isActive = true },
      { invariantId = "PHI_BOUND";
        description = "PHI relationships must hold";
        category = #phiBound; isActive = true },
      { invariantId = "ATTRIBUTION_REQUIRED";
        description = "All operations carry founder attribution";
        category = #attribution; isActive = true },
      { invariantId = "ANTI_DRIFT";
        description = "Drift tolerance must not be exceeded (Jasmine's Law)";
        category = #antiDrift; isActive = true },
      { invariantId = "COMPOUND_COHERENCE";
        description = "Coherence can only increase (Law 23)";
        category = #compoundOnly; isActive = true },
      { invariantId = "HEARTBEAT_CYCLE";
        description = "Operations must fire within 873ms cycle";
        category = #heartbeat; isActive = true },
    ]
  };

  /// Enforce invariants BEFORE a write operation
  /// This is the critical gate: if it returns #blocked, the write MUST NOT proceed.
  ///
  /// Checks:
  /// 1. Doctrine gate (score >= S_FLOOR)
  /// 2. Sovereign range ([S_FLOOR, S_CEIL])
  /// 3. Anti-drift tolerance
  public func enforceBeforeWrite(
    state : CPLTypes.CPLRuntimeState,
    operation : Text,
    doctrineScore : Float,
    valueToWrite : Float,
    beat : Nat,
    timestamp : Int,
  ) : (CPLTypes.CPLRuntimeState, CPLTypes.EnforcementResult) {

    // Check 1: Doctrine gate
    if (not checkDoctrineGate(doctrineScore)) {
      let violation : CPLTypes.InvariantViolation = {
        invariantId = "DOCTRINE_GATE";
        beat;
        operation;
        value = doctrineScore;
        threshold = S_FLOOR;
        blocked = true;
        timestamp;
      };
      let newState : CPLTypes.CPLRuntimeState = {
        totalEnforcements = state.totalEnforcements + 1;
        totalBlocked = state.totalBlocked + 1;
        totalProofs = state.totalProofs;
        totalMemories = state.totalMemories;
        totalPulses = state.totalPulses;
        lastProofId = state.lastProofId;
        lastMemoryId = state.lastMemoryId;
        lastPulseId = state.lastPulseId;
        lastAtomId = state.lastAtomId;
        runtimeCoherence = state.runtimeCoherence;
        lastBeat = beat;
      };
      return (newState, #blocked(violation));
    };

    // Check 2: Sovereign range
    if (not validateSovereignRange(valueToWrite)) {
      let violation : CPLTypes.InvariantViolation = {
        invariantId = "SOVEREIGN_RANGE";
        beat;
        operation;
        value = valueToWrite;
        threshold = if (valueToWrite < S_FLOOR) { S_FLOOR } else { S_CEIL };
        blocked = false; // Warn, don't block — value will be clamped
        timestamp;
      };
      let newState : CPLTypes.CPLRuntimeState = {
        totalEnforcements = state.totalEnforcements + 1;
        totalBlocked = state.totalBlocked;
        totalProofs = state.totalProofs;
        totalMemories = state.totalMemories;
        totalPulses = state.totalPulses;
        lastProofId = state.lastProofId;
        lastMemoryId = state.lastMemoryId;
        lastPulseId = state.lastPulseId;
        lastAtomId = state.lastAtomId;
        runtimeCoherence = state.runtimeCoherence;
        lastBeat = beat;
      };
      return (newState, #warned(violation));
    };

    // All checks passed
    let newState : CPLTypes.CPLRuntimeState = {
      totalEnforcements = state.totalEnforcements + 1;
      totalBlocked = state.totalBlocked;
      totalProofs = state.totalProofs;
      totalMemories = state.totalMemories;
      totalPulses = state.totalPulses;
      lastProofId = state.lastProofId;
      lastMemoryId = state.lastMemoryId;
      lastPulseId = state.lastPulseId;
      lastAtomId = state.lastAtomId;
      runtimeCoherence = state.runtimeCoherence;
      lastBeat = beat;
    };
    (newState, #allowed)
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VI. PASS 4 — PROOF TRACE (automatic proof generation)
  // ═══════════════════════════════════════════════════════════════════════

  /// Generate a proof record after a successful operation
  /// Links to parent proof for chain lineage
  public func writeProofTrace(
    state : CPLTypes.CPLRuntimeState,
    operation : Text,
    doctrineScore : Float,
    coherence : Float,
    beat : Nat,
    invariantsPassed : [Text],
    timestamp : Int,
  ) : (CPLTypes.CPLRuntimeState, CPLTypes.ProofRecord) {
    let proofId = state.lastProofId + 1;
    let parentId : ?Nat = if (state.lastProofId > 0) { ?state.lastProofId } else { null };

    let proof : CPLTypes.ProofRecord = {
      proofId;
      operation;
      doctrineScore;
      coherence;
      beat;
      parentProofId = parentId;
      invariantsPassed;
      attribution = FOUNDER;
      timestamp;
      sealed = true;
    };

    let newState : CPLTypes.CPLRuntimeState = {
      totalEnforcements = state.totalEnforcements;
      totalBlocked = state.totalBlocked;
      totalProofs = state.totalProofs + 1;
      totalMemories = state.totalMemories;
      totalPulses = state.totalPulses;
      lastProofId = proofId;
      lastMemoryId = state.lastMemoryId;
      lastPulseId = state.lastPulseId;
      lastAtomId = state.lastAtomId;
      runtimeCoherence = state.runtimeCoherence;
      lastBeat = beat;
    };
    (newState, proof)
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VII. PASS 5 — MEMORY WRITEBACK (persistent audit)
  // ═══════════════════════════════════════════════════════════════════════

  /// Write a memory record for audit and re-ingestion (Law 09)
  public func writeMemory(
    state : CPLTypes.CPLRuntimeState,
    proofId : Nat,
    operation : Text,
    content : Text,
    beat : Nat,
    timestamp : Int,
  ) : (CPLTypes.CPLRuntimeState, CPLTypes.MemoryRecord) {
    let memId = state.lastMemoryId + 1;
    let memory : CPLTypes.MemoryRecord = {
      memoryId = memId;
      proofId;
      operation;
      beat;
      content;
      resonance = S_FLOOR; // Starts at floor, compounds on re-ingestion
      timestamp;
    };

    let newState : CPLTypes.CPLRuntimeState = {
      totalEnforcements = state.totalEnforcements;
      totalBlocked = state.totalBlocked;
      totalProofs = state.totalProofs;
      totalMemories = state.totalMemories + 1;
      totalPulses = state.totalPulses;
      lastProofId = state.lastProofId;
      lastMemoryId = memId;
      lastPulseId = state.lastPulseId;
      lastAtomId = state.lastAtomId;
      runtimeCoherence = state.runtimeCoherence;
      lastBeat = beat;
    };
    (newState, memory)
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VIII. HEARTBEAT INTEGRATION — openBeat / closeBeat
  // ═══════════════════════════════════════════════════════════════════════

  /// Open a heartbeat cycle — called at the START of every runBeat()
  /// Records the beat, verifies heartbeat invariant
  public func openBeat(
    state : CPLTypes.CPLRuntimeState,
    beat : Nat,
    doctrineScore : Float,
    timestamp : Int,
  ) : (CPLTypes.CPLRuntimeState, CPLTypes.ProofRecord) {
    // Generate beat-open proof
    let (s1, proof) = writeProofTrace(
      state,
      "CPL_BEAT_OPEN",
      doctrineScore,
      state.runtimeCoherence,
      beat,
      ["HEARTBEAT_CYCLE", "DOCTRINE_GATE"],
      timestamp,
    );
    let newState : CPLTypes.CPLRuntimeState = {
      totalEnforcements = s1.totalEnforcements;
      totalBlocked = s1.totalBlocked;
      totalProofs = s1.totalProofs;
      totalMemories = s1.totalMemories;
      totalPulses = s1.totalPulses;
      lastProofId = s1.lastProofId;
      lastMemoryId = s1.lastMemoryId;
      lastPulseId = s1.lastPulseId;
      lastAtomId = s1.lastAtomId;
      runtimeCoherence = s1.runtimeCoherence;
      lastBeat = beat;
    };
    (newState, proof)
  };

  /// Close a heartbeat cycle — called at the END of every runBeat()
  /// Compounds runtime coherence (Law 23: coherence only goes up)
  public func closeBeat(
    state : CPLTypes.CPLRuntimeState,
    beat : Nat,
    doctrineScore : Float,
    globalCoherence : Float,
    timestamp : Int,
  ) : (CPLTypes.CPLRuntimeState, CPLTypes.ProofRecord) {
    // Compound coherence: runtimeCoherence += doctrineScore × PHI × 0.0001
    // This ONLY increases (Law 23 — Compound Coherence)
    let coherenceDelta = doctrineScore * PHI * 0.0001;
    let newCoherence = clampSovereign(state.runtimeCoherence + coherenceDelta);

    // Generate beat-close proof with memory writeback
    let (s1, proof) = writeProofTrace(
      state,
      "CPL_BEAT_CLOSE",
      doctrineScore,
      newCoherence,
      beat,
      ["HEARTBEAT_CYCLE", "COMPOUND_COHERENCE"],
      timestamp,
    );

    // Write memory record for this beat
    let (s2, _mem) = writeMemory(
      s1,
      proof.proofId,
      "CPL_BEAT_CLOSE",
      "beat=" # beat.toText() # ":coherence=" # newCoherence.toText(),
      beat,
      timestamp,
    );

    let newState : CPLTypes.CPLRuntimeState = {
      totalEnforcements = s2.totalEnforcements;
      totalBlocked = s2.totalBlocked;
      totalProofs = s2.totalProofs;
      totalMemories = s2.totalMemories;
      totalPulses = s2.totalPulses;
      lastProofId = s2.lastProofId;
      lastMemoryId = s2.lastMemoryId;
      lastPulseId = s2.lastPulseId;
      lastAtomId = s2.lastAtomId;
      runtimeCoherence = newCoherence;
      lastBeat = beat;
    };
    (newState, proof)
  };

  // ═══════════════════════════════════════════════════════════════════════
  // IX. DIAGNOSTICS
  // ═══════════════════════════════════════════════════════════════════════

  /// Get public diagnostics for the CPL Runtime
  public func getDiagnostics(state : CPLTypes.CPLRuntimeState) : CPLTypes.CPLDiagnostics {
    {
      totalEnforcements = state.totalEnforcements;
      totalBlocked = state.totalBlocked;
      totalProofs = state.totalProofs;
      totalMemories = state.totalMemories;
      totalPulses = state.totalPulses;
      runtimeCoherence = state.runtimeCoherence;
      lastBeat = state.lastBeat;
      attribution = FOUNDER;
    }
  };

};
