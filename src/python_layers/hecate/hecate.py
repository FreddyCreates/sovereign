"""
HECATE - The Decision Layer
ΕΚΑΤΗ (Greek) | Trivia Selectrix (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML/AI orchestration for decision systems)
Domain: Branching logic, path selection, crossroads decisions,
        choice computation, destiny routing

Purpose: HECATE provides decision intelligence for crossroads and branching.
         Named for the goddess of crossroads, magic, and thresholds.
         Guides decisions at critical junctures within doctrine bounds.

Mathematical Model:
    decision_score = Σ(option_utility × probability × PHI^rank)
    path_value = expected_outcome × doctrine_alignment × risk_adjusted
    crossroads_entropy = -Σ(p_i × log(p_i)) normalized by options
    hecate_score = decision × clarity × wisdom × doctrine_alignment

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple, Callable, Any
from enum import Enum
import math
import random
from datetime import datetime

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI
S0_FLOOR = 0.75
S_CEIL = 9.75

# Decision constants
MAX_OPTIONS = 13           # Fibonacci
MAX_PATHS = 49             # 7^2
CERTAINTY_THRESHOLD = 0.8
UNCERTAINTY_TOLERANCE = 0.3
WISDOM_WEIGHT = PHI_INV

# Fibonacci for weighting
FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]

# Attribution
ATTRIBUTION = "Alfredo Medina Hernandez"


# ═══════════════════════════════════════════════════════════════════════
# II. HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def clamp_sovereign(value: float) -> float:
    return max(S0_FLOOR, min(S_CEIL, value))


def normalize_sovereign(value: float) -> float:
    clamped = clamp_sovereign(value)
    return (clamped - S0_FLOOR) / (S_CEIL - S0_FLOOR)


def phi_resonance(value: float) -> float:
    return 0.5 + 0.5 * math.sin(value * math.pi * PHI)


def entropy(probabilities: List[float]) -> float:
    """Compute Shannon entropy"""
    h = 0.0
    for p in probabilities:
        if p > 0:
            h -= p * math.log2(p)
    return h


def softmax(values: List[float], temperature: float = 1.0) -> List[float]:
    """Compute softmax probabilities"""
    if not values:
        return []
    max_val = max(values)
    exp_vals = [math.exp((v - max_val) / temperature) for v in values]
    total = sum(exp_vals)
    return [e / total for e in exp_vals]


# ═══════════════════════════════════════════════════════════════════════
# III. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

class DecisionType(Enum):
    """Types of decisions"""
    BINARY = "binary"          # Two options
    MULTIPLE = "multiple"      # Many options
    SEQUENTIAL = "sequential"  # Ordered choices
    PARALLEL = "parallel"      # Simultaneous branches
    RECURSIVE = "recursive"    # Self-referential


class PathState(Enum):
    """States of a decision path"""
    POTENTIAL = "potential"    # Not yet taken
    ACTIVE = "active"          # Currently exploring
    COMMITTED = "committed"    # Decision made
    ABANDONED = "abandoned"    # Path rejected
    COMPLETED = "completed"    # Path finished


class WisdomSource(Enum):
    """Sources of decision wisdom"""
    DOCTRINE = "doctrine"      # From core doctrine
    EXPERIENCE = "experience"  # From past decisions
    INTUITION = "intuition"    # From pattern matching
    CALCULATION = "calculation"  # From explicit computation
    ORACLE = "oracle"          # From higher guidance


@dataclass
class Option:
    """A decision option"""
    id: str
    name: str
    utility: float         # Expected value
    probability: float     # Likelihood of success
    risk: float            # Risk factor [0, 1]
    doctrine_alignment: float
    is_available: bool = True

    def expected_value(self) -> float:
        return self.utility * self.probability * (1.0 - self.risk * 0.5)


@dataclass
class Crossroads:
    """A decision point"""
    id: str
    name: str
    decision_type: DecisionType
    options: List[Option]
    selected_option: Optional[str] = None
    beat_created: int = 0
    beat_decided: Optional[int] = None
    wisdom_source: Optional[WisdomSource] = None

    def get_entropy(self) -> float:
        """Compute decision entropy (uncertainty)"""
        probs = softmax([o.expected_value() for o in self.options if o.is_available])
        return entropy(probs)


@dataclass
class Path:
    """A decision path/branch"""
    id: str
    name: str
    crossroads_sequence: List[str]  # Crossroads IDs in order
    state: PathState
    cumulative_value: float = 0.0
    decisions_made: int = 0


@dataclass
class Decision:
    """A recorded decision"""
    id: str
    crossroads_id: str
    selected_option_id: str
    confidence: float
    wisdom_source: WisdomSource
    beat: int
    outcome: Optional[float] = None


# ═══════════════════════════════════════════════════════════════════════
# IV. WISDOM ORACLE
# ═══════════════════════════════════════════════════════════════════════

class WisdomOracle:
    """
    Provides wisdom for decisions.
    Combines multiple sources of guidance.
    """

    def __init__(self):
        self.decision_history: List[Decision] = []
        self.experience_weights: Dict[str, float] = {}
        self.intuition_cache: Dict[str, float] = {}

    def consult(self, crossroads: Crossroads, beat: int) -> Tuple[str, float, WisdomSource]:
        """Consult oracle for decision guidance"""
        options = [o for o in crossroads.options if o.is_available]
        if not options:
            return "", 0.0, WisdomSource.DOCTRINE

        # Compute scores from multiple sources
        doctrine_scores = self._doctrine_guidance(options)
        experience_scores = self._experience_guidance(options)
        intuition_scores = self._intuition_guidance(options, beat)
        calculation_scores = self._calculation_guidance(options)

        # Combine with PHI weights
        combined = []
        for i, opt in enumerate(options):
            score = (
                doctrine_scores[i] * PHI +
                experience_scores[i] * PHI_INV +
                intuition_scores[i] * PHI_INV +
                calculation_scores[i] * 1.0
            ) / (PHI + 2 * PHI_INV + 1.0)
            combined.append((opt, score))

        # Select best option
        best_opt, best_score = max(combined, key=lambda x: x[1])

        # Determine primary wisdom source
        source = self._determine_source(
            doctrine_scores, experience_scores,
            intuition_scores, calculation_scores,
            options.index(best_opt)
        )

        confidence = min(1.0, best_score / CERTAINTY_THRESHOLD)
        return best_opt.id, confidence, source

    def _doctrine_guidance(self, options: List[Option]) -> List[float]:
        """Get guidance from doctrine alignment"""
        return [o.doctrine_alignment for o in options]

    def _experience_guidance(self, options: List[Option]) -> List[float]:
        """Get guidance from past experience"""
        scores = []
        for opt in options:
            weight = self.experience_weights.get(opt.id, 0.5)
            scores.append(weight)
        return scores

    def _intuition_guidance(self, options: List[Option], beat: int) -> List[float]:
        """Get guidance from intuition (pattern matching)"""
        scores = []
        for i, opt in enumerate(options):
            # PHI-based intuition pattern
            intuition = phi_resonance(beat * 0.01 + i * PHI_INV)
            scores.append(intuition * opt.probability)
        return scores

    def _calculation_guidance(self, options: List[Option]) -> List[float]:
        """Get guidance from explicit calculation"""
        return [o.expected_value() for o in options]

    def _determine_source(self, doctrine: List[float], experience: List[float],
                         intuition: List[float], calculation: List[float],
                         selected_idx: int) -> WisdomSource:
        """Determine primary wisdom source for selection"""
        sources = [
            (WisdomSource.DOCTRINE, doctrine[selected_idx]),
            (WisdomSource.EXPERIENCE, experience[selected_idx]),
            (WisdomSource.INTUITION, intuition[selected_idx]),
            (WisdomSource.CALCULATION, calculation[selected_idx]),
        ]
        return max(sources, key=lambda x: x[1])[0]

    def record_outcome(self, decision: Decision, outcome: float) -> None:
        """Record outcome to improve future decisions"""
        decision.outcome = outcome
        self.decision_history.append(decision)

        # Update experience weights
        if outcome > 0.5:
            self.experience_weights[decision.selected_option_id] = \
                self.experience_weights.get(decision.selected_option_id, 0.5) * 0.9 + outcome * 0.1


# ═══════════════════════════════════════════════════════════════════════
# V. HECATE ORCHESTRATOR
# ═══════════════════════════════════════════════════════════════════════

class HecateOrchestrator:
    """
    Main orchestrator for the HECATE decision layer.
    Manages crossroads, paths, and wisdom.
    """

    def __init__(self):
        self.crossroads: Dict[str, Crossroads] = {}
        self.paths: List[Path] = []
        self.decisions: List[Decision] = []
        self.oracle = WisdomOracle()
        self.beat_count = 0
        self.decision_score = 0.0
        self.clarity_score = 0.0
        self.hecate_score = 0.0

    def advance(self) -> "HecateState":
        """Advance HECATE by one heartbeat"""
        self.beat_count += 1

        # Process pending crossroads
        for crossroads in self.crossroads.values():
            if crossroads.selected_option is None:
                self._auto_decide(crossroads)

        # Update paths
        for path in self.paths:
            self._update_path(path)

        # Compute scores
        self.decision_score = self._compute_decision_score()
        self.clarity_score = self._compute_clarity_score()
        self.hecate_score = self._compute_hecate_score()

        return self.get_state()

    def _auto_decide(self, crossroads: Crossroads) -> None:
        """Automatically decide at a crossroads if timeout"""
        age = self.beat_count - crossroads.beat_created
        if age > FIBONACCI[5]:  # 5 beats timeout
            self.decide(crossroads.id)

    def _update_path(self, path: Path) -> None:
        """Update path state"""
        if path.state not in [PathState.ACTIVE, PathState.POTENTIAL]:
            return

        # Check if path is complete
        all_decided = all(
            self.crossroads.get(cid, Crossroads("", "", DecisionType.BINARY, [], beat_created=0)).selected_option is not None
            for cid in path.crossroads_sequence
        )

        if all_decided and path.crossroads_sequence:
            path.state = PathState.COMPLETED
            # Compute cumulative value
            for cid in path.crossroads_sequence:
                if cid in self.crossroads:
                    cr = self.crossroads[cid]
                    if cr.selected_option:
                        opt = next((o for o in cr.options if o.id == cr.selected_option), None)
                        if opt:
                            path.cumulative_value += opt.expected_value()
                            path.decisions_made += 1

    def _compute_decision_score(self) -> float:
        """Compute decision quality score"""
        if not self.decisions:
            return 0.5

        # Average confidence of decisions
        confidences = [d.confidence for d in self.decisions[-20:]]  # Recent decisions
        return sum(confidences) / len(confidences)

    def _compute_clarity_score(self) -> float:
        """Compute decision clarity (inverse of entropy)"""
        if not self.crossroads:
            return 1.0

        entropies = [cr.get_entropy() for cr in self.crossroads.values() if cr.options]
        if not entropies:
            return 1.0

        avg_entropy = sum(entropies) / len(entropies)
        max_entropy = math.log2(MAX_OPTIONS) if MAX_OPTIONS > 1 else 1.0
        return 1.0 - (avg_entropy / max_entropy)

    def _compute_hecate_score(self) -> float:
        """Compute HECATE score"""
        wisdom = WISDOM_WEIGHT
        phi_res = phi_resonance(self.beat_count * 0.01)
        return self.decision_score * self.clarity_score * wisdom * phi_res

    def create_crossroads(self, name: str, options: List[Dict],
                          decision_type: DecisionType = DecisionType.MULTIPLE) -> Crossroads:
        """Create a new crossroads"""
        option_objects = []
        for i, opt_data in enumerate(options[:MAX_OPTIONS]):
            option = Option(
                id=f"OPT_{self.beat_count}_{len(self.crossroads)}_{i}",
                name=opt_data.get("name", f"Option {i}"),
                utility=opt_data.get("utility", 0.5),
                probability=opt_data.get("probability", 0.5),
                risk=opt_data.get("risk", 0.2),
                doctrine_alignment=opt_data.get("doctrine_alignment", 0.7)
            )
            option_objects.append(option)

        crossroads = Crossroads(
            id=f"CROSS_{self.beat_count}_{len(self.crossroads)}",
            name=name,
            decision_type=decision_type,
            options=option_objects,
            beat_created=self.beat_count
        )

        self.crossroads[crossroads.id] = crossroads
        return crossroads

    def decide(self, crossroads_id: str, option_id: Optional[str] = None) -> Optional[Decision]:
        """Make a decision at a crossroads"""
        if crossroads_id not in self.crossroads:
            return None

        crossroads = self.crossroads[crossroads_id]
        if crossroads.selected_option is not None:
            return None  # Already decided

        # Consult oracle if no option specified
        if option_id is None:
            option_id, confidence, source = self.oracle.consult(crossroads, self.beat_count)
        else:
            confidence = CERTAINTY_THRESHOLD
            source = WisdomSource.CALCULATION

        if not option_id:
            return None

        # Record decision
        decision = Decision(
            id=f"DEC_{self.beat_count}_{len(self.decisions)}",
            crossroads_id=crossroads_id,
            selected_option_id=option_id,
            confidence=confidence,
            wisdom_source=source,
            beat=self.beat_count
        )

        crossroads.selected_option = option_id
        crossroads.beat_decided = self.beat_count
        crossroads.wisdom_source = source

        self.decisions.append(decision)
        return decision

    def create_path(self, name: str, crossroads_ids: List[str]) -> Path:
        """Create a decision path"""
        path = Path(
            id=f"PATH_{self.beat_count}_{len(self.paths)}",
            name=name,
            crossroads_sequence=crossroads_ids,
            state=PathState.POTENTIAL
        )
        self.paths.append(path)
        return path

    def get_state(self) -> "HecateState":
        """Get current HECATE state"""
        return HecateState(
            beat_count=self.beat_count,
            decision_score=self.decision_score,
            clarity_score=self.clarity_score,
            hecate_score=self.hecate_score,
            crossroads_count=len(self.crossroads),
            decided_count=sum(1 for cr in self.crossroads.values() if cr.selected_option),
            path_count=len(self.paths),
            decision_count=len(self.decisions),
            attribution=ATTRIBUTION
        )

    def get_summary(self) -> Dict:
        """Get HECATE summary for monitoring"""
        return {
            "beat_count": self.beat_count,
            "decision_score": self.decision_score,
            "clarity_score": self.clarity_score,
            "hecate_score": self.hecate_score,
            "crossroads": {
                "total": len(self.crossroads),
                "decided": sum(1 for cr in self.crossroads.values() if cr.selected_option),
                "pending": sum(1 for cr in self.crossroads.values() if cr.selected_option is None)
            },
            "paths": {
                "total": len(self.paths),
                "completed": sum(1 for p in self.paths if p.state == PathState.COMPLETED),
                "active": sum(1 for p in self.paths if p.state == PathState.ACTIVE)
            },
            "decisions": len(self.decisions),
            "wisdom_sources": {
                source.value: sum(1 for d in self.decisions if d.wisdom_source == source)
                for source in WisdomSource
            },
            "attribution": ATTRIBUTION
        }


# ═══════════════════════════════════════════════════════════════════════
# VI. STATE TYPES
# ═══════════════════════════════════════════════════════════════════════

@dataclass
class HecateState:
    """Complete HECATE state"""
    beat_count: int
    decision_score: float
    clarity_score: float
    hecate_score: float
    crossroads_count: int
    decided_count: int
    path_count: int
    decision_count: int
    attribution: str

    def to_dict(self) -> Dict:
        return {
            "beat_count": self.beat_count,
            "decision_score": self.decision_score,
            "clarity_score": self.clarity_score,
            "hecate_score": self.hecate_score,
            "crossroads_count": self.crossroads_count,
            "decided_count": self.decided_count,
            "path_count": self.path_count,
            "decision_count": self.decision_count,
            "attribution": self.attribution
        }


# ═══════════════════════════════════════════════════════════════════════
# VII. ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    hecate = HecateOrchestrator()

    # Create some crossroads
    crossroads = hecate.create_crossroads("Strategic Choice", [
        {"name": "Path Alpha", "utility": 0.8, "probability": 0.7, "doctrine_alignment": 0.9},
        {"name": "Path Beta", "utility": 0.6, "probability": 0.9, "doctrine_alignment": 0.8},
        {"name": "Path Gamma", "utility": 0.9, "probability": 0.5, "doctrine_alignment": 0.7},
    ])

    # Run 100 heartbeats
    for _ in range(100):
        state = hecate.advance()

    summary = hecate.get_summary()
    print(f"HECATE — THE DECISION LAYER")
    print(f"Attribution: {ATTRIBUTION}")
    print(f"Decision Score: {summary['decision_score']:.4f}")
    print(f"Clarity Score: {summary['clarity_score']:.4f}")
    print(f"HECATE Score: {summary['hecate_score']:.4f}")
    print(f"Crossroads: {summary['crossroads']}")
