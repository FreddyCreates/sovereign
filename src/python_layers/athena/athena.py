"""
ATHENA - The Strategy Layer
ΑΘΗΝΑ (Greek) | Minerva Strategos (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML/AI orchestration for strategic planning)
Domain: Strategy computation, tactical planning, wisdom-guided decision making,
        game-theoretic analysis, doctrine-aligned optimization

Purpose: ATHENA provides strategic intelligence for sovereign decision-making.
         Named for the goddess of wisdom and strategic warfare.
         All strategies must align with sovereign doctrine.

Mathematical Model:
    strategy_score = Π(tactic_i.utility × doctrine_alignment) ^ (1/n)
    tactical_value = expected_outcome × probability × phi_resonance
    planning_horizon = fibonacci[depth] beats
    optimization = gradient_ascent(utility, doctrine_constraints)

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

# Fibonacci sequence for planning horizons
FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]

# Strategy constants
MAX_TACTICS = 21  # Fibonacci bound
MAX_STRATEGIES = 13
UTILITY_THRESHOLD = PHI_INV
DOCTRINE_MIN_ALIGNMENT = 0.6

# Attribution
ATTRIBUTION = "Alfredo Medina Hernandez"


# ═══════════════════════════════════════════════════════════════════════
# II. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

def clamp_sovereign(value: float) -> float:
    """Clamp value to sovereign bounds [S0_FLOOR, S_CEIL]"""
    return max(S0_FLOOR, min(S_CEIL, value))


def normalize_sovereign(value: float) -> float:
    """Normalize to [0, 1] within sovereign bounds"""
    clamped = clamp_sovereign(value)
    return (clamped - S0_FLOOR) / (S_CEIL - S0_FLOOR)


def phi_resonance(value: float) -> float:
    """Compute PHI resonance factor"""
    return 0.5 + 0.5 * math.sin(value * math.pi * PHI)


class StrategyType(Enum):
    """Types of strategic approaches"""
    DEFENSIVE = "defensive"      # Protect existing state
    EXPANSIVE = "expansive"      # Grow and extend
    ADAPTIVE = "adaptive"        # Respond to conditions
    TRANSFORMATIVE = "transformative"  # Fundamental change
    EQUILIBRIUM = "equilibrium"  # Maintain balance


class TacticPriority(Enum):
    """Tactic priority levels"""
    CRITICAL = 1
    HIGH = 2
    MEDIUM = 3
    LOW = 4


@dataclass
class Tactic:
    """A single tactical action"""
    id: str
    name: str
    description: str
    priority: TacticPriority
    utility: float           # Expected value (0.0 to PHI)
    probability: float       # Success probability (0.0 to 1.0)
    doctrine_alignment: float  # Alignment with doctrine (0.0 to 1.0)
    resource_cost: float     # Cost in sovereign units
    duration_beats: int      # How long to execute
    prerequisites: List[str] = field(default_factory=list)
    created_beat: int = 0
    executed: bool = False
    outcome: Optional[float] = None


@dataclass
class Strategy:
    """A complete strategic plan"""
    id: str
    name: str
    strategy_type: StrategyType
    tactics: List[Tactic]
    horizon_beats: int       # Planning horizon
    total_utility: float
    doctrine_score: float
    risk_level: float        # 0.0 to 1.0
    created_beat: int
    active: bool = True
    completed: bool = False


@dataclass
class StrategicContext:
    """Current strategic situation"""
    available_resources: float
    threat_level: float      # 0.0 to 1.0
    opportunity_level: float  # 0.0 to 1.0
    doctrine_vector: List[float]  # 13-dimensional
    active_constraints: List[str]
    recent_outcomes: List[Tuple[str, float]]  # (tactic_id, outcome)


@dataclass
class AthenaState:
    """Complete Athena strategic state"""
    beat_count: int
    strategies: Dict[str, Strategy]
    tactics: Dict[str, Tactic]
    context: StrategicContext
    wisdom_score: float      # Accumulated strategic wisdom
    decision_history: List[Tuple[int, str, float]]  # (beat, decision, outcome)
    athena_score: float


@dataclass
class AthenaResponse:
    """Response from Athena computation"""
    recommended_strategy: Optional[Strategy]
    recommended_tactics: List[Tactic]
    strategic_assessment: str
    athena_score: float
    warnings: List[str]


# ═══════════════════════════════════════════════════════════════════════
# III. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

def init_strategic_context() -> StrategicContext:
    """Initialize default strategic context"""
    return StrategicContext(
        available_resources=5.0,
        threat_level=0.2,
        opportunity_level=0.5,
        doctrine_vector=[5.0] * 13,  # Middle of sovereign range
        active_constraints=[],
        recent_outcomes=[]
    )


def init_athena_state() -> AthenaState:
    """Initialize Athena state"""
    return AthenaState(
        beat_count=0,
        strategies={},
        tactics={},
        context=init_strategic_context(),
        wisdom_score=0.0,
        decision_history=[],
        athena_score=0.0
    )


# ═══════════════════════════════════════════════════════════════════════
# IV. TACTIC COMPUTATION
# ═══════════════════════════════════════════════════════════════════════

def compute_tactic_value(tactic: Tactic) -> float:
    """Compute tactical value (expected utility × probability × doctrine)"""
    utility_factor = min(tactic.utility, PHI) / PHI
    prob_factor = tactic.probability
    doctrine_factor = tactic.doctrine_alignment
    
    # PHI resonance bonus when all factors align
    alignment_bonus = 0.0
    if all(f > 0.7 for f in [utility_factor, prob_factor, doctrine_factor]):
        alignment_bonus = PHI_INV * 0.1
    
    base_value = utility_factor * prob_factor * doctrine_factor
    return min(1.0, base_value + alignment_bonus)


def evaluate_tactic_prerequisites(
    tactic: Tactic,
    completed_tactics: List[str]
) -> bool:
    """Check if tactic prerequisites are met"""
    return all(prereq in completed_tactics for prereq in tactic.prerequisites)


def prioritize_tactics(tactics: List[Tactic]) -> List[Tactic]:
    """Sort tactics by priority and value"""
    def sort_key(t: Tactic) -> Tuple[int, float]:
        return (t.priority.value, -compute_tactic_value(t))
    
    return sorted(tactics, key=sort_key)


# ═══════════════════════════════════════════════════════════════════════
# V. STRATEGY COMPUTATION
# ═══════════════════════════════════════════════════════════════════════

def compute_strategy_score(strategy: Strategy) -> float:
    """Compute overall strategy score"""
    if not strategy.tactics:
        return 0.0
    
    # Geometric mean of tactic values
    tactic_values = [compute_tactic_value(t) for t in strategy.tactics]
    product = 1.0
    for v in tactic_values:
        product *= max(0.001, v)  # Avoid zero
    
    geometric_mean = product ** (1.0 / len(tactic_values))
    
    # Risk adjustment
    risk_factor = 1.0 - strategy.risk_level * 0.3
    
    # PHI resonance
    phi_res = phi_resonance(geometric_mean)
    
    return geometric_mean * risk_factor * (0.7 + 0.3 * phi_res)


def select_strategy_type(context: StrategicContext) -> StrategyType:
    """Select appropriate strategy type based on context"""
    if context.threat_level > 0.7:
        return StrategyType.DEFENSIVE
    elif context.opportunity_level > 0.7 and context.threat_level < 0.3:
        return StrategyType.EXPANSIVE
    elif context.threat_level > 0.5 or context.opportunity_level > 0.5:
        return StrategyType.ADAPTIVE
    elif sum(context.doctrine_vector) / len(context.doctrine_vector) < 3.0:
        return StrategyType.TRANSFORMATIVE
    else:
        return StrategyType.EQUILIBRIUM


def compute_planning_horizon(context: StrategicContext) -> int:
    """Determine planning horizon using Fibonacci"""
    # Shorter horizon in volatile conditions
    volatility = (context.threat_level + context.opportunity_level) / 2
    
    if volatility > 0.8:
        return FIBONACCI[3]   # 3 beats
    elif volatility > 0.6:
        return FIBONACCI[5]   # 8 beats
    elif volatility > 0.4:
        return FIBONACCI[7]   # 21 beats
    elif volatility > 0.2:
        return FIBONACCI[9]   # 55 beats
    else:
        return FIBONACCI[11]  # 144 beats


# ═══════════════════════════════════════════════════════════════════════
# VI. STRATEGIC ANALYSIS
# ═══════════════════════════════════════════════════════════════════════

def analyze_strategic_situation(
    state: AthenaState
) -> Tuple[str, List[str]]:
    """Analyze current strategic situation"""
    context = state.context
    warnings = []
    
    # Threat assessment
    if context.threat_level > 0.8:
        warnings.append("CRITICAL: Threat level critical — immediate defense required")
    elif context.threat_level > 0.5:
        warnings.append("WARNING: Elevated threat level — defensive posture advised")
    
    # Resource assessment
    normalized_resources = normalize_sovereign(context.available_resources)
    if normalized_resources < 0.2:
        warnings.append("WARNING: Resources critically low")
    
    # Doctrine alignment
    doctrine_mean = sum(context.doctrine_vector) / len(context.doctrine_vector)
    if normalize_sovereign(doctrine_mean) < 0.5:
        warnings.append("WARNING: Doctrine alignment below threshold")
    
    # Opportunity assessment
    if context.opportunity_level > 0.8 and context.threat_level < 0.3:
        assessment = "GOLDEN OPPORTUNITY: Conditions highly favorable for expansion"
    elif context.threat_level > 0.7:
        assessment = "DEFENSIVE POSTURE: Focus on protection and consolidation"
    elif abs(context.threat_level - context.opportunity_level) < 0.2:
        assessment = "EQUILIBRIUM: Balance offensive and defensive actions"
    elif context.opportunity_level > context.threat_level:
        assessment = "FAVORABLE: Pursue opportunities with measured risk"
    else:
        assessment = "CAUTIOUS: Minimize exposure while building strength"
    
    return assessment, warnings


def generate_recommendations(
    state: AthenaState
) -> List[Tactic]:
    """Generate tactical recommendations based on current situation"""
    context = state.context
    strategy_type = select_strategy_type(context)
    
    recommendations = []
    
    # Get available tactics
    available = [t for t in state.tactics.values() 
                 if not t.executed and t.doctrine_alignment >= DOCTRINE_MIN_ALIGNMENT]
    
    # Filter by strategy type
    if strategy_type == StrategyType.DEFENSIVE:
        # Prioritize low-risk, high-doctrine tactics
        available = [t for t in available if t.probability > 0.7]
    elif strategy_type == StrategyType.EXPANSIVE:
        # Accept higher risk for higher utility
        available = [t for t in available if t.utility > 0.5]
    elif strategy_type == StrategyType.ADAPTIVE:
        # Balance utility and probability
        available = [t for t in available 
                     if t.utility * t.probability > 0.4]
    
    # Prioritize and select top tactics
    prioritized = prioritize_tactics(available)
    
    # Resource constraint
    remaining_resources = context.available_resources
    for tactic in prioritized:
        if tactic.resource_cost <= remaining_resources:
            recommendations.append(tactic)
            remaining_resources -= tactic.resource_cost
            if len(recommendations) >= 5:  # Max 5 recommendations
                break
    
    return recommendations


# ═══════════════════════════════════════════════════════════════════════
# VII. MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════

def execute_athena(
    state: AthenaState,
    context_update: Optional[StrategicContext] = None
) -> Tuple[AthenaResponse, AthenaState]:
    """Execute Athena strategic intelligence"""
    # Update beat
    new_beat = state.beat_count + 1
    
    # Update context if provided
    new_context = context_update if context_update else state.context
    
    # Analyze situation
    assessment, warnings = analyze_strategic_situation(
        AthenaState(
            beat_count=new_beat,
            strategies=state.strategies,
            tactics=state.tactics,
            context=new_context,
            wisdom_score=state.wisdom_score,
            decision_history=state.decision_history,
            athena_score=state.athena_score
        )
    )
    
    # Generate recommendations
    recommended_tactics = generate_recommendations(
        AthenaState(
            beat_count=new_beat,
            strategies=state.strategies,
            tactics=state.tactics,
            context=new_context,
            wisdom_score=state.wisdom_score,
            decision_history=state.decision_history,
            athena_score=state.athena_score
        )
    )
    
    # Find best active strategy
    active_strategies = [s for s in state.strategies.values() 
                        if s.active and not s.completed]
    recommended_strategy = None
    if active_strategies:
        recommended_strategy = max(active_strategies, key=compute_strategy_score)
    
    # Update wisdom score based on recent outcomes
    wisdom_delta = 0.0
    for _, outcome in state.context.recent_outcomes[-10:]:
        wisdom_delta += (outcome - 0.5) * 0.01  # Learn from outcomes
    new_wisdom = max(0.0, min(PHI, state.wisdom_score + wisdom_delta))
    
    # Compute Athena score
    strategy_factor = compute_strategy_score(recommended_strategy) if recommended_strategy else 0.5
    doctrine_mean = sum(new_context.doctrine_vector) / len(new_context.doctrine_vector)
    doctrine_factor = normalize_sovereign(doctrine_mean)
    phi_res = phi_resonance(strategy_factor)
    
    athena_score = strategy_factor * doctrine_factor * (0.5 + 0.5 * phi_res) * (1.0 + new_wisdom / PHI)
    
    # Build new state
    new_state = AthenaState(
        beat_count=new_beat,
        strategies=state.strategies,
        tactics=state.tactics,
        context=new_context,
        wisdom_score=new_wisdom,
        decision_history=state.decision_history,
        athena_score=athena_score
    )
    
    # Build response
    response = AthenaResponse(
        recommended_strategy=recommended_strategy,
        recommended_tactics=recommended_tactics,
        strategic_assessment=assessment,
        athena_score=athena_score,
        warnings=warnings
    )
    
    return response, new_state


# ═══════════════════════════════════════════════════════════════════════
# VIII. STRATEGY/TACTIC MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════

def add_tactic(
    state: AthenaState,
    name: str,
    description: str,
    priority: TacticPriority,
    utility: float,
    probability: float,
    doctrine_alignment: float,
    resource_cost: float,
    duration_beats: int,
    prerequisites: List[str] = None
) -> Tuple[Optional[Tactic], AthenaState]:
    """Add a new tactic"""
    if len(state.tactics) >= MAX_TACTICS:
        return None, state
    
    tactic_id = f"TACTIC_{name.upper().replace(' ', '_')}_{state.beat_count}"
    
    tactic = Tactic(
        id=tactic_id,
        name=name,
        description=description,
        priority=priority,
        utility=min(PHI, utility),
        probability=max(0.0, min(1.0, probability)),
        doctrine_alignment=max(0.0, min(1.0, doctrine_alignment)),
        resource_cost=clamp_sovereign(resource_cost),
        duration_beats=duration_beats,
        prerequisites=prerequisites or [],
        created_beat=state.beat_count
    )
    
    new_tactics = dict(state.tactics)
    new_tactics[tactic_id] = tactic
    
    new_state = AthenaState(
        beat_count=state.beat_count,
        strategies=state.strategies,
        tactics=new_tactics,
        context=state.context,
        wisdom_score=state.wisdom_score,
        decision_history=state.decision_history,
        athena_score=state.athena_score
    )
    
    return tactic, new_state


def create_strategy(
    state: AthenaState,
    name: str,
    tactic_ids: List[str]
) -> Tuple[Optional[Strategy], AthenaState]:
    """Create a new strategy from tactics"""
    if len(state.strategies) >= MAX_STRATEGIES:
        return None, state
    
    # Gather tactics
    tactics = [state.tactics[tid] for tid in tactic_ids if tid in state.tactics]
    if not tactics:
        return None, state
    
    strategy_type = select_strategy_type(state.context)
    horizon = compute_planning_horizon(state.context)
    
    # Compute strategy metrics
    total_utility = sum(compute_tactic_value(t) for t in tactics)
    doctrine_score = sum(t.doctrine_alignment for t in tactics) / len(tactics)
    risk_level = 1.0 - sum(t.probability for t in tactics) / len(tactics)
    
    strategy_id = f"STRATEGY_{name.upper().replace(' ', '_')}_{state.beat_count}"
    
    strategy = Strategy(
        id=strategy_id,
        name=name,
        strategy_type=strategy_type,
        tactics=tactics,
        horizon_beats=horizon,
        total_utility=total_utility,
        doctrine_score=doctrine_score,
        risk_level=risk_level,
        created_beat=state.beat_count
    )
    
    new_strategies = dict(state.strategies)
    new_strategies[strategy_id] = strategy
    
    new_state = AthenaState(
        beat_count=state.beat_count,
        strategies=new_strategies,
        tactics=state.tactics,
        context=state.context,
        wisdom_score=state.wisdom_score,
        decision_history=state.decision_history,
        athena_score=state.athena_score
    )
    
    return strategy, new_state


# ═══════════════════════════════════════════════════════════════════════
# IX. QUERY FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def get_summary(state: AthenaState) -> Dict[str, any]:
    """Get Athena state summary"""
    return {
        "beat_count": state.beat_count,
        "total_strategies": len(state.strategies),
        "active_strategies": sum(1 for s in state.strategies.values() if s.active),
        "total_tactics": len(state.tactics),
        "executed_tactics": sum(1 for t in state.tactics.values() if t.executed),
        "wisdom_score": state.wisdom_score,
        "athena_score": state.athena_score,
        "threat_level": state.context.threat_level,
        "opportunity_level": state.context.opportunity_level,
        "attribution": ATTRIBUTION
    }
