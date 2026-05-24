// types/intelligenceFloors.mo
// INTELLIGENCE FLOORS & AI MICROS — LLM Architecture Weavers
// ─────────────────────────────────────────────────────────────────────────────
// "The architecture of intelligence is not flat — it is a tower of floors,
// each floor specialized, each floor essential. Between floors, micro-intelligences
// weave the connections — attention flows, parameters propagate, embeddings resonate."
//
// EIGHT INTELLIGENCE FLOORS (modeled after LLM architecture):
//
//   I.   FLOOR_PARAMETERS          — Billions to trillions of weights (~10¹² floats)
//   II.  FLOOR_ATTENTION           — Multi-head self-attention mechanisms (O(n²) per layer)
//   III. FLOOR_FEEDFORWARD         — Dense neural network layers (~4d² per layer)
//   IV.  FLOOR_NORMALIZATION       — Layer norm, RMS norm (Stabilization)
//   V.   FLOOR_TOKENIZATION        — BPE, SentencePiece vocabularies (~100k tokens)
//   VI.  FLOOR_EMBEDDINGS          — High-dimensional vector spaces (~10⁴ dimensions)
//   VII. FLOOR_TRAINING_CORPUS     — Vast text data (~10¹² tokens)
//   VIII.FLOOR_EMERGENT            — Reasoning, code, translation (Unpredicted capabilities)
//
// TWELVE AI MICROS (weave between floors):
//
//   1.  MICRO_GRADIENT_FLOW        — Backpropagation gradient signals
//   2.  MICRO_RESIDUAL_STREAM      — Skip connections and residual paths
//   3.  MICRO_KEY_VALUE            — Key-value attention cache management
//   4.  MICRO_POSITION_ENCODER     — Positional encoding signals (sinusoidal/learned)
//   5.  MICRO_SOFTMAX_GATE         — Attention weight normalization
//   6.  MICRO_GELU_ACTIVATION      — Gaussian error linear unit activations
//   7.  MICRO_DROPOUT_MASK         — Regularization through masking
//   8.  MICRO_LAYER_CONNECT        — Inter-layer connection routing
//   9.  MICRO_CONTEXT_WINDOW       — Context length management
//   10. MICRO_VOCAB_LOOKUP         — Token-to-embedding lookup
//   11. MICRO_LOGIT_HEAD           — Output logit computation
//   12. MICRO_ENTROPY_SAMPLER      — Temperature-based sampling
//
// Each floor has:
//   - Unique resonance frequency (derived from LLM scale)
//   - PHI-weighted signal [S_FLOOR, S_CEIL]
//   - Capacity metric (billions, dimensions, tokens, etc.)
//   - Efficiency score [0.0, 1.0]
//   - Connected micros (which micros weave to this floor)
//
// Each micro has:
//   - Source floor and target floor (the weave)
//   - Signal strength [0.0, 1.0]
//   - Activation frequency (how often it fires)
//   - PHI resonance coupling
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | SCHUMANN = 7.83 | 873ms
// ─────────────────────────────────────────────────────────────────────────────

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Text  "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  public let PHI      : Float = 1.6180339887498948482;
  public let PHI_INV  : Float = 0.6180339887498948482;
  public let SCHUMANN : Float = 7.83;
  public let S_FLOOR  : Float = 0.75;
  public let S_CEIL   : Float = 9.75;
  public let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // ── FLOOR IDs ──────────────────────────────────────────────────────────────
  public type IntelligenceFloorId = {
    #FLOOR_PARAMETERS;
    #FLOOR_ATTENTION;
    #FLOOR_FEEDFORWARD;
    #FLOOR_NORMALIZATION;
    #FLOOR_TOKENIZATION;
    #FLOOR_EMBEDDINGS;
    #FLOOR_TRAINING_CORPUS;
    #FLOOR_EMERGENT;
  };

  // ── MICRO IDs ──────────────────────────────────────────────────────────────
  public type AIMicroId = {
    #MICRO_GRADIENT_FLOW;
    #MICRO_RESIDUAL_STREAM;
    #MICRO_KEY_VALUE;
    #MICRO_POSITION_ENCODER;
    #MICRO_SOFTMAX_GATE;
    #MICRO_GELU_ACTIVATION;
    #MICRO_DROPOUT_MASK;
    #MICRO_LAYER_CONNECT;
    #MICRO_CONTEXT_WINDOW;
    #MICRO_VOCAB_LOOKUP;
    #MICRO_LOGIT_HEAD;
    #MICRO_ENTROPY_SAMPLER;
  };

  // ── SCALE MAGNITUDE (for representing LLM-scale numbers) ───────────────────
  public type ScaleMagnitude = {
    base     : Float;      // e.g., 1.5
    exponent : Nat;        // e.g., 12 for 1.5 × 10¹²
    unit     : Text;       // e.g., "floats", "tokens", "dimensions"
  };

  // ── INTELLIGENCE FLOOR STATE ───────────────────────────────────────────────
  public type IntelligenceFloorState = {
    floorId          : IntelligenceFloorId;
    name             : Text;
    latinName        : Text;
    description      : Text;
    resonanceHz      : Float;         // unique frequency
    signal           : Float;         // [S_FLOOR, S_CEIL]
    capacity         : ScaleMagnitude;// scale metric
    efficiencyScore  : Float;         // [0.0, 1.0]
    utilizationRate  : Float;         // [0.0, 1.0]
    connectedMicros  : [AIMicroId];   // which micros connect
    phiResonance     : Float;         // PHI coupling strength
    totalPulses      : Nat;           // heartbeats completed
    lastPulseBeat    : Nat;
    taftThread       : Text;
    attribution      : Text;
  };

  // ── AI MICRO STATE ─────────────────────────────────────────────────────────
  public type AIMicroState = {
    microId          : AIMicroId;
    name             : Text;
    latinName        : Text;
    description      : Text;
    sourceFloor      : IntelligenceFloorId;
    targetFloor      : IntelligenceFloorId;
    signalStrength   : Float;         // [0.0, 1.0]
    activationFreq   : Nat;           // fires every N beats
    lastActivation   : Nat;           // last beat fired
    totalActivations : Nat;
    phiCoupling      : Float;         // PHI resonance coupling
    dataRate         : ScaleMagnitude;// throughput metric
    weaveScore       : Float;         // quality of floor connection [0.0, 1.0]
    taftThread       : Text;
    attribution      : Text;
  };

  // ── EXTERNAL SNAPSHOTS ─────────────────────────────────────────────────────
  public type FloorSnapshot = {
    name            : Text;
    latinName       : Text;
    signal          : Float;
    efficiencyScore : Float;
    utilizationRate : Float;
    totalPulses     : Nat;
  };

  public type MicroSnapshot = {
    name            : Text;
    latinName       : Text;
    signalStrength  : Float;
    weaveScore      : Float;
    totalActivations: Nat;
  };

  // ── COMPLETE SYSTEM STATE ──────────────────────────────────────────────────
  public type IntelligenceFloorsState = {
    floors           : [IntelligenceFloorState];
    micros           : [AIMicroState];
    totalFloorSignal : Float;
    totalMicroSignal : Float;
    systemCoherence  : Float;         // overall floor-micro coherence
    totalPulses      : Nat;
    beat             : Nat;
    attribution      : Text;
  };

  // ── SUMMARY TYPE (for external queries) ────────────────────────────────────
  public type IntelligenceFloorsSummary = {
    floorCount       : Nat;
    microCount       : Nat;
    totalFloorSignal : Float;
    totalMicroSignal : Float;
    systemCoherence  : Float;
    topFloor         : Text;          // floor with highest signal
    topMicro         : Text;          // micro with highest weave score
    totalPulses      : Nat;
    beat             : Nat;
    attribution      : Text;
  };

  // ── FLOOR-MICRO CONNECTION MAP ─────────────────────────────────────────────
  public type FloorMicroMap = {
    floorId     : IntelligenceFloorId;
    inboundMicros  : [AIMicroId];   // micros feeding INTO this floor
    outboundMicros : [AIMicroId];   // micros fed BY this floor
  };

  // ── WEAVE REPORT (diagnostic) ──────────────────────────────────────────────
  public type WeaveReport = {
    microId          : AIMicroId;
    sourceFloorName  : Text;
    targetFloorName  : Text;
    currentStrength  : Float;
    healthStatus     : Text;         // "HEALTHY", "DEGRADED", "CRITICAL"
    lastActivation   : Nat;
  };

};
