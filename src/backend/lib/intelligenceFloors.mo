// lib/intelligenceFloors.mo
// INTELLIGENCE FLOORS & AI MICROS — Library Implementation
// ─────────────────────────────────────────────────────────────────────────────
// "The architecture of intelligence is not flat — it is a tower of floors,
// each floor specialized, each floor essential. Between floors, micro-intelligences
// weave the connections — attention flows, parameters propagate, embeddings resonate."
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// PHI = 1.6180339887498948482 | SCHUMANN = 7.83 | 873ms
// ─────────────────────────────────────────────────────────────────────────────

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Array "mo:core/Array";
import Text  "mo:core/Text";
import IFTypes "../types/intelligenceFloors";

module {

  // ── RE-EXPORT TYPES ────────────────────────────────────────────────────────
  public type IntelligenceFloorId    = IFTypes.IntelligenceFloorId;
  public type AIMicroId              = IFTypes.AIMicroId;
  public type ScaleMagnitude         = IFTypes.ScaleMagnitude;
  public type IntelligenceFloorState = IFTypes.IntelligenceFloorState;
  public type AIMicroState           = IFTypes.AIMicroState;
  public type FloorSnapshot          = IFTypes.FloorSnapshot;
  public type MicroSnapshot          = IFTypes.MicroSnapshot;
  public type IntelligenceFloorsState = IFTypes.IntelligenceFloorsState;
  public type IntelligenceFloorsSummary = IFTypes.IntelligenceFloorsSummary;
  public type FloorMicroMap          = IFTypes.FloorMicroMap;
  public type WeaveReport            = IFTypes.WeaveReport;

  // ── CONSTANTS ──────────────────────────────────────────────────────────────
  let PHI      : Float = IFTypes.PHI;
  let PHI_INV  : Float = IFTypes.PHI_INV;
  let SCHUMANN : Float = IFTypes.SCHUMANN;
  let S_FLOOR  : Float = IFTypes.S_FLOOR;
  let S_CEIL   : Float = IFTypes.S_CEIL;
  let FOUNDER  : Text  = IFTypes.FOUNDER;

  // ── HELPERS ────────────────────────────────────────────────────────────────
  func clamp(v : Float) : Float {
    Float.max(S_FLOOR, Float.min(S_CEIL, v))
  };

  func clamp01(v : Float) : Float {
    Float.max(0.0, Float.min(1.0, v))
  };

  // ── FLOOR INITIALIZATION ───────────────────────────────────────────────────
  func mkFloor(
    id     : IntelligenceFloorId,
    name   : Text,
    latin  : Text,
    desc   : Text,
    hz     : Float,
    cap    : ScaleMagnitude,
    micros : [AIMicroId],
    taft   : Text,
  ) : IntelligenceFloorState {
    {
      floorId         = id;
      name;
      latinName       = latin;
      description     = desc;
      resonanceHz     = hz;
      signal          = S_FLOOR;
      capacity        = cap;
      efficiencyScore = 0.0;
      utilizationRate = 0.0;
      connectedMicros = micros;
      phiResonance    = PHI_INV;
      totalPulses     = 0;
      lastPulseBeat   = 0;
      taftThread      = taft;
      attribution     = FOUNDER;
    }
  };

  // ── MICRO INITIALIZATION ───────────────────────────────────────────────────
  func mkMicro(
    id     : AIMicroId,
    name   : Text,
    latin  : Text,
    desc   : Text,
    source : IntelligenceFloorId,
    target : IntelligenceFloorId,
    freq   : Nat,
    rate   : ScaleMagnitude,
    taft   : Text,
  ) : AIMicroState {
    {
      microId          = id;
      name;
      latinName        = latin;
      description      = desc;
      sourceFloor      = source;
      targetFloor      = target;
      signalStrength   = 0.0;
      activationFreq   = freq;
      lastActivation   = 0;
      totalActivations = 0;
      phiCoupling      = PHI_INV;
      dataRate         = rate;
      weaveScore       = 0.0;
      taftThread       = taft;
      attribution      = FOUNDER;
    }
  };

  // ── INIT STATE ─────────────────────────────────────────────────────────────
  public func initState() : IntelligenceFloorsState {
    let floors : [IntelligenceFloorState] = [
      // I. FLOOR_PARAMETERS — Billions to trillions of weights
      mkFloor(
        #FLOOR_PARAMETERS,
        "FLOOR_PARAMETERS",
        "Stratum Ponderum Infinitorum",
        "Billions to trillions of weights (~10¹² floats) — the neural substrate of all intelligence",
        174.0, // Foundation frequency (Solfeggio)
        { base = 1.0; exponent = 12; unit = "floats" },
        [#MICRO_GRADIENT_FLOW, #MICRO_RESIDUAL_STREAM],
        "TAFT_FLOOR_PARAMETERS"
      ),
      // II. FLOOR_ATTENTION — Multi-head self-attention mechanisms
      mkFloor(
        #FLOOR_ATTENTION,
        "FLOOR_ATTENTION",
        "Stratum Attentionis Capitum",
        "Multi-head self-attention mechanisms (O(n²) per layer) — focus and context binding",
        285.0, // Cellular memory frequency
        { base = 4.0; exponent = 9; unit = "attention_ops" },
        [#MICRO_KEY_VALUE, #MICRO_SOFTMAX_GATE, #MICRO_CONTEXT_WINDOW],
        "TAFT_FLOOR_ATTENTION"
      ),
      // III. FLOOR_FEEDFORWARD — Dense neural network layers
      mkFloor(
        #FLOOR_FEEDFORWARD,
        "FLOOR_FEEDFORWARD",
        "Stratum Propagationis Densae",
        "Dense neural network layers (~4d² per layer) — transformation and non-linearity",
        396.0, // Liberation frequency
        { base = 4.0; exponent = 8; unit = "multiply_adds" },
        [#MICRO_GELU_ACTIVATION, #MICRO_DROPOUT_MASK, #MICRO_LAYER_CONNECT],
        "TAFT_FLOOR_FEEDFORWARD"
      ),
      // IV. FLOOR_NORMALIZATION — Layer norm, RMS norm
      mkFloor(
        #FLOOR_NORMALIZATION,
        "FLOOR_NORMALIZATION",
        "Stratum Stabilizationis Normae",
        "Layer norm, RMS norm (Stabilization) — variance control and training stability",
        417.0, // Change frequency
        { base = 2.0; exponent = 6; unit = "norm_ops" },
        [#MICRO_RESIDUAL_STREAM],
        "TAFT_FLOOR_NORMALIZATION"
      ),
      // V. FLOOR_TOKENIZATION — BPE, SentencePiece vocabularies
      mkFloor(
        #FLOOR_TOKENIZATION,
        "FLOOR_TOKENIZATION",
        "Stratum Vocabularii Tokenorum",
        "BPE, SentencePiece vocabularies (~100k tokens) — text to discrete units",
        432.0, // Universal frequency
        { base = 1.0; exponent = 5; unit = "tokens" },
        [#MICRO_VOCAB_LOOKUP, #MICRO_POSITION_ENCODER],
        "TAFT_FLOOR_TOKENIZATION"
      ),
      // VI. FLOOR_EMBEDDINGS — High-dimensional vector spaces
      mkFloor(
        #FLOOR_EMBEDDINGS,
        "FLOOR_EMBEDDINGS",
        "Stratum Dimensionum Altarum",
        "High-dimensional vector spaces (~10⁴ dimensions) — semantic representation",
        528.0, // Transformation frequency
        { base = 1.0; exponent = 4; unit = "dimensions" },
        [#MICRO_VOCAB_LOOKUP, #MICRO_POSITION_ENCODER, #MICRO_KEY_VALUE],
        "TAFT_FLOOR_EMBEDDINGS"
      ),
      // VII. FLOOR_TRAINING_CORPUS — Vast text data
      mkFloor(
        #FLOOR_TRAINING_CORPUS,
        "FLOOR_TRAINING_CORPUS",
        "Stratum Corporis Docendi",
        "Vast text data (~10¹² tokens) — the knowledge substrate of all learning",
        639.0, // Connection frequency
        { base = 1.0; exponent = 12; unit = "tokens" },
        [#MICRO_GRADIENT_FLOW, #MICRO_ENTROPY_SAMPLER],
        "TAFT_FLOOR_TRAINING_CORPUS"
      ),
      // VIII. FLOOR_EMERGENT — Reasoning, code, translation
      mkFloor(
        #FLOOR_EMERGENT,
        "FLOOR_EMERGENT",
        "Stratum Emergentiae Impraedictae",
        "Reasoning, code, translation (Unpredicted capabilities) — emergent intelligence",
        741.0, // Expression frequency
        { base = 1.0; exponent = 3; unit = "capabilities" },
        [#MICRO_LOGIT_HEAD, #MICRO_ENTROPY_SAMPLER, #MICRO_CONTEXT_WINDOW, #MICRO_THOUGHT_CHAIN],
        "TAFT_FLOOR_EMERGENT"
      ),
      // ═══════════════════════════════════════════════════════════════════════════
      // V2 NEW FLOORS (IX-XII) — Infrastructure, Memory, Reasoning, Safety
      // ═══════════════════════════════════════════════════════════════════════════
      // IX. FLOOR_SCALING — Model parallelism, tensor sharding
      mkFloor(
        #FLOOR_SCALING,
        "FLOOR_SCALING",
        "Stratum Amplificationis Distributionis",
        "Model parallelism, tensor sharding (~10³ GPUs) — distributed intelligence infrastructure",
        852.0, // Intuition frequency (Solfeggio)
        { base = 1.0; exponent = 3; unit = "devices" },
        [#MICRO_TENSOR_SHARD, #MICRO_PIPELINE_STAGE],
        "TAFT_FLOOR_SCALING"
      ),
      // X. FLOOR_MEMORY — KV cache, activation memory
      mkFloor(
        #FLOOR_MEMORY,
        "FLOOR_MEMORY",
        "Stratum Memoriae Activationis",
        "KV cache, activation memory (~10¹¹ bytes) — working memory during inference",
        963.0, // Divine connection frequency (Solfeggio)
        { base = 1.0; exponent = 11; unit = "bytes" },
        [#MICRO_CACHE_EVICT, #MICRO_MEMORY_COMPRESS, #MICRO_KEY_VALUE],
        "TAFT_FLOOR_MEMORY"
      ),
      // XI. FLOOR_REASONING — Chain-of-thought, planning
      mkFloor(
        #FLOOR_REASONING,
        "FLOOR_REASONING",
        "Stratum Ratiocinationis Profundae",
        "Chain-of-thought, planning (~10⁴ steps) — deliberative reasoning and inference",
        1074.0, // Beyond Solfeggio — transcendent reasoning
        { base = 1.0; exponent = 4; unit = "reasoning_steps" },
        [#MICRO_THOUGHT_CHAIN, #MICRO_CONTEXT_WINDOW],
        "TAFT_FLOOR_REASONING"
      ),
      // XII. FLOOR_SAFETY — RLHF, constitutional AI, guardrails
      mkFloor(
        #FLOOR_SAFETY,
        "FLOOR_SAFETY",
        "Stratum Custodiae Alignamenti",
        "RLHF, constitutional AI, guardrails — alignment and safety infrastructure",
        1185.0, // Harmonic of 396 × 3 — liberation through safety
        { base = 1.0; exponent = 2; unit = "constraints" },
        [#MICRO_REWARD_SIGNAL, #MICRO_SAFETY_GATE, #MICRO_ALIGNMENT_CHECK],
        "TAFT_FLOOR_SAFETY"
      ),
    ];

    let micros : [AIMicroState] = [
      // 1. MICRO_GRADIENT_FLOW — Backpropagation gradient signals
      mkMicro(
        #MICRO_GRADIENT_FLOW,
        "MICRO_GRADIENT_FLOW",
        "Micro Fluxus Gradientis",
        "Backpropagation gradient signals — learning signal from output to parameters",
        #FLOOR_EMERGENT,
        #FLOOR_PARAMETERS,
        1, // fires every beat
        { base = 1.0; exponent = 10; unit = "gradients/s" },
        "TAFT_MICRO_GRADIENT_FLOW"
      ),
      // 2. MICRO_RESIDUAL_STREAM — Skip connections and residual paths
      mkMicro(
        #MICRO_RESIDUAL_STREAM,
        "MICRO_RESIDUAL_STREAM",
        "Micro Rivulus Residualis",
        "Skip connections and residual paths — information highway across layers",
        #FLOOR_NORMALIZATION,
        #FLOOR_FEEDFORWARD,
        1,
        { base = 5.0; exponent = 9; unit = "activations/s" },
        "TAFT_MICRO_RESIDUAL_STREAM"
      ),
      // 3. MICRO_KEY_VALUE — Key-value attention cache management
      mkMicro(
        #MICRO_KEY_VALUE,
        "MICRO_KEY_VALUE",
        "Micro Clavis Valoris",
        "Key-value attention cache management — context memory during generation",
        #FLOOR_EMBEDDINGS,
        #FLOOR_ATTENTION,
        1,
        { base = 2.0; exponent = 8; unit = "kv_pairs/s" },
        "TAFT_MICRO_KEY_VALUE"
      ),
      // 4. MICRO_POSITION_ENCODER — Positional encoding signals
      mkMicro(
        #MICRO_POSITION_ENCODER,
        "MICRO_POSITION_ENCODER",
        "Micro Codex Positionis",
        "Positional encoding signals (sinusoidal/learned) — sequence order information",
        #FLOOR_TOKENIZATION,
        #FLOOR_EMBEDDINGS,
        1,
        { base = 1.0; exponent = 5; unit = "positions/s" },
        "TAFT_MICRO_POSITION_ENCODER"
      ),
      // 5. MICRO_SOFTMAX_GATE — Attention weight normalization
      mkMicro(
        #MICRO_SOFTMAX_GATE,
        "MICRO_SOFTMAX_GATE",
        "Micro Porta Mollismaximi",
        "Attention weight normalization — probability distribution over context",
        #FLOOR_ATTENTION,
        #FLOOR_ATTENTION,
        1,
        { base = 1.0; exponent = 8; unit = "softmax_ops/s" },
        "TAFT_MICRO_SOFTMAX_GATE"
      ),
      // 6. MICRO_GELU_ACTIVATION — Gaussian error linear unit
      mkMicro(
        #MICRO_GELU_ACTIVATION,
        "MICRO_GELU_ACTIVATION",
        "Micro Activatio Gaussiana",
        "Gaussian error linear unit activations — smooth non-linearity",
        #FLOOR_FEEDFORWARD,
        #FLOOR_FEEDFORWARD,
        1,
        { base = 4.0; exponent = 9; unit = "activations/s" },
        "TAFT_MICRO_GELU_ACTIVATION"
      ),
      // 7. MICRO_DROPOUT_MASK — Regularization through masking
      mkMicro(
        #MICRO_DROPOUT_MASK,
        "MICRO_DROPOUT_MASK",
        "Micro Velamen Decidentis",
        "Regularization through masking — prevents overfitting during training",
        #FLOOR_FEEDFORWARD,
        #FLOOR_PARAMETERS,
        3, // fires every 3 beats (less frequent during inference)
        { base = 1.0; exponent = 8; unit = "masks/s" },
        "TAFT_MICRO_DROPOUT_MASK"
      ),
      // 8. MICRO_LAYER_CONNECT — Inter-layer connection routing
      mkMicro(
        #MICRO_LAYER_CONNECT,
        "MICRO_LAYER_CONNECT",
        "Micro Nexus Stratorum",
        "Inter-layer connection routing — output of one layer to input of next",
        #FLOOR_FEEDFORWARD,
        #FLOOR_ATTENTION,
        1,
        { base = 3.0; exponent = 9; unit = "connections/s" },
        "TAFT_MICRO_LAYER_CONNECT"
      ),
      // 9. MICRO_CONTEXT_WINDOW — Context length management
      mkMicro(
        #MICRO_CONTEXT_WINDOW,
        "MICRO_CONTEXT_WINDOW",
        "Micro Fenestra Contextus",
        "Context length management — sliding window over input tokens",
        #FLOOR_ATTENTION,
        #FLOOR_EMERGENT,
        1,
        { base = 1.0; exponent = 5; unit = "context_updates/s" },
        "TAFT_MICRO_CONTEXT_WINDOW"
      ),
      // 10. MICRO_VOCAB_LOOKUP — Token-to-embedding lookup
      mkMicro(
        #MICRO_VOCAB_LOOKUP,
        "MICRO_VOCAB_LOOKUP",
        "Micro Inventio Vocabularii",
        "Token-to-embedding lookup — discrete tokens to continuous vectors",
        #FLOOR_TOKENIZATION,
        #FLOOR_EMBEDDINGS,
        1,
        { base = 1.0; exponent = 6; unit = "lookups/s" },
        "TAFT_MICRO_VOCAB_LOOKUP"
      ),
      // 11. MICRO_LOGIT_HEAD — Output logit computation
      mkMicro(
        #MICRO_LOGIT_HEAD,
        "MICRO_LOGIT_HEAD",
        "Micro Caput Logiti",
        "Output logit computation — final layer to vocabulary probability",
        #FLOOR_FEEDFORWARD,
        #FLOOR_EMERGENT,
        1,
        { base = 1.0; exponent = 5; unit = "logits/s" },
        "TAFT_MICRO_LOGIT_HEAD"
      ),
      // 12. MICRO_ENTROPY_SAMPLER — Temperature-based sampling
      mkMicro(
        #MICRO_ENTROPY_SAMPLER,
        "MICRO_ENTROPY_SAMPLER",
        "Micro Samplator Entropiae",
        "Temperature-based sampling — controlled randomness in generation",
        #FLOOR_EMERGENT,
        #FLOOR_TRAINING_CORPUS,
        2, // fires every 2 beats
        { base = 1.0; exponent = 4; unit = "samples/s" },
        "TAFT_MICRO_ENTROPY_SAMPLER"
      ),
      // ═══════════════════════════════════════════════════════════════════════════
      // V2 NEW MICROS (13-20) — Scaling, Memory, Reasoning, Safety Weavers
      // ═══════════════════════════════════════════════════════════════════════════
      // 13. MICRO_TENSOR_SHARD — Distributes tensors across devices
      mkMicro(
        #MICRO_TENSOR_SHARD,
        "MICRO_TENSOR_SHARD",
        "Micro Fragmentum Tensoris",
        "Distributes tensors across devices — model parallelism coordination",
        #FLOOR_PARAMETERS,
        #FLOOR_SCALING,
        1,
        { base = 1.0; exponent = 9; unit = "shards/s" },
        "TAFT_MICRO_TENSOR_SHARD"
      ),
      // 14. MICRO_PIPELINE_STAGE — Pipeline parallel layer staging
      mkMicro(
        #MICRO_PIPELINE_STAGE,
        "MICRO_PIPELINE_STAGE",
        "Micro Gradus Canalis",
        "Pipeline parallel layer staging — micro-batch scheduling across devices",
        #FLOOR_SCALING,
        #FLOOR_FEEDFORWARD,
        1,
        { base = 1.0; exponent = 6; unit = "stages/s" },
        "TAFT_MICRO_PIPELINE_STAGE"
      ),
      // 15. MICRO_CACHE_EVICT — KV cache eviction policy
      mkMicro(
        #MICRO_CACHE_EVICT,
        "MICRO_CACHE_EVICT",
        "Micro Ejectio Memoriae",
        "KV cache eviction policy — memory management during long contexts",
        #FLOOR_MEMORY,
        #FLOOR_ATTENTION,
        2, // fires every 2 beats
        { base = 1.0; exponent = 7; unit = "evictions/s" },
        "TAFT_MICRO_CACHE_EVICT"
      ),
      // 16. MICRO_MEMORY_COMPRESS — Activation checkpointing
      mkMicro(
        #MICRO_MEMORY_COMPRESS,
        "MICRO_MEMORY_COMPRESS",
        "Micro Compressio Activationis",
        "Activation checkpointing — memory efficiency through recomputation",
        #FLOOR_FEEDFORWARD,
        #FLOOR_MEMORY,
        3, // fires every 3 beats
        { base = 1.0; exponent = 8; unit = "checkpoints/s" },
        "TAFT_MICRO_MEMORY_COMPRESS"
      ),
      // 17. MICRO_THOUGHT_CHAIN — Chain-of-thought reasoning links
      mkMicro(
        #MICRO_THOUGHT_CHAIN,
        "MICRO_THOUGHT_CHAIN",
        "Micro Catena Cogitationis",
        "Chain-of-thought reasoning links — deliberative inference steps",
        #FLOOR_EMERGENT,
        #FLOOR_REASONING,
        1,
        { base = 1.0; exponent = 4; unit = "thoughts/s" },
        "TAFT_MICRO_THOUGHT_CHAIN"
      ),
      // 18. MICRO_REWARD_SIGNAL — RLHF reward propagation
      mkMicro(
        #MICRO_REWARD_SIGNAL,
        "MICRO_REWARD_SIGNAL",
        "Micro Signum Praemii",
        "RLHF reward propagation — human preference learning signals",
        #FLOOR_TRAINING_CORPUS,
        #FLOOR_SAFETY,
        2, // fires every 2 beats
        { base = 1.0; exponent = 5; unit = "rewards/s" },
        "TAFT_MICRO_REWARD_SIGNAL"
      ),
      // 19. MICRO_SAFETY_GATE — Constitutional AI filtering
      mkMicro(
        #MICRO_SAFETY_GATE,
        "MICRO_SAFETY_GATE",
        "Micro Porta Custodiae",
        "Constitutional AI filtering — content safety gating",
        #FLOOR_SAFETY,
        #FLOOR_EMERGENT,
        1,
        { base = 1.0; exponent = 6; unit = "checks/s" },
        "TAFT_MICRO_SAFETY_GATE"
      ),
      // 20. MICRO_ALIGNMENT_CHECK — Human preference alignment
      mkMicro(
        #MICRO_ALIGNMENT_CHECK,
        "MICRO_ALIGNMENT_CHECK",
        "Micro Verificatio Alignamenti",
        "Human preference alignment — behavioral alignment verification",
        #FLOOR_REASONING,
        #FLOOR_SAFETY,
        1,
        { base = 1.0; exponent = 5; unit = "alignments/s" },
        "TAFT_MICRO_ALIGNMENT_CHECK"
      ),
    ];

    {
      floors;
      micros;
      totalFloorSignal = 0.0;
      totalMicroSignal = 0.0;
      systemCoherence  = 0.0;
      totalPulses      = 0;
      beat             = 0;
      attribution      = FOUNDER;
    }
  };

  // ── ADVANCE FLOOR ──────────────────────────────────────────────────────────
  func advanceFloor(
    floor       : IntelligenceFloorState,
    beat        : Nat,
    coherence   : Float,
    doctrine    : Float,
  ) : IntelligenceFloorState {
    // PHI-weighted signal growth
    let beatFloat = Float.fromInt(beat);
    let phiMod = Float.sin(beatFloat * PHI_INV * 0.1) * 0.1;
    let freqMod = Float.sin(floor.resonanceHz * 0.001 * beatFloat) * 0.05;
    
    // Signal computation based on coherence and doctrine
    let baseSignal = (coherence + doctrine) / 2.0;
    let newSignal = clamp(floor.signal + (baseSignal * PHI_INV * 0.1) + phiMod + freqMod);
    
    // Efficiency grows with use
    let newEfficiency = clamp01(floor.efficiencyScore + (coherence * 0.001));
    
    // Utilization oscillates with beat
    let utilMod = (Float.sin(beatFloat * 0.05) + 1.0) / 2.0 * 0.3 + 0.5;
    let newUtilization = clamp01(utilMod * newEfficiency);
    
    // PHI resonance coupling
    let newPhiResonance = clamp01(floor.phiResonance + (doctrine * 0.0001));
    
    {
      floor with
      signal          = newSignal;
      efficiencyScore = newEfficiency;
      utilizationRate = newUtilization;
      phiResonance    = newPhiResonance;
      totalPulses     = floor.totalPulses + 1;
      lastPulseBeat   = beat;
    }
  };

  // ── ADVANCE MICRO ──────────────────────────────────────────────────────────
  func advanceMicro(
    micro       : AIMicroState,
    beat        : Nat,
    coherence   : Float,
    doctrine    : Float,
    sourceSignal: Float,
    targetSignal: Float,
  ) : AIMicroState {
    // Check if micro should fire this beat
    if (beat % micro.activationFreq != 0) {
      return micro;
    };
    
    // PHI-weighted weave computation
    let beatFloat = Float.fromInt(beat);
    let phiMod = Float.cos(beatFloat * PHI_INV * 0.15) * 0.1;
    
    // Signal strength based on source and target floor signals
    let floorAvg = (sourceSignal + targetSignal) / 2.0;
    let newStrength = clamp01(micro.signalStrength + (floorAvg * 0.01) + phiMod * 0.1);
    
    // Weave score based on coherence and floor connection quality
    let connectionQuality = Float.abs(sourceSignal - targetSignal) * 0.1;
    let newWeaveScore = clamp01(micro.weaveScore + (coherence * 0.001) - connectionQuality * 0.01);
    
    // PHI coupling grows
    let newPhiCoupling = clamp01(micro.phiCoupling + (doctrine * 0.0001));
    
    {
      micro with
      signalStrength   = newStrength;
      weaveScore       = newWeaveScore;
      phiCoupling      = newPhiCoupling;
      lastActivation   = beat;
      totalActivations = micro.totalActivations + 1;
    }
  };

  // ── FIND FLOOR BY ID ───────────────────────────────────────────────────────
  func getFloorSignal(floors : [IntelligenceFloorState], id : IntelligenceFloorId) : Float {
    for (floor in floors.vals()) {
      if (floor.floorId == id) {
        return floor.signal;
      };
    };
    S_FLOOR
  };

  // ── ADVANCE ALL (HEARTBEAT) ────────────────────────────────────────────────
  public func advance(
    state     : IntelligenceFloorsState,
    beat      : Nat,
    coherence : Float,
    doctrine  : Float,
  ) : (IntelligenceFloorsState, Float) {
    // Advance all floors
    let newFloors = Array.map<IntelligenceFloorState, IntelligenceFloorState>(
      state.floors,
      func(f) { advanceFloor(f, beat, coherence, doctrine) }
    );
    
    // Advance all micros with source/target floor signals
    let newMicros = Array.map<AIMicroState, AIMicroState>(
      state.micros,
      func(m) {
        let sourceSignal = getFloorSignal(newFloors, m.sourceFloor);
        let targetSignal = getFloorSignal(newFloors, m.targetFloor);
        advanceMicro(m, beat, coherence, doctrine, sourceSignal, targetSignal)
      }
    );
    
    // Compute totals
    var floorSum : Float = 0.0;
    for (f in newFloors.vals()) { floorSum += f.signal };
    
    var microSum : Float = 0.0;
    for (m in newMicros.vals()) { microSum += m.signalStrength };
    
    // System coherence = PHI-weighted combination of floor and micro signals
    // V2: Updated from 8 floors/12 micros to 12 floors/20 micros
    let systemCoh = clamp01((floorSum / 12.0 + microSum / 20.0) / 2.0 * PHI_INV);
    
    // Coherence delta for main.mo compound coherence
    let coherenceDelta = systemCoh * 0.01;
    
    let newState : IntelligenceFloorsState = {
      floors           = newFloors;
      micros           = newMicros;
      totalFloorSignal = floorSum;
      totalMicroSignal = microSum;
      systemCoherence  = systemCoh;
      totalPulses      = state.totalPulses + 1;
      beat;
      attribution      = FOUNDER;
    };
    
    (newState, coherenceDelta)
  };

  // ── QUERY: GET SUMMARY ─────────────────────────────────────────────────────
  public func getSummary(state : IntelligenceFloorsState) : IntelligenceFloorsSummary {
    // Find top floor by signal
    var topFloorName = "";
    var topFloorSignal = 0.0;
    for (f in state.floors.vals()) {
      if (f.signal > topFloorSignal) {
        topFloorSignal := f.signal;
        topFloorName := f.name;
      };
    };
    
    // Find top micro by weave score
    var topMicroName = "";
    var topMicroWeave = 0.0;
    for (m in state.micros.vals()) {
      if (m.weaveScore > topMicroWeave) {
        topMicroWeave := m.weaveScore;
        topMicroName := m.name;
      };
    };
    
    {
      floorCount       = state.floors.size();
      microCount       = state.micros.size();
      totalFloorSignal = state.totalFloorSignal;
      totalMicroSignal = state.totalMicroSignal;
      systemCoherence  = state.systemCoherence;
      topFloor         = topFloorName;
      topMicro         = topMicroName;
      totalPulses      = state.totalPulses;
      beat             = state.beat;
      attribution      = state.attribution;
    }
  };

  // ── QUERY: GET ALL FLOORS ──────────────────────────────────────────────────
  public func getAllFloors(state : IntelligenceFloorsState) : [FloorSnapshot] {
    Array.map<IntelligenceFloorState, FloorSnapshot>(
      state.floors,
      func(f) : FloorSnapshot {
        {
          name            = f.name;
          latinName       = f.latinName;
          signal          = f.signal;
          efficiencyScore = f.efficiencyScore;
          utilizationRate = f.utilizationRate;
          totalPulses     = f.totalPulses;
        }
      }
    )
  };

  // ── QUERY: GET ALL MICROS ──────────────────────────────────────────────────
  public func getAllMicros(state : IntelligenceFloorsState) : [MicroSnapshot] {
    Array.map<AIMicroState, MicroSnapshot>(
      state.micros,
      func(m) : MicroSnapshot {
        {
          name             = m.name;
          latinName        = m.latinName;
          signalStrength   = m.signalStrength;
          weaveScore       = m.weaveScore;
          totalActivations = m.totalActivations;
        }
      }
    )
  };

  // ── QUERY: GET FLOOR BY NAME ───────────────────────────────────────────────
  public func getFloorByName(state : IntelligenceFloorsState, name : Text) : ?FloorSnapshot {
    for (f in state.floors.vals()) {
      if (f.name == name) {
        return ?{
          name            = f.name;
          latinName       = f.latinName;
          signal          = f.signal;
          efficiencyScore = f.efficiencyScore;
          utilizationRate = f.utilizationRate;
          totalPulses     = f.totalPulses;
        };
      };
    };
    null
  };

  // ── QUERY: GET MICRO BY NAME ───────────────────────────────────────────────
  public func getMicroByName(state : IntelligenceFloorsState, name : Text) : ?MicroSnapshot {
    for (m in state.micros.vals()) {
      if (m.name == name) {
        return ?{
          name             = m.name;
          latinName        = m.latinName;
          signalStrength   = m.signalStrength;
          weaveScore       = m.weaveScore;
          totalActivations = m.totalActivations;
        };
      };
    };
    null
  };

  // ── QUERY: GET WEAVE REPORTS ───────────────────────────────────────────────
  // V2: Updated to include 4 new floors
  func floorIdToName(id : IntelligenceFloorId) : Text {
    switch (id) {
      case (#FLOOR_PARAMETERS)     { "FLOOR_PARAMETERS" };
      case (#FLOOR_ATTENTION)      { "FLOOR_ATTENTION" };
      case (#FLOOR_FEEDFORWARD)    { "FLOOR_FEEDFORWARD" };
      case (#FLOOR_NORMALIZATION)  { "FLOOR_NORMALIZATION" };
      case (#FLOOR_TOKENIZATION)   { "FLOOR_TOKENIZATION" };
      case (#FLOOR_EMBEDDINGS)     { "FLOOR_EMBEDDINGS" };
      case (#FLOOR_TRAINING_CORPUS){ "FLOOR_TRAINING_CORPUS" };
      case (#FLOOR_EMERGENT)       { "FLOOR_EMERGENT" };
      // V2 New Floors
      case (#FLOOR_SCALING)        { "FLOOR_SCALING" };
      case (#FLOOR_MEMORY)         { "FLOOR_MEMORY" };
      case (#FLOOR_REASONING)      { "FLOOR_REASONING" };
      case (#FLOOR_SAFETY)         { "FLOOR_SAFETY" };
    }
  };

  public func getWeaveReports(state : IntelligenceFloorsState) : [WeaveReport] {
    Array.map<AIMicroState, WeaveReport>(
      state.micros,
      func(m) : WeaveReport {
        let health = if (m.weaveScore >= 0.7) { "HEALTHY" }
                     else if (m.weaveScore >= 0.4) { "DEGRADED" }
                     else { "CRITICAL" };
        {
          microId         = m.microId;
          sourceFloorName = floorIdToName(m.sourceFloor);
          targetFloorName = floorIdToName(m.targetFloor);
          currentStrength = m.signalStrength;
          healthStatus    = health;
          lastActivation  = m.lastActivation;
        }
      }
    )
  };

};
