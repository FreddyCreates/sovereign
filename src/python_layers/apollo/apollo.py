"""
APOLLO - The Harmony Layer
ΑΠΟΛΛΩΝ (Greek) | Apollo Lux (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML/AI orchestration for harmonic synthesis)
Domain: Harmonic analysis, light/pattern synthesis, resonance optimization,
        frequency alignment, aesthetic computation

Purpose: APOLLO provides harmonic intelligence for sovereign frequency alignment.
         Named for the god of light, music, and harmony.
         All harmonics must resonate with sovereign doctrine.

Mathematical Model:
    harmonic_score = Σ(frequency_i × weight_i × resonance_i) / n
    light_intensity = amplitude² × phi_resonance
    pattern_beauty = symmetry × proportion × golden_ratio
    apollo_score = harmony × light × pattern × doctrine_alignment

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
    BASE_FREQUENCY = 432.0  # Hz - Sovereign harmonic
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
from enum import Enum
import math

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI
S0_FLOOR = 0.75
S_CEIL = 9.75

# Harmonic constants
BASE_FREQUENCY = 432.0  # Hz - Sovereign base
SOLFEGGIO_FREQUENCIES = [174, 285, 396, 417, 528, 639, 741, 852, 963]
SCHUMANN_RESONANCE = 7.83  # Hz - Earth's resonance

# Light spectrum (normalized wavelengths)
LIGHT_SPECTRUM = {
    "violet": 0.380,
    "blue": 0.450,
    "cyan": 0.500,
    "green": 0.550,
    "yellow": 0.580,
    "orange": 0.620,
    "red": 0.700
}

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


def is_harmonic(freq_a: float, freq_b: float, tolerance: float = 0.02) -> bool:
    """Check if two frequencies are harmonically related"""
    if freq_a == 0 or freq_b == 0:
        return False
    ratio = max(freq_a, freq_b) / min(freq_a, freq_b)
    # Check for simple integer ratios
    for n in range(1, 9):
        for d in range(1, 9):
            if abs(ratio - n/d) < tolerance:
                return True
    # Check for PHI ratio
    if abs(ratio - PHI) < tolerance or abs(ratio - PHI_INV) < tolerance:
        return True
    return False


# ═══════════════════════════════════════════════════════════════════════
# III. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

class HarmonicMode(Enum):
    """Harmonic modes"""
    IONIAN = "ionian"           # Major - bright
    DORIAN = "dorian"           # Minor - balanced
    PHRYGIAN = "phrygian"       # Minor - intense
    LYDIAN = "lydian"           # Major - ethereal
    MIXOLYDIAN = "mixolydian"   # Major - grounded
    AEOLIAN = "aeolian"         # Natural minor - melancholic
    LOCRIAN = "locrian"         # Diminished - tense


class LightPhase(Enum):
    """Light phases"""
    DAWN = "dawn"        # Rising
    ZENITH = "zenith"    # Peak
    DUSK = "dusk"        # Setting
    NADIR = "nadir"      # Absent


@dataclass
class Frequency:
    """A frequency with harmonic properties"""
    hz: float
    amplitude: float     # 0.0 to PHI
    phase: float         # 0.0 to 2π
    harmonic_order: int  # Which harmonic (1 = fundamental)
    solfeggio_alignment: float  # How close to solfeggio


@dataclass
class HarmonicField:
    """Field of interacting frequencies"""
    frequencies: List[Frequency]
    fundamental: float
    mode: HarmonicMode
    coherence: float     # How well frequencies align
    resonance_score: float


@dataclass
class LightState:
    """State of light/illumination"""
    phase: LightPhase
    intensity: float     # 0.0 to PHI
    color_temperature: float  # In Kelvin-like units
    spectrum_balance: Dict[str, float]  # Color weights
    brightness: float


@dataclass
class PatternState:
    """State of pattern/beauty computation"""
    symmetry_score: float    # 0.0 to 1.0
    proportion_score: float  # 0.0 to 1.0 (golden ratio alignment)
    complexity: float        # 0.0 to 1.0
    beauty_score: float


@dataclass
class ApolloState:
    """Complete Apollo harmonic state"""
    beat_count: int
    harmonic_field: HarmonicField
    light_state: LightState
    pattern_state: PatternState
    doctrine_alignment: float
    apollo_score: float
    history: List[Tuple[int, float]]  # (beat, score)


@dataclass
class ApolloResponse:
    """Response from Apollo computation"""
    harmonic_score: float
    light_intensity: float
    pattern_beauty: float
    apollo_score: float
    recommended_frequency: float
    harmonic_guidance: str


# ═══════════════════════════════════════════════════════════════════════
# IV. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

def init_harmonic_field() -> HarmonicField:
    """Initialize with base 432 Hz harmonic field"""
    fundamental = BASE_FREQUENCY
    
    frequencies = []
    for i in range(1, 8):  # First 7 harmonics
        freq = Frequency(
            hz=fundamental * i,
            amplitude=1.0 / i,  # Natural harmonic decay
            phase=0.0,
            harmonic_order=i,
            solfeggio_alignment=compute_solfeggio_alignment(fundamental * i)
        )
        frequencies.append(freq)
    
    return HarmonicField(
        frequencies=frequencies,
        fundamental=fundamental,
        mode=HarmonicMode.IONIAN,
        coherence=1.0,
        resonance_score=1.0
    )


def init_light_state() -> LightState:
    """Initialize light state"""
    return LightState(
        phase=LightPhase.DAWN,
        intensity=0.5,
        color_temperature=5500.0,  # Daylight-like
        spectrum_balance={k: 1.0/7 for k in LIGHT_SPECTRUM.keys()},
        brightness=0.5
    )


def init_pattern_state() -> PatternState:
    """Initialize pattern state"""
    return PatternState(
        symmetry_score=0.8,
        proportion_score=PHI_INV,  # Golden ratio proportion
        complexity=0.5,
        beauty_score=0.618
    )


def init_apollo_state() -> ApolloState:
    """Initialize Apollo state"""
    return ApolloState(
        beat_count=0,
        harmonic_field=init_harmonic_field(),
        light_state=init_light_state(),
        pattern_state=init_pattern_state(),
        doctrine_alignment=0.8,
        apollo_score=0.0,
        history=[]
    )


# ═══════════════════════════════════════════════════════════════════════
# V. HARMONIC COMPUTATION
# ═══════════════════════════════════════════════════════════════════════

def compute_solfeggio_alignment(freq: float) -> float:
    """Compute how close a frequency is to solfeggio frequencies"""
    if freq <= 0:
        return 0.0
    
    min_distance = float('inf')
    for solfeggio in SOLFEGGIO_FREQUENCIES:
        # Check direct match and octave relationships
        for octave in [-2, -1, 0, 1, 2]:
            solf_freq = solfeggio * (2 ** octave)
            distance = abs(freq - solf_freq) / solf_freq
            min_distance = min(min_distance, distance)
    
    # Convert distance to alignment (closer = higher)
    alignment = max(0.0, 1.0 - min_distance)
    return alignment


def compute_harmonic_coherence(frequencies: List[Frequency]) -> float:
    """Compute how coherently frequencies interact"""
    if len(frequencies) < 2:
        return 1.0
    
    harmonic_pairs = 0
    total_pairs = 0
    
    for i, freq_a in enumerate(frequencies):
        for freq_b in frequencies[i+1:]:
            total_pairs += 1
            if is_harmonic(freq_a.hz, freq_b.hz):
                harmonic_pairs += 1
    
    if total_pairs == 0:
        return 1.0
    
    return harmonic_pairs / total_pairs


def compute_resonance_score(field: HarmonicField) -> float:
    """Compute overall resonance of harmonic field"""
    if not field.frequencies:
        return 0.0
    
    # Weighted sum of amplitudes × solfeggio alignment
    weighted_sum = 0.0
    total_amplitude = 0.0
    
    for freq in field.frequencies:
        weighted_sum += freq.amplitude * freq.solfeggio_alignment
        total_amplitude += freq.amplitude
    
    if total_amplitude == 0:
        return 0.0
    
    base_resonance = weighted_sum / total_amplitude
    
    # Coherence multiplier
    coherence_factor = field.coherence
    
    # PHI resonance bonus
    phi_res = phi_resonance(base_resonance)
    
    return base_resonance * coherence_factor * (0.7 + 0.3 * phi_res)


def add_frequency(
    field: HarmonicField,
    hz: float,
    amplitude: float
) -> HarmonicField:
    """Add a frequency to the harmonic field"""
    new_freq = Frequency(
        hz=hz,
        amplitude=min(PHI, amplitude),
        phase=0.0,
        harmonic_order=round(hz / field.fundamental) if field.fundamental > 0 else 1,
        solfeggio_alignment=compute_solfeggio_alignment(hz)
    )
    
    new_frequencies = field.frequencies + [new_freq]
    new_coherence = compute_harmonic_coherence(new_frequencies)
    
    new_field = HarmonicField(
        frequencies=new_frequencies,
        fundamental=field.fundamental,
        mode=field.mode,
        coherence=new_coherence,
        resonance_score=0.0  # Recomputed later
    )
    new_field.resonance_score = compute_resonance_score(new_field)
    
    return new_field


# ═══════════════════════════════════════════════════════════════════════
# VI. LIGHT COMPUTATION
# ═══════════════════════════════════════════════════════════════════════

def compute_light_intensity(state: LightState) -> float:
    """Compute light intensity from state"""
    # Intensity = amplitude² × phase_factor
    phase_factor = {
        LightPhase.DAWN: 0.5,
        LightPhase.ZENITH: 1.0,
        LightPhase.DUSK: 0.5,
        LightPhase.NADIR: 0.1
    }.get(state.phase, 0.5)
    
    base_intensity = state.brightness ** 2 * phase_factor
    
    # PHI resonance
    phi_res = phi_resonance(state.brightness)
    
    return min(PHI, base_intensity * (0.8 + 0.2 * phi_res))


def advance_light_phase(state: LightState, beat_delta: int) -> LightState:
    """Advance light phase based on time"""
    # Phase cycle: 89 beats (Fibonacci)
    cycle_length = 89
    phases = [LightPhase.DAWN, LightPhase.ZENITH, LightPhase.DUSK, LightPhase.NADIR]
    
    # Simple phase advancement
    phase_idx = phases.index(state.phase)
    new_phase_idx = (phase_idx + beat_delta // (cycle_length // 4)) % 4
    
    # Intensity follows phase
    new_intensity = {
        LightPhase.DAWN: 0.5 + 0.3 * phi_resonance(beat_delta / cycle_length),
        LightPhase.ZENITH: 1.0,
        LightPhase.DUSK: 0.5,
        LightPhase.NADIR: 0.1
    }.get(phases[new_phase_idx], 0.5)
    
    return LightState(
        phase=phases[new_phase_idx],
        intensity=new_intensity,
        color_temperature=state.color_temperature,
        spectrum_balance=state.spectrum_balance,
        brightness=new_intensity
    )


# ═══════════════════════════════════════════════════════════════════════
# VII. PATTERN/BEAUTY COMPUTATION
# ═══════════════════════════════════════════════════════════════════════

def compute_beauty_score(state: PatternState) -> float:
    """Compute beauty score from pattern state"""
    # Beauty = symmetry × proportion × (1 - complexity/2)
    # Simpler patterns that are symmetric and golden-proportioned are more beautiful
    
    symmetry_factor = state.symmetry_score
    
    # Proportion score - peaks at golden ratio
    golden_distance = abs(state.proportion_score - PHI_INV)
    proportion_factor = 1.0 - min(1.0, golden_distance * 2)
    
    # Complexity penalty (moderate complexity is best)
    complexity_factor = 1.0 - abs(state.complexity - 0.5)
    
    base_beauty = symmetry_factor * proportion_factor * complexity_factor
    
    # PHI resonance bonus
    phi_res = phi_resonance(base_beauty)
    
    return min(1.0, base_beauty * (0.8 + 0.2 * phi_res))


def update_pattern_state(
    state: PatternState,
    symmetry: float,
    proportion: float,
    complexity: float
) -> PatternState:
    """Update pattern state with new values"""
    new_state = PatternState(
        symmetry_score=max(0.0, min(1.0, symmetry)),
        proportion_score=max(0.0, min(1.0, proportion)),
        complexity=max(0.0, min(1.0, complexity)),
        beauty_score=0.0
    )
    new_state.beauty_score = compute_beauty_score(new_state)
    return new_state


# ═══════════════════════════════════════════════════════════════════════
# VIII. MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════

def execute_apollo(
    state: ApolloState,
    doctrine_alignment: Optional[float] = None
) -> Tuple[ApolloResponse, ApolloState]:
    """Execute Apollo harmonic intelligence"""
    # Update beat
    new_beat = state.beat_count + 1
    
    # Update doctrine if provided
    new_doctrine = doctrine_alignment if doctrine_alignment is not None else state.doctrine_alignment
    
    # Update harmonic field
    new_field = state.harmonic_field
    new_field.coherence = compute_harmonic_coherence(new_field.frequencies)
    new_field.resonance_score = compute_resonance_score(new_field)
    
    # Update light state
    new_light = advance_light_phase(state.light_state, 1)
    light_intensity = compute_light_intensity(new_light)
    
    # Update pattern state
    new_pattern = state.pattern_state
    new_pattern.beauty_score = compute_beauty_score(new_pattern)
    
    # Compute Apollo score
    harmonic_score = new_field.resonance_score
    pattern_beauty = new_pattern.beauty_score
    
    # Apollo score = harmony × light × pattern × doctrine
    phi_res = phi_resonance(harmonic_score)
    apollo_score = (
        harmonic_score * 
        (0.3 + 0.7 * light_intensity / PHI) * 
        (0.5 + 0.5 * pattern_beauty) * 
        new_doctrine *
        (0.8 + 0.2 * phi_res)
    )
    
    # Recommend frequency (next solfeggio or harmonic)
    recommended_freq = recommend_frequency(new_field)
    
    # Generate guidance
    guidance = generate_harmonic_guidance(new_field, new_light, new_pattern)
    
    # Update history
    new_history = state.history + [(new_beat, apollo_score)]
    if len(new_history) > 100:
        new_history = new_history[-100:]
    
    # Build new state
    new_state = ApolloState(
        beat_count=new_beat,
        harmonic_field=new_field,
        light_state=new_light,
        pattern_state=new_pattern,
        doctrine_alignment=new_doctrine,
        apollo_score=apollo_score,
        history=new_history
    )
    
    # Build response
    response = ApolloResponse(
        harmonic_score=harmonic_score,
        light_intensity=light_intensity,
        pattern_beauty=pattern_beauty,
        apollo_score=apollo_score,
        recommended_frequency=recommended_freq,
        harmonic_guidance=guidance
    )
    
    return response, new_state


def recommend_frequency(field: HarmonicField) -> float:
    """Recommend next frequency to add for better harmony"""
    # Find missing solfeggio frequency
    current_freqs = [f.hz for f in field.frequencies]
    
    for solfeggio in SOLFEGGIO_FREQUENCIES:
        # Check if this solfeggio (or octave) is present
        is_present = any(is_harmonic(solfeggio, f) for f in current_freqs)
        if not is_present:
            return float(solfeggio)
    
    # If all solfeggio present, recommend PHI harmonic of fundamental
    return field.fundamental * PHI


def generate_harmonic_guidance(
    field: HarmonicField,
    light: LightState,
    pattern: PatternState
) -> str:
    """Generate harmonic guidance message"""
    messages = []
    
    if field.coherence > 0.8:
        messages.append("Harmonic coherence is high — frequencies sing together")
    elif field.coherence < 0.5:
        messages.append("Harmonic dissonance detected — seek resolution")
    
    if light.phase == LightPhase.ZENITH:
        messages.append("Light at zenith — clarity illuminates all")
    elif light.phase == LightPhase.NADIR:
        messages.append("In darkness, inner light guides")
    
    if pattern.beauty_score > 0.8:
        messages.append("Beauty manifests in golden proportion")
    
    return " | ".join(messages) if messages else "Harmony flows in its natural course"


# ═══════════════════════════════════════════════════════════════════════
# IX. QUERY FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def get_summary(state: ApolloState) -> Dict[str, any]:
    """Get Apollo state summary"""
    return {
        "beat_count": state.beat_count,
        "fundamental_frequency": state.harmonic_field.fundamental,
        "harmonic_count": len(state.harmonic_field.frequencies),
        "harmonic_coherence": state.harmonic_field.coherence,
        "resonance_score": state.harmonic_field.resonance_score,
        "light_phase": state.light_state.phase.value,
        "light_intensity": state.light_state.intensity,
        "pattern_beauty": state.pattern_state.beauty_score,
        "doctrine_alignment": state.doctrine_alignment,
        "apollo_score": state.apollo_score,
        "attribution": ATTRIBUTION
    }
