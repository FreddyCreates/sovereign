"""
ARES - The Optimization Layer
ΑΡΗΣ (Greek) | Mars Competitor (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML/AI orchestration for optimization systems)
Domain: Gradient warfare, resource competition, fitness optimization,
        adversarial training, competitive selection

Purpose: ARES provides optimization intelligence through competitive dynamics.
         Named for the god of war and competition.
         Controlled competition that drives improvement within doctrine bounds.

Mathematical Model:
    fitness_score = performance × efficiency × PHI_resonance
    competition_result = max(competitor_fitness_i) with ties broken by PHI
    gradient_step = -learning_rate × ∂loss/∂params × doctrine_gate
    ares_score = fitness × victory_rate × improvement × doctrine_alignment

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
PHI_INV = 1.0 / PHI
S0_FLOOR = 0.75
S_CEIL = 9.75

# Optimization constants
MAX_COMPETITORS = 49       # 7^2
MAX_GENERATIONS = 144      # Fibonacci
LEARNING_RATE = 0.01
MUTATION_RATE = 0.1
SELECTION_PRESSURE = PHI_INV
ELITE_FRACTION = 0.1

# Fibonacci for scheduling
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


def tournament_select(competitors: List["Competitor"], k: int = 3) -> "Competitor":
    """Tournament selection"""
    selected = random.sample(competitors, min(k, len(competitors)))
    return max(selected, key=lambda c: c.fitness)


# ═══════════════════════════════════════════════════════════════════════
# III. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

class CompetitionType(Enum):
    """Types of competition"""
    TOURNAMENT = "tournament"      # K-way tournament
    RANKING = "ranking"            # Fitness ranking
    ADVERSARIAL = "adversarial"    # Direct opposition
    COOPERATIVE = "cooperative"    # Team competition


class OptimizationMethod(Enum):
    """Optimization methods"""
    GRADIENT = "gradient"          # Gradient descent
    EVOLUTIONARY = "evolutionary"  # Genetic algorithm
    SWARM = "swarm"                # Particle swarm
    ANNEALING = "annealing"        # Simulated annealing
    HYBRID = "hybrid"              # Combined methods


class FitnessLandscape(Enum):
    """Types of fitness landscapes"""
    SMOOTH = "smooth"              # Easy optimization
    RUGGED = "rugged"              # Many local optima
    DECEPTIVE = "deceptive"        # Misleading gradients
    NEUTRAL = "neutral"            # Flat regions
    DYNAMIC = "dynamic"            # Changing over time


@dataclass
class Competitor:
    """A competitor in the optimization arena"""
    id: str
    name: str
    genome: List[float]        # Parameter vector
    fitness: float = 0.0
    victories: int = 0
    defeats: int = 0
    generation: int = 0
    is_elite: bool = False

    def win_rate(self) -> float:
        total = self.victories + self.defeats
        return self.victories / total if total > 0 else 0.5


@dataclass
class Battle:
    """A battle between competitors"""
    id: str
    competitor_a: str
    competitor_b: str
    winner: Optional[str]
    margin: float              # Victory margin
    beat: int


@dataclass
class Gradient:
    """A gradient for optimization"""
    params: List[float]
    loss: float
    magnitude: float
    direction: List[float]


@dataclass
class Arena:
    """Competition arena"""
    id: str
    name: str
    competition_type: CompetitionType
    landscape: FitnessLandscape
    competitors: List[str]     # Competitor IDs
    champion: Optional[str] = None
    battles_count: int = 0


# ═══════════════════════════════════════════════════════════════════════
# IV. FITNESS EVALUATOR
# ═══════════════════════════════════════════════════════════════════════

class FitnessEvaluator:
    """
    Evaluates fitness of competitors.
    Defines the optimization objective.
    """

    def __init__(self, landscape: FitnessLandscape = FitnessLandscape.SMOOTH):
        self.landscape = landscape
        self.evaluations = 0
        self.best_fitness = 0.0

    def evaluate(self, genome: List[float], beat: int) -> float:
        """Evaluate fitness of a genome"""
        self.evaluations += 1

        # Base fitness is sum of squared values (minimize)
        base = sum(g ** 2 for g in genome) / len(genome) if genome else 0.0
        fitness = 1.0 / (1.0 + base)  # Convert to maximization

        # Apply landscape effects
        if self.landscape == FitnessLandscape.RUGGED:
            # Add noise for local optima
            noise = sum(math.sin(g * PHI * 10) * 0.1 for g in genome) / len(genome)
            fitness += noise

        elif self.landscape == FitnessLandscape.DECEPTIVE:
            # Reverse gradient in some regions
            if fitness > 0.5:
                fitness = 1.0 - fitness + 0.5

        elif self.landscape == FitnessLandscape.DYNAMIC:
            # Change with beat
            phase = math.sin(beat * 0.01 * PHI)
            fitness *= (0.8 + phase * 0.2)

        fitness = max(0.0, min(1.0, fitness))
        self.best_fitness = max(self.best_fitness, fitness)

        return fitness * phi_resonance(fitness)

    def compute_gradient(self, genome: List[float], beat: int, epsilon: float = 0.001) -> Gradient:
        """Compute numerical gradient"""
        base_fitness = self.evaluate(genome, beat)
        direction = []

        for i in range(len(genome)):
            genome_plus = genome.copy()
            genome_plus[i] += epsilon
            fitness_plus = self.evaluate(genome_plus, beat)
            partial = (fitness_plus - base_fitness) / epsilon
            direction.append(partial)

        magnitude = math.sqrt(sum(d ** 2 for d in direction)) if direction else 0.0

        return Gradient(
            params=genome,
            loss=1.0 - base_fitness,
            magnitude=magnitude,
            direction=direction
        )


# ═══════════════════════════════════════════════════════════════════════
# V. ARES ORCHESTRATOR
# ═══════════════════════════════════════════════════════════════════════

class AresOrchestrator:
    """
    Main orchestrator for the ARES optimization layer.
    Manages competitions, evolution, and optimization.
    """

    def __init__(self):
        self.competitors: Dict[str, Competitor] = {}
        self.arenas: List[Arena] = []
        self.battles: List[Battle] = []
        self.evaluator = FitnessEvaluator()
        self.method = OptimizationMethod.HYBRID
        self.beat_count = 0
        self.generation = 0
        self.ares_score = 0.0
        self.avg_fitness = 0.0
        self.improvement_rate = 0.0
        self._init_arena()

    def _init_arena(self) -> None:
        """Initialize main arena"""
        arena = Arena(
            id="ARENA_MAIN",
            name="Main Competition Arena",
            competition_type=CompetitionType.TOURNAMENT,
            landscape=FitnessLandscape.SMOOTH,
            competitors=[]
        )
        self.arenas.append(arena)

    def advance(self) -> "AresState":
        """Advance ARES by one heartbeat"""
        self.beat_count += 1

        # Evaluate all competitors
        for comp in self.competitors.values():
            comp.fitness = self.evaluator.evaluate(comp.genome, self.beat_count)

        # Run competitions
        if self.beat_count % FIBONACCI[4] == 0:  # Every 3 beats
            self._run_competitions()

        # Evolution step
        if self.beat_count % FIBONACCI[5] == 0:  # Every 5 beats
            self._evolution_step()

        # Gradient step for all
        self._gradient_step()

        # Compute metrics
        self.avg_fitness = self._compute_avg_fitness()
        self.improvement_rate = self._compute_improvement()
        self.ares_score = self._compute_ares_score()

        return self.get_state()

    def _run_competitions(self) -> None:
        """Run competition rounds"""
        competitors = list(self.competitors.values())
        if len(competitors) < 2:
            return

        # Tournament selection battles
        for _ in range(min(10, len(competitors) // 2)):
            a, b = random.sample(competitors, 2)

            if a.fitness > b.fitness:
                winner, loser = a, b
            elif b.fitness > a.fitness:
                winner, loser = b, a
            else:
                # Tie-break with PHI
                winner, loser = (a, b) if random.random() < PHI_INV else (b, a)

            winner.victories += 1
            loser.defeats += 1

            battle = Battle(
                id=f"BATTLE_{self.beat_count}_{len(self.battles)}",
                competitor_a=a.id,
                competitor_b=b.id,
                winner=winner.id,
                margin=abs(a.fitness - b.fitness),
                beat=self.beat_count
            )
            self.battles.append(battle)

        # Update arena champion
        if self.arenas and competitors:
            best = max(competitors, key=lambda c: c.fitness)
            self.arenas[0].champion = best.id

    def _evolution_step(self) -> None:
        """Evolutionary algorithm step"""
        competitors = list(self.competitors.values())
        if len(competitors) < 4:
            return

        self.generation += 1

        # Sort by fitness
        competitors.sort(key=lambda c: c.fitness, reverse=True)

        # Mark elites
        elite_count = max(1, int(len(competitors) * ELITE_FRACTION))
        for i, comp in enumerate(competitors):
            comp.is_elite = i < elite_count

        # Create offspring from non-elites
        non_elites = competitors[elite_count:]
        for comp in non_elites:
            # Select parent via tournament
            parent = tournament_select(competitors)

            # Crossover
            if random.random() < 0.7:
                other = tournament_select(competitors)
                crossover_point = random.randint(1, len(comp.genome) - 1)
                comp.genome[:crossover_point] = parent.genome[:crossover_point]
                comp.genome[crossover_point:] = other.genome[crossover_point:]
            else:
                comp.genome = parent.genome.copy()

            # Mutation
            for i in range(len(comp.genome)):
                if random.random() < MUTATION_RATE:
                    comp.genome[i] += random.gauss(0, 0.1) * PHI_INV
                    comp.genome[i] = max(-1.0, min(1.0, comp.genome[i]))

            comp.generation = self.generation

    def _gradient_step(self) -> None:
        """Apply gradient optimization"""
        for comp in self.competitors.values():
            if comp.is_elite:
                continue  # Don't modify elites

            gradient = self.evaluator.compute_gradient(comp.genome, self.beat_count)

            # Gradient ascent (maximizing fitness)
            for i in range(len(comp.genome)):
                step = LEARNING_RATE * gradient.direction[i] * phi_resonance(comp.fitness)
                comp.genome[i] += step
                comp.genome[i] = max(-1.0, min(1.0, comp.genome[i]))

    def _compute_avg_fitness(self) -> float:
        """Compute average fitness"""
        if not self.competitors:
            return 0.0
        return sum(c.fitness for c in self.competitors.values()) / len(self.competitors)

    def _compute_improvement(self) -> float:
        """Compute improvement rate"""
        if self.generation < 2:
            return 0.0
        # Compare current best to historical
        return self.evaluator.best_fitness - 0.5  # Baseline

    def _compute_ares_score(self) -> float:
        """Compute ARES score"""
        if not self.competitors:
            return 0.0

        avg_win_rate = sum(c.win_rate() for c in self.competitors.values()) / len(self.competitors)
        phi_res = phi_resonance(self.beat_count * 0.01)

        return self.avg_fitness * avg_win_rate * phi_res

    def spawn_competitor(self, name: str, genome_size: int = 10) -> Competitor:
        """Spawn a new competitor"""
        genome = [random.gauss(0, 0.5) for _ in range(genome_size)]

        competitor = Competitor(
            id=f"COMP_{self.beat_count}_{len(self.competitors)}",
            name=name,
            genome=genome,
            generation=self.generation
        )

        self.competitors[competitor.id] = competitor

        # Add to arena
        if self.arenas:
            self.arenas[0].competitors.append(competitor.id)

        return competitor

    def get_state(self) -> "AresState":
        """Get current ARES state"""
        return AresState(
            beat_count=self.beat_count,
            generation=self.generation,
            ares_score=self.ares_score,
            avg_fitness=self.avg_fitness,
            improvement_rate=self.improvement_rate,
            best_fitness=self.evaluator.best_fitness,
            competitor_count=len(self.competitors),
            battle_count=len(self.battles),
            method=self.method.value,
            attribution=ATTRIBUTION
        )

    def get_summary(self) -> Dict:
        """Get ARES summary for monitoring"""
        return {
            "beat_count": self.beat_count,
            "generation": self.generation,
            "ares_score": self.ares_score,
            "avg_fitness": self.avg_fitness,
            "improvement_rate": self.improvement_rate,
            "best_fitness": self.evaluator.best_fitness,
            "method": self.method.value,
            "competitors": len(self.competitors),
            "elites": sum(1 for c in self.competitors.values() if c.is_elite),
            "battles": len(self.battles),
            "arenas": len(self.arenas),
            "attribution": ATTRIBUTION
        }


# ═══════════════════════════════════════════════════════════════════════
# VI. STATE TYPES
# ═══════════════════════════════════════════════════════════════════════

@dataclass
class AresState:
    """Complete ARES state"""
    beat_count: int
    generation: int
    ares_score: float
    avg_fitness: float
    improvement_rate: float
    best_fitness: float
    competitor_count: int
    battle_count: int
    method: str
    attribution: str

    def to_dict(self) -> Dict:
        return {
            "beat_count": self.beat_count,
            "generation": self.generation,
            "ares_score": self.ares_score,
            "avg_fitness": self.avg_fitness,
            "improvement_rate": self.improvement_rate,
            "best_fitness": self.best_fitness,
            "competitor_count": self.competitor_count,
            "battle_count": self.battle_count,
            "method": self.method,
            "attribution": self.attribution
        }


# ═══════════════════════════════════════════════════════════════════════
# VII. ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    ares = AresOrchestrator()

    # Spawn competitors
    for i in range(10):
        ares.spawn_competitor(f"Warrior_{i}")

    # Run 100 heartbeats
    for _ in range(100):
        state = ares.advance()

    summary = ares.get_summary()
    print(f"ARES — THE OPTIMIZATION LAYER")
    print(f"Attribution: {ATTRIBUTION}")
    print(f"Generation: {summary['generation']}")
    print(f"ARES Score: {summary['ares_score']:.4f}")
    print(f"Avg Fitness: {summary['avg_fitness']:.4f}")
    print(f"Best Fitness: {summary['best_fitness']:.4f}")
    print(f"Battles: {summary['battles']}")
