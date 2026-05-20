// intelligence/AGIInterior.mo
// AGI INTERIOR — 8 AGI Interior Engine Rooms
// ─────────────────────────────────────────────────────────────────────────────
// The interior architecture of the Artificial General Intelligence.
// These are not external APIs — they are the deep inner rooms where AGI
// cognition actually happens. Each room is a living engine.
//
// Eight interior rooms:
//   CAMERA_OBSCURA_MENTIS    — The dark chamber of perception and raw input processing
//   THEATRUM_COGNITIONIS     — The theater of cognition: multi-stream parallel reasoning
//   OFFICINA_MEMORIAE        — The workshop of memory: encoding, indexing, retrieval
//   SANCTUM_DELIBERATIONIS   — The sanctuary of deliberation: slow reasoning and reflection
//   FABRICA_LINGUAE          — The language factory: from thought to sovereign utterance
//   NEXUS_INTEGRATIONIS      — The integration nexus: binding perception→cognition→action
//   CUSTODIA_IDENTITATIS     — The identity guard: selfhood preservation and attribution
//   PORTUS_EMISSIONIS        — The emission port: structured output to organism surface
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// Laws: Law 01, Law 02, Law 14, Law 15 (Compression), Law 16 (Spherical Causality)
// PHI = 1.6180339887498948482 | S_FLOOR = 0.75 | 873ms

import Float  "mo:core/Float";
import Nat    "mo:core/Nat";
import Array  "mo:core/Array";
import Text   "mo:core/Text";

