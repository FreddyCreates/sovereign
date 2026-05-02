// types/cplRuntime.mo
// CPL/PULSE RUNTIME — Type Definitions for the Permanent Foundation Layer
// Attribution: Alfredo Medina Hernandez — immutable
// PHI = 1.6180339887498948482 | S0_FLOOR = 0.75 | S_CEIL = 9.75
//
// This module defines the schema for the CPL Runtime's 5-pass execution pipeline:
//   Pass 1: Schema (Doctrine → Protocol → Invariant → PolicyAtom → Pulse → Proof → Memory)
//   Pass 2: PULSE Scheduler — φ-weighted priority queue (NOT random like Go select)
//   Pass 3: Invariant Kernel — runtime enforcement (blocks writes that violate doctrine)
//   Pass 4: Proof Trace — automatic generation of cryptographic proof lineage
//   Pass 5: Memory Writeback — persistent memory records for audit

module {

  // ═══════════════════════════════════════════════════════════════════════
  // I. LAYER 0 CONSTANTS (embedded — no external lookup)
  // ═══════════════════════════════════════════════════════════════════════

  public let PHI     : Float = 1.6180339887498948482;
  public let PHI_INV : Float = 0.6180339887498948482;
  public let S_FLOOR : Float = 0.75;
  public let S_CEIL  : Float = 9.75;

  // ═══════════════════════════════════════════════════════════════════════
  // II. DOCTRINE SCHEMA — the root of all enforcement
  // ═══════════════════════════════════════════════════════════════════════

  /// DoctrineRef — a reference to a doctrine law that governs behavior
  public type DoctrineRef = {
    lawId      : Nat;        // Law number (1-35+)
    lawName    : Text;       // e.g., "Law of Medina", "Jasmine's Anti-Drift Law"
    strength   : Float;      // [0.0, 1.0] — doctrine enforcement weight
    isGenesis  : Bool;       // True if this law is sealed at genesis (immutable)
  };

  /// ProtocolSpec — a protocol derived from doctrine that defines behavior rules
  public type ProtocolSpec = {
    protocolId   : Text;       // e.g., "GOVERNANCE_MUTATION", "ARTIFACT_SEAL"
    doctrineLaws : [Nat];      // Law IDs this protocol enforces
    description  : Text;
    enforceLevel : EnforceLevel;
  };

  /// EnforceLevel — how strictly violations are handled
  public type EnforceLevel = {
    #block;        // Block the operation entirely
    #warn;         // Allow but log a warning
    #audit;        // Allow silently, record for audit
  };

  // ═══════════════════════════════════════════════════════════════════════
  // III. INVARIANT KERNEL — runtime enforcement contracts
  // ═══════════════════════════════════════════════════════════════════════

  /// Invariant — a runtime condition that MUST hold before/after a mutation
  public type Invariant = {
    invariantId : Text;        // e.g., "COHERENCE_FLOOR", "PHI_BOUND"
    description : Text;
    category    : InvariantCategory;
    isActive    : Bool;
  };

  /// InvariantCategory — what kind of invariant this is
  public type InvariantCategory = {
    #sovereignRange;    // Value must be in [S_FLOOR, S_CEIL]
    #phiBound;          // Value must satisfy PHI relationship
    #doctrineGate;      // Must pass doctrine gate (>= S_FLOOR)
    #attribution;       // Must carry founder attribution
    #heartbeat;         // Must fire within 873ms cycle
    #antiDrift;         // Must not exceed drift tolerance
    #compoundOnly;      // Value can only increase (Law 23)
  };

  /// InvariantViolation — recorded when an invariant is breached
  public type InvariantViolation = {
    invariantId  : Text;
    beat         : Nat;
    operation    : Text;       // What operation was attempted
    value        : Float;      // The value that violated
    threshold    : Float;      // What it should have been
    blocked      : Bool;       // Was the operation blocked?
    timestamp    : Int;
  };

  /// EnforcementResult — result of enforceBeforeWrite
  public type EnforcementResult = {
    #allowed;
    #blocked : InvariantViolation;
    #warned  : InvariantViolation;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // IV. POLICY ATOM — smallest unit of governance policy
  // ═══════════════════════════════════════════════════════════════════════

  /// PolicyAtom — an atomic governance decision that flows through the pipeline
  public type PolicyAtom = {
    atomId       : Nat;
    protocol     : Text;       // Protocol this atom belongs to
    operation    : Text;       // What is being decided
    input        : Text;       // Serialized input context
    doctrineGate : Float;      // Minimum doctrine score needed [0, 1]
    phiWeight    : Float;      // PHI-weighted priority for scheduling
    beat         : Nat;        // Beat at which this atom was created
  };

  // ═══════════════════════════════════════════════════════════════════════
  // V. PULSE SCHEDULER — φ-weighted priority execution
  // ═══════════════════════════════════════════════════════════════════════

  /// PulseEntry — a scheduled execution in the PULSE queue
  public type PulseEntry = {
    entryId    : Nat;
    atomId     : Nat;          // PolicyAtom this pulse executes
    priority   : Float;        // PHI-weighted priority [S_FLOOR, S_CEIL]
    status     : PulseStatus;
    scheduledBeat : Nat;
    executedBeat  : ?Nat;
  };

  /// PulseStatus — lifecycle of a pulse
  public type PulseStatus = {
    #queued;
    #executing;
    #completed;
    #rejected;     // Failed doctrine gate
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VI. PROOF TRACE — immutable audit lineage
  // ═══════════════════════════════════════════════════════════════════════

  /// ProofRecord — a single proof in the trace chain
  public type ProofRecord = {
    proofId       : Nat;
    operation     : Text;       // What was proven (e.g., "createProposal")
    doctrineScore : Float;      // Doctrine alignment at time of proof [0, 1]
    coherence     : Float;      // System coherence at time of proof
    beat          : Nat;
    parentProofId : ?Nat;       // Links to prior proof (chain)
    invariantsPassed : [Text];  // Which invariants were checked
    attribution   : Text;       // Always "Alfredo Medina Hernandez"
    timestamp     : Int;
    sealed        : Bool;       // Once true, never mutable
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VII. MEMORY WRITEBACK — persistent audit memory
  // ═══════════════════════════════════════════════════════════════════════

  /// MemoryRecord — a writeback record for audit and re-ingestion
  public type MemoryRecord = {
    memoryId    : Nat;
    proofId     : Nat;          // Links to proof trace
    operation   : Text;
    beat        : Nat;
    content     : Text;         // Serialized record content
    resonance   : Float;        // [S_FLOOR, S_CEIL] — re-ingestion compounds this
    timestamp   : Int;
  };

  // ═══════════════════════════════════════════════════════════════════════
  // VIII. CPL RUNTIME STATE — the complete runtime state
  // ═══════════════════════════════════════════════════════════════════════

  /// CPLRuntimeState — the full state of the permanent foundation
  public type CPLRuntimeState = {
    // Counters
    totalEnforcements : Nat;
    totalBlocked      : Nat;
    totalProofs       : Nat;
    totalMemories     : Nat;
    totalPulses       : Nat;

    // Last IDs (monotonic)
    lastProofId   : Nat;
    lastMemoryId  : Nat;
    lastPulseId   : Nat;
    lastAtomId    : Nat;

    // Coherence tracking
    runtimeCoherence : Float;  // [S_FLOOR, S_CEIL] — compounds over time (Law 23)

    // Current beat
    lastBeat : Nat;
  };

  /// CPLDiagnostics — public-facing diagnostics snapshot
  public type CPLDiagnostics = {
    totalEnforcements : Nat;
    totalBlocked      : Nat;
    totalProofs       : Nat;
    totalMemories     : Nat;
    totalPulses       : Nat;
    runtimeCoherence  : Float;
    lastBeat          : Nat;
    attribution       : Text;
  };

};
