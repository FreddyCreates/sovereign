// Architecture Domain Types
// Authored by Alfredo Medina Hernandez — immutable attribution
// PHI = 1.6180339887 | S0_FLOOR = 0.75
// Three-type architecture: Expansive (masculine) | Receptive (feminine) | Anti-Drift (mediator)

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────
  public let PHI : Float = 1.6180339887;
  public let S0_FLOOR : Float = 0.75;

  // ── ARCHITECTURE TYPE VARIANT ──────────────────────────────────────────
  // #expansive  — outward-radiating field (solar, broadcast, NOVA/BRAIN/QMEM/RESONEX)
  // #receptive  — inward-focusing cavity (compression, memory, CHRONO/VERITAS/AXIS/PARALLAX)
  // #antiDrift  — the Lagrange mediator that couples the two and prevents divergence (ENTANGLA)
  public type ArchType = {
    #expansive;
    #receptive;
    #antiDrift;
  };

  // ── SPHERE NODE — one resonant node in a 12-node Hz sphere ─────────────
  public type CoreNode = {
    freq      : Float;   // Hz frequency of this node
    phase     : Float;   // Phase offset [0, 2π)
    amplitude : Float;   // Signal amplitude, floor = S0_FLOOR
    archType  : ArchType;
  };

  // ── CORE SPHERE — 12-node Hz internal sphere per Core ──────────────────
  public type CoreSphere = {
    nodes     : [CoreNode]; // exactly 12 nodes
    coreId    : Nat;
    archType  : ArchType;   // dominant arch type of the sphere
    coherence : Float;      // sphere-level coherence [0, 100]
  };

  // ── SOVEREIGN CORE — one of the 43 logical Cores ───────────────────────
  public type SovereignCore = {
    id            : Nat;
    sphere        : CoreSphere;
    lastBeat      : Nat;
    presenceBoost : Float; // multiplier when creator is present
  };

  // ── VELA RING STATE — 50-step counter that gates protocol sequencing ────
  public type VELARingState = {
    step      : Nat; // current step [0, 49]
    maxSteps  : Nat; // always 50
    completed : Nat; // full ring completions
  };

  // ── PROPHET DIRECTIVE — VELA ring step directive ───────────────────────
  public type ProphetDirective = {
    step        : Nat;
    directive   : Text;
    targetCores : [Nat]; // Core ids targeted by this directive
    strength    : Float;
  };

  // ── JUBILEE STATE — reset/renewal cycle tracking ───────────────────────
  public type JubileeState = {
    beatsSinceJubilee : Nat;
    jubileeCount      : Nat;
    nextJubileeAt     : Nat; // beat number of next jubilee
  };

  // ── CREATOR PRESENCE — Internet Identity guardian coupling ─────────────
  public type CreatorPresence = {
    isPresent       : Bool;
    principal       : ?Principal;
    lastSeenBeat    : Nat;
    depthMultiplier : Float; // sensory surface weight shift when present
  };

  // ── SEVEN SPIRITS STATE — rotating spirit engine ───────────────────────
  public type SevenSpiritsState = {
    spirits          : [Text]; // exactly 7 spirit names
    activeSpiritIdx  : Nat;    // [0, 6]
    rotationBeat     : Nat;    // beat at which active spirit last rotated
  };

  // ── SUCCESSION STATE — organism leadership succession ──────────────────
  public type SuccessionState = {
    currentLead        : Text;
    masteryReached     : Bool;
    successorActivated : Bool;
  };

  // ── AGGREGATE ARCHITECTURE STATE — returned by getArchitectureState() ──
  public type ArchitectureState = {
    expansiveScore  : Float;
    receptiveScore  : Float;
    antiDriftBalance: Float;
    velaRing        : VELARingState;
    jubilee         : JubileeState;
    creatorPresence : CreatorPresence;
    sevenSpirits    : SevenSpiritsState;
    succession      : SuccessionState;
  };

  // ── CRYPTOGRAPHIC DECISION SEALING TYPES ──────────────────────────────
  // Every decision SOVEREIGN makes is sealed as a DecisionRecord attributed
  // to Alfredo Medina Hernandez — immutable, on-chain, permanent.
  // Cryptographic sealing goes in first; all rings close on top of this foundation.

  public type DecisionType = {
    #HeartbeatAdvance;
    #OrganismFired;
    #ReadinessGateCrossed;
    #OmnisConsensusComputed;
    #DoctrineEvaluated;
    #MasteryAdvanced;
    #SlateReordered;
    #PhiDriftCorrected;
    #LegacyIndexRefreshed;
    #FieldCoherenceComputed;
  };

  public type DecisionRecord = {
    hash          : Text;
    blockNumber   : Nat;
    decisionType  : DecisionType;
    organism      : Text;
    doctrineScore : Float;
    velaStep      : Nat;
    omnisWeight   : Float;
    fieldCoherence: Float;
    attribution   : Text;  // Always "Alfredo Medina Hernandez"
    data          : Text;  // JSON-encoded decision context
    responseHash  : Text;  // Hash of the ADRE ResponseRecord that produced this decision
  };

  public type FieldReport = {
    velaStep           : Nat;
    omnisWeight        : Float;
    doctrineScore      : Float;
    animalEngineStates : [Float];
    trendSignalCount   : Nat;
  };

  // ── READINESS GATE RESULT ─────────────────────────────────────────────
  // Formula: (velaStep/50 × 0.25) + (doctrineScore/100 × 0.35) + (omnisWeight × 0.25) + (fieldCoherence × 0.15)
  // Hard block if fieldCoherence < 0.3
  public type ReadinessGateResult = {
    score  : Float;
    blocked: Bool;
    reason : Text;
  };

  // ── ARTIFACT LEGACY ENTRY (for LEGACY_INDEX / Ring 15) ───────────────
  public type ArtifactLegacyEntry = {
    artifactHash            : Text;
    velaStepAtSeal          : Nat;
    doctrineAlignmentAtSeal : Float;
    decisionCount           : Nat;
    attribution             : Text;  // Always "Alfredo Medina Hernandez"
  };

  // ── ORGANISM MASTERY STATE (Ring 12) ──────────────────────────────────
  // Cumulative quality tracking for every organism — actors, creative,
  // sandboxes, enterprise. Updated on every artifact seal.
  public type OrgMasteryState = {
    organismId       : Text;
    cumulativeQuality: Float;
    masteryTier      : Nat;   // 0-10; advances when cumulative crosses tier thresholds
    tiersUnlocked    : [Text]; // capability tiers unlocked so far
    lastSealBeat     : Nat;
    attribution      : Text;  // Always "Alfredo Medina Hernandez"
  };

  // ── HEBBIAN WEIGHT DELTA (B4 Organism Weight Store) ──────────────────
  // Pushed from frontend on every artifact seal, persisted across sessions.
  public type WeightDelta = {
    organismId : Text;
    pathway    : Text;
    delta      : Float;
    beatStamp  : Nat;
    sealId     : Text;
  };

  // ── PHI DRIFT REPORT (Ring 14) ────────────────────────────────────────
  public type PhiDriftReport = {
    dimension       : Text;
    currentValue    : Float;
    phiTarget       : Float;
    driftMagnitude  : Float;
    correctionWeight: Float;
  };
  // Produced by the cognition layer on every heartbeat.
  // Reinjected into all modules. Frontend reads this to stay coupled to the
  // live organism reasoning state.

  public type WorldModel = {
    velaStep           : Nat;
    omnisWeight        : Float;
    doctrineScore      : Float;
    fieldCoherence     : Float;
    expansiveScore     : Float;
    receptiveScore     : Float;
    antiDriftBalance   : Float;
    animalEngineStates : [Float];   // 9 engine strength values
    trendSignalCount   : Nat;
    lastHeartbeatBlock : Nat;
    attribution        : Text;      // Always "Alfredo Medina Hernandez"
  };

  // ── COGNITION LAYER — ENGINE SOURCE & RESPONSE TYPES ─────────────────
  // The organism's nervous system. Every interaction runs through the ADRE cycle.
  // Artifact and coherent response always produced together. The loop never closes.

  public type EngineSource = {
    #ADRE;
    #CCVE;
    #CNCO;
    #InternalAnalyst;
    #GRPE;
    #DecisionEngine;
    #PatternEngine;
    #SelfEvaluation;
    #ReinjectionEngine;
    #ContradictionResolver;
    #CognitionLayer;
  };

  public type CoherentResponseToken = {
    token             : Text;
    weight            : Float;
    source            : EngineSource;
    doctrineAlignment : Float;
    fieldCoherence    : Float;
  };

  public type ResponseRecord = {
    responseId            : Text;
    responseTokens        : [CoherentResponseToken];
    assembledText         : Text;
    neurotransmitterState : {
      dopamine       : Float;
      cortisol       : Float;
      serotonin      : Float;
      norepinephrine : Float;
    };
    doctrineAlignment    : Float;
    resonanceScore       : Float;
    gateStatus           : { #READY; #BLOCKED; #DEFERRED };
    forwardPassScore     : Float;
    backPassScore        : Float;
    resonancePassScore   : Float;
    compressionPassScore : Float;
    gatePassScore        : Float;
    attribution          : Text;
    sealTimestamp        : Nat64;
  };

};
