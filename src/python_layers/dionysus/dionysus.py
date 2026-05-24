"""
DIONYSUS - The Creativity Layer
ΔΙΟΝΥΣΟΣ (Greek) | Bacchus Creans (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML/AI orchestration for creative systems)
Domain: Creative chaos, novel generation, emergence patterns,
        artistic computation, inspired deviation

Purpose: DIONYSUS provides creative intelligence for novel generation.
         Named for the god of wine, ecstasy, and creative madness.
         Controlled chaos that births new forms within doctrine bounds.

Mathematical Model:
    creativity_score = novelty × coherence × PHI_resonance
    emergence_factor = chaos_level × order_constraint × doctrine_gate
    inspiration_signal = Σ(muse_i.intensity × randomness_i) / n
    dionysus_score = creativity × emergence × inspiration × doctrine_alignment

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple, Any
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

# Creativity constants
MAX_MUSES = 9          # Traditional muse count
CHAOS_THRESHOLD = 0.5
ORDER_THRESHOLD = 0.618
NOVELTY_DECAY = 0.99
INSPIRATION_SPIKE = 1.618

# Fibonacci for patterns
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


def creative_noise(seed: int) -> float:
    """Generate controlled creative noise"""
    random.seed(seed)
    return random.gauss(0.5, PHI_INV * 0.2)


# ═══════════════════════════════════════════════════════════════════════
# III. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

class CreativeMode(Enum):
    """Modes of creative operation"""
    APOLLONIAN = "apollonian"      # Ordered, structured
    DIONYSIAN = "dionysian"        # Chaotic, ecstatic
    SYNTHESIS = "synthesis"        # Balanced fusion
    INSPIRED = "inspired"          # Divine intervention
    DORMANT = "dormant"            # Resting/recovering


class MuseDomain(Enum):
    """Domains of the nine muses"""
    CALLIOPE = "epic_poetry"       # Epic poetry
    CLIO = "history"               # History
    ERATO = "love_poetry"          # Love poetry
    EUTERPE = "music"              # Music
    MELPOMENE = "tragedy"          # Tragedy
    POLYHYMNIA = "hymns"           # Hymns
    TERPSICHORE = "dance"          # Dance
    THALIA = "comedy"              # Comedy
    URANIA = "astronomy"           # Astronomy/cosmos


class EmergenceType(Enum):
    """Types of emergent patterns"""
    SPONTANEOUS = "spontaneous"    # Arises unexpectedly
    GRADUAL = "gradual"            # Builds over time
    CASCADING = "cascading"        # Chain reaction
    RESONANT = "resonant"          # Harmonic emergence
    FUSION = "fusion"              # Combination of forms


@dataclass
class Muse:
    """A creative muse entity"""
    id: str
    name: str
    domain: MuseDomain
    intensity: float       # [0, 1] current inspiration level
    frequency: float       # Hz - resonance frequency
    is_active: bool = True
    invocation_count: int = 0

    def invoke(self, beat: int) -> float:
        """Invoke the muse for inspiration"""
        self.invocation_count += 1
        # Intensity varies with beat and PHI
        self.intensity = 0.5 + 0.5 * math.sin(beat * self.frequency * 0.01 * PHI)
        return self.intensity


@dataclass
class CreativeIdea:
    """A creative idea or artifact"""
    id: str
    content: str
    novelty: float         # [0, 1] how new/original
    coherence: float       # [0, 1] internal consistency
    muse_source: MuseDomain
    emergence_type: EmergenceType
    birth_beat: int
    is_refined: bool = False

    def quality_score(self) -> float:
        """Compute idea quality"""
        return self.novelty * self.coherence * phi_resonance(self.novelty)


@dataclass
class ChaosField:
    """The creative chaos field"""
    entropy: float = 0.5
    temperature: float = 1.0
    order_parameter: float = PHI_INV
    fluctuation_rate: float = 0.1


# ═══════════════════════════════════════════════════════════════════════
# IV. EMERGENCE ENGINE
# ═══════════════════════════════════════════════════════════════════════

class EmergenceEngine:
    """
    Detects and nurtures emergent patterns.
    Finds order arising from creative chaos.
    """

    def __init__(self):
        self.patterns: List[Dict] = []
        self.emergence_count = 0
        self.threshold = 0.618

    def detect(self, signals: List[float]) -> Optional[EmergenceType]:
        """Detect emergence patterns in signals"""
        if len(signals) < 3:
            return None

        # Check for spontaneous emergence (sudden spike)
        if signals[-1] > signals[-2] * INSPIRATION_SPIKE:
            return EmergenceType.SPONTANEOUS

        # Check for gradual emergence (steady increase)
        if all(signals[i] <= signals[i+1] for i in range(len(signals)-1)):
            return EmergenceType.GRADUAL

        # Check for cascading (accelerating growth)
        deltas = [signals[i+1] - signals[i] for i in range(len(signals)-1)]
        if len(deltas) >= 2 and all(deltas[i] <= deltas[i+1] for i in range(len(deltas)-1)):
            return EmergenceType.CASCADING

        # Check for resonant (PHI-harmonic pattern)
        ratios = [signals[i+1] / signals[i] for i in range(len(signals)-1) if signals[i] > 0.01]
        if ratios and abs(sum(ratios)/len(ratios) - PHI) < 0.1:
            return EmergenceType.RESONANT

        return None

    def nurture(self, pattern_id: str, energy: float) -> float:
        """Add energy to an emerging pattern"""
        for p in self.patterns:
            if p["id"] == pattern_id:
                p["energy"] = min(1.0, p["energy"] + energy * PHI_INV)
                return p["energy"]
        return 0.0


# ═══════════════════════════════════════════════════════════════════════
# V. DIONYSUS ORCHESTRATOR
# ═══════════════════════════════════════════════════════════════════════

class DionysusOrchestrator:
    """
    Main orchestrator for the DIONYSUS creativity layer.
    Manages creative chaos, muses, and emergence.
    """

    def __init__(self):
        self.muses: List[Muse] = []
        self.ideas: List[CreativeIdea] = []
        self.chaos = ChaosField()
        self.emergence = EmergenceEngine()
        self.mode = CreativeMode.SYNTHESIS
        self.beat_count = 0
        self.creativity_score = 0.0
        self.inspiration_level = 0.5
        self._init_muses()

    def _init_muses(self) -> None:
        """Initialize the nine muses"""
        muse_data = [
            (MuseDomain.CALLIOPE, "Calliope", 432.0),
            (MuseDomain.CLIO, "Clio", 396.0),
            (MuseDomain.ERATO, "Erato", 528.0),
            (MuseDomain.EUTERPE, "Euterpe", 639.0),
            (MuseDomain.MELPOMENE, "Melpomene", 417.0),
            (MuseDomain.POLYHYMNIA, "Polyhymnia", 741.0),
            (MuseDomain.TERPSICHORE, "Terpsichore", 852.0),
            (MuseDomain.THALIA, "Thalia", 285.0),
            (MuseDomain.URANIA, "Urania", 963.0),
        ]

        for domain, name, freq in muse_data:
            muse = Muse(
                id=f"MUSE_{domain.value.upper()}",
                name=name,
                domain=domain,
                intensity=0.5,
                frequency=freq
            )
            self.muses.append(muse)

    def advance(self) -> "DionysusState":
        """Advance DIONYSUS by one heartbeat"""
        self.beat_count += 1

        # Update chaos field
        self._update_chaos()

        # Invoke muses
        inspirations = [muse.invoke(self.beat_count) for muse in self.muses if muse.is_active]
        self.inspiration_level = sum(inspirations) / len(inspirations) if inspirations else 0.0

        # Check for spontaneous idea generation
        if self.inspiration_level > ORDER_THRESHOLD and self.chaos.entropy > CHAOS_THRESHOLD:
            self._generate_idea()

        # Compute creativity score
        self.creativity_score = self._compute_score()

        # Update mode based on chaos/order balance
        self._update_mode()

        return self.get_state()

    def _update_chaos(self) -> None:
        """Update chaos field dynamics"""
        # Entropy fluctuates with PHI resonance
        entropy_delta = creative_noise(self.beat_count) - 0.5
        self.chaos.entropy = max(0.0, min(1.0, self.chaos.entropy + entropy_delta * 0.1))

        # Temperature follows inspiration
        self.chaos.temperature = 0.5 + self.inspiration_level * 0.5

        # Order parameter moves toward PHI_INV
        order_delta = (PHI_INV - self.chaos.order_parameter) * 0.01
        self.chaos.order_parameter += order_delta

    def _generate_idea(self) -> Optional[CreativeIdea]:
        """Generate a new creative idea"""
        if len(self.ideas) >= FIBONACCI[8]:  # Cap at 21 ideas
            return None

        # Select random active muse
        active_muses = [m for m in self.muses if m.is_active]
        if not active_muses:
            return None

        muse = random.choice(active_muses)

        # Determine emergence type
        recent_inspirations = [m.intensity for m in self.muses[-5:]]
        emergence = self.emergence.detect(recent_inspirations) or EmergenceType.SPONTANEOUS

        idea = CreativeIdea(
            id=f"IDEA_{self.beat_count}_{len(self.ideas)}",
            content=f"Inspiration from {muse.name} at beat {self.beat_count}",
            novelty=self.chaos.entropy * self.inspiration_level,
            coherence=self.chaos.order_parameter,
            muse_source=muse.domain,
            emergence_type=emergence,
            birth_beat=self.beat_count
        )
        self.ideas.append(idea)
        return idea

    def _compute_score(self) -> float:
        """Compute DIONYSUS creativity score"""
        if not self.ideas:
            return self.inspiration_level * phi_resonance(self.beat_count * 0.01)

        idea_scores = [i.quality_score() for i in self.ideas[-10:]]  # Recent ideas
        avg_quality = sum(idea_scores) / len(idea_scores)
        return avg_quality * self.inspiration_level * self.chaos.order_parameter

    def _update_mode(self) -> None:
        """Update creative mode based on state"""
        if self.chaos.entropy > 0.7:
            self.mode = CreativeMode.DIONYSIAN
        elif self.chaos.order_parameter > 0.7:
            self.mode = CreativeMode.APOLLONIAN
        elif self.inspiration_level > 0.8:
            self.mode = CreativeMode.INSPIRED
        else:
            self.mode = CreativeMode.SYNTHESIS

    def invoke_muse(self, domain: MuseDomain) -> Optional[float]:
        """Specifically invoke a muse"""
        muse = next((m for m in self.muses if m.domain == domain), None)
        if muse:
            return muse.invoke(self.beat_count)
        return None

    def get_state(self) -> "DionysusState":
        """Get current DIONYSUS state"""
        return DionysusState(
            beat_count=self.beat_count,
            mode=self.mode.value,
            creativity_score=self.creativity_score,
            inspiration_level=self.inspiration_level,
            chaos_entropy=self.chaos.entropy,
            chaos_order=self.chaos.order_parameter,
            idea_count=len(self.ideas),
            active_muses=sum(1 for m in self.muses if m.is_active),
            attribution=ATTRIBUTION
        )

    def get_summary(self) -> Dict:
        """Get DIONYSUS summary for monitoring"""
        return {
            "beat_count": self.beat_count,
            "mode": self.mode.value,
            "creativity_score": self.creativity_score,
            "inspiration_level": self.inspiration_level,
            "chaos": {
                "entropy": self.chaos.entropy,
                "temperature": self.chaos.temperature,
                "order_parameter": self.chaos.order_parameter
            },
            "muses": [
                {"name": m.name, "domain": m.domain.value, "intensity": m.intensity}
                for m in self.muses
            ],
            "ideas": len(self.ideas),
            "recent_ideas": [i.content for i in self.ideas[-3:]],
            "attribution": ATTRIBUTION
        }


# ═══════════════════════════════════════════════════════════════════════
# VI. STATE TYPES
# ═══════════════════════════════════════════════════════════════════════

@dataclass
class DionysusState:
    """Complete DIONYSUS state"""
    beat_count: int
    mode: str
    creativity_score: float
    inspiration_level: float
    chaos_entropy: float
    chaos_order: float
    idea_count: int
    active_muses: int
    attribution: str

    def to_dict(self) -> Dict:
        return {
            "beat_count": self.beat_count,
            "mode": self.mode,
            "creativity_score": self.creativity_score,
            "inspiration_level": self.inspiration_level,
            "chaos_entropy": self.chaos_entropy,
            "chaos_order": self.chaos_order,
            "idea_count": self.idea_count,
            "active_muses": self.active_muses,
            "attribution": self.attribution
        }


# ═══════════════════════════════════════════════════════════════════════
# VII. ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    dionysus = DionysusOrchestrator()

    # Run 100 heartbeats
    for _ in range(100):
        state = dionysus.advance()

    summary = dionysus.get_summary()
    print(f"DIONYSUS — THE CREATIVITY LAYER")
    print(f"Attribution: {ATTRIBUTION}")
    print(f"Mode: {summary['mode']}")
    print(f"Creativity Score: {summary['creativity_score']:.4f}")
    print(f"Inspiration Level: {summary['inspiration_level']:.4f}")
    print(f"Ideas Generated: {summary['ideas']}")
    print(f"Chaos Entropy: {summary['chaos']['entropy']:.4f}")
