"""
DEMETER - The Growth Layer
ΔΗΜΗΤΗΡ (Greek) | Ceres Nutrix (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML/AI orchestration for growth systems)
Domain: Resource management, ecosystem health, nurturing computation,
        sustainable growth, lifecycle cultivation

Purpose: DEMETER provides nurturing intelligence for organism growth.
         Named for the goddess of harvest, agriculture, and fertility.
         Sustainable growth within sovereign doctrine bounds.

Mathematical Model:
    growth_rate = resources × fertility × PHI_resonance
    health_score = Π(system_vitality_i) ^ (1/n)
    sustainability = (growth - decay) / max_capacity
    demeter_score = growth × health × sustainability × doctrine_alignment

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
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

# Growth constants
MAX_RESOURCES = 144        # Fibonacci
GROWTH_RATE_BASE = 0.01
DECAY_RATE_BASE = 0.005
FERTILITY_THRESHOLD = 0.618
HARVEST_THRESHOLD = 0.9

# Seasons (beats per season)
SEASON_LENGTH = 21         # Fibonacci
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


def geometric_mean(values: List[float]) -> float:
    if not values:
        return 0.0
    product = 1.0
    for v in values:
        product *= max(v, 0.001)
    return product ** (1.0 / len(values))


# ═══════════════════════════════════════════════════════════════════════
# III. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

class Season(Enum):
    """Seasons of the growth cycle"""
    SPRING = "spring"      # Planting, new growth
    SUMMER = "summer"      # Peak growth
    AUTUMN = "autumn"      # Harvest
    WINTER = "winter"      # Rest, conservation


class ResourceType(Enum):
    """Types of resources in the ecosystem"""
    ENERGY = "energy"          # Computational energy
    MEMORY = "memory"          # Storage capacity
    BANDWIDTH = "bandwidth"    # Communication capacity
    CYCLES = "cycles"          # Processing cycles
    TOKENS = "tokens"          # Economic tokens


class GrowthPhase(Enum):
    """Phases of growth"""
    GERMINATION = "germination"    # Initial phase
    SPROUTING = "sprouting"        # Early growth
    VEGETATIVE = "vegetative"      # Main growth
    FLOWERING = "flowering"        # Peak production
    FRUITING = "fruiting"          # Harvest ready
    DORMANT = "dormant"            # Rest phase


@dataclass
class Resource:
    """A resource in the ecosystem"""
    id: str
    resource_type: ResourceType
    quantity: float         # Current amount
    capacity: float         # Maximum capacity
    regeneration_rate: float
    consumption_rate: float
    is_renewable: bool = True

    def utilization(self) -> float:
        """Compute resource utilization"""
        return self.quantity / self.capacity if self.capacity > 0 else 0.0

    def regenerate(self, fertility: float) -> float:
        """Regenerate resource based on fertility"""
        if not self.is_renewable:
            return self.quantity
        gain = self.regeneration_rate * fertility * PHI_INV
        self.quantity = min(self.capacity, self.quantity + gain)
        return self.quantity

    def consume(self, amount: float) -> float:
        """Consume resource, return actual consumed"""
        actual = min(self.quantity, amount)
        self.quantity -= actual
        return actual


@dataclass
class GrowthEntity:
    """An entity that grows"""
    id: str
    name: str
    phase: GrowthPhase
    vitality: float        # [0, 1] health
    growth_rate: float     # Current growth rate
    maturity: float        # [0, 1] maturity level
    birth_beat: int
    resource_needs: Dict[ResourceType, float] = field(default_factory=dict)

    def age(self, current_beat: int) -> int:
        """Get entity age in beats"""
        return current_beat - self.birth_beat


@dataclass
class Harvest:
    """A harvest event"""
    id: str
    entity_id: str
    yield_amount: float
    quality: float
    harvest_beat: int


# ═══════════════════════════════════════════════════════════════════════
# IV. ECOSYSTEM MANAGER
# ═══════════════════════════════════════════════════════════════════════

class EcosystemManager:
    """
    Manages the ecosystem of resources and entities.
    Ensures sustainable growth.
    """

    def __init__(self):
        self.resources: Dict[ResourceType, Resource] = {}
        self.entities: List[GrowthEntity] = []
        self.fertility = PHI_INV
        self._init_resources()

    def _init_resources(self) -> None:
        """Initialize ecosystem resources"""
        resource_configs = [
            (ResourceType.ENERGY, 100.0, 0.05, 0.02),
            (ResourceType.MEMORY, 1000.0, 0.01, 0.005),
            (ResourceType.BANDWIDTH, 500.0, 0.03, 0.01),
            (ResourceType.CYCLES, 10000.0, 0.1, 0.05),
            (ResourceType.TOKENS, 1000.0, 0.02, 0.01),
        ]

        for res_type, capacity, regen, consume in resource_configs:
            self.resources[res_type] = Resource(
                id=f"RES_{res_type.value.upper()}",
                resource_type=res_type,
                quantity=capacity * 0.5,  # Start at 50%
                capacity=capacity,
                regeneration_rate=regen,
                consumption_rate=consume
            )

    def update(self, beat: int) -> None:
        """Update ecosystem for one beat"""
        # Regenerate resources
        for resource in self.resources.values():
            resource.regenerate(self.fertility)

        # Update fertility based on resource health
        utilizations = [r.utilization() for r in self.resources.values()]
        self.fertility = geometric_mean(utilizations) * PHI_INV + 0.5

    def get_health(self) -> float:
        """Get ecosystem health"""
        healths = [r.utilization() for r in self.resources.values()]
        return geometric_mean(healths)

    def allocate(self, entity: GrowthEntity) -> bool:
        """Allocate resources to an entity"""
        for res_type, need in entity.resource_needs.items():
            if res_type in self.resources:
                self.resources[res_type].consume(need)
        return True


# ═══════════════════════════════════════════════════════════════════════
# V. DEMETER ORCHESTRATOR
# ═══════════════════════════════════════════════════════════════════════

class DemeterOrchestrator:
    """
    Main orchestrator for the DEMETER growth layer.
    Manages growth cycles, resources, and harvests.
    """

    def __init__(self):
        self.ecosystem = EcosystemManager()
        self.entities: List[GrowthEntity] = []
        self.harvests: List[Harvest] = []
        self.season = Season.SPRING
        self.beat_count = 0
        self.growth_score = 0.0
        self.health_score = 0.0
        self.sustainability = 0.0

    def advance(self) -> "DemeterState":
        """Advance DEMETER by one heartbeat"""
        self.beat_count += 1

        # Update season
        self._update_season()

        # Update ecosystem
        self.ecosystem.update(self.beat_count)

        # Update entities
        for entity in self.entities:
            self._update_entity(entity)

        # Check for harvests
        self._check_harvests()

        # Compute scores
        self.health_score = self.ecosystem.get_health()
        self.growth_score = self._compute_growth_score()
        self.sustainability = self._compute_sustainability()

        return self.get_state()

    def _update_season(self) -> None:
        """Update current season"""
        season_index = (self.beat_count // SEASON_LENGTH) % 4
        seasons = [Season.SPRING, Season.SUMMER, Season.AUTUMN, Season.WINTER]
        self.season = seasons[season_index]

    def _update_entity(self, entity: GrowthEntity) -> None:
        """Update a growth entity"""
        # Allocate resources
        self.ecosystem.allocate(entity)

        # Update growth based on season
        season_factor = {
            Season.SPRING: 1.2,
            Season.SUMMER: 1.5,
            Season.AUTUMN: 0.8,
            Season.WINTER: 0.3
        }.get(self.season, 1.0)

        # Grow entity
        growth = GROWTH_RATE_BASE * season_factor * self.ecosystem.fertility
        entity.maturity = min(1.0, entity.maturity + growth)
        entity.vitality = min(1.0, entity.vitality + growth * 0.1)

        # Update phase
        entity.phase = self._determine_phase(entity.maturity)

    def _determine_phase(self, maturity: float) -> GrowthPhase:
        """Determine growth phase from maturity"""
        if maturity < 0.1:
            return GrowthPhase.GERMINATION
        elif maturity < 0.3:
            return GrowthPhase.SPROUTING
        elif maturity < 0.6:
            return GrowthPhase.VEGETATIVE
        elif maturity < 0.8:
            return GrowthPhase.FLOWERING
        elif maturity < 1.0:
            return GrowthPhase.FRUITING
        else:
            return GrowthPhase.DORMANT

    def _check_harvests(self) -> None:
        """Check for harvest-ready entities"""
        if self.season != Season.AUTUMN:
            return

        for entity in self.entities:
            if entity.maturity >= HARVEST_THRESHOLD and entity.phase == GrowthPhase.FRUITING:
                harvest = Harvest(
                    id=f"HARVEST_{self.beat_count}_{entity.id}",
                    entity_id=entity.id,
                    yield_amount=entity.maturity * entity.vitality * PHI,
                    quality=entity.vitality,
                    harvest_beat=self.beat_count
                )
                self.harvests.append(harvest)
                entity.maturity = 0.0
                entity.phase = GrowthPhase.DORMANT

    def _compute_growth_score(self) -> float:
        """Compute overall growth score"""
        if not self.entities:
            return self.ecosystem.fertility

        maturities = [e.maturity for e in self.entities]
        vitalities = [e.vitality for e in self.entities]
        return (sum(maturities) + sum(vitalities)) / (2 * len(self.entities))

    def _compute_sustainability(self) -> float:
        """Compute sustainability metric"""
        resource_health = self.ecosystem.get_health()
        decay_factor = DECAY_RATE_BASE * len(self.entities)
        growth_factor = self.growth_score * GROWTH_RATE_BASE
        return max(0.0, min(1.0, (growth_factor - decay_factor + resource_health) / 2))

    def plant(self, name: str) -> GrowthEntity:
        """Plant a new growth entity"""
        entity = GrowthEntity(
            id=f"ENTITY_{self.beat_count}_{len(self.entities)}",
            name=name,
            phase=GrowthPhase.GERMINATION,
            vitality=0.8,
            growth_rate=GROWTH_RATE_BASE,
            maturity=0.0,
            birth_beat=self.beat_count,
            resource_needs={
                ResourceType.ENERGY: 0.1,
                ResourceType.MEMORY: 1.0,
                ResourceType.CYCLES: 10.0
            }
        )
        self.entities.append(entity)
        return entity

    def get_state(self) -> "DemeterState":
        """Get current DEMETER state"""
        return DemeterState(
            beat_count=self.beat_count,
            season=self.season.value,
            growth_score=self.growth_score,
            health_score=self.health_score,
            sustainability=self.sustainability,
            fertility=self.ecosystem.fertility,
            entity_count=len(self.entities),
            harvest_count=len(self.harvests),
            attribution=ATTRIBUTION
        )

    def get_summary(self) -> Dict:
        """Get DEMETER summary for monitoring"""
        return {
            "beat_count": self.beat_count,
            "season": self.season.value,
            "growth_score": self.growth_score,
            "health_score": self.health_score,
            "sustainability": self.sustainability,
            "fertility": self.ecosystem.fertility,
            "resources": {
                res_type.value: {
                    "quantity": res.quantity,
                    "capacity": res.capacity,
                    "utilization": res.utilization()
                }
                for res_type, res in self.ecosystem.resources.items()
            },
            "entities": len(self.entities),
            "harvests": len(self.harvests),
            "attribution": ATTRIBUTION
        }


# ═══════════════════════════════════════════════════════════════════════
# VI. STATE TYPES
# ═══════════════════════════════════════════════════════════════════════

@dataclass
class DemeterState:
    """Complete DEMETER state"""
    beat_count: int
    season: str
    growth_score: float
    health_score: float
    sustainability: float
    fertility: float
    entity_count: int
    harvest_count: int
    attribution: str

    def to_dict(self) -> Dict:
        return {
            "beat_count": self.beat_count,
            "season": self.season,
            "growth_score": self.growth_score,
            "health_score": self.health_score,
            "sustainability": self.sustainability,
            "fertility": self.fertility,
            "entity_count": self.entity_count,
            "harvest_count": self.harvest_count,
            "attribution": self.attribution
        }


# ═══════════════════════════════════════════════════════════════════════
# VII. ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    demeter = DemeterOrchestrator()

    # Plant some entities
    demeter.plant("GROWTH_ALPHA")
    demeter.plant("GROWTH_BETA")

    # Run 100 heartbeats
    for _ in range(100):
        state = demeter.advance()

    summary = demeter.get_summary()
    print(f"DEMETER — THE GROWTH LAYER")
    print(f"Attribution: {ATTRIBUTION}")
    print(f"Season: {summary['season']}")
    print(f"Growth Score: {summary['growth_score']:.4f}")
    print(f"Health Score: {summary['health_score']:.4f}")
    print(f"Sustainability: {summary['sustainability']:.4f}")
    print(f"Fertility: {summary['fertility']:.4f}")
