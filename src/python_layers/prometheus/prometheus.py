"""
PROMETHEUS - The Learning Layer
ΠΡΟΜΗΘΕΥΣ (Greek) | Prometheus (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML training and adaptive learning)
Domain: Adaptive learning, weight updates, model training,
        Hebbian learning, backpropagation, reinforcement

Purpose: PROMETHEUS is the organism's LEARNER. Named after the
         Titan who gave fire (knowledge) to humanity.
         
         PROMETHEUS implements the learning algorithms:
         - Hebbian learning (what fires together, wires together)
         - Backpropagation of doctrine alignment errors
         - Reinforcement from coherence feedback
         - Adaptive rate scheduling based on PHI

Mathematical Model:
    hebbian_delta = pre × post × phi × learning_rate
    backprop_gradient = -∂(doctrine_error)/∂(weight)
    reinforcement = (coherence - baseline) × phi^reward_scale
    learning_rate(t) = base_lr × phi^(-t/tau)
    
    Combined update:
    Δw = hebbian_delta + backprop_gradient + reinforcement
    w' = w + Δw × doctrine_gate  (gated by doctrine compliance)

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple, Callable
from enum import Enum
import math
import random
from datetime import datetime

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI  # ≈ 0.6180339887
S0_FLOOR = 0.75
S_CEIL = 9.75

# Learning constants
BASE_LEARNING_RATE = 0.01
LEARNING_RATE_DECAY_TAU = 343.0  # 7^3 beats
MIN_LEARNING_RATE = 0.0001
MAX_LEARNING_RATE = 0.1

# Hebbian learning
HEBBIAN_COEFFICIENT = PHI_INV
LTP_THRESHOLD = 0.5   # Long-term potentiation threshold
LTD_THRESHOLD = 0.3   # Long-term depression threshold

# Reinforcement learning
REWARD_SCALE = 1.0
DISCOUNT_FACTOR = PHI_INV  # γ ≈ 0.618

# Weight bounds
MIN_WEIGHT = -S_CEIL
MAX_WEIGHT = S_CEIL

# Attribution
ATTRIBUTION = "Alfredo Medina Hernandez"


# ═══════════════════════════════════════════════════════════════════════
# II. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

def clamp_sovereign(value: float) -> float:
    """Clamp value to sovereign range [S0_FLOOR, S_CEIL]."""
    return max(S0_FLOOR, min(S_CEIL, value))


def clamp_weight(value: float) -> float:
    """Clamp weight to valid range."""
    return max(MIN_WEIGHT, min(MAX_WEIGHT, value))


class LearningMode(Enum):
    """Learning algorithm modes."""
    HEBBIAN = "hebbian"
    BACKPROP = "backprop"
    REINFORCEMENT = "reinforcement"
    COMBINED = "combined"
    FROZEN = "frozen"  # No learning (inference only)


class ActivationFunction(Enum):
    """Activation functions for neurons."""
    SIGMOID = "sigmoid"
    TANH = "tanh"
    RELU = "relu"
    PHI_SIGMOID = "phi_sigmoid"  # Custom: 1 / (1 + exp(-x × PHI))
    SOVEREIGN = "sovereign"  # Clamp to [S0_FLOOR, S_CEIL]


@dataclass
class Synapse:
    """A connection between two neurons."""
    synapse_id: str
    source_id: str
    target_id: str
    weight: float
    learning_rate: float
    is_plastic: bool = True  # Can this synapse learn?
    last_updated: int = 0
    update_count: int = 0
    cumulative_delta: float = 0.0


@dataclass
class Neuron:
    """A single neuron in the learning network."""
    neuron_id: str
    layer: int
    activation: float
    bias: float
    activation_fn: ActivationFunction
    input_synapses: List[str]  # Synapse IDs
    output_synapses: List[str]  # Synapse IDs
    error_gradient: float = 0.0
    last_fired: int = 0


@dataclass
class LearningSignal:
    """A signal that drives learning."""
    signal_type: LearningMode
    target_output: Optional[List[float]]  # For supervised learning
    reward: Optional[float]  # For reinforcement learning
    doctrine_score: float
    coherence: float
    beat: int


@dataclass
class TrainingExample:
    """A single training example."""
    example_id: str
    inputs: List[float]
    targets: Optional[List[float]]
    reward: Optional[float]
    doctrine_weight: float
    timestamp: int


@dataclass
class LearningMetrics:
    """Metrics tracking learning progress."""
    total_updates: int
    average_delta: float
    loss: float
    doctrine_loss: float
    coherence_gain: float
    learning_rate_current: float


@dataclass
class PrometheusState:
    """Complete state of the PROMETHEUS learning layer."""
    # Network structure
    neurons: Dict[str, Neuron]
    synapses: Dict[str, Synapse]
    layers: List[List[str]]  # Layer index → neuron IDs
    
    # Learning state
    learning_mode: LearningMode
    learning_rate: float
    momentum: float
    
    # History
    training_history: List[TrainingExample]
    metrics_history: List[LearningMetrics]
    
    # State tracking
    current_beat: int
    total_examples_seen: int
    total_weight_updates: int
    
    # Doctrine
    doctrine_coherence: float
    baseline_coherence: float  # For reinforcement baseline
    
    attribution: str = ATTRIBUTION


# ═══════════════════════════════════════════════════════════════════════
# III. ACTIVATION FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def sigmoid(x: float) -> float:
    """Standard sigmoid activation."""
    return 1.0 / (1.0 + math.exp(-max(-700, min(700, x))))


def tanh(x: float) -> float:
    """Hyperbolic tangent activation."""
    return math.tanh(x)


def relu(x: float) -> float:
    """Rectified linear unit activation."""
    return max(0.0, x)


def phi_sigmoid(x: float) -> float:
    """PHI-weighted sigmoid: 1 / (1 + exp(-x × PHI))."""
    return 1.0 / (1.0 + math.exp(-max(-700, min(700, x * PHI))))


def sovereign_activation(x: float) -> float:
    """Sovereign-bounded activation."""
    return clamp_sovereign(x)


def activate(x: float, fn: ActivationFunction) -> float:
    """Apply activation function."""
    if fn == ActivationFunction.SIGMOID:
        return sigmoid(x)
    elif fn == ActivationFunction.TANH:
        return tanh(x)
    elif fn == ActivationFunction.RELU:
        return relu(x)
    elif fn == ActivationFunction.PHI_SIGMOID:
        return phi_sigmoid(x)
    elif fn == ActivationFunction.SOVEREIGN:
        return sovereign_activation(x)
    return x


def activate_derivative(x: float, fn: ActivationFunction) -> float:
    """Compute derivative of activation function at x."""
    if fn == ActivationFunction.SIGMOID:
        s = sigmoid(x)
        return s * (1 - s)
    elif fn == ActivationFunction.TANH:
        t = tanh(x)
        return 1 - t * t
    elif fn == ActivationFunction.RELU:
        return 1.0 if x > 0 else 0.0
    elif fn == ActivationFunction.PHI_SIGMOID:
        s = phi_sigmoid(x)
        return PHI * s * (1 - s)
    elif fn == ActivationFunction.SOVEREIGN:
        return 1.0 if S0_FLOOR <= x <= S_CEIL else 0.0
    return 1.0


# ═══════════════════════════════════════════════════════════════════════
# IV. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

def init_synapse(
    source_id: str,
    target_id: str,
    beat: int,
    learning_rate: float = BASE_LEARNING_RATE
) -> Synapse:
    """Initialize a synapse with PHI-scaled random weight."""
    weight = (random.random() * 2 - 1) * PHI_INV  # [-PHI_INV, PHI_INV]
    return Synapse(
        synapse_id=f"SYN_{source_id}_{target_id}",
        source_id=source_id,
        target_id=target_id,
        weight=weight,
        learning_rate=learning_rate,
        is_plastic=True,
        last_updated=beat,
        update_count=0,
        cumulative_delta=0.0
    )


def init_neuron(
    neuron_id: str,
    layer: int,
    activation_fn: ActivationFunction = ActivationFunction.PHI_SIGMOID
) -> Neuron:
    """Initialize a neuron."""
    return Neuron(
        neuron_id=neuron_id,
        layer=layer,
        activation=S0_FLOOR,
        bias=(random.random() * 2 - 1) * PHI_INV,
        activation_fn=activation_fn,
        input_synapses=[],
        output_synapses=[],
        error_gradient=0.0,
        last_fired=0
    )


def init_prometheus_state(
    layer_sizes: List[int] = [13, 21, 13, 7],  # Fibonacci-inspired
    learning_mode: LearningMode = LearningMode.COMBINED
) -> PrometheusState:
    """Initialize PROMETHEUS with a neural network."""
    neurons: Dict[str, Neuron] = {}
    synapses: Dict[str, Synapse] = {}
    layers: List[List[str]] = []
    
    # Create neurons layer by layer
    for layer_idx, layer_size in enumerate(layer_sizes):
        layer_neurons = []
        
        # Use sovereign activation for output layer
        act_fn = ActivationFunction.SOVEREIGN if layer_idx == len(layer_sizes) - 1 else ActivationFunction.PHI_SIGMOID
        
        for neuron_idx in range(layer_size):
            neuron_id = f"N_{layer_idx}_{neuron_idx}"
            neuron = init_neuron(neuron_id, layer_idx, act_fn)
            neurons[neuron_id] = neuron
            layer_neurons.append(neuron_id)
        
        layers.append(layer_neurons)
    
    # Create fully connected synapses between adjacent layers
    for layer_idx in range(len(layers) - 1):
        for source_id in layers[layer_idx]:
            for target_id in layers[layer_idx + 1]:
                synapse = init_synapse(source_id, target_id, 0)
                synapses[synapse.synapse_id] = synapse
                neurons[source_id].output_synapses.append(synapse.synapse_id)
                neurons[target_id].input_synapses.append(synapse.synapse_id)
    
    return PrometheusState(
        neurons=neurons,
        synapses=synapses,
        layers=layers,
        learning_mode=learning_mode,
        learning_rate=BASE_LEARNING_RATE,
        momentum=PHI_INV,
        training_history=[],
        metrics_history=[],
        current_beat=0,
        total_examples_seen=0,
        total_weight_updates=0,
        doctrine_coherence=S0_FLOOR,
        baseline_coherence=S0_FLOOR
    )


# ═══════════════════════════════════════════════════════════════════════
# V. FORWARD PASS
# ═══════════════════════════════════════════════════════════════════════

def forward_pass(inputs: List[float], state: PrometheusState) -> List[float]:
    """Execute forward pass through the network."""
    # Set input layer activations
    input_layer = state.layers[0]
    for i, neuron_id in enumerate(input_layer):
        if i < len(inputs):
            state.neurons[neuron_id].activation = inputs[i]
        else:
            state.neurons[neuron_id].activation = S0_FLOOR
    
    # Propagate through hidden and output layers
    for layer_idx in range(1, len(state.layers)):
        for neuron_id in state.layers[layer_idx]:
            neuron = state.neurons[neuron_id]
            
            # Sum weighted inputs
            total_input = neuron.bias
            for synapse_id in neuron.input_synapses:
                synapse = state.synapses[synapse_id]
                source_activation = state.neurons[synapse.source_id].activation
                total_input += source_activation * synapse.weight
            
            # Apply activation function
            neuron.activation = activate(total_input, neuron.activation_fn)
            neuron.last_fired = state.current_beat
    
    # Return output layer activations
    output_layer = state.layers[-1]
    return [state.neurons[nid].activation for nid in output_layer]


# ═══════════════════════════════════════════════════════════════════════
# VI. LEARNING ALGORITHMS
# ═══════════════════════════════════════════════════════════════════════

def compute_learning_rate(base_rate: float, beat: int) -> float:
    """Compute PHI-decayed learning rate."""
    decay = PHI ** (-beat / LEARNING_RATE_DECAY_TAU)
    rate = base_rate * decay
    return max(MIN_LEARNING_RATE, min(MAX_LEARNING_RATE, rate))


def hebbian_update(
    synapse: Synapse,
    state: PrometheusState
) -> float:
    """Compute Hebbian weight update: Δw = pre × post × PHI × lr."""
    if not synapse.is_plastic:
        return 0.0
    
    pre = state.neurons[synapse.source_id].activation
    post = state.neurons[synapse.target_id].activation
    
    # LTP if both active, LTD if mismatch
    if pre > LTP_THRESHOLD and post > LTP_THRESHOLD:
        delta = pre * post * HEBBIAN_COEFFICIENT * synapse.learning_rate
    elif pre > LTP_THRESHOLD and post < LTD_THRESHOLD:
        delta = -pre * (1 - post) * HEBBIAN_COEFFICIENT * synapse.learning_rate * PHI_INV
    elif pre < LTD_THRESHOLD and post > LTP_THRESHOLD:
        delta = -(1 - pre) * post * HEBBIAN_COEFFICIENT * synapse.learning_rate * PHI_INV
    else:
        delta = 0.0
    
    return delta


def backprop_update(
    synapse: Synapse,
    state: PrometheusState,
    targets: List[float]
) -> float:
    """Compute backpropagation weight update."""
    if not synapse.is_plastic:
        return 0.0
    
    target_neuron = state.neurons[synapse.target_id]
    source_neuron = state.neurons[synapse.source_id]
    
    # For output layer, compute error directly
    if target_neuron.layer == len(state.layers) - 1:
        target_idx = state.layers[-1].index(synapse.target_id)
        if target_idx < len(targets):
            error = targets[target_idx] - target_neuron.activation
            target_neuron.error_gradient = error * activate_derivative(target_neuron.activation, target_neuron.activation_fn)
    
    # Compute gradient descent update
    delta = synapse.learning_rate * target_neuron.error_gradient * source_neuron.activation
    
    # Propagate error to source (for hidden layers)
    if source_neuron.layer > 0:
        source_neuron.error_gradient += synapse.weight * target_neuron.error_gradient
    
    return delta


def reinforcement_update(
    synapse: Synapse,
    state: PrometheusState,
    reward: float
) -> float:
    """Compute reinforcement learning weight update."""
    if not synapse.is_plastic:
        return 0.0
    
    # Reward relative to baseline
    advantage = reward - state.baseline_coherence
    
    # Scale by PHI and activity
    pre = state.neurons[synapse.source_id].activation
    post = state.neurons[synapse.target_id].activation
    
    eligibility = pre * post  # Eligibility trace
    delta = synapse.learning_rate * advantage * eligibility * REWARD_SCALE
    
    return delta


def apply_weight_updates(
    deltas: Dict[str, float],
    state: PrometheusState,
    doctrine_gate: float
) -> PrometheusState:
    """Apply weight updates with doctrine gating."""
    total_delta = 0.0
    
    for synapse_id, delta in deltas.items():
        if synapse_id in state.synapses:
            synapse = state.synapses[synapse_id]
            
            # Gate by doctrine compliance
            gated_delta = delta * doctrine_gate * PHI_INV
            
            # Apply momentum
            momentum_delta = state.momentum * synapse.cumulative_delta + (1 - state.momentum) * gated_delta
            
            # Update weight
            new_weight = synapse.weight + momentum_delta
            synapse.weight = clamp_weight(new_weight)
            
            # Update synapse state
            synapse.cumulative_delta = gated_delta
            synapse.last_updated = state.current_beat
            synapse.update_count += 1
            
            total_delta += abs(gated_delta)
    
    state.total_weight_updates += len(deltas)
    
    return state


# ═══════════════════════════════════════════════════════════════════════
# VII. TRAINING LOOP
# ═══════════════════════════════════════════════════════════════════════

def train_step(
    inputs: List[float],
    signal: LearningSignal,
    state: PrometheusState
) -> Tuple[List[float], LearningMetrics, PrometheusState]:
    """Execute one training step."""
    state.current_beat = signal.beat
    state.total_examples_seen += 1
    
    # Forward pass
    outputs = forward_pass(inputs, state)
    
    # Compute updates based on learning mode
    deltas: Dict[str, float] = {}
    
    if state.learning_mode == LearningMode.FROZEN:
        # No learning
        pass
    
    elif state.learning_mode == LearningMode.HEBBIAN:
        for synapse_id, synapse in state.synapses.items():
            deltas[synapse_id] = hebbian_update(synapse, state)
    
    elif state.learning_mode == LearningMode.BACKPROP:
        if signal.target_output:
            # Reset gradients
            for neuron in state.neurons.values():
                neuron.error_gradient = 0.0
            
            # Backpropagate from output to input
            for layer_idx in range(len(state.layers) - 1, 0, -1):
                for neuron_id in state.layers[layer_idx]:
                    neuron = state.neurons[neuron_id]
                    for synapse_id in neuron.input_synapses:
                        synapse = state.synapses[synapse_id]
                        deltas[synapse_id] = backprop_update(synapse, state, signal.target_output)
    
    elif state.learning_mode == LearningMode.REINFORCEMENT:
        if signal.reward is not None:
            for synapse_id, synapse in state.synapses.items():
                deltas[synapse_id] = reinforcement_update(synapse, state, signal.reward)
    
    elif state.learning_mode == LearningMode.COMBINED:
        # Combine all learning signals
        for synapse_id, synapse in state.synapses.items():
            heb_delta = hebbian_update(synapse, state) * 0.3
            
            bp_delta = 0.0
            if signal.target_output:
                bp_delta = backprop_update(synapse, state, signal.target_output) * 0.4
            
            rl_delta = 0.0
            if signal.reward is not None:
                rl_delta = reinforcement_update(synapse, state, signal.reward) * 0.3
            
            deltas[synapse_id] = heb_delta + bp_delta + rl_delta
    
    # Compute doctrine gate
    doctrine_gate = signal.doctrine_score / S_CEIL
    
    # Apply updates
    state = apply_weight_updates(deltas, state, doctrine_gate)
    
    # Update learning rate
    state.learning_rate = compute_learning_rate(BASE_LEARNING_RATE, state.current_beat)
    
    # Compute metrics
    loss = 0.0
    if signal.target_output:
        for i, (out, target) in enumerate(zip(outputs, signal.target_output)):
            loss += (out - target) ** 2
        loss /= len(outputs) if outputs else 1
    
    doctrine_loss = abs(signal.doctrine_score - state.doctrine_coherence) / S_CEIL
    
    avg_delta = sum(abs(d) for d in deltas.values()) / len(deltas) if deltas else 0.0
    
    coherence_gain = signal.coherence - state.baseline_coherence
    
    metrics = LearningMetrics(
        total_updates=len(deltas),
        average_delta=avg_delta,
        loss=loss,
        doctrine_loss=doctrine_loss,
        coherence_gain=coherence_gain,
        learning_rate_current=state.learning_rate
    )
    
    state.metrics_history.append(metrics)
    state.metrics_history = state.metrics_history[-100:]  # Keep last 100
    
    # Update baseline coherence (exponential moving average)
    alpha = 0.01
    state.baseline_coherence = (1 - alpha) * state.baseline_coherence + alpha * signal.coherence
    state.doctrine_coherence = clamp_sovereign(
        state.doctrine_coherence * PHI_INV + signal.doctrine_score * (1 - PHI_INV)
    )
    
    return outputs, metrics, state


# ═══════════════════════════════════════════════════════════════════════
# VIII. HEARTBEAT EXECUTION
# ═══════════════════════════════════════════════════════════════════════

def heartbeat(state: PrometheusState, doctrine_score: float) -> PrometheusState:
    """Execute one PROMETHEUS heartbeat cycle."""
    state.current_beat += 1
    
    # Decay learning rate
    state.learning_rate = compute_learning_rate(BASE_LEARNING_RATE, state.current_beat)
    
    # Update doctrine coherence
    state.doctrine_coherence = clamp_sovereign(
        state.doctrine_coherence * PHI_INV + doctrine_score * (1 - PHI_INV)
    )
    
    return state


def execute_prometheus(
    inputs: List[float],
    signal: LearningSignal,
    state: PrometheusState
) -> Tuple[List[float], LearningMetrics, PrometheusState]:
    """Execute PROMETHEUS learning step."""
    return train_step(inputs, signal, state)


# ═══════════════════════════════════════════════════════════════════════
# IX. USAGE EXAMPLE
# ═══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    """
    Example usage:
    
    # Initialize with network architecture
    prometheus = init_prometheus_state([13, 21, 13, 7])
    
    # Every 873ms beat
    for beat in range(1000):
        # Get current signals (13-dimensional input)
        inputs = [0.8, 0.9, 0.75, 0.82, 0.91, 0.78, 0.85, 0.88, 0.79, 0.86, 0.81, 0.84, 0.87]
        
        # Create learning signal
        signal = LearningSignal(
            signal_type=LearningMode.COMBINED,
            target_output=[0.85, 0.90, 0.80, 0.85, 0.88, 0.82, 0.87],  # 7 targets
            reward=0.8,  # Positive reward
            doctrine_score=8.5,
            coherence=0.85,
            beat=beat
        )
        
        # Execute learning step
        outputs, metrics, prometheus = execute_prometheus(inputs, signal, prometheus)
        
        print(f"Beat {beat}")
        print(f"  Loss: {metrics.loss:.4f}")
        print(f"  Avg Delta: {metrics.average_delta:.6f}")
        print(f"  Learning Rate: {metrics.learning_rate_current:.6f}")
        print(f"  Coherence Gain: {metrics.coherence_gain:.4f}")
    """
    # Quick test
    prometheus = init_prometheus_state([13, 21, 13, 7])
    
    inputs = [0.8, 0.9, 0.75, 0.82, 0.91, 0.78, 0.85, 0.88, 0.79, 0.86, 0.81, 0.84, 0.87]
    signal = LearningSignal(
        signal_type=LearningMode.COMBINED,
        target_output=[0.85, 0.90, 0.80, 0.85, 0.88, 0.82, 0.87],
        reward=0.8,
        doctrine_score=8.5,
        coherence=0.85,
        beat=0
    )
    
    outputs, metrics, prometheus = execute_prometheus(inputs, signal, prometheus)
    
    print(f"Network: {len(prometheus.neurons)} neurons, {len(prometheus.synapses)} synapses")
    print(f"Outputs: {[f'{o:.3f}' for o in outputs]}")
    print(f"Loss: {metrics.loss:.4f}")
    print(f"Learning Rate: {metrics.learning_rate_current:.6f}")
