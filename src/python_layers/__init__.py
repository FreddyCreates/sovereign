"""
Python Layers for SOVEREIGN

Attribution: Alfredo Medina Hernandez — immutable

This package contains Python-based layers for the SOVEREIGN polyglot architecture:

- SOPHIA: Wisdom Layer - ML/AI model orchestration
- HERMES: Communication Layer - Message routing and protocols
- PROMETHEUS: Learning Layer - Adaptive learning and training
- ATHENA: Strategy Layer - Strategic planning and decision making
- APOLLO: Harmony Layer - Harmonic synthesis and light computation
- ARTEMIS: Protection Layer - Boundary defense and threat detection
- HEPHAESTUS: Forge Layer - Artifact creation and crafting

All layers maintain doctrine alignment and use PHI-based mathematics.

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
"""

__version__ = "1.0.0"
__author__ = "Alfredo Medina Hernandez"
__attribution__ = "Alfredo Medina Hernandez — immutable"

# Re-export main modules
from .sophia.sophia import (
    init_sophia_state,
    execute_sophia,
    SophiaState,
    WisdomQuery,
    WisdomResponse,
)

from .hermes.hermes import (
    init_hermes_state,
    execute_hermes,
    HermesState,
    Message,
    MessageType,
    Protocol,
)

from .prometheus.prometheus import (
    init_prometheus_state,
    execute_prometheus,
    PrometheusState,
    LearningSignal,
    LearningMode,
)

from .athena.athena import (
    init_athena_state,
    execute_athena,
    AthenaState,
    Strategy,
    Tactic,
    StrategyType,
)

from .apollo.apollo import (
    init_apollo_state,
    execute_apollo,
    ApolloState,
    HarmonicField,
    Frequency,
)

from .artemis.artemis import (
    init_artemis_state,
    execute_artemis,
    ArtemisState,
    Barrier,
    Threat,
    ThreatLevel,
)

from .hephaestus.hephaestus import (
    init_hephaestus_state,
    execute_hephaestus,
    HephaestusState,
    Artifact,
    Recipe,
    ForgeState,
)

# PHI constant available at package level
PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI
S0_FLOOR = 0.75
S_CEIL = 9.75

__all__ = [
    # SOPHIA
    "init_sophia_state",
    "execute_sophia",
    "SophiaState",
    "WisdomQuery",
    "WisdomResponse",
    
    # HERMES
    "init_hermes_state",
    "execute_hermes",
    "HermesState",
    "Message",
    "MessageType",
    "Protocol",
    
    # PROMETHEUS
    "init_prometheus_state",
    "execute_prometheus",
    "PrometheusState",
    "LearningSignal",
    "LearningMode",
    
    # ATHENA
    "init_athena_state",
    "execute_athena",
    "AthenaState",
    "Strategy",
    "Tactic",
    "StrategyType",
    
    # APOLLO
    "init_apollo_state",
    "execute_apollo",
    "ApolloState",
    "HarmonicField",
    "Frequency",
    
    # ARTEMIS
    "init_artemis_state",
    "execute_artemis",
    "ArtemisState",
    "Barrier",
    "Threat",
    "ThreatLevel",
    
    # HEPHAESTUS
    "init_hephaestus_state",
    "execute_hephaestus",
    "HephaestusState",
    "Artifact",
    "Recipe",
    "ForgeState",
    
    # Constants
    "PHI",
    "PHI_INV",
    "S0_FLOOR",
    "S_CEIL",
]
