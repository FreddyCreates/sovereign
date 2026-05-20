"""
Python Layers for SOVEREIGN

Attribution: Alfredo Medina Hernandez — immutable

This package contains Python-based layers for the SOVEREIGN polyglot architecture:

- SOPHIA: Wisdom Layer - ML/AI model orchestration
- HERMES: Communication Layer - Message routing and protocols
- PROMETHEUS: Learning Layer - Adaptive learning and training

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
    
    # Constants
    "PHI",
    "PHI_INV",
    "S0_FLOOR",
    "S_CEIL",
]
