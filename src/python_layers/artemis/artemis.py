"""
ARTEMIS - The Protection Layer
ΑΡΤΕΜΙΣ (Greek) | Diana Custos (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML/AI orchestration for protection systems)
Domain: Protection computation, boundary defense, threat detection,
        perimeter security, doctrine-aligned guardianship

Purpose: ARTEMIS provides protective intelligence for sovereign boundaries.
         Named for the goddess of the hunt and protector of the wild.
         All defenses must align with sovereign doctrine.

Mathematical Model:
    defense_score = Σ(barrier_i × strength_i) / perimeter_length
    threat_detection = pattern_match(signals, threat_signatures) × sensitivity
    boundary_integrity = (1 - breaches) × barrier_coverage
    artemis_score = defense × detection × integrity × doctrine_alignment

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple, Set
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

# Defense constants
MAX_BARRIERS = 21  # Fibonacci bound
MAX_THREATS = 89   # Fibonacci
DETECTION_THRESHOLD = 0.5
INTEGRITY_CRITICAL = 0.3

# Fibonacci for scaling
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


# ═══════════════════════════════════════════════════════════════════════
# III. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

class ThreatLevel(Enum):
    """Threat severity levels"""
    NONE = 0
    LOW = 1
    MODERATE = 2
    HIGH = 3
    CRITICAL = 4


class BarrierType(Enum):
    """Types of defensive barriers"""
    PERIMETER = "perimeter"      # Outer boundary
    FIREWALL = "firewall"        # Traffic filtering
    ENCRYPTION = "encryption"    # Data protection
    AUTHENTICATION = "authentication"  # Identity verification
    ISOLATION = "isolation"      # Compartmentalization


class ThreatType(Enum):
    """Types of threats"""
    INTRUSION = "intrusion"      # Unauthorized access attempt
    EXFILTRATION = "exfiltration"  # Data theft attempt
    CORRUPTION = "corruption"    # Data manipulation
    DENIAL = "denial"            # Service disruption
    RECONNAISSANCE = "reconnaissance"  # Information gathering


@dataclass
class Barrier:
    """A defensive barrier"""
    id: str
    name: str
    barrier_type: BarrierType
    strength: float          # 0.0 to PHI
    coverage: float          # 0.0 to 1.0 (perimeter coverage)
    integrity: float         # 0.0 to 1.0 (structural health)
    doctrine_alignment: float
    active: bool = True
    breach_count: int = 0
    last_tested_beat: int = 0


@dataclass
class Threat:
    """A detected threat"""
    id: str
    threat_type: ThreatType
    level: ThreatLevel
    confidence: float        # Detection confidence (0.0 to 1.0)
    origin: str              # Where it came from
    target: str              # What it's targeting
    signature: str           # Pattern signature
    detected_beat: int
    neutralized: bool = False
    neutralized_beat: Optional[int] = None


@dataclass
class Perimeter:
    """The defensive perimeter"""
    total_length: float      # Perimeter "size"
    barriers: List[Barrier]
    coverage_map: Dict[str, float]  # Sector -> coverage
    total_coverage: float
    total_strength: float
    weak_points: List[str]


@dataclass
class DetectionState:
    """Threat detection state"""
    sensitivity: float       # 0.0 to 1.0
    active_threats: List[Threat]
    threat_history: List[Threat]
    false_positive_rate: float
    detection_rate: float
    last_scan_beat: int


@dataclass
class ArtemisState:
    """Complete Artemis protection state"""
    beat_count: int
    perimeter: Perimeter
    detection: DetectionState
    current_threat_level: ThreatLevel
    defense_score: float
    detection_score: float
    integrity_score: float
    artemis_score: float
    doctrine_alignment: float
    alert_history: List[Tuple[int, str, ThreatLevel]]


@dataclass
class ArtemisResponse:
    """Response from Artemis computation"""
    threat_level: ThreatLevel
    active_threats: int
    defense_score: float
    detection_score: float
    integrity_score: float
    artemis_score: float
    alerts: List[str]
    recommended_actions: List[str]


# ═══════════════════════════════════════════════════════════════════════
# IV. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

def init_perimeter() -> Perimeter:
    """Initialize default perimeter with basic barriers"""
    barriers = [
        Barrier(
            id="BARRIER_PERIMETER_0",
            name="Outer Perimeter",
            barrier_type=BarrierType.PERIMETER,
            strength=1.0,
            coverage=0.8,
            integrity=1.0,
            doctrine_alignment=0.9,
            active=True
        ),
        Barrier(
            id="BARRIER_FIREWALL_0",
            name="Doctrine Firewall",
            barrier_type=BarrierType.FIREWALL,
            strength=PHI_INV,
            coverage=1.0,
            integrity=1.0,
            doctrine_alignment=1.0,
            active=True
        )
    ]
    
    return Perimeter(
        total_length=100.0,  # Abstract units
        barriers=barriers,
        coverage_map={"north": 0.8, "south": 0.8, "east": 0.8, "west": 0.8},
        total_coverage=0.8,
        total_strength=compute_total_strength(barriers),
        weak_points=[]
    )


def init_detection_state() -> DetectionState:
    """Initialize detection state"""
    return DetectionState(
        sensitivity=0.7,
        active_threats=[],
        threat_history=[],
        false_positive_rate=0.05,
        detection_rate=0.9,
        last_scan_beat=0
    )


def init_artemis_state() -> ArtemisState:
    """Initialize Artemis state"""
    perimeter = init_perimeter()
    detection = init_detection_state()
    
    return ArtemisState(
        beat_count=0,
        perimeter=perimeter,
        detection=detection,
        current_threat_level=ThreatLevel.NONE,
        defense_score=compute_defense_score(perimeter),
        detection_score=detection.detection_rate,
        integrity_score=1.0,
        artemis_score=0.0,
        doctrine_alignment=0.9,
        alert_history=[]
    )


# ═══════════════════════════════════════════════════════════════════════
# V. DEFENSE COMPUTATION
# ═══════════════════════════════════════════════════════════════════════

def compute_total_strength(barriers: List[Barrier]) -> float:
    """Compute combined barrier strength"""
    if not barriers:
        return 0.0
    
    active_barriers = [b for b in barriers if b.active]
    if not active_barriers:
        return 0.0
    
    # Weighted by coverage and integrity
    weighted_sum = sum(
        b.strength * b.coverage * b.integrity * b.doctrine_alignment
        for b in active_barriers
    )
    coverage_sum = sum(b.coverage for b in active_barriers)
    
    if coverage_sum == 0:
        return 0.0
    
    return min(PHI, weighted_sum / coverage_sum)


def compute_defense_score(perimeter: Perimeter) -> float:
    """Compute overall defense score"""
    strength_factor = perimeter.total_strength / PHI
    coverage_factor = perimeter.total_coverage
    
    # Weak point penalty
    weak_point_penalty = len(perimeter.weak_points) * 0.05
    
    base_score = strength_factor * coverage_factor * (1.0 - weak_point_penalty)
    
    # PHI resonance
    phi_res = phi_resonance(base_score)
    
    return max(0.0, min(1.0, base_score * (0.8 + 0.2 * phi_res)))


def find_weak_points(perimeter: Perimeter) -> List[str]:
    """Identify weak points in the perimeter"""
    weak_points = []
    
    # Check coverage map
    for sector, coverage in perimeter.coverage_map.items():
        if coverage < 0.5:
            weak_points.append(f"Low coverage in {sector} sector")
    
    # Check barrier integrity
    for barrier in perimeter.barriers:
        if barrier.integrity < 0.5:
            weak_points.append(f"Degraded barrier: {barrier.name}")
        if barrier.breach_count > 2:
            weak_points.append(f"Frequently breached: {barrier.name}")
    
    return weak_points


def add_barrier(
    state: ArtemisState,
    name: str,
    barrier_type: BarrierType,
    strength: float,
    coverage: float,
    doctrine_alignment: float
) -> Tuple[Optional[Barrier], ArtemisState]:
    """Add a new barrier to the perimeter"""
    if len(state.perimeter.barriers) >= MAX_BARRIERS:
        return None, state
    
    barrier_id = f"BARRIER_{barrier_type.value.upper()}_{state.beat_count}"
    
    barrier = Barrier(
        id=barrier_id,
        name=name,
        barrier_type=barrier_type,
        strength=min(PHI, strength),
        coverage=max(0.0, min(1.0, coverage)),
        integrity=1.0,
        doctrine_alignment=max(0.0, min(1.0, doctrine_alignment)),
        active=True
    )
    
    new_barriers = state.perimeter.barriers + [barrier]
    new_perimeter = Perimeter(
        total_length=state.perimeter.total_length,
        barriers=new_barriers,
        coverage_map=state.perimeter.coverage_map,
        total_coverage=state.perimeter.total_coverage,
        total_strength=compute_total_strength(new_barriers),
        weak_points=find_weak_points(state.perimeter)
    )
    
    new_state = ArtemisState(
        beat_count=state.beat_count,
        perimeter=new_perimeter,
        detection=state.detection,
        current_threat_level=state.current_threat_level,
        defense_score=compute_defense_score(new_perimeter),
        detection_score=state.detection_score,
        integrity_score=state.integrity_score,
        artemis_score=state.artemis_score,
        doctrine_alignment=state.doctrine_alignment,
        alert_history=state.alert_history
    )
    
    return barrier, new_state


# ═══════════════════════════════════════════════════════════════════════
# VI. THREAT DETECTION
# ═══════════════════════════════════════════════════════════════════════

def detect_threat(
    state: ArtemisState,
    threat_type: ThreatType,
    level: ThreatLevel,
    origin: str,
    target: str,
    signature: str
) -> Tuple[Optional[Threat], ArtemisState]:
    """Detect and register a new threat"""
    if len(state.detection.active_threats) >= MAX_THREATS:
        return None, state
    
    # Detection probability based on sensitivity and threat level
    detection_prob = state.detection.sensitivity * (0.5 + 0.1 * level.value)
    
    # For simulation, we assume detection succeeds
    confidence = min(1.0, detection_prob * (1.0 - state.detection.false_positive_rate))
    
    threat_id = f"THREAT_{threat_type.value.upper()}_{state.beat_count}"
    
    threat = Threat(
        id=threat_id,
        threat_type=threat_type,
        level=level,
        confidence=confidence,
        origin=origin,
        target=target,
        signature=signature,
        detected_beat=state.beat_count
    )
    
    new_active = state.detection.active_threats + [threat]
    new_detection = DetectionState(
        sensitivity=state.detection.sensitivity,
        active_threats=new_active,
        threat_history=state.detection.threat_history,
        false_positive_rate=state.detection.false_positive_rate,
        detection_rate=state.detection.detection_rate,
        last_scan_beat=state.beat_count
    )
    
    # Update threat level
    new_threat_level = max(state.current_threat_level, level, key=lambda x: x.value)
    
    new_state = ArtemisState(
        beat_count=state.beat_count,
        perimeter=state.perimeter,
        detection=new_detection,
        current_threat_level=new_threat_level,
        defense_score=state.defense_score,
        detection_score=state.detection_score,
        integrity_score=state.integrity_score,
        artemis_score=state.artemis_score,
        doctrine_alignment=state.doctrine_alignment,
        alert_history=state.alert_history + [(state.beat_count, f"Threat detected: {threat_type.value}", level)]
    )
    
    return threat, new_state


def neutralize_threat(
    state: ArtemisState,
    threat_id: str
) -> ArtemisState:
    """Neutralize an active threat"""
    new_active = []
    new_history = list(state.detection.threat_history)
    
    for threat in state.detection.active_threats:
        if threat.id == threat_id:
            threat.neutralized = True
            threat.neutralized_beat = state.beat_count
            new_history.append(threat)
        else:
            new_active.append(threat)
    
    # Recalculate threat level
    if new_active:
        new_threat_level = max(t.level for t in new_active)
    else:
        new_threat_level = ThreatLevel.NONE
    
    new_detection = DetectionState(
        sensitivity=state.detection.sensitivity,
        active_threats=new_active,
        threat_history=new_history[-100:],  # Keep last 100
        false_positive_rate=state.detection.false_positive_rate,
        detection_rate=state.detection.detection_rate,
        last_scan_beat=state.detection.last_scan_beat
    )
    
    return ArtemisState(
        beat_count=state.beat_count,
        perimeter=state.perimeter,
        detection=new_detection,
        current_threat_level=new_threat_level,
        defense_score=state.defense_score,
        detection_score=state.detection_score,
        integrity_score=state.integrity_score,
        artemis_score=state.artemis_score,
        doctrine_alignment=state.doctrine_alignment,
        alert_history=state.alert_history + [(state.beat_count, f"Threat neutralized: {threat_id}", ThreatLevel.NONE)]
    )


# ═══════════════════════════════════════════════════════════════════════
# VII. INTEGRITY COMPUTATION
# ═══════════════════════════════════════════════════════════════════════

def compute_integrity_score(state: ArtemisState) -> float:
    """Compute overall boundary integrity"""
    if not state.perimeter.barriers:
        return 0.0
    
    # Average barrier integrity
    barrier_integrity = sum(b.integrity for b in state.perimeter.barriers) / len(state.perimeter.barriers)
    
    # Breach penalty
    total_breaches = sum(b.breach_count for b in state.perimeter.barriers)
    breach_penalty = min(0.5, total_breaches * 0.05)
    
    # Active threat penalty
    threat_penalty = min(0.3, len(state.detection.active_threats) * 0.03)
    
    integrity = barrier_integrity * (1.0 - breach_penalty) * (1.0 - threat_penalty)
    
    return max(0.0, min(1.0, integrity))


# ═══════════════════════════════════════════════════════════════════════
# VIII. MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════

def execute_artemis(
    state: ArtemisState,
    doctrine_alignment: Optional[float] = None
) -> Tuple[ArtemisResponse, ArtemisState]:
    """Execute Artemis protection intelligence"""
    # Update beat
    new_beat = state.beat_count + 1
    
    # Update doctrine if provided
    new_doctrine = doctrine_alignment if doctrine_alignment is not None else state.doctrine_alignment
    
    # Update perimeter
    new_perimeter = state.perimeter
    new_perimeter.weak_points = find_weak_points(new_perimeter)
    new_perimeter.total_strength = compute_total_strength(new_perimeter.barriers)
    
    # Compute scores
    defense_score = compute_defense_score(new_perimeter)
    detection_score = state.detection.detection_rate * state.detection.sensitivity
    integrity_score = compute_integrity_score(state)
    
    # Compute Artemis score
    phi_res = phi_resonance(defense_score)
    artemis_score = (
        defense_score * 
        detection_score * 
        integrity_score * 
        new_doctrine *
        (0.8 + 0.2 * phi_res)
    )
    
    # Generate alerts
    alerts = []
    if state.current_threat_level.value >= ThreatLevel.HIGH.value:
        alerts.append(f"ALERT: Threat level {state.current_threat_level.name}")
    if integrity_score < INTEGRITY_CRITICAL:
        alerts.append("CRITICAL: Boundary integrity compromised")
    for weak in new_perimeter.weak_points:
        alerts.append(f"WARNING: {weak}")
    
    # Generate recommendations
    recommendations = generate_recommendations(state, defense_score, integrity_score)
    
    # Build new state
    new_detection = DetectionState(
        sensitivity=state.detection.sensitivity,
        active_threats=state.detection.active_threats,
        threat_history=state.detection.threat_history,
        false_positive_rate=state.detection.false_positive_rate,
        detection_rate=state.detection.detection_rate,
        last_scan_beat=new_beat
    )
    
    new_state = ArtemisState(
        beat_count=new_beat,
        perimeter=new_perimeter,
        detection=new_detection,
        current_threat_level=state.current_threat_level,
        defense_score=defense_score,
        detection_score=detection_score,
        integrity_score=integrity_score,
        artemis_score=artemis_score,
        doctrine_alignment=new_doctrine,
        alert_history=state.alert_history
    )
    
    # Build response
    response = ArtemisResponse(
        threat_level=state.current_threat_level,
        active_threats=len(state.detection.active_threats),
        defense_score=defense_score,
        detection_score=detection_score,
        integrity_score=integrity_score,
        artemis_score=artemis_score,
        alerts=alerts,
        recommended_actions=recommendations
    )
    
    return response, new_state


def generate_recommendations(
    state: ArtemisState,
    defense_score: float,
    integrity_score: float
) -> List[str]:
    """Generate protection recommendations"""
    recommendations = []
    
    if defense_score < 0.5:
        recommendations.append("Strengthen perimeter barriers")
    
    if integrity_score < 0.5:
        recommendations.append("Repair damaged barriers")
    
    if state.detection.sensitivity < 0.7:
        recommendations.append("Increase detection sensitivity")
    
    if len(state.detection.active_threats) > 5:
        recommendations.append("Prioritize threat neutralization")
    
    if state.perimeter.total_coverage < 0.8:
        recommendations.append("Expand perimeter coverage")
    
    if not recommendations:
        recommendations.append("Maintain vigilance — defenses adequate")
    
    return recommendations


# ═══════════════════════════════════════════════════════════════════════
# IX. QUERY FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def get_summary(state: ArtemisState) -> Dict[str, any]:
    """Get Artemis state summary"""
    return {
        "beat_count": state.beat_count,
        "threat_level": state.current_threat_level.name,
        "active_threats": len(state.detection.active_threats),
        "total_barriers": len(state.perimeter.barriers),
        "perimeter_coverage": state.perimeter.total_coverage,
        "perimeter_strength": state.perimeter.total_strength,
        "weak_points": len(state.perimeter.weak_points),
        "defense_score": state.defense_score,
        "detection_score": state.detection_score,
        "integrity_score": state.integrity_score,
        "artemis_score": state.artemis_score,
        "doctrine_alignment": state.doctrine_alignment,
        "attribution": ATTRIBUTION
    }
