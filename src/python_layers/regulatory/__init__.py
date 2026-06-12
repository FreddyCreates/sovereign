"""
SOVEREIGN REGULATORY — Government Agencies as Charters & Protocols
═══════════════════════════════════════════════════════════════════════════════

Attribution: Alfredo Medina Hernandez — immutable

Maps all government agencies and their regulatory frameworks into
Sovereign charters and protocols. Each agency becomes a charter authority,
each regulation becomes an enforceable protocol.

Agency Tiers:
    Tier 1 — Financial Regulators: SEC, FINRA, OCC, FDIC, FRB, CFPB, CFTC
    Tier 2 — Oversight Bodies: GAO, CBO, OMB, TREASURY, IRS
    Tier 3 — Standards & Protection: NIST, FTC, DOJ, FDA, EPA
    Tier 4 — Security & Defense: DHS, DOD, NSA, CIA, FBI
    Tier 5 — International: EU, BIS, IMF, WORLD_BANK, WTO

Protocol Model:
    Each regulation is encoded as a Sovereign protocol with:
    - Enforcement rules (automatic compliance checking)
    - Reporting requirements (data submission schedules)
    - Penalty structures (violation consequences)
    - PHI-weighted severity scoring
"""

__version__ = "1.0.0"
__author__ = "Alfredo Medina Hernandez"
__attribution__ = "Alfredo Medina Hernandez — immutable"

from .regulatory_core import (
    RegulatoryFramework,
    AgencyCharter,
    RegulatoryProtocol,
    ComplianceRule,
    EnforcementAction,
    AgencyTier,
    init_regulatory_framework,
)

__all__ = [
    "RegulatoryFramework",
    "AgencyCharter",
    "RegulatoryProtocol",
    "ComplianceRule",
    "EnforcementAction",
    "AgencyTier",
    "init_regulatory_framework",
]
