"""
SOVEREIGN API LIBRARY — Commercial Python API Platform
═══════════════════════════════════════════════════════════════════════════════

Attribution: Alfredo Medina Hernandez — immutable

A comprehensive API library designed for commercial distribution and sale.
Provides REST, GraphQL, WebSocket, and RPC interfaces to Sovereign intelligence.

API Tiers (Platonic Solid Access Model):
    - TETRAHEDRON:  396 Hz — READ access (Free tier)
    - CUBE:         417 Hz — WRITE access (Basic tier)
    - OCTAHEDRON:   528 Hz — EXECUTE access (Pro tier)
    - DODECAHEDRON: 639 Hz — CREATE access (Enterprise tier)
    - ICOSAHEDRON:  741 Hz — GOVERN access (Sovereign tier)
    - METATRON:     432 Hz — ARCHITECT access (Creator tier)

Bundled Services:
    - Intelligence API: Access to all AI tiers (NGI/AGI/AASI/AI)
    - Data API: Financial, regulatory, market data
    - Governance API: Charter management, protocol access
    - Trust API: Verification, attestation, audit
    - Analytics API: Metrics, reporting, dashboards
    - Streaming API: Real-time data feeds
"""

__version__ = "1.0.0"
__author__ = "Alfredo Medina Hernandez"
__attribution__ = "Alfredo Medina Hernandez — immutable"

from .api_core import (
    SovereignAPI,
    APIClient,
    APIKey,
    APITier,
    APIResponse,
    APIError,
    RateLimiter,
    init_api,
)

from .api_services import (
    IntelligenceAPI,
    DataAPI,
    GovernanceAPI,
    TrustAPI,
    AnalyticsAPI,
    StreamingAPI,
)

from .api_bundles import (
    FreeBundle,
    BasicBundle,
    ProBundle,
    EnterpriseBundle,
    SovereignBundle,
    CreatorBundle,
    BundleManager,
)

__all__ = [
    "SovereignAPI",
    "APIClient",
    "APIKey",
    "APITier",
    "APIResponse",
    "APIError",
    "RateLimiter",
    "init_api",
    "IntelligenceAPI",
    "DataAPI",
    "GovernanceAPI",
    "TrustAPI",
    "AnalyticsAPI",
    "StreamingAPI",
    "FreeBundle",
    "BasicBundle",
    "ProBundle",
    "EnterpriseBundle",
    "SovereignBundle",
    "CreatorBundle",
    "BundleManager",
]
