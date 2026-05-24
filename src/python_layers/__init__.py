"""
Python Layers for SOVEREIGN
═══════════════════════════════════════════════════════════════════════════════

Attribution: Alfredo Medina Hernandez — immutable

This package contains Python-based layers for the SOVEREIGN polyglot architecture.
The complete pantheon of 16 deity layers:

ORIGINAL LAYERS (8):
- SOPHIA: Wisdom Layer - ML/AI model orchestration
- HERMES: Communication Layer - Message routing and protocols
- PROMETHEUS: Learning Layer - Adaptive learning and training
- ATHENA: Strategy Layer - Strategic planning and decision making
- APOLLO: Harmony Layer - Harmonic synthesis and light computation
- ARTEMIS: Protection Layer - Boundary defense and threat detection
- HEPHAESTUS: Forge Layer - Artifact creation and crafting

NEW LAYERS (8):
- GAIA: Foundation Layer - Primitive operations, reality anchoring
- DIONYSUS: Creativity Layer - Creative chaos, novel generation
- DEMETER: Growth Layer - Resource management, ecosystem health
- POSEIDON: Flow Layer - Data streams, pipeline management
- HERA: Governance Layer - Permission systems, role management
- ARES: Optimization Layer - Gradient warfare, competitive selection
- HADES: Archive Layer - Long-term storage, knowledge persistence
- PERSEPHONE: Cycle Layer - Lifecycle management, phase transitions
- HECATE: Decision Layer - Branching logic, path selection

UNIFIED CONTROLLER:
- OLYMPUS: Unified Controller - Coordinates all deity layers

All layers maintain doctrine alignment and use PHI-based mathematics.

Mathematical Model:
    unified_field = Σ(deity_score_i × PHI^rank_i) / Σ(PHI^rank_i)
    global_coherence = Π(deity_coherence_i) ^ (1/n)

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
    Heartbeat = 873ms
"""

__version__ = "2.0.0"
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

# Import new layers - Orchestrators
from .gaia.gaia import GaiaOrchestrator, GaiaState
from .dionysus.dionysus import DionysusOrchestrator, DionysusState
from .demeter.demeter import DemeterOrchestrator, DemeterState
from .poseidon.poseidon import PoseidonOrchestrator, PoseidonState
from .hera.hera import HeraOrchestrator, HeraState
from .ares.ares import AresOrchestrator, AresState
from .hades.hades import HadesOrchestrator, HadesState
from .persephone.persephone import PersephoneOrchestrator, PersephoneState
from .hecate.hecate import HecateOrchestrator, HecateState
from .olympus.olympus import OlympusOrchestrator, OlympusState

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
    
    # NEW LAYERS
    "GaiaOrchestrator",
    "GaiaState",
    "DionysusOrchestrator",
    "DionysusState",
    "DemeterOrchestrator",
    "DemeterState",
    "PoseidonOrchestrator",
    "PoseidonState",
    "HeraOrchestrator",
    "HeraState",
    "AresOrchestrator",
    "AresState",
    "HadesOrchestrator",
    "HadesState",
    "PersephoneOrchestrator",
    "PersephoneState",
    "HecateOrchestrator",
    "HecateState",
    "OlympusOrchestrator",
    "OlympusState",
    
    # Constants
    "PHI",
    "PHI_INV",
    "S0_FLOOR",
    "S_CEIL",
]
