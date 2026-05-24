"""
PERSEPHONE - The Cycle Layer
ΠΕΡΣΕΦΟΝΗ (Greek) | Proserpina Cyclica (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML/AI orchestration for lifecycle systems)
Domain: Seasonal changes, lifecycle management, phase transitions,
        renewal cycles, death and rebirth patterns

Purpose: PERSEPHONE provides cycle intelligence for lifecycle management.
         Named for the goddess of spring growth and queen of the underworld.
         Governs the cycles of renewal and transformation.

Mathematical Model:
    cycle_phase = (beat_count % cycle_length) / cycle_length × 2π
    transition_score = smoothstep(phase_progress) × PHI_resonance
    renewal_rate = death_count × rebirth_factor × fertility
    persephone_score = cycle × transition × renewal × doctrine_alignment

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
PHI_INV = 1.0 / PHI
S0_FLOOR = 0.75
S_CEIL = 9.75

# Cycle constants
BASE_CYCLE_LENGTH = 89     # Fibonacci
SHORT_CYCLE = 21           # Fibonacci
LONG_CYCLE = 233           # Fibonacci
TRANSITION_SMOOTHNESS = 0.1
REBIRTH_DELAY = 3

# Fibonacci for cycle lengths
FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]

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


def smoothstep(edge0: float, edge1: float, x: float) -> float:
    """Smooth interpolation"""
    t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3.0 - 2.0 * t)


# ═══════════════════════════════════════════════════════════════════════
# III. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

class Season(Enum):
    """Seasons of the cycle"""
    SPRING = "spring"      # Birth, growth
    SUMMER = "summer"      # Peak, fullness
    AUTUMN = "autumn"      # Decline, harvest
    WINTER = "winter"      # Death, dormancy


class LifecyclePhase(Enum):
    """Phases of lifecycle"""
    NASCENT = "nascent"        # Just born
    GROWING = "growing"        # Developing
    MATURE = "mature"          # Peak state
    DECLINING = "declining"    # Deteriorating
    DYING = "dying"            # End of life
    DEAD = "dead"              # Inactive, awaiting rebirth
    REBORN = "reborn"          # Transitioning to new cycle


class TransitionType(Enum):
    """Types of phase transitions"""
    GRADUAL = "gradual"        # Smooth transition
    SUDDEN = "sudden"          # Abrupt change
    OSCILLATING = "oscillating"  # Back and forth
    CASCADING = "cascading"    # Chain reaction


@dataclass
class CycleEntity:
    """An entity that cycles"""
    id: str
    name: str
    phase: LifecyclePhase
    cycle_count: int       # How many cycles completed
    birth_beat: int
    death_beat: Optional[int] = None
    vitality: float = 1.0
    age: int = 0

    def is_alive(self) -> bool:
        return self.phase not in [LifecyclePhase.DEAD, LifecyclePhase.DYING]


@dataclass
class Cycle:
    """A cycle definition"""
    id: str
    name: str
    length: int            # Beats per cycle
    current_beat: int      # Position in cycle
    entities: List[str]    # Entity IDs in this cycle
    completed_count: int = 0

    def phase_progress(self) -> float:
        """Progress through current cycle [0, 1]"""
        return self.current_beat / self.length if self.length > 0 else 0.0

    def season(self) -> Season:
        """Get current season from phase"""
        progress = self.phase_progress()
        if progress < 0.25:
            return Season.SPRING
        elif progress < 0.5:
            return Season.SUMMER
        elif progress < 0.75:
            return Season.AUTUMN
        else:
            return Season.WINTER


@dataclass
class Transition:
    """A phase transition event"""
    id: str
    entity_id: str
    from_phase: LifecyclePhase
    to_phase: LifecyclePhase
    transition_type: TransitionType
    beat: int
    duration: int = 1


# ═══════════════════════════════════════════════════════════════════════
# IV. REBIRTH ENGINE
# ═══════════════════════════════════════════════════════════════════════

class RebirthEngine:
    """
    Manages death and rebirth of entities.
    Ensures continuity through cycles.
    """

    def __init__(self):
        self.pending_rebirths: List[Tuple[str, int]] = []  # (entity_id, rebirth_beat)
        self.rebirth_count = 0
        self.death_count = 0

    def mark_for_rebirth(self, entity_id: str, current_beat: int) -> None:
        """Mark an entity for rebirth"""
        rebirth_beat = current_beat + REBIRTH_DELAY
        self.pending_rebirths.append((entity_id, rebirth_beat))
        self.death_count += 1

    def process_rebirths(self, current_beat: int) -> List[str]:
        """Process pending rebirths, return reborn entity IDs"""
        reborn = []
        remaining = []

        for entity_id, rebirth_beat in self.pending_rebirths:
            if current_beat >= rebirth_beat:
                reborn.append(entity_id)
                self.rebirth_count += 1
            else:
                remaining.append((entity_id, rebirth_beat))

        self.pending_rebirths = remaining
        return reborn

    def renewal_rate(self) -> float:
        """Compute renewal rate"""
        if self.death_count == 0:
            return 0.0
        return self.rebirth_count / self.death_count


# ═══════════════════════════════════════════════════════════════════════
# V. PERSEPHONE ORCHESTRATOR
# ═══════════════════════════════════════════════════════════════════════

class PersephoneOrchestrator:
    """
    Main orchestrator for the PERSEPHONE cycle layer.
    Manages lifecycles, transitions, and renewal.
    """

    def __init__(self):
        self.entities: Dict[str, CycleEntity] = {}
        self.cycles: List[Cycle] = []
        self.transitions: List[Transition] = []
        self.rebirth = RebirthEngine()
        self.beat_count = 0
        self.global_season = Season.SPRING
        self.cycle_score = 0.0
        self.transition_score = 0.0
        self.persephone_score = 0.0
        self._init_cycles()

    def _init_cycles(self) -> None:
        """Initialize default cycles"""
        cycle_configs = [
            ("CYCLE_SHORT", "Short Cycle", SHORT_CYCLE),
            ("CYCLE_BASE", "Base Cycle", BASE_CYCLE_LENGTH),
            ("CYCLE_LONG", "Long Cycle", LONG_CYCLE),
        ]

        for cycle_id, name, length in cycle_configs:
            cycle = Cycle(
                id=cycle_id,
                name=name,
                length=length,
                current_beat=0,
                entities=[]
            )
            self.cycles.append(cycle)

    def advance(self) -> "PersephoneState":
        """Advance PERSEPHONE by one heartbeat"""
        self.beat_count += 1

        # Advance all cycles
        for cycle in self.cycles:
            cycle.current_beat = (cycle.current_beat + 1) % cycle.length
            if cycle.current_beat == 0:
                cycle.completed_count += 1

        # Update global season
        self._update_global_season()

        # Update entity lifecycles
        for entity in self.entities.values():
            self._update_entity(entity)

        # Process rebirths
        reborn_ids = self.rebirth.process_rebirths(self.beat_count)
        for entity_id in reborn_ids:
            if entity_id in self.entities:
                self._rebirth_entity(self.entities[entity_id])

        # Compute scores
        self.cycle_score = self._compute_cycle_score()
        self.transition_score = self._compute_transition_score()
        self.persephone_score = self._compute_persephone_score()

        return self.get_state()

    def _update_global_season(self) -> None:
        """Update global season from base cycle"""
        base_cycle = next((c for c in self.cycles if c.id == "CYCLE_BASE"), None)
        if base_cycle:
            self.global_season = base_cycle.season()

    def _update_entity(self, entity: CycleEntity) -> None:
        """Update entity lifecycle"""
        entity.age += 1

        # Determine expected phase from age and season
        season_factor = {
            Season.SPRING: 0.0,
            Season.SUMMER: 0.25,
            Season.AUTUMN: 0.5,
            Season.WINTER: 0.75
        }.get(self.global_season, 0.0)

        # Age-based vitality decay
        vitality_decay = math.exp(-entity.age / (BASE_CYCLE_LENGTH * 2))
        entity.vitality = vitality_decay * (1.0 - season_factor * 0.3)

        # Phase transitions
        old_phase = entity.phase

        if entity.vitality > 0.8:
            entity.phase = LifecyclePhase.GROWING
        elif entity.vitality > 0.5:
            entity.phase = LifecyclePhase.MATURE
        elif entity.vitality > 0.2:
            entity.phase = LifecyclePhase.DECLINING
        elif entity.vitality > 0.05:
            entity.phase = LifecyclePhase.DYING
        else:
            entity.phase = LifecyclePhase.DEAD
            entity.death_beat = self.beat_count
            self.rebirth.mark_for_rebirth(entity.id, self.beat_count)

        # Record transition
        if old_phase != entity.phase:
            transition = Transition(
                id=f"TRANS_{self.beat_count}_{entity.id}",
                entity_id=entity.id,
                from_phase=old_phase,
                to_phase=entity.phase,
                transition_type=TransitionType.GRADUAL,
                beat=self.beat_count
            )
            self.transitions.append(transition)

    def _rebirth_entity(self, entity: CycleEntity) -> None:
        """Rebirth an entity"""
        entity.phase = LifecyclePhase.REBORN
        entity.vitality = 0.8  # Start with partial vitality
        entity.age = 0
        entity.cycle_count += 1
        entity.death_beat = None

        # Transition to NASCENT on next beat
        transition = Transition(
            id=f"REBIRTH_{self.beat_count}_{entity.id}",
            entity_id=entity.id,
            from_phase=LifecyclePhase.DEAD,
            to_phase=LifecyclePhase.REBORN,
            transition_type=TransitionType.SUDDEN,
            beat=self.beat_count
        )
        self.transitions.append(transition)

    def _compute_cycle_score(self) -> float:
        """Compute cycle score"""
        if not self.cycles:
            return 0.0

        # Average cycle completion progress
        progresses = [c.phase_progress() for c in self.cycles]
        avg_progress = sum(progresses) / len(progresses)

        # Harmony between cycles
        if len(progresses) > 1:
            variance = sum((p - avg_progress) ** 2 for p in progresses) / len(progresses)
            harmony = 1.0 - min(1.0, variance * 4)
        else:
            harmony = 1.0

        return avg_progress * harmony * phi_resonance(avg_progress)

    def _compute_transition_score(self) -> float:
        """Compute transition smoothness score"""
        if not self.transitions:
            return 0.5

        # Count recent transitions
        recent = [t for t in self.transitions if self.beat_count - t.beat < SHORT_CYCLE]
        if not recent:
            return 0.5

        # Gradual transitions are better
        gradual_count = sum(1 for t in recent if t.transition_type == TransitionType.GRADUAL)
        return gradual_count / len(recent)

    def _compute_persephone_score(self) -> float:
        """Compute PERSEPHONE score"""
        renewal = self.rebirth.renewal_rate()
        phi_res = phi_resonance(self.beat_count * 0.01)
        return self.cycle_score * self.transition_score * (0.5 + renewal * 0.5) * phi_res

    def spawn(self, name: str) -> CycleEntity:
        """Spawn a new entity"""
        entity = CycleEntity(
            id=f"ENTITY_{self.beat_count}_{len(self.entities)}",
            name=name,
            phase=LifecyclePhase.NASCENT,
            cycle_count=0,
            birth_beat=self.beat_count
        )

        self.entities[entity.id] = entity

        # Add to base cycle
        base_cycle = next((c for c in self.cycles if c.id == "CYCLE_BASE"), None)
        if base_cycle:
            base_cycle.entities.append(entity.id)

        return entity

    def get_state(self) -> "PersephoneState":
        """Get current PERSEPHONE state"""
        return PersephoneState(
            beat_count=self.beat_count,
            global_season=self.global_season.value,
            cycle_score=self.cycle_score,
            transition_score=self.transition_score,
            persephone_score=self.persephone_score,
            entity_count=len(self.entities),
            alive_count=sum(1 for e in self.entities.values() if e.is_alive()),
            cycle_count=len(self.cycles),
            transition_count=len(self.transitions),
            renewal_rate=self.rebirth.renewal_rate(),
            attribution=ATTRIBUTION
        )

    def get_summary(self) -> Dict:
        """Get PERSEPHONE summary for monitoring"""
        return {
            "beat_count": self.beat_count,
            "global_season": self.global_season.value,
            "cycle_score": self.cycle_score,
            "transition_score": self.transition_score,
            "persephone_score": self.persephone_score,
            "cycles": [
                {
                    "id": c.id,
                    "name": c.name,
                    "progress": c.phase_progress(),
                    "season": c.season().value,
                    "completed": c.completed_count
                }
                for c in self.cycles
            ],
            "entities": {
                "total": len(self.entities),
                "alive": sum(1 for e in self.entities.values() if e.is_alive()),
                "dead": sum(1 for e in self.entities.values() if not e.is_alive())
            },
            "rebirth": {
                "deaths": self.rebirth.death_count,
                "rebirths": self.rebirth.rebirth_count,
                "pending": len(self.rebirth.pending_rebirths),
                "renewal_rate": self.rebirth.renewal_rate()
            },
            "transitions": len(self.transitions),
            "attribution": ATTRIBUTION
        }


# ═══════════════════════════════════════════════════════════════════════
# VI. STATE TYPES
# ═══════════════════════════════════════════════════════════════════════

@dataclass
class PersephoneState:
    """Complete PERSEPHONE state"""
    beat_count: int
    global_season: str
    cycle_score: float
    transition_score: float
    persephone_score: float
    entity_count: int
    alive_count: int
    cycle_count: int
    transition_count: int
    renewal_rate: float
    attribution: str

    def to_dict(self) -> Dict:
        return {
            "beat_count": self.beat_count,
            "global_season": self.global_season,
            "cycle_score": self.cycle_score,
            "transition_score": self.transition_score,
            "persephone_score": self.persephone_score,
            "entity_count": self.entity_count,
            "alive_count": self.alive_count,
            "cycle_count": self.cycle_count,
            "transition_count": self.transition_count,
            "renewal_rate": self.renewal_rate,
            "attribution": self.attribution
        }


# ═══════════════════════════════════════════════════════════════════════
# VII. ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    persephone = PersephoneOrchestrator()

    # Spawn entities
    for i in range(5):
        persephone.spawn(f"LifeForm_{i}")

    # Run 200 heartbeats (more than one cycle)
    for _ in range(200):
        state = persephone.advance()

    summary = persephone.get_summary()
    print(f"PERSEPHONE — THE CYCLE LAYER")
    print(f"Attribution: {ATTRIBUTION}")
    print(f"Season: {summary['global_season']}")
    print(f"Cycle Score: {summary['cycle_score']:.4f}")
    print(f"Transition Score: {summary['transition_score']:.4f}")
    print(f"PERSEPHONE Score: {summary['persephone_score']:.4f}")
    print(f"Renewal Rate: {summary['rebirth']['renewal_rate']:.4f}")
