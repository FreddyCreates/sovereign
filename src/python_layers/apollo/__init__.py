"""
APOLLO - Harmonic Intelligence Layer
"""

from .apollo import (
    PHI, PHI_INV, S0_FLOOR, S_CEIL, ATTRIBUTION,
    BASE_FREQUENCY, SOLFEGGIO_FREQUENCIES, SCHUMANN_RESONANCE,
    HarmonicMode, LightPhase,
    Frequency, HarmonicField, LightState, PatternState, ApolloState, ApolloResponse,
    init_apollo_state, execute_apollo,
    add_frequency, compute_resonance_score, compute_beauty_score,
    get_summary
)

__all__ = [
    'PHI', 'PHI_INV', 'S0_FLOOR', 'S_CEIL', 'ATTRIBUTION',
    'BASE_FREQUENCY', 'SOLFEGGIO_FREQUENCIES', 'SCHUMANN_RESONANCE',
    'HarmonicMode', 'LightPhase',
    'Frequency', 'HarmonicField', 'LightState', 'PatternState', 'ApolloState', 'ApolloResponse',
    'init_apollo_state', 'execute_apollo',
    'add_frequency', 'compute_resonance_score', 'compute_beauty_score',
    'get_summary'
]
