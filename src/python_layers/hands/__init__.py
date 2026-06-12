"""
SOVEREIGN HANDS — Manipulation & Interaction Layer
═══════════════════════════════════════════════════════════════════════════════

Attribution: Alfredo Medina Hernandez — immutable

Gives Sovereign the ability to reach out, manipulate, interact with,
and orchestrate external systems, APIs, data sources, and services.

Hand Architecture:
    - LEFT_HAND:  Data ingestion, pulling, receiving, sensing
    - RIGHT_HAND: Action execution, pushing, sending, commanding
    - BOTH_HANDS: Coordinated bilateral operations

Finger Subsystems (per hand):
    - THUMB:   Grip/Hold — Connection management, session persistence
    - INDEX:   Point/Direct — Routing, targeting, addressing
    - MIDDLE:  Extend/Reach — Range extension, proxy, relay
    - RING:    Bind/Commit — Transaction binding, confirmation
    - PINKY:   Signal/Sense — Telemetry, health check, ping

Mathematical Model:
    grip_strength = PHI * (fingers_engaged / 5) * coherence
    reach_distance = base_range * PHI^extension_level
    precision = 1 - (1/PHI)^calibration_cycles
"""

__version__ = "1.0.0"
__author__ = "Alfredo Medina Hernandez"
__attribution__ = "Alfredo Medina Hernandez — immutable"

from .hands import (
    SovereignHands,
    HandState,
    LeftHand,
    RightHand,
    Finger,
    GripAction,
    ReachAction,
    HandCoordinator,
    init_hands_state,
    execute_hands,
)

__all__ = [
    "SovereignHands",
    "HandState",
    "LeftHand",
    "RightHand",
    "Finger",
    "GripAction",
    "ReachAction",
    "HandCoordinator",
    "init_hands_state",
    "execute_hands",
]
