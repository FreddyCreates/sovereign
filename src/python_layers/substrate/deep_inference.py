"""
DEEP INFERENCE — Deep Learning Inference Pipeline
Connects to Julia substrate for mathematical inference operations

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML/AI orchestration layer)

Purpose: DEEP_INFERENCE provides:
    - Neural network inference with PHI-weighted activations
    - Kuramoto-inspired attention mechanisms
    - Hebbian-style adaptive learning
    - Integration with Julia DeepMath substrate

Mathematical Model:
    attention_weight = softmax(Q × K^T / sqrt(d_k)) × PHI
    inference_score = Σ(layer_output × PHI^layer) / normalization
    coherence = 1 - variance(outputs) / mean(outputs)
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple, Any
from enum import Enum
import math

# Import shared constants from organism_bus
from .organism_bus import (
    PHI, PHI_INV, PHI_SQ, PI, S0_FLOOR, S_CEIL,
    FIBONACCI, SOLFEGGIO, ATTRIBUTION,
    clamp, clamp_sovereign, geometric_mean, phi_weighted_average
)


# ═══════════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════

# Inference constants
MAX_LAYERS = 12
LEARNING_RATE = 0.01 * PHI_INV
LTP_THRESHOLD = PHI_INV
LTD_THRESHOLD = 0.3
ATTENTION_HEADS = 8


# ═══════════════════════════════════════════════════════════════════════════
# II. TENSOR OPERATIONS
# ═══════════════════════════════════════════════════════════════════════════

def matrix_multiply(A: List[List[float]], B: List[List[float]]) -> List[List[float]]:
    """Simple matrix multiplication."""
    if not A or not B or not A[0]:
        return []
    
    rows_A, cols_A = len(A), len(A[0])
    rows_B, cols_B = len(B), len(B[0])
    
    if cols_A != rows_B:
        return []
    
    result = [[0.0 for _ in range(cols_B)] for _ in range(rows_A)]
    
    for i in range(rows_A):
        for j in range(cols_B):
            for k in range(cols_A):
                result[i][j] += A[i][k] * B[k][j]
    
    return result


def transpose(M: List[List[float]]) -> List[List[float]]:
    """Transpose a matrix."""
    if not M:
        return []
    rows, cols = len(M), len(M[0])
    return [[M[i][j] for i in range(rows)] for j in range(cols)]


def softmax(values: List[float]) -> List[float]:
    """Compute softmax of values."""
    if not values:
        return []
    
    max_val = max(values)
    exp_values = [math.exp(v - max_val) for v in values]
    sum_exp = sum(exp_values)
    
    return [e / sum_exp for e in exp_values]


def phi_sigmoid(x: float) -> float:
    """Sigmoid activation with PHI scaling."""
    return 1.0 / (1.0 + math.exp(-PHI * x))


def relu(x: float) -> float:
    """ReLU activation."""
    return max(0.0, x)


def phi_gelu(x: float) -> float:
    """GELU approximation with PHI scaling."""
    return 0.5 * x * (1 + math.tanh(math.sqrt(2 / PI) * (x + 0.044715 * x**3 * PHI)))


# ═══════════════════════════════════════════════════════════════════════════
# III. ATTENTION MECHANISM
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class AttentionHead:
    """A single attention head."""
    id: int
    dimension: int
    
    # Weight matrices
    W_q: List[List[float]] = field(default_factory=list)
    W_k: List[List[float]] = field(default_factory=list)
    W_v: List[List[float]] = field(default_factory=list)
    
    # State
    attention_weights: List[List[float]] = field(default_factory=list)
    output: List[float] = field(default_factory=list)
    coherence: float = 0.5
    
    def __post_init__(self):
        """Initialize weight matrices."""
        if not self.W_q:
            self._init_weights()
    
    def _init_weights(self):
        """Initialize weights with PHI-based values."""
        d = self.dimension
        # Initialize with small PHI-modulated values
        self.W_q = [[0.1 * math.sin(i * PHI + j * PHI_INV) for j in range(d)] for i in range(d)]
        self.W_k = [[0.1 * math.cos(i * PHI + j * PHI_INV) for j in range(d)] for i in range(d)]
        self.W_v = [[0.1 * math.sin(i * PHI_INV + j * PHI) for j in range(d)] for i in range(d)]


@dataclass
class MultiHeadAttention:
    """Multi-head attention mechanism."""
    num_heads: int
    dimension: int
    heads: List[AttentionHead] = field(default_factory=list)
    output: List[float] = field(default_factory=list)
    coherence: float = 0.5
    
    def __post_init__(self):
        """Initialize attention heads."""
        if not self.heads:
            head_dim = max(1, self.dimension // self.num_heads)
            self.heads = [
                AttentionHead(i, head_dim)
                for i in range(self.num_heads)
            ]


def compute_attention(
    query: List[float],
    keys: List[List[float]],
    values: List[List[float]],
    head: AttentionHead
) -> Tuple[List[float], List[float]]:
    """Compute scaled dot-product attention."""
    d_k = len(query) if query else 1
    scale = math.sqrt(d_k) * PHI_INV  # PHI-scaled
    
    # Q × K^T / sqrt(d_k)
    scores = []
    for key in keys:
        dot_product = sum(q * k for q, k in zip(query, key))
        scores.append(dot_product / scale)
    
    # Softmax
    attention_weights = softmax(scores)
    
    # Weighted sum of values
    output = [0.0] * len(values[0]) if values and values[0] else []
    for i, weight in enumerate(attention_weights):
        if i < len(values):
            for j, v in enumerate(values[i]):
                if j < len(output):
                    output[j] += weight * v
    
    return output, attention_weights


def multi_head_attention_forward(
    mha: MultiHeadAttention,
    query: List[float],
    keys: List[List[float]],
    values: List[List[float]]
) -> List[float]:
    """Forward pass through multi-head attention."""
    head_outputs = []
    
    for head in mha.heads:
        output, weights = compute_attention(query, keys, values, head)
        head_outputs.append(output)
        head.output = output
        head.attention_weights = [weights]
        
        # Compute head coherence
        if weights:
            mean_w = sum(weights) / len(weights)
            var_w = sum((w - mean_w)**2 for w in weights) / len(weights)
            head.coherence = 1 - min(math.sqrt(var_w) / max(mean_w, 0.001), 1.0)
    
    # Concatenate head outputs
    mha.output = []
    for head_out in head_outputs:
        mha.output.extend(head_out)
    
    # Global coherence
    mha.coherence = geometric_mean([h.coherence for h in mha.heads])
    
    return mha.output


# ═══════════════════════════════════════════════════════════════════════════
# IV. INFERENCE LAYER
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class InferenceLayer:
    """A single inference layer."""
    id: int
    input_dim: int
    output_dim: int
    activation: str = "phi_sigmoid"  # "phi_sigmoid", "relu", "phi_gelu"
    
    # Weights and biases
    weights: List[List[float]] = field(default_factory=list)
    biases: List[float] = field(default_factory=list)
    
    # State
    output: List[float] = field(default_factory=list)
    coherence: float = 0.5
    phi_resonance: float = PHI_INV
    
    # Hebbian state
    eligibility_traces: List[List[float]] = field(default_factory=list)
    ltp_strength: float = 0.5
    ltd_strength: float = 0.5
    
    def __post_init__(self):
        """Initialize weights."""
        if not self.weights:
            self._init_weights()
    
    def _init_weights(self):
        """Initialize weights with PHI-based values."""
        # Xavier initialization with PHI scaling
        scale = math.sqrt(2.0 / (self.input_dim + self.output_dim)) * PHI_INV
        
        self.weights = [
            [scale * math.sin(i * PHI + j * PHI_INV) for j in range(self.input_dim)]
            for i in range(self.output_dim)
        ]
        self.biases = [0.0 for _ in range(self.output_dim)]
        self.eligibility_traces = [
            [0.0 for _ in range(self.input_dim)]
            for _ in range(self.output_dim)
        ]


def layer_forward(layer: InferenceLayer, input_vec: List[float]) -> List[float]:
    """Forward pass through inference layer."""
    output = []
    
    for i in range(layer.output_dim):
        # Weighted sum
        weighted_sum = layer.biases[i]
        for j in range(min(len(input_vec), layer.input_dim)):
            weighted_sum += layer.weights[i][j] * input_vec[j]
        
        # Activation
        if layer.activation == "relu":
            activated = relu(weighted_sum)
        elif layer.activation == "phi_gelu":
            activated = phi_gelu(weighted_sum)
        else:  # phi_sigmoid
            activated = phi_sigmoid(weighted_sum)
        
        output.append(activated)
    
    layer.output = output
    
    # Compute coherence
    if output:
        mean_out = sum(output) / len(output)
        if mean_out > 0.001:
            var_out = sum((o - mean_out)**2 for o in output) / len(output)
            layer.coherence = 1 - min(math.sqrt(var_out) / mean_out, 1.0)
        else:
            layer.coherence = 0.5
    
    # PHI resonance from output pattern
    layer.phi_resonance = 0.0
    for i, o in enumerate(output):
        layer.phi_resonance += o * (PHI ** (-(i + 1) / len(output)))
    layer.phi_resonance = clamp(layer.phi_resonance / max(len(output), 1), 0, 1)
    
    return output


def hebbian_update(
    layer: InferenceLayer,
    input_vec: List[float],
    learning_rate: float = LEARNING_RATE
):
    """Apply Hebbian learning update."""
    if not layer.output or not input_vec:
        return
    
    for i in range(layer.output_dim):
        post = layer.output[i]
        for j in range(min(len(input_vec), layer.input_dim)):
            pre = input_vec[j]
            w = layer.weights[i][j]
            
            # Update eligibility trace
            layer.eligibility_traces[i][j] *= (1 - 0.01)
            layer.eligibility_traces[i][j] += pre * post * PHI_INV
            layer.eligibility_traces[i][j] = clamp(layer.eligibility_traces[i][j], 0, 1)
            
            # Oja's rule
            oja_term = pre * post - post * post * w
            
            # LTP/LTD
            if pre > LTP_THRESHOLD and post > LTP_THRESHOLD:
                delta = learning_rate * oja_term * layer.ltp_strength
                layer.ltp_strength = min(layer.ltp_strength + 0.01, 1.0)
            elif pre < LTD_THRESHOLD or post < LTD_THRESHOLD:
                delta = -learning_rate * 0.5 * w * layer.ltd_strength
                layer.ltd_strength = min(layer.ltd_strength + 0.005, 1.0)
            else:
                delta = learning_rate * oja_term * 0.5
            
            layer.weights[i][j] = clamp(w + delta, -1.0, 1.0)


# ═══════════════════════════════════════════════════════════════════════════
# V. INFERENCE NETWORK
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class InferenceNetwork:
    """Complete inference network."""
    layers: List[InferenceLayer] = field(default_factory=list)
    attention: Optional[MultiHeadAttention] = None
    
    # State
    output: List[float] = field(default_factory=list)
    coherence: float = 0.5
    phi_resonance: float = PHI_INV
    
    # Statistics
    inference_count: int = 0
    learning_count: int = 0
    beat_count: int = 0


def create_inference_network(
    layer_dims: List[Tuple[int, int]],
    use_attention: bool = True,
    attention_heads: int = ATTENTION_HEADS
) -> InferenceNetwork:
    """Create an inference network with specified layer dimensions."""
    layers = []
    for i, (in_dim, out_dim) in enumerate(layer_dims):
        activation = "phi_gelu" if i < len(layer_dims) - 1 else "phi_sigmoid"
        layers.append(InferenceLayer(i, in_dim, out_dim, activation))
    
    attention = None
    if use_attention and layers:
        attention_dim = layers[0].output_dim
        attention = MultiHeadAttention(attention_heads, attention_dim)
    
    return InferenceNetwork(layers=layers, attention=attention)


def network_forward(
    network: InferenceNetwork,
    input_vec: List[float],
    apply_attention: bool = True
) -> List[float]:
    """Forward pass through network."""
    if not network.layers:
        return input_vec
    
    current = input_vec
    
    for layer in network.layers:
        current = layer_forward(layer, current)
    
    # Apply attention if enabled
    if apply_attention and network.attention and current:
        keys = [current]  # Self-attention
        values = [current]
        current = multi_head_attention_forward(
            network.attention, current, keys, values
        )
    
    network.output = current
    network.inference_count += 1
    
    # Compute network coherence
    layer_coherences = [l.coherence for l in network.layers]
    if network.attention:
        layer_coherences.append(network.attention.coherence)
    network.coherence = geometric_mean(layer_coherences)
    
    # PHI resonance
    layer_resonances = [l.phi_resonance for l in network.layers]
    network.phi_resonance = phi_weighted_average(layer_resonances)
    
    return current


def network_learn(network: InferenceNetwork, input_vec: List[float]):
    """Apply Hebbian learning across network."""
    if not network.layers:
        return
    
    current = input_vec
    
    for layer in network.layers:
        layer_forward(layer, current)
        hebbian_update(layer, current)
        current = layer.output
    
    network.learning_count += 1


# ═══════════════════════════════════════════════════════════════════════════
# VI. DEEP INFERENCE STATE
# ═══════════════════════════════════════════════════════════════════════════

@dataclass
class DeepInferenceState:
    """Complete deep inference state."""
    network: InferenceNetwork = field(default_factory=lambda: create_inference_network([
        (64, 128), (128, 256), (256, 128), (128, 64)
    ]))
    
    # Global metrics
    global_coherence: float = 0.5
    global_resonance: float = PHI_INV
    health_score: float = 1.0
    
    # Statistics
    total_inferences: int = 0
    total_learning_steps: int = 0
    beat_count: int = 0
    last_update_beat: int = 0


def advance_deep_inference(state: DeepInferenceState, input_vec: Optional[List[float]] = None) -> DeepInferenceState:
    """Advance deep inference by one beat."""
    state.beat_count += 1
    state.network.beat_count = state.beat_count
    
    # Generate input if not provided
    if input_vec is None:
        input_dim = state.network.layers[0].input_dim if state.network.layers else 64
        input_vec = [
            0.5 + 0.3 * math.sin(i * PHI + state.beat_count * PHI_INV)
            for i in range(input_dim)
        ]
    
    # Forward pass
    output = network_forward(state.network, input_vec)
    state.total_inferences += 1
    
    # Learning step (every 3 beats)
    if state.beat_count % 3 == 0:
        network_learn(state.network, input_vec)
        state.total_learning_steps += 1
    
    # Update global metrics
    state.global_coherence = state.network.coherence
    state.global_resonance = state.network.phi_resonance
    
    # Health from layer coherences
    if state.network.layers:
        min_coh = min(l.coherence for l in state.network.layers)
        state.health_score = min_coh * state.global_coherence
    
    state.last_update_beat = state.beat_count
    return state


def get_deep_inference_summary(state: DeepInferenceState) -> Dict[str, Any]:
    """Get summary of deep inference state."""
    layer_summaries = []
    for layer in state.network.layers:
        layer_summaries.append({
            "id": layer.id,
            "input_dim": layer.input_dim,
            "output_dim": layer.output_dim,
            "activation": layer.activation,
            "coherence": layer.coherence,
            "phi_resonance": layer.phi_resonance,
            "ltp_strength": layer.ltp_strength,
            "ltd_strength": layer.ltd_strength
        })
    
    attention_summary = None
    if state.network.attention:
        attention_summary = {
            "num_heads": state.network.attention.num_heads,
            "dimension": state.network.attention.dimension,
            "coherence": state.network.attention.coherence
        }
    
    return {
        "name": "DeepInference",
        "layer_count": len(state.network.layers),
        "global_coherence": state.global_coherence,
        "global_resonance": state.global_resonance,
        "health_score": state.health_score,
        "total_inferences": state.total_inferences,
        "total_learning_steps": state.total_learning_steps,
        "beat_count": state.beat_count,
        "layers": layer_summaries,
        "attention": attention_summary,
        "attribution": ATTRIBUTION
    }


# ═══════════════════════════════════════════════════════════════════════════
# VII. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════════

def init_deep_inference() -> DeepInferenceState:
    """Initialize deep inference state."""
    return DeepInferenceState()


# Module test
if __name__ == "__main__":
    print(f"DeepInference initialized - PHI={PHI:.10f}")
    state = init_deep_inference()
    
    # Run a few beats
    for i in range(10):
        state = advance_deep_inference(state)
    
    summary = get_deep_inference_summary(state)
    print(f"After 10 beats:")
    print(f"  Global coherence: {summary['global_coherence']:.4f}")
    print(f"  Global resonance: {summary['global_resonance']:.4f}")
    print(f"  Health score: {summary['health_score']:.4f}")
    print(f"  Total inferences: {summary['total_inferences']}")
    print(f"  Learning steps: {summary['total_learning_steps']}")
    print(f"  Attribution: {summary['attribution']}")
