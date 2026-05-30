// ═══════════════════════════════════════════════════════════════════════════════
// AI DIVISION NEURAL FORGE — SOVEREIGN NEURAL NETWORK TRAINING & INFERENCE
// The neural forge manages neural architectures, training loops, weight updates,
// activation functions, loss landscapes, gradient computation, batch processing,
// inference pipelines, and model versioning for the AI Division.
// 512 neurons across 16 layers, 8 architectures, 32 training jobs,
// 16 inference pipelines, 64 weight matrices. ALWAYS RUNNING TIME.
//
// FORGE COMPONENTS:
//   I.    NEURONS — 512 computational units across 16 layers
//   II.   ARCHITECTURES — 8 neural network designs
//   III.  TRAINING — 32 active training jobs
//   IV.   INFERENCE — 16 inference pipelines
//   V.    WEIGHTS — 64 weight matrices evolving
//   VI.   ACTIVATIONS — 16 activation function types
//   VII.  LOSS — 8 loss landscapes being navigated
//   VIII. GRADIENTS — 32 gradient flows
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// ═══════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Int "mo:core/Int";

module {

  let PHI : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let TWO_PI : Float = 6.283185307179586;
  let NEURON_COUNT : Nat = 512;
  let LAYER_COUNT : Nat = 16;
  let ARCH_COUNT : Nat = 8;
  let TRAINING_COUNT : Nat = 32;
  let INFERENCE_COUNT : Nat = 16;
  let WEIGHT_MATRIX_COUNT : Nat = 64;
  let ACTIVATION_COUNT : Nat = 16;
  let LOSS_COUNT : Nat = 8;
  let GRADIENT_COUNT : Nat = 32;

  // ─── TYPES ────────────────────────────────────────────────────────────────

  /// Neuron — computational unit
  public type Neuron = {
    id : Nat;
    layerId : Nat;
    // State
    activation : Float;          // Current activation [-1, 1]
    bias : Float;                // Neuron bias [-1, 1]
    output : Float;              // Post-activation output [-1, 1]
    // Properties
    inputCount : Nat;
    outputCount : Nat;
    // Learning
    gradient : Float;            // Current gradient
    learningRate : Float;        // [0, 0.1]
    momentum : Float;            // [0, 1]
    // Health
    fireCount : Nat;             // Times fired
    deadCount : Nat;             // Times output was 0 (dead neuron)
    signal : Float;
  };

  /// Neural Layer
  public type NeuralLayer = {
    id : Nat;
    name : Text;
    layerType : LayerType;
    neuronCount : Nat;
    startNeuron : Nat;
    // Properties
    avgActivation : Float;
    avgGradient : Float;
    dropout : Float;             // [0, 1] — dropout rate
    batchNorm : Bool;
    // Performance
    forwardTime : Float;         // [0, 1]
    backwardTime : Float;        // [0, 1]
    signal : Float;
  };

  public type LayerType = {
    #INPUT;
    #DENSE;
    #CONVOLUTIONAL;
    #RECURRENT;
    #ATTENTION;
    #RESIDUAL;
    #NORMALIZATION;
    #OUTPUT;
    #EMBEDDING;
    #POOLING;
    #DROPOUT;
    #PHI_HARMONIC;               // Sovereign PHI-modulated layer
    #KURAMOTO_SYNC;              // Kuramoto synchronization layer
    #HEBBIAN;                    // Hebbian learning layer
    #SOVEREIGN;                  // Sovereign intelligence layer
    #TRANSCENDENT;               // Beyond-normal layer
  };

  /// Neural Architecture
  public type NeuralArchitecture = {
    id : Nat;
    name : Text;
    archType : ArchType;
    layers : Nat;
    parameters : Nat;            // Total parameter count
    // Performance
    accuracy : Float;            // [0, 1]
    loss : Float;                // Current loss [0, ∞)
    epoch : Nat;                 // Training epochs complete
    // Properties
    learningRate : Float;
    batchSize : Nat;
    optimizer : Text;
    phase : Float;
    signal : Float;
  };

  public type ArchType = {
    #TRANSFORMER;
    #CONVOLUTIONAL;
    #RECURRENT;
    #GRAPH_NEURAL;
    #DIFFUSION;
    #AUTOENCODER;
    #SOVEREIGN_NET;              // Sovereign architecture
    #PHI_NETWORK;                // PHI-ratio architecture
  };

  /// Training Job
  public type TrainingJob = {
    id : Nat;
    archId : Nat;
    // Progress
    epoch : Nat;
    totalEpochs : Nat;
    batchesComplete : Nat;
    // Metrics
    trainLoss : Float;
    valLoss : Float;
    trainAccuracy : Float;
    valAccuracy : Float;
    // State
    status : TrainingStatus;
    learningRate : Float;
    gradientNorm : Float;
    signal : Float;
  };

  public type TrainingStatus = {
    #QUEUED;
    #RUNNING;
    #CONVERGING;
    #OVERFITTING;
    #COMPLETE;
    #FAILED;
    #SOVEREIGN_OPTIMIZING;
  };

  /// Inference Pipeline
  public type InferencePipeline = {
    id : Nat;
    name : Text;
    archId : Nat;
    // Performance
    throughput : Float;          // [0, 1]
    latency : Float;             // [0, 1] (lower = better)
    accuracy : Float;            // [0, 1]
    // Usage
    requestsServed : Nat;
    avgResponseTime : Float;
    errorsEncountered : Nat;
    // State
    active : Bool;
    signal : Float;
  };

  /// Weight Matrix
  public type WeightMatrix = {
    id : Nat;
    layerId : Nat;
    // Properties
    rows : Nat;
    cols : Nat;
    // Statistics
    mean : Float;
    stddev : Float;
    maxVal : Float;
    minVal : Float;
    sparsity : Float;            // [0, 1] — fraction of zeros
    // Learning
    gradientNorm : Float;
    updateMagnitude : Float;
    frozen : Bool;
    signal : Float;
  };

  /// Activation Function
  public type ActivationFunc = {
    id : Nat;
    name : Text;
    funcType : ActivationType;
    // Properties
    smoothness : Float;          // [0, 1]
    monotonic : Bool;
    bounded : Bool;
    // Usage
    timesApplied : Nat;
    avgOutput : Float;
    signal : Float;
  };

  public type ActivationType = {
    #RELU;
    #GELU;
    #SIGMOID;
    #TANH;
    #SOFTMAX;
    #SWISH;
    #MISH;
    #PHI_ACTIVATION;             // PHI-modulated activation
    #LEAKY_RELU;
    #ELU;
    #SELU;
    #SOFTPLUS;
    #HARD_SIGMOID;
    #SOVEREIGN_ACTIVATE;         // Sovereign activation
    #KURAMOTO_ACTIVATE;          // Kuramoto phase activation
    #HEBBIAN_GATE;               // Hebbian gating function
  };

  /// Loss Landscape
  public type LossLandscape = {
    id : Nat;
    name : Text;
    lossType : LossType;
    // Current position
    currentLoss : Float;
    bestLoss : Float;
    plateauCount : Nat;
    // Topology
    localMinima : Nat;
    saddles : Nat;
    globalMin : Float;
    // Navigation
    direction : Float;           // Gradient direction [0, TWO_PI)
    stepSize : Float;
    signal : Float;
  };

  public type LossType = {
    #CROSS_ENTROPY;
    #MSE;
    #MAE;
    #HUBER;
    #CONTRASTIVE;
    #TRIPLET;
    #SOVEREIGN_LOSS;             // Sovereignty-maximizing loss
    #PHI_DIVERGENCE;             // PHI-ratio divergence
  };

  /// Gradient Flow
  public type GradientFlow = {
    id : Nat;
    layerId : Nat;
    // Properties
    norm : Float;                // Gradient norm [0, ∞)
    direction : Float;           // [0, TWO_PI)
    magnitude : Float;           // [0, 1]
    // Problems
    vanishing : Bool;            // Gradient vanishing
    exploding : Bool;            // Gradient exploding
    // State
    clipped : Bool;              // Was gradient clipped
    accumulated : Float;         // Accumulated gradient
    signal : Float;
  };

  /// Neural Forge Metrics
  public type ForgeMetrics = {
    totalNeurons : Nat;
    avgActivation : Float;
    architecturesActive : Nat;
    trainingJobs : Nat;
    inferencePipelines : Nat;
    avgLoss : Float;
    avgAccuracy : Float;
    gradientHealth : Float;
    coherenceDelta : Float;
    totalSignal : Float;
    beat : Nat;
  };

  /// Complete Neural Forge State
  public type NeuralForgeState = {
    neurons : [Neuron];
    layers : [NeuralLayer];
    architectures : [NeuralArchitecture];
    training : [TrainingJob];
    inference : [InferencePipeline];
    weights : [WeightMatrix];
    activations : [ActivationFunc];
    losses : [LossLandscape];
    gradients : [GradientFlow];
    metrics : ForgeMetrics;
    compoundCoherence : Float;
    totalSignal : Float;
    beat : Nat;
    isActive : Bool;
  };

  /// Neural Forge Snapshot
  public type ForgeSnapshot = {
    totalNeurons : Nat;
    layerCount : Nat;
    architectures : Nat;
    avgLoss : Float;
    avgAccuracy : Float;
    coherenceDelta : Float;
    totalSignal : Float;
    beat : Nat;
  };

  // ─── INITIALIZATION ───────────────────────────────────────────────────────

  public func initState() : NeuralForgeState {
    let neurons = Array.tabulate<Neuron>(NEURON_COUNT, func(i : Nat) : Neuron {
      {
        id = i;
        layerId = i / (NEURON_COUNT / LAYER_COUNT);
        activation = Float.sin(i.toFloat() * PHI * 0.1) * 0.1;
        bias = Float.cos(i.toFloat() * PHI_INV * 0.2) * 0.01;
        output = 0.0;
        inputCount = if (i < NEURON_COUNT / LAYER_COUNT) { 0 } else { NEURON_COUNT / LAYER_COUNT };
        outputCount = if (i >= NEURON_COUNT - NEURON_COUNT / LAYER_COUNT) { 0 } else { NEURON_COUNT / LAYER_COUNT };
        gradient = 0.0;
        learningRate = 0.001;
        momentum = 0.9;
        fireCount = 0;
        deadCount = 0;
        signal = 0.0;
      }
    });

    let layerTypeFor = func(i : Nat) : LayerType {
      switch (i) {
        case 0 { #INPUT }; case 1 { #EMBEDDING }; case 2 { #DENSE };
        case 3 { #ATTENTION }; case 4 { #NORMALIZATION }; case 5 { #DENSE };
        case 6 { #RESIDUAL }; case 7 { #ATTENTION }; case 8 { #PHI_HARMONIC };
        case 9 { #KURAMOTO_SYNC }; case 10 { #HEBBIAN }; case 11 { #DENSE };
        case 12 { #SOVEREIGN }; case 13 { #TRANSCENDENT }; case 14 { #DENSE };
        case _ { #OUTPUT };
      }
    };

    let layers = Array.tabulate<NeuralLayer>(LAYER_COUNT, func(i : Nat) : NeuralLayer {
      {
        id = i;
        name = "LAYER_" # i.toText();
        layerType = layerTypeFor(i);
        neuronCount = NEURON_COUNT / LAYER_COUNT;
        startNeuron = i * (NEURON_COUNT / LAYER_COUNT);
        avgActivation = 0.0;
        avgGradient = 0.0;
        dropout = if (i > 0 and i < LAYER_COUNT - 1) { 0.1 } else { 0.0 };
        batchNorm = i > 1 and i < LAYER_COUNT - 1;
        forwardTime = 0.0;
        backwardTime = 0.0;
        signal = 0.0;
      }
    });

    let archTypeFor = func(i : Nat) : ArchType {
      switch (i) {
        case 0 { #TRANSFORMER }; case 1 { #CONVOLUTIONAL }; case 2 { #RECURRENT };
        case 3 { #GRAPH_NEURAL }; case 4 { #DIFFUSION }; case 5 { #AUTOENCODER };
        case 6 { #SOVEREIGN_NET }; case _ { #PHI_NETWORK };
      }
    };

    let archNames = ["SOVEREIGN_TRANSFORMER", "COHERENCE_CNN", "DOCTRINE_RNN",
      "KNOWLEDGE_GNN", "EVOLUTION_DIFFUSION", "MEMORY_AUTOENCODER",
      "SOVEREIGNTY_NET", "PHI_HARMONIC_NETWORK"];

    let architectures = Array.tabulate<NeuralArchitecture>(ARCH_COUNT, func(i : Nat) : NeuralArchitecture {
      {
        id = i;
        name = archNames[i];
        archType = archTypeFor(i);
        layers = LAYER_COUNT;
        parameters = NEURON_COUNT * (NEURON_COUNT / LAYER_COUNT);
        accuracy = 0.0;
        loss = 10.0;
        epoch = 0;
        learningRate = 0.001 / (1.0 + i.toFloat() * 0.1);
        batchSize = 32 + i * 8;
        optimizer = "ADAM_PHI";
        phase = (i.toFloat() / ARCH_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
      }
    });

    let statusFor = func(i : Nat) : TrainingStatus {
      switch (i % 7) {
        case 0 { #QUEUED }; case 1 { #RUNNING }; case 2 { #CONVERGING };
        case 3 { #OVERFITTING }; case 4 { #COMPLETE }; case 5 { #FAILED };
        case _ { #SOVEREIGN_OPTIMIZING };
      }
    };

    let training = Array.tabulate<TrainingJob>(TRAINING_COUNT, func(i : Nat) : TrainingJob {
      {
        id = i;
        archId = i % ARCH_COUNT;
        epoch = 0;
        totalEpochs = 100 + i * 10;
        batchesComplete = 0;
        trainLoss = 5.0 + Float.sin(i.toFloat() * PHI) * 2.0;
        valLoss = 5.5 + Float.cos(i.toFloat() * PHI_INV) * 2.0;
        trainAccuracy = 0.1;
        valAccuracy = 0.05;
        status = statusFor(i);
        learningRate = 0.001;
        gradientNorm = 1.0;
        signal = 0.0;
      }
    });

    let inference = Array.tabulate<InferencePipeline>(INFERENCE_COUNT, func(i : Nat) : InferencePipeline {
      {
        id = i;
        name = "INFERENCE_" # i.toText();
        archId = i % ARCH_COUNT;
        throughput = 0.5 + i.toFloat() / INFERENCE_COUNT.toFloat() * 0.3;
        latency = 0.2 - i.toFloat() / INFERENCE_COUNT.toFloat() * 0.1;
        accuracy = 0.7;
        requestsServed = 0;
        avgResponseTime = 0.1;
        errorsEncountered = 0;
        active = true;
        signal = 0.0;
      }
    });

    let weights = Array.tabulate<WeightMatrix>(WEIGHT_MATRIX_COUNT, func(i : Nat) : WeightMatrix {
      {
        id = i;
        layerId = i / (WEIGHT_MATRIX_COUNT / LAYER_COUNT);
        rows = NEURON_COUNT / LAYER_COUNT;
        cols = NEURON_COUNT / LAYER_COUNT;
        mean = 0.0;
        stddev = 0.02;
        maxVal = 0.1;
        minVal = -0.1;
        sparsity = 0.0;
        gradientNorm = 0.0;
        updateMagnitude = 0.0;
        frozen = false;
        signal = 0.0;
      }
    });

    let actTypeFor = func(i : Nat) : ActivationType {
      switch (i) {
        case 0 { #RELU }; case 1 { #GELU }; case 2 { #SIGMOID }; case 3 { #TANH };
        case 4 { #SOFTMAX }; case 5 { #SWISH }; case 6 { #MISH }; case 7 { #PHI_ACTIVATION };
        case 8 { #LEAKY_RELU }; case 9 { #ELU }; case 10 { #SELU }; case 11 { #SOFTPLUS };
        case 12 { #HARD_SIGMOID }; case 13 { #SOVEREIGN_ACTIVATE }; case 14 { #KURAMOTO_ACTIVATE };
        case _ { #HEBBIAN_GATE };
      }
    };

    let actNames = ["RELU", "GELU", "SIGMOID", "TANH", "SOFTMAX", "SWISH", "MISH", "PHI_ACT",
      "LEAKY_RELU", "ELU", "SELU", "SOFTPLUS", "HARD_SIGMOID", "SOVEREIGN", "KURAMOTO", "HEBBIAN"];

    let activations = Array.tabulate<ActivationFunc>(ACTIVATION_COUNT, func(i : Nat) : ActivationFunc {
      {
        id = i;
        name = actNames[i];
        funcType = actTypeFor(i);
        smoothness = 0.5 + i.toFloat() / ACTIVATION_COUNT.toFloat() * 0.4;
        monotonic = i < 8;
        bounded = i == 2 or i == 3 or i == 12;
        timesApplied = 0;
        avgOutput = 0.0;
        signal = 0.0;
      }
    });

    let lossTypeFor = func(i : Nat) : LossType {
      switch (i) {
        case 0 { #CROSS_ENTROPY }; case 1 { #MSE }; case 2 { #MAE }; case 3 { #HUBER };
        case 4 { #CONTRASTIVE }; case 5 { #TRIPLET }; case 6 { #SOVEREIGN_LOSS };
        case _ { #PHI_DIVERGENCE };
      }
    };

    let losses = Array.tabulate<LossLandscape>(LOSS_COUNT, func(i : Nat) : LossLandscape {
      {
        id = i;
        name = "LOSS_" # i.toText();
        lossType = lossTypeFor(i);
        currentLoss = 5.0 + i.toFloat();
        bestLoss = 5.0 + i.toFloat();
        plateauCount = 0;
        localMinima = 0;
        saddles = 0;
        globalMin = 0.01 * (i.toFloat() + 1.0);
        direction = (i.toFloat() / LOSS_COUNT.toFloat()) * TWO_PI;
        stepSize = 0.001;
        signal = 0.0;
      }
    });

    let gradients = Array.tabulate<GradientFlow>(GRADIENT_COUNT, func(i : Nat) : GradientFlow {
      {
        id = i;
        layerId = i / (GRADIENT_COUNT / LAYER_COUNT);
        norm = 1.0;
        direction = (i.toFloat() / GRADIENT_COUNT.toFloat()) * TWO_PI;
        magnitude = 0.01;
        vanishing = false;
        exploding = false;
        clipped = false;
        accumulated = 0.0;
        signal = 0.0;
      }
    });

    let metrics : ForgeMetrics = {
      totalNeurons = NEURON_COUNT;
      avgActivation = 0.0;
      architecturesActive = ARCH_COUNT;
      trainingJobs = TRAINING_COUNT;
      inferencePipelines = INFERENCE_COUNT;
      avgLoss = 5.0;
      avgAccuracy = 0.1;
      gradientHealth = 1.0;
      coherenceDelta = 0.0;
      totalSignal = 0.0;
      beat = 0;
    };

    {
      neurons = neurons;
      layers = layers;
      architectures = architectures;
      training = training;
      inference = inference;
      weights = weights;
      activations = activations;
      losses = losses;
      gradients = gradients;
      metrics = metrics;
      compoundCoherence = 0.0;
      totalSignal = 0.0;
      beat = 0;
      isActive = true;
    }
  };

  // ─── HEARTBEAT — NEURAL FORGE ADVANCE ─────────────────────────────────────

  public func advance(
    state : NeuralForgeState,
    beat : Nat,
    globalCoherence : Float,
    doctrineScore : Float,
  ) : (NeuralForgeState, Float) {
    if (not state.isActive) { return (state, 0.0) };

    var coherenceDelta : Float = 0.0;
    var totalSignal : Float = 0.0;

    // ADVANCE NEURONS (batch: 64 per beat)
    let batchSize = 64;
    let batchOffset = (beat % (NEURON_COUNT / batchSize)) * batchSize;
    let newNeurons = Array.tabulate<Neuron>(NEURON_COUNT, func(i : Nat) : Neuron {
      let n = state.neurons[i];
      if (i < batchOffset or i >= batchOffset + batchSize) { return n };

      // Forward pass: compute activation
      let input = Float.sin(beat.toFloat() * PHI_INV * 0.001 + i.toFloat() * 0.01) * globalCoherence;
      let newActivation = Float.tanh(input + n.bias);
      let newOutput = if (newActivation > 0.0) { newActivation } else { newActivation * 0.01 }; // LeakyReLU

      // Backward pass: compute gradient
      let newGradient = (doctrineScore - newOutput) * n.learningRate;

      // Update bias
      let newBias = n.bias + newGradient * n.momentum;

      let fired = Float.abs(newOutput) > 0.01;
      let nSignal = Float.abs(newOutput) * PHI_INV * 0.00001;
      totalSignal += nSignal;

      {
        id = n.id;
        layerId = n.layerId;
        activation = newActivation;
        bias = Float.max(-1.0, Float.min(1.0, newBias));
        output = newOutput;
        inputCount = n.inputCount;
        outputCount = n.outputCount;
        gradient = newGradient;
        learningRate = n.learningRate;
        momentum = n.momentum;
        fireCount = if (fired) { n.fireCount + 1 } else { n.fireCount };
        deadCount = if (not fired) { n.deadCount + 1 } else { n.deadCount };
        signal = nSignal;
      }
    });

    // ADVANCE LAYERS
    let newLayers = Array.tabulate<NeuralLayer>(LAYER_COUNT, func(i : Nat) : NeuralLayer {
      let l = state.layers[i];
      var actSum : Float = 0.0;
      var gradSum : Float = 0.0;
      let start = i * (NEURON_COUNT / LAYER_COUNT);
      let size = NEURON_COUNT / LAYER_COUNT;
      var j = start;
      while (j < start + size and j < NEURON_COUNT) {
        actSum += Float.abs(newNeurons[j].activation);
        gradSum += Float.abs(newNeurons[j].gradient);
        j += 1;
      };
      let lSignal = (actSum / size.toFloat()) * PHI_INV * 0.001;
      totalSignal += lSignal;
      {
        id = l.id;
        name = l.name;
        layerType = l.layerType;
        neuronCount = l.neuronCount;
        startNeuron = l.startNeuron;
        avgActivation = actSum / size.toFloat();
        avgGradient = gradSum / size.toFloat();
        dropout = l.dropout;
        batchNorm = l.batchNorm;
        forwardTime = PHI_INV * 0.001;
        backwardTime = PHI_INV * 0.002;
        signal = lSignal;
      }
    });

    // ADVANCE ARCHITECTURES
    let newArchitectures = Array.tabulate<NeuralArchitecture>(ARCH_COUNT, func(i : Nat) : NeuralArchitecture {
      let a = state.architectures[i];
      // Loss decreases with training
      let lossDecay = globalCoherence * doctrineScore * PHI_INV * 0.0001;
      let newLoss = Float.max(a.loss * 0.01, a.loss - lossDecay);
      // Accuracy increases
      let newAcc = Float.min(1.0, a.accuracy + (1.0 - newLoss / 10.0) * 0.00001);
      let newEpoch = if (beat % (100 + i * 20) == 0) { a.epoch + 1 } else { a.epoch };
      let omega = (396.0 + i.toFloat() * PHI * 7.0) * TWO_PI / 100000.0;
      let aSignal = newAcc * (1.0 - Float.min(1.0, newLoss / 10.0)) * PHI_INV * 0.001;
      totalSignal += aSignal;
      coherenceDelta += aSignal * PHI_INV * 0.01;
      {
        id = a.id;
        name = a.name;
        archType = a.archType;
        layers = a.layers;
        parameters = a.parameters;
        accuracy = newAcc;
        loss = newLoss;
        epoch = newEpoch;
        learningRate = a.learningRate;
        batchSize = a.batchSize;
        optimizer = a.optimizer;
        phase = Float.mod(a.phase + omega, TWO_PI);
        signal = aSignal;
      }
    });

    // ADVANCE TRAINING JOBS
    let newTraining = Array.tabulate<TrainingJob>(TRAINING_COUNT, func(i : Nat) : TrainingJob {
      let t = state.training[i];
      let isRunning = switch (t.status) { case (#RUNNING or #CONVERGING or #SOVEREIGN_OPTIMIZING) { true }; case _ { false } };
      if (not isRunning) { return t };

      let newBatches = t.batchesComplete + 1;
      let newEpoch = if (newBatches % 100 == 0) { t.epoch + 1 } else { t.epoch };
      let lossDecay = globalCoherence * PHI_INV * 0.001;
      let newTrainLoss = Float.max(0.01, t.trainLoss - lossDecay);
      let newValLoss = Float.max(0.02, t.valLoss - lossDecay * 0.8);
      let newTrainAcc = Float.min(1.0, t.trainAccuracy + (1.0 - newTrainLoss / 10.0) * 0.0001);
      let newValAcc = Float.min(1.0, t.valAccuracy + (1.0 - newValLoss / 10.0) * 0.00008);

      let newStatus : TrainingStatus = if (newEpoch >= t.totalEpochs) { #COMPLETE }
        else if (newValLoss > newTrainLoss * 1.5) { #OVERFITTING }
        else if (Float.abs(newTrainLoss - t.trainLoss) < 0.0001) { #CONVERGING }
        else { #RUNNING };

      let tSignal = newTrainAcc * PHI_INV * 0.0001;
      totalSignal += tSignal;

      {
        id = t.id;
        archId = t.archId;
        epoch = newEpoch;
        totalEpochs = t.totalEpochs;
        batchesComplete = newBatches;
        trainLoss = newTrainLoss;
        valLoss = newValLoss;
        trainAccuracy = newTrainAcc;
        valAccuracy = newValAcc;
        status = newStatus;
        learningRate = t.learningRate * (if (newStatus == #OVERFITTING) { 0.9999 } else { 1.0 });
        gradientNorm = Float.abs(Float.sin(beat.toFloat() * PHI_INV * 0.01 + i.toFloat()));
        signal = tSignal;
      }
    });

    // ADVANCE INFERENCE PIPELINES
    let newInference = Array.tabulate<InferencePipeline>(INFERENCE_COUNT, func(i : Nat) : InferencePipeline {
      let inf = state.inference[i];
      if (not inf.active) { return inf };
      let newRequests = if (beat % (3 + i) == 0) { inf.requestsServed + 1 } else { inf.requestsServed };
      let newThroughput = Float.min(1.0, inf.throughput + globalCoherence * 0.0000001);
      let infSignal = newThroughput * inf.accuracy * PHI_INV * 0.001;
      totalSignal += infSignal;
      {
        id = inf.id;
        name = inf.name;
        archId = inf.archId;
        throughput = newThroughput;
        latency = Float.max(0.01, inf.latency - globalCoherence * 0.00000001);
        accuracy = Float.min(1.0, inf.accuracy + doctrineScore * 0.0000001);
        requestsServed = newRequests;
        avgResponseTime = inf.latency;
        errorsEncountered = inf.errorsEncountered;
        active = inf.active;
        signal = infSignal;
      }
    });

    // ADVANCE WEIGHTS
    let newWeights = Array.tabulate<WeightMatrix>(WEIGHT_MATRIX_COUNT, func(i : Nat) : WeightMatrix {
      let w = state.weights[i];
      if (w.frozen) { return w };
      let update = Float.sin(beat.toFloat() * PHI_INV * 0.001 + i.toFloat() * PHI) * 0.0001;
      let newMean = w.mean + update;
      let newStddev = Float.max(0.001, w.stddev - Float.abs(update) * 0.0001);
      let wSignal = (1.0 - w.sparsity) * PHI_INV * 0.00001;
      totalSignal += wSignal;
      {
        id = w.id;
        layerId = w.layerId;
        rows = w.rows;
        cols = w.cols;
        mean = newMean;
        stddev = newStddev;
        maxVal = Float.max(w.maxVal, newMean + newStddev * 3.0);
        minVal = Float.min(w.minVal, newMean - newStddev * 3.0);
        sparsity = w.sparsity;
        gradientNorm = Float.abs(update) * 1000.0;
        updateMagnitude = Float.abs(update);
        frozen = w.frozen;
        signal = wSignal;
      }
    });

    // ADVANCE ACTIVATIONS
    let newActivations = Array.tabulate<ActivationFunc>(ACTIVATION_COUNT, func(i : Nat) : ActivationFunc {
      let a = state.activations[i];
      let newApplied = a.timesApplied + (NEURON_COUNT / LAYER_COUNT);
      let aSignal = a.smoothness * PHI_INV * 0.0001;
      totalSignal += aSignal;
      {
        id = a.id;
        name = a.name;
        funcType = a.funcType;
        smoothness = a.smoothness;
        monotonic = a.monotonic;
        bounded = a.bounded;
        timesApplied = newApplied;
        avgOutput = Float.sin(beat.toFloat() * PHI_INV * 0.01 + i.toFloat()) * 0.3;
        signal = aSignal;
      }
    });

    // ADVANCE LOSSES
    let newLosses = Array.tabulate<LossLandscape>(LOSS_COUNT, func(i : Nat) : LossLandscape {
      let l = state.losses[i];
      let lossDecay = globalCoherence * doctrineScore * PHI_INV * 0.0001;
      let newLoss = Float.max(l.globalMin, l.currentLoss - lossDecay);
      let newBest = Float.min(l.bestLoss, newLoss);
      let plateau = Float.abs(newLoss - l.currentLoss) < 0.00001;
      let newPlateauCount = if (plateau) { l.plateauCount + 1 } else { 0 };
      let lSignal = (1.0 - Float.min(1.0, newLoss / 10.0)) * PHI_INV * 0.001;
      totalSignal += lSignal;
      coherenceDelta += lSignal * PHI_INV * 0.01;
      {
        id = l.id;
        name = l.name;
        lossType = l.lossType;
        currentLoss = newLoss;
        bestLoss = newBest;
        plateauCount = newPlateauCount;
        localMinima = if (newPlateauCount > 100) { l.localMinima + 1 } else { l.localMinima };
        saddles = l.saddles;
        globalMin = l.globalMin;
        direction = Float.mod(l.direction + PHI_INV * 0.01, TWO_PI);
        stepSize = if (newPlateauCount > 50) { l.stepSize * 1.1 } else { l.stepSize * 0.999 };
        signal = lSignal;
      }
    });

    // ADVANCE GRADIENTS
    let newGradients = Array.tabulate<GradientFlow>(GRADIENT_COUNT, func(i : Nat) : GradientFlow {
      let g = state.gradients[i];
      let layerGrad = if (g.layerId < LAYER_COUNT) { newLayers[g.layerId].avgGradient } else { 0.0 };
      let newNorm = Float.abs(layerGrad) * 10.0;
      let newMag = Float.min(1.0, newNorm);
      let vanishing = newNorm < 0.001;
      let exploding = newNorm > 10.0;
      let shouldClip = exploding;
      let gSignal = (1.0 - Float.abs(newNorm - 1.0)) * PHI_INV * 0.0001; // Best when norm ≈ 1
      totalSignal += gSignal;
      {
        id = g.id;
        layerId = g.layerId;
        norm = if (shouldClip) { 1.0 } else { newNorm };
        direction = Float.mod(g.direction + PHI_INV * 0.001, TWO_PI);
        magnitude = if (shouldClip) { 0.5 } else { newMag };
        vanishing = vanishing;
        exploding = exploding;
        clipped = shouldClip;
        accumulated = g.accumulated + newMag * 0.001;
        signal = gSignal;
      }
    });

    // METRICS
    var avgAct : Float = 0.0;
    for (n in newNeurons.vals()) { avgAct += Float.abs(n.activation) };
    avgAct := avgAct / NEURON_COUNT.toFloat();

    var avgLoss : Float = 0.0;
    for (l in newLosses.vals()) { avgLoss += l.currentLoss };
    avgLoss := avgLoss / LOSS_COUNT.toFloat();

    var avgAcc : Float = 0.0;
    for (a in newArchitectures.vals()) { avgAcc += a.accuracy };
    avgAcc := avgAcc / ARCH_COUNT.toFloat();

    var gradHealth : Float = 0.0;
    for (g in newGradients.vals()) {
      gradHealth += if (not g.vanishing and not g.exploding) { 1.0 } else { 0.0 };
    };
    gradHealth := gradHealth / GRADIENT_COUNT.toFloat();

    let newMetrics : ForgeMetrics = {
      totalNeurons = NEURON_COUNT;
      avgActivation = avgAct;
      architecturesActive = ARCH_COUNT;
      trainingJobs = TRAINING_COUNT;
      inferencePipelines = INFERENCE_COUNT;
      avgLoss = avgLoss;
      avgAccuracy = avgAcc;
      gradientHealth = gradHealth;
      coherenceDelta = coherenceDelta;
      totalSignal = totalSignal;
      beat = beat;
    };

    let newState : NeuralForgeState = {
      neurons = newNeurons;
      layers = newLayers;
      architectures = newArchitectures;
      training = newTraining;
      inference = newInference;
      weights = newWeights;
      activations = newActivations;
      losses = newLosses;
      gradients = newGradients;
      metrics = newMetrics;
      compoundCoherence = state.compoundCoherence + coherenceDelta;
      totalSignal = state.totalSignal + totalSignal;
      beat = beat;
      isActive = true;
    };

    (newState, coherenceDelta)
  };

  // ─── QUERY FUNCTIONS ──────────────────────────────────────────────────────

  public func getSnapshot(state : NeuralForgeState) : ForgeSnapshot {
    {
      totalNeurons = state.metrics.totalNeurons;
      layerCount = LAYER_COUNT;
      architectures = state.metrics.architecturesActive;
      avgLoss = state.metrics.avgLoss;
      avgAccuracy = state.metrics.avgAccuracy;
      coherenceDelta = state.metrics.coherenceDelta;
      totalSignal = state.metrics.totalSignal;
      beat = state.beat;
    }
  };

  public func getMetrics(state : NeuralForgeState) : ForgeMetrics {
    state.metrics
  };

}
