"""
Python Substrate Package
Interconnected orchestration layer for Julia/Motoko/Python organism AI

Attribution: Alfredo Medina Hernandez — immutable
"""

from .organism_bus import (
    OrganismBusState,
    init_organism_bus,
    advance_organism_bus,
    get_organism_summary,
    serialize_for_julia,
    serialize_for_motoko,
    PHI, PHI_INV, S0_FLOOR, S_CEIL,
    FIBONACCI, SOLFEGGIO, LANGUAGES,
    ATTRIBUTION
)

from .deep_inference import (
    DeepInferenceState,
    init_deep_inference,
    advance_deep_inference,
    get_deep_inference_summary,
    InferenceNetwork,
    InferenceLayer,
    MultiHeadAttention
)

__all__ = [
    # Organism Bus
    "OrganismBusState",
    "init_organism_bus",
    "advance_organism_bus",
    "get_organism_summary",
    "serialize_for_julia",
    "serialize_for_motoko",
    
    # Deep Inference
    "DeepInferenceState",
    "init_deep_inference",
    "advance_deep_inference",
    "get_deep_inference_summary",
    "InferenceNetwork",
    "InferenceLayer",
    "MultiHeadAttention",
    
    # Constants
    "PHI",
    "PHI_INV",
    "S0_FLOOR",
    "S_CEIL",
    "FIBONACCI",
    "SOLFEGGIO",
    "LANGUAGES",
    "ATTRIBUTION"
]
