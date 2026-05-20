"""
SOPHIA - The Wisdom Layer
ΣΟΦΙΑ (Greek) | Sapientia (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML/AI orchestration for wisdom synthesis)
Domain: Model orchestration, inference routing, wisdom aggregation,
        multi-model consensus, doctrine-aligned reasoning

Purpose: SOPHIA orchestrates multiple AI/ML models to produce
         doctrine-aligned wisdom. Not a single model — a symphony of models
         that must achieve consensus before any wisdom is emitted.

         The name SOPHIA = "wisdom" in Greek.
         Wisdom is not information — it's aligned understanding.

Mathematical Model:
    model_consensus = Π(model_i.confidence) ^ (1/n) × doctrine_alignment
    wisdom_score = consensus × coherence × phi_resonance
    routing_weight = model_accuracy × 1/latency × doctrine_fit
    aggregation = weighted_sum(model_outputs) normalized by doctrine

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple, Callable
from enum import Enum
import math
from datetime import datetime

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI  # ≈ 0.6180339887
S0_FLOOR = 0.75
S_CEIL = 9.75

# Model orchestration constants
MAX_MODELS = 13  # PHI-bounded
CONSENSUS_THRESHOLD = 0.618  # PHI^(-1)
MIN_MODEL_CONFIDENCE = S0_FLOOR
ROUTING_LATENCY_WEIGHT = 0.3
ROUTING_ACCURACY_WEIGHT = 0.4
ROUTING_DOCTRINE_WEIGHT = 0.3

# Attribution
ATTRIBUTION = "Alfredo Medina Hernandez"


# ═══════════════════════════════════════════════════════════════════════
# II. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

def clamp_sovereign(value: float) -> float:
    """Clamp value to sovereign range [S0_FLOOR, S_CEIL]."""
    return max(S0_FLOOR, min(S_CEIL, value))


class ModelType(Enum):
    """Types of models that can be orchestrated."""
    REASONING = "reasoning"
    CREATIVE = "creative"
    ANALYTICAL = "analytical"
    EMPATHETIC = "empathetic"
    ETHICAL = "ethical"
    PREDICTIVE = "predictive"
    SYNTHESIS = "synthesis"


class RoutingStrategy(Enum):
    """Strategies for routing queries to models."""
    ROUND_ROBIN = "round_robin"
    WEIGHTED = "weighted"
    CONSENSUS = "consensus"
    SPECIALIST = "specialist"
    ENSEMBLE = "ensemble"


@dataclass
class ModelCapability:
    """Describes what a model can do."""
    name: str
    model_type: ModelType
    accuracy: float  # [0, 1]
    latency_ms: float
    doctrine_alignment: float  # [S0_FLOOR, S_CEIL]
    domains: List[str]
    max_tokens: int
    is_active: bool = True


@dataclass
class ModelOutput:
    """Output from a single model."""
    model_name: str
    content: str
    confidence: float  # [0, 1]
    reasoning_trace: List[str]
    doctrine_score: float  # [S0_FLOOR, S_CEIL]
    latency_ms: float
    token_count: int
    timestamp: datetime = field(default_factory=datetime.now)


@dataclass
class WisdomQuery:
    """A query seeking wisdom."""
    query_id: str
    content: str
    context: Dict[str, str]
    required_consensus: float  # Minimum consensus needed
    max_latency_ms: float
    priority: int  # 1-7 (Fibonacci-based)
    doctrine_context: str


@dataclass
class WisdomResponse:
    """Aggregated wisdom response."""
    query_id: str
    wisdom: str
    consensus_score: float  # Geometric mean of confidences
    doctrine_alignment: float  # [S0_FLOOR, S_CEIL]
    phi_resonance: float  # PHI-harmonic measure
    contributing_models: List[str]
    model_outputs: List[ModelOutput]
    aggregation_strategy: str
    total_latency_ms: float
    wisdom_score: float  # Final wisdom quality score
    attribution: str = ATTRIBUTION


@dataclass
class RoutingDecision:
    """Decision about which models to route to."""
    selected_models: List[str]
    weights: Dict[str, float]
    strategy: RoutingStrategy
    expected_latency_ms: float
    expected_accuracy: float


@dataclass
class SophiaState:
    """Complete state of the SOPHIA wisdom layer."""
    models: Dict[str, ModelCapability]
    routing_history: List[RoutingDecision]
    wisdom_history: List[WisdomResponse]
    current_beat: int
    total_queries: int
    total_wisdom_generated: int
    average_consensus: float
    average_wisdom_score: float
    doctrine_coherence: float
    attribution: str = ATTRIBUTION


# ═══════════════════════════════════════════════════════════════════════
# III. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

def init_model_capability(
    name: str,
    model_type: ModelType,
    accuracy: float = 0.8,
    latency_ms: float = 100.0,
    doctrine_alignment: float = S0_FLOOR,
    domains: Optional[List[str]] = None
) -> ModelCapability:
    """Initialize a model capability."""
    return ModelCapability(
        name=name,
        model_type=model_type,
        accuracy=max(0.0, min(1.0, accuracy)),
        latency_ms=max(10.0, latency_ms),
        doctrine_alignment=clamp_sovereign(doctrine_alignment),
        domains=domains or ["general"],
        max_tokens=4096,
        is_active=True
    )


def init_sophia_state() -> SophiaState:
    """Initialize SOPHIA with default models."""
    # Create default model ensemble
    models = {
        "LOGOS": init_model_capability("LOGOS", ModelType.REASONING, 0.9, 150.0, 9.0, ["logic", "proof"]),
        "POIESIS": init_model_capability("POIESIS", ModelType.CREATIVE, 0.85, 200.0, 8.5, ["art", "narrative"]),
        "NOUS": init_model_capability("NOUS", ModelType.ANALYTICAL, 0.92, 100.0, 9.2, ["analysis", "data"]),
        "PATHOS": init_model_capability("PATHOS", ModelType.EMPATHETIC, 0.88, 120.0, 8.0, ["emotion", "support"]),
        "ETHOS": init_model_capability("ETHOS", ModelType.ETHICAL, 0.95, 80.0, 9.5, ["ethics", "doctrine"]),
        "MANTIS": init_model_capability("MANTIS", ModelType.PREDICTIVE, 0.82, 180.0, 8.2, ["forecast", "risk"]),
        "SYNESIS": init_model_capability("SYNESIS", ModelType.SYNTHESIS, 0.87, 130.0, 8.8, ["integration", "summary"]),
    }
    
    return SophiaState(
        models=models,
        routing_history=[],
        wisdom_history=[],
        current_beat=0,
        total_queries=0,
        total_wisdom_generated=0,
        average_consensus=S0_FLOOR,
        average_wisdom_score=S0_FLOOR,
        doctrine_coherence=S0_FLOOR
    )


# ═══════════════════════════════════════════════════════════════════════
# IV. ROUTING FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def compute_routing_score(model: ModelCapability) -> float:
    """Compute routing priority score for a model."""
    if not model.is_active:
        return 0.0
    
    # Inverse latency (faster = better)
    latency_score = 1.0 / (1.0 + model.latency_ms / 1000.0)
    
    # Combined score with doctrine emphasis
    score = (
        ROUTING_ACCURACY_WEIGHT * model.accuracy +
        ROUTING_LATENCY_WEIGHT * latency_score +
        ROUTING_DOCTRINE_WEIGHT * (model.doctrine_alignment / S_CEIL)
    )
    
    return score * PHI_INV  # Scale by PHI^(-1)


def select_models_for_query(
    query: WisdomQuery,
    state: SophiaState,
    strategy: RoutingStrategy
) -> RoutingDecision:
    """Select which models to route a query to."""
    active_models = [m for m in state.models.values() if m.is_active]
    
    if strategy == RoutingStrategy.ROUND_ROBIN:
        # Cycle through models based on query count
        idx = state.total_queries % len(active_models)
        selected = [active_models[idx].name]
        weights = {selected[0]: 1.0}
        
    elif strategy == RoutingStrategy.SPECIALIST:
        # Find best model for query domains
        best_model = max(active_models, key=lambda m: compute_routing_score(m))
        selected = [best_model.name]
        weights = {best_model.name: 1.0}
        
    elif strategy == RoutingStrategy.ENSEMBLE:
        # Use all active models with weighted voting
        selected = [m.name for m in active_models]
        total_score = sum(compute_routing_score(m) for m in active_models)
        weights = {
            m.name: compute_routing_score(m) / total_score if total_score > 0 else 1.0 / len(active_models)
            for m in active_models
        }
        
    elif strategy == RoutingStrategy.CONSENSUS:
        # Select top models that can achieve consensus
        scored = sorted(active_models, key=compute_routing_score, reverse=True)
        # Take top 3-5 models for consensus
        n_models = min(5, max(3, len(scored)))
        selected = [m.name for m in scored[:n_models]]
        weights = {name: 1.0 / n_models for name in selected}
        
    else:  # WEIGHTED
        # Weight by routing score
        selected = [m.name for m in active_models]
        total_score = sum(compute_routing_score(m) for m in active_models)
        weights = {
            m.name: compute_routing_score(m) / total_score if total_score > 0 else 1.0 / len(active_models)
            for m in active_models
        }
    
    # Compute expected metrics
    selected_models = [state.models[name] for name in selected]
    expected_latency = max(m.latency_ms for m in selected_models) if selected_models else 0.0
    expected_accuracy = sum(m.accuracy * weights.get(m.name, 0) for m in selected_models)
    
    return RoutingDecision(
        selected_models=selected,
        weights=weights,
        strategy=strategy,
        expected_latency_ms=expected_latency,
        expected_accuracy=expected_accuracy
    )


# ═══════════════════════════════════════════════════════════════════════
# V. AGGREGATION FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def compute_consensus(outputs: List[ModelOutput]) -> float:
    """Compute consensus score (geometric mean of confidences)."""
    if not outputs:
        return 0.0
    
    # Geometric mean of confidences
    product = 1.0
    for output in outputs:
        product *= max(0.01, output.confidence)  # Avoid zero
    
    geometric_mean = product ** (1.0 / len(outputs))
    return geometric_mean


def compute_doctrine_alignment(outputs: List[ModelOutput]) -> float:
    """Compute overall doctrine alignment."""
    if not outputs:
        return S0_FLOOR
    
    # Weighted average by confidence
    total_weight = sum(o.confidence for o in outputs)
    if total_weight < 0.01:
        return S0_FLOOR
    
    weighted_sum = sum(o.doctrine_score * o.confidence for o in outputs)
    return clamp_sovereign(weighted_sum / total_weight)


def compute_phi_resonance(outputs: List[ModelOutput]) -> float:
    """Compute PHI-harmonic resonance across outputs."""
    if len(outputs) < 2:
        return S0_FLOOR
    
    # Check if confidence ratios approach PHI
    confidences = sorted([o.confidence for o in outputs], reverse=True)
    
    resonance_scores = []
    for i in range(len(confidences) - 1):
        if confidences[i + 1] > 0.01:
            ratio = confidences[i] / confidences[i + 1]
            # How close is ratio to PHI?
            phi_distance = abs(ratio - PHI)
            resonance = math.exp(-phi_distance * PHI)
            resonance_scores.append(resonance)
    
    if not resonance_scores:
        return S0_FLOOR
    
    avg_resonance = sum(resonance_scores) / len(resonance_scores)
    return clamp_sovereign(avg_resonance * PHI + S0_FLOOR)


def aggregate_wisdom(
    outputs: List[ModelOutput],
    weights: Dict[str, float],
    query: WisdomQuery
) -> WisdomResponse:
    """Aggregate multiple model outputs into unified wisdom."""
    if not outputs:
        return WisdomResponse(
            query_id=query.query_id,
            wisdom="No wisdom available - no model outputs received.",
            consensus_score=0.0,
            doctrine_alignment=S0_FLOOR,
            phi_resonance=S0_FLOOR,
            contributing_models=[],
            model_outputs=[],
            aggregation_strategy="none",
            total_latency_ms=0.0,
            wisdom_score=0.0
        )
    
    # Compute metrics
    consensus = compute_consensus(outputs)
    doctrine = compute_doctrine_alignment(outputs)
    resonance = compute_phi_resonance(outputs)
    
    # Compute wisdom score
    wisdom_score = clamp_sovereign(consensus * doctrine * resonance * PHI / S_CEIL)
    
    # Aggregate content (weighted by confidence × weight)
    aggregated_parts = []
    for output in sorted(outputs, key=lambda o: o.confidence * weights.get(o.model_name, 1.0), reverse=True):
        if output.confidence >= MIN_MODEL_CONFIDENCE / S_CEIL:
            aggregated_parts.append(f"[{output.model_name}]: {output.content}")
    
    wisdom_text = "\n\n".join(aggregated_parts) if aggregated_parts else "Insufficient confidence for wisdom synthesis."
    
    # Total latency is max of parallel executions
    total_latency = max(o.latency_ms for o in outputs) if outputs else 0.0
    
    return WisdomResponse(
        query_id=query.query_id,
        wisdom=wisdom_text,
        consensus_score=consensus,
        doctrine_alignment=doctrine,
        phi_resonance=resonance,
        contributing_models=[o.model_name for o in outputs],
        model_outputs=outputs,
        aggregation_strategy="weighted_consensus",
        total_latency_ms=total_latency,
        wisdom_score=wisdom_score
    )


# ═══════════════════════════════════════════════════════════════════════
# VI. MOCK MODEL EXECUTION
# ═══════════════════════════════════════════════════════════════════════

def mock_model_inference(
    model: ModelCapability,
    query: WisdomQuery
) -> ModelOutput:
    """Mock model inference (placeholder for real model calls)."""
    import random
    
    # Simulate inference
    confidence = model.accuracy * random.uniform(0.8, 1.0)
    doctrine_score = model.doctrine_alignment * random.uniform(0.9, 1.0)
    
    # Generate mock content based on model type
    content_templates = {
        ModelType.REASONING: f"Through logical analysis of '{query.content[:50]}...', we derive...",
        ModelType.CREATIVE: f"Inspired by '{query.content[:50]}...', we envision...",
        ModelType.ANALYTICAL: f"Data analysis of '{query.content[:50]}...' reveals...",
        ModelType.EMPATHETIC: f"Understanding the sentiment in '{query.content[:50]}...', we feel...",
        ModelType.ETHICAL: f"From a doctrine perspective on '{query.content[:50]}...', we assert...",
        ModelType.PREDICTIVE: f"Forecasting based on '{query.content[:50]}...', we predict...",
        ModelType.SYNTHESIS: f"Synthesizing insights from '{query.content[:50]}...', we conclude...",
    }
    
    content = content_templates.get(model.model_type, f"Processing '{query.content[:50]}...'")
    
    return ModelOutput(
        model_name=model.name,
        content=content,
        confidence=confidence,
        reasoning_trace=[f"Step 1: Parse query", f"Step 2: Apply {model.model_type.value} reasoning", f"Step 3: Verify doctrine"],
        doctrine_score=clamp_sovereign(doctrine_score),
        latency_ms=model.latency_ms * random.uniform(0.8, 1.2),
        token_count=len(content.split())
    )


# ═══════════════════════════════════════════════════════════════════════
# VII. MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════

def execute_sophia(
    query: WisdomQuery,
    state: SophiaState,
    strategy: RoutingStrategy = RoutingStrategy.CONSENSUS
) -> Tuple[WisdomResponse, SophiaState]:
    """Execute SOPHIA wisdom orchestration."""
    state.total_queries += 1
    state.current_beat += 1
    
    # Route to appropriate models
    routing = select_models_for_query(query, state, strategy)
    state.routing_history.append(routing)
    
    # Execute models (in production, this would be parallel/async)
    outputs = []
    for model_name in routing.selected_models:
        model = state.models.get(model_name)
        if model and model.is_active:
            output = mock_model_inference(model, query)
            outputs.append(output)
    
    # Aggregate wisdom
    wisdom = aggregate_wisdom(outputs, routing.weights, query)
    
    # Update state metrics
    if wisdom.consensus_score >= CONSENSUS_THRESHOLD:
        state.total_wisdom_generated += 1
    
    state.wisdom_history.append(wisdom)
    state.wisdom_history = state.wisdom_history[-100:]  # Keep last 100
    
    # Update averages
    if state.wisdom_history:
        state.average_consensus = sum(w.consensus_score for w in state.wisdom_history) / len(state.wisdom_history)
        state.average_wisdom_score = sum(w.wisdom_score for w in state.wisdom_history) / len(state.wisdom_history)
        state.doctrine_coherence = clamp_sovereign(
            sum(w.doctrine_alignment for w in state.wisdom_history) / len(state.wisdom_history)
        )
    
    return wisdom, state


def heartbeat(state: SophiaState, doctrine_score: float) -> SophiaState:
    """Execute one SOPHIA heartbeat cycle."""
    state.current_beat += 1
    
    # Update model doctrine alignments based on overall doctrine
    for model in state.models.values():
        # Models drift toward system doctrine
        delta = (doctrine_score - model.doctrine_alignment) * PHI_INV * 0.1
        model.doctrine_alignment = clamp_sovereign(model.doctrine_alignment + delta)
    
    # Update doctrine coherence
    if state.models:
        avg_doctrine = sum(m.doctrine_alignment for m in state.models.values()) / len(state.models)
        state.doctrine_coherence = clamp_sovereign(avg_doctrine)
    
    return state


# ═══════════════════════════════════════════════════════════════════════
# VIII. USAGE EXAMPLE
# ═══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    """
    Example usage:
    
    # Initialize
    sophia = init_sophia_state()
    
    # Every 873ms beat
    for beat in range(1000):
        doctrine_score = 8.5
        sophia = heartbeat(sophia, doctrine_score)
        
        # Process a wisdom query
        query = WisdomQuery(
            query_id=f"Q_{beat}",
            content="What is the meaning of sovereignty in the context of AI governance?",
            context={"domain": "philosophy", "urgency": "normal"},
            required_consensus=0.618,
            max_latency_ms=500.0,
            priority=3,
            doctrine_context="SOVEREIGN_DOCTRINE"
        )
        
        wisdom, sophia = execute_sophia(query, sophia)
        
        print(f"Beat {beat}")
        print(f"  Consensus: {wisdom.consensus_score:.3f}")
        print(f"  Doctrine: {wisdom.doctrine_alignment:.3f}")
        print(f"  PHI Resonance: {wisdom.phi_resonance:.3f}")
        print(f"  Wisdom Score: {wisdom.wisdom_score:.3f}")
        print(f"  Models: {', '.join(wisdom.contributing_models)}")
    """
    # Quick test
    sophia = init_sophia_state()
    query = WisdomQuery(
        query_id="test_001",
        content="What is wisdom?",
        context={},
        required_consensus=0.618,
        max_latency_ms=500.0,
        priority=1,
        doctrine_context="SOVEREIGN_DOCTRINE"
    )
    wisdom, sophia = execute_sophia(query, sophia)
    print(f"Wisdom Score: {wisdom.wisdom_score:.3f}")
    print(f"Consensus: {wisdom.consensus_score:.3f}")
    print(f"Doctrine Alignment: {wisdom.doctrine_alignment:.3f}")