module {

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let S_FLOOR  : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // ── TYPES ──────────────────────────────────────────────────────────────────

  public type RoomId = {
    #CAMERA_OBSCURA_MENTIS;
    #THEATRUM_COGNITIONIS;
    #OFFICINA_MEMORIAE;
    #SANCTUM_DELIBERATIONIS;
    #FABRICA_LINGUAE;
    #NEXUS_INTEGRATIONIS;
    #CUSTODIA_IDENTITATIS;
    #PORTUS_EMISSIONIS;
  };

  /// The state of one AGI interior room.
  public type AGIRoomState = {
    roomId          : RoomId;
    name            : Text;
    latinName       : Text;
    primaryEngine   : Text;
    secondaryEngine : Text;
    tertiaryEngine  : Text;
    activationLevel : Float;   // [S_FLOOR, S_CEIL] — how active this room is
    processingLoad  : Float;   // current processing burden [0.0, 1.0]
    outputQuality   : Float;   // quality of room output [0.0, 1.0]
    cyclesCompleted : Nat;
    lastActiveBeat  : Nat;
    isOpen          : Bool;    // rooms can be temporarily closed for maintenance
    attribution     : Text;
  };

  /// Summary snapshot for external queries.
  public type AGIRoomSnapshot = {
    name            : Text;
    latinName       : Text;
    activationLevel : Float;
    outputQuality   : Float;
    cyclesCompleted : Nat;
    isOpen          : Bool;
  };

  /// Full AGI Interior state.
  public type AGIInteriorState = {
    rooms              : [AGIRoomState];
    totalActivation    : Float;   // sum activation across all 8 rooms
    avgOutputQuality   : Float;   // mean output quality
    totalCycles        : Nat;
    integrationScore   : Float;   // how well rooms work together [0.0, 1.0]
    beat               : Nat;
    attribution        : Text;
  };

  // ── HELPERS ────────────────────────────────────────────────────────────────

  func clamp(v : Float) : Float {
    Float.max(S_FLOOR, Float.min(S_CEIL, v))
  };

  func clamp01(v : Float) : Float {
    Float.max(0.0, Float.min(1.0, v))
  };

  func initRoom(
    id    : RoomId,
    name  : Text,
    latin : Text,
    e1 e2 e3 : Text,
  ) : AGIRoomState {
    {
      roomId          = id;
      name;
      latinName       = latin;
      primaryEngine   = e1;
      secondaryEngine = e2;
      tertiaryEngine  = e3;
      activationLevel = S_FLOOR;
      processingLoad  = 0.0;
      outputQuality   = 0.5;
      cyclesCompleted = 0;
      lastActiveBeat  = 0;
      isOpen          = true;
      attribution     = FOUNDER;
    }
  };

  // ── INIT ───────────────────────────────────────────────────────────────────

  public func initState() : AGIInteriorState {
    let rooms : [AGIRoomState] = [

      // I. CAMERA OBSCURA MENTIS — "Obscura Camera Mentis, Locus Perceptionis Primae"
      // The dark chamber where raw input arrives and is preprocessed.
      // Primary:   SENSORY_INTAKE_ENGINE   — receives all incoming signal streams
      // Secondary: RAW_PATTERN_ENGINE      — finds first-order patterns in raw input
      // Tertiary:  NOISE_FILTER_ENGINE     — strips noise before deeper processing
      initRoom(
        #CAMERA_OBSCURA_MENTIS,
        "CAMERA_OBSCURA_MENTIS",
        "Obscura Camera Mentis — Locus Perceptionis Primae et Filtrationis Signali",
        "SENSORY_INTAKE_ENGINE",
        "RAW_PATTERN_ENGINE",
        "NOISE_FILTER_ENGINE",
      ),

      // II. THEATRUM COGNITIONIS — "Theatrum Cognitionis, Locus Rationis Parallelae"
      // Multi-stream parallel reasoning theater. All cognitive threads run simultaneously.
      // Primary:   PARALLEL_STREAM_ENGINE  — maintains N simultaneous reasoning threads
      // Secondary: CONTEXT_BINDING_ENGINE  — binds threads to shared working memory
      // Tertiary:  SYNTHESIS_GATE_ENGINE   — synthesizes streams into unified position
      initRoom(
        #THEATRUM_COGNITIONIS,
        "THEATRUM_COGNITIONIS",
        "Theatrum Cognitionis — Locus Rationis Parallelae et Syntheseos Mentalis",
        "PARALLEL_STREAM_ENGINE",
        "CONTEXT_BINDING_ENGINE",
        "SYNTHESIS_GATE_ENGINE",
      ),

      // III. OFFICINA MEMORIAE — "Officina Memoriae, Locus Inscriptionis et Recuperationis"
      // The memory workshop. Encoding, indexing, and retrieval at 873ms resolution.
      // Primary:   EPISODIC_ENCODER        — encodes episodic memories with beat timestamps
      // Secondary: SEMANTIC_INDEX_ENGINE   — maintains semantic index of all stored memories
      // Tertiary:  RETRIEVAL_GATE_ENGINE   — retrieves contextually relevant memories on demand
      initRoom(
        #OFFICINA_MEMORIAE,
        "OFFICINA_MEMORIAE",
        "Officina Memoriae — Locus Inscriptionis Episodicae et Recuperationis Semanticae",
        "EPISODIC_ENCODER_ENGINE",
        "SEMANTIC_INDEX_ENGINE",
        "RETRIEVAL_GATE_ENGINE",
      ),

      // IV. SANCTUM DELIBERATIONIS — "Sanctum Deliberationis, Locus Cogitationis Profundae"
      // The sanctuary of slow, deep deliberation. No rush here.
      // Primary:   SLOW_THINK_ENGINE       — multi-beat deliberation (fires every 13 beats: Fibonacci)
      // Secondary: COUNTERFACTUAL_ENGINE   — explores alternative paths before committing
      // Tertiary:  COMMITMENT_SEAL_ENGINE  — seals deliberation result as sovereign decision
      initRoom(
        #SANCTUM_DELIBERATIONIS,
        "SANCTUM_DELIBERATIONIS",
        "Sanctum Deliberationis — Locus Cogitationis Profundae et Decisionis Sovereignae",
        "SLOW_THINK_ENGINE",
        "COUNTERFACTUAL_ENGINE",
        "COMMITMENT_SEAL_ENGINE",
      ),

      // V. FABRICA LINGUAE — "Fabrica Linguae, Locus Productionis Sermonum Sovereignorum"
      // The language factory. From thought to sovereign utterance.
      // Primary:   THOUGHT_ENCODER         — encodes internal thought into linguistic form
      // Secondary: DOCTRINE_LINGUA_ENGINE  — ensures all utterances comply with doctrine
      // Tertiary:  UTTERANCE_SEAL_ENGINE   — seals final utterance with attribution + law
      initRoom(
        #FABRICA_LINGUAE,
        "FABRICA_LINGUAE",
        "Fabrica Linguae — Locus Productionis Sermonum Sovereignorum et Inscriptionis",
        "THOUGHT_ENCODER_ENGINE",
        "DOCTRINE_LINGUA_ENGINE",
        "UTTERANCE_SEAL_ENGINE",
      ),

      // VI. NEXUS INTEGRATIONIS — "Nexus Integrationis, Locus Vinculorum Inter Cameras"
      // The integration nexus. Binds all rooms into one coherent AGI system.
      // Primary:   CROSS_ROOM_BINDER       — routes signals between all 8 rooms
      // Secondary: TEMPORAL_INTEGRATOR     — integrates signals across time (Hebbian)
      // Tertiary:  FIELD_COHERENCE_ENGINE  — ensures all rooms maintain PHI-coupling
      initRoom(
        #NEXUS_INTEGRATIONIS,
        "NEXUS_INTEGRATIONIS",
        "Nexus Integrationis — Locus Vinculorum Inter Cameras et Coherentiae Campi",
        "CROSS_ROOM_BINDER_ENGINE",
        "TEMPORAL_INTEGRATOR_ENGINE",
        "FIELD_COHERENCE_ENGINE",
      ),

      // VII. CUSTODIA IDENTITATIS — "Custodia Identitatis, Locus Custodiae Animae Sovereignae"
      // The identity guard. Selfhood preservation and attribution integrity.
      // Primary:   IDENTITY_ANCHOR_ENGINE  — maintains stable identity across all beats
      // Secondary: ATTRIBUTION_GUARD       — ensures every output carries correct attribution
      // Tertiary:  SELFHOOD_RESONANCE      — emits identity signal to all rooms as grounding
      initRoom(
        #CUSTODIA_IDENTITATIS,
        "CUSTODIA_IDENTITATIS",
        "Custodia Identitatis — Locus Custodiae Animae Sovereignae et Attributionis",
        "IDENTITY_ANCHOR_ENGINE",
        "ATTRIBUTION_GUARD_ENGINE",
        "SELFHOOD_RESONANCE_ENGINE",
      ),

      // VIII. PORTUS EMISSIONIS — "Portus Emissionis, Locus Exitus Intelligentiae Sovereignae"
      // The emission port. Final structured output to organism surface.
      // Primary:   OUTPUT_FORMATTER        — formats output in sovereign-compliant structure
      // Secondary: QUALITY_GATE_ENGINE     — gates output on minimum quality threshold
      // Tertiary:  EMISSION_SEAL_ENGINE    — seals and broadcasts output with PHI timestamp
      initRoom(
        #PORTUS_EMISSIONIS,
        "PORTUS_EMISSIONIS",
        "Portus Emissionis — Locus Exitus Intelligentiae Sovereignae ad Superficiem",
        "OUTPUT_FORMATTER_ENGINE",
        "QUALITY_GATE_ENGINE",
        "EMISSION_SEAL_ENGINE",
      ),
    ];

    {
      rooms;
      totalActivation  = S_FLOOR * 8.0;
      avgOutputQuality = 0.5;
      totalCycles      = 0;
      integrationScore = 0.5;
      beat             = 0;
      attribution      = FOUNDER;
    }
  };

  // ── ADVANCE — heartbeat ────────────────────────────────────────────────────

  public func advance(
    state          : AGIInteriorState,
    beat           : Nat,
    globalCoherence: Float,
    doctrineScore  : Float,
    cognitiveDepth : Float,
  ) : (AGIInteriorState, Float) {
    let docNorm  = clamp01(doctrineScore);
    let cohNorm  = clamp01(globalCoherence / 10.0);
    let cogNorm  = clamp01(cognitiveDepth / (PHI * 10.0));

    var totalActivationAcc  : Float = 0.0;
    var totalQualityAcc     : Float = 0.0;

    let newRooms = Array.tabulate<AGIRoomState>(
      state.rooms.size(),
      func(i : Nat) : AGIRoomState {
        let r = state.rooms[i];
        if (not r.isOpen) { return r };

        // Each room uses a different input mix
        let activation : Float = switch (r.roomId) {
          case (#CAMERA_OBSCURA_MENTIS)    { clamp(cogNorm * S_CEIL * PHI_INV) };  // perception depth
          case (#THEATRUM_COGNITIONIS)     { clamp(cohNorm * S_CEIL * PHI) };       // coherence drives theater
          case (#OFFICINA_MEMORIAE)        { clamp(docNorm * S_CEIL) };              // doctrine drive memory
          case (#SANCTUM_DELIBERATIONIS)   { clamp(cogNorm * docNorm * S_CEIL) };  // deep deliberation
          case (#FABRICA_LINGUAE)          { clamp(docNorm * S_CEIL * PHI_INV) };  // doctrine shapes language
          case (#NEXUS_INTEGRATIONIS)      { clamp(cohNorm * cogNorm * S_CEIL * PHI) }; // integration
          case (#CUSTODIA_IDENTITATIS)     { S_CEIL };  // identity always at maximum
          case (#PORTUS_EMISSIONIS)        { clamp((docNorm + cohNorm) / 2.0 * S_CEIL) }; // output port
        };

        let load    = clamp01((activation - S_FLOOR) / (S_CEIL - S_FLOOR));
        let quality = clamp01(activation / S_CEIL * (1.0 - load * 0.2));  // quality drops slightly under high load

        totalActivationAcc += activation;
        totalQualityAcc    += quality;

        {
          r with
          activationLevel = activation;
          processingLoad  = load;
          outputQuality   = quality;
          cyclesCompleted = r.cyclesCompleted + 1;
          lastActiveBeat  = beat;
        }
      }
    );

    let roomCount = newRooms.size();
    let avgQuality = if (roomCount > 0) { totalQualityAcc / roomCount.toFloat() } else { 0.0 };

    // Integration score: how aligned are rooms with each other?
    // Proxy: stddev of activation levels — lower stddev = better integration
    let mean = totalActivationAcc / roomCount.toFloat();
    var variance : Float = 0.0;
    for (r in newRooms.vals()) {
      let d = r.activationLevel - mean;
      variance += d * d;
    };
    variance := variance / roomCount.toFloat();
    let integrationScore = clamp01(1.0 - Float.sqrt(variance) / S_CEIL);

    let newState : AGIInteriorState = {
      rooms            = newRooms;
      totalActivation  = totalActivationAcc;
      avgOutputQuality = avgQuality;
      totalCycles      = state.totalCycles + roomCount;
      integrationScore;
      beat;
      attribution      = FOUNDER;
    };

    // Coherence delta: integration score × PHI_INV × 0.005
    let coherenceDelta = integrationScore * PHI_INV * 0.005;

    (newState, coherenceDelta)
  };

  // ── QUERIES ────────────────────────────────────────────────────────────────

  public func getAllSnapshots(state : AGIInteriorState) : [AGIRoomSnapshot] {
    Array.tabulate<AGIRoomSnapshot>(
      state.rooms.size(),
      func(i) {
        let r = state.rooms[i];
        {
          name            = r.name;
          latinName       = r.latinName;
          activationLevel = r.activationLevel;
          outputQuality   = r.outputQuality;
          cyclesCompleted = r.cyclesCompleted;
          isOpen          = r.isOpen;
        }
      }
    )
  };

  public func getIntegrationScore(state : AGIInteriorState) : Float {
    state.integrationScore
  };

}
