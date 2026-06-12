"""
SOVEREIGN API — Commercial Bundles
═══════════════════════════════════════════════════════════════════════════════

Attribution: Alfredo Medina Hernandez — immutable

Bundled API packages for commercial sale. Each bundle provides a curated
set of services at different price points and capability levels.
"""

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional
import time

from .api_core import APITier, SovereignAPI, APIKey
from .api_services import (
    IntelligenceAPI, DataAPI, GovernanceAPI,
    TrustAPI, AnalyticsAPI, StreamingAPI,
)

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI


# ═══════════════════════════════════════════════════════════════════════════════
# BUNDLE BASE
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class BundleConfig:
    """Configuration for an API bundle."""
    name: str
    tier: APITier
    services: List[str]
    price_monthly: float
    features: List[str]
    limits: Dict[str, int]
    description: str = ""


# ═══════════════════════════════════════════════════════════════════════════════
# BUNDLE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════════════

class FreeBundle:
    """Free tier — READ access to basic data."""
    CONFIG = BundleConfig(
        name="Free",
        tier=APITier.TETRAHEDRON,
        services=["data", "analytics"],
        price_monthly=0.0,
        features=["Market data (delayed)", "Basic analytics", "Community support"],
        limits={"rpm": 60, "rpd": 1000, "streams": 0},
        description="Get started with Sovereign data access",
    )

    def __init__(self):
        self.data = DataAPI()
        self.analytics = AnalyticsAPI()

    def get_services(self) -> Dict[str, Any]:
        return {"data": self.data, "analytics": self.analytics}


class BasicBundle:
    """Basic tier — READ/WRITE access."""
    CONFIG = BundleConfig(
        name="Basic",
        tier=APITier.CUBE,
        services=["data", "analytics", "trust"],
        price_monthly=49.99,
        features=["Real-time market data", "Trust verification", "Email support", "Basic reporting"],
        limits={"rpm": 300, "rpd": 10000, "streams": 2},
        description="Essential tools for data-driven decisions",
    )

    def __init__(self):
        self.data = DataAPI()
        self.analytics = AnalyticsAPI()
        self.trust = TrustAPI()

    def get_services(self) -> Dict[str, Any]:
        return {"data": self.data, "analytics": self.analytics, "trust": self.trust}


class ProBundle:
    """Pro tier — EXECUTE access with intelligence."""
    CONFIG = BundleConfig(
        name="Pro",
        tier=APITier.OCTAHEDRON,
        services=["intelligence", "data", "analytics", "trust", "streaming"],
        price_monthly=199.99,
        features=[
            "AI Intelligence queries", "Real-time streaming",
            "Advanced analytics", "Trust attestation",
            "Priority support", "Custom reports",
        ],
        limits={"rpm": 1000, "rpd": 100000, "streams": 10},
        description="Professional intelligence and data platform",
    )

    def __init__(self):
        self.intelligence = IntelligenceAPI()
        self.data = DataAPI()
        self.analytics = AnalyticsAPI()
        self.trust = TrustAPI()
        self.streaming = StreamingAPI()

    def get_services(self) -> Dict[str, Any]:
        return {
            "intelligence": self.intelligence,
            "data": self.data,
            "analytics": self.analytics,
            "trust": self.trust,
            "streaming": self.streaming,
        }


class EnterpriseBundle:
    """Enterprise tier — CREATE access with governance."""
    CONFIG = BundleConfig(
        name="Enterprise",
        tier=APITier.DODECAHEDRON,
        services=["intelligence", "data", "governance", "trust", "analytics", "streaming"],
        price_monthly=999.99,
        features=[
            "Full AI intelligence suite", "Governance & compliance",
            "Charter management", "Regulatory protocols",
            "Dedicated support", "SLA guarantee",
            "Custom integrations", "Bulk data access",
        ],
        limits={"rpm": 5000, "rpd": 500000, "streams": 50},
        description="Enterprise-grade sovereign intelligence platform",
    )

    def __init__(self):
        self.intelligence = IntelligenceAPI()
        self.data = DataAPI()
        self.governance = GovernanceAPI()
        self.trust = TrustAPI()
        self.analytics = AnalyticsAPI()
        self.streaming = StreamingAPI()

    def get_services(self) -> Dict[str, Any]:
        return {
            "intelligence": self.intelligence,
            "data": self.data,
            "governance": self.governance,
            "trust": self.trust,
            "analytics": self.analytics,
            "streaming": self.streaming,
        }


class SovereignBundle:
    """Sovereign tier — GOVERN access."""
    CONFIG = BundleConfig(
        name="Sovereign",
        tier=APITier.ICOSAHEDRON,
        services=["intelligence", "data", "governance", "trust", "analytics", "streaming"],
        price_monthly=4999.99,
        features=[
            "NGI-level intelligence", "Governance authority",
            "Protocol creation", "Regulatory compliance automation",
            "White-glove support", "Custom AI models",
            "Unlimited streaming", "Multi-region deployment",
            "Audit automation", "Trust authority",
        ],
        limits={"rpm": 20000, "rpd": 2000000, "streams": 200},
        description="Full sovereign governance and intelligence authority",
    )

    def __init__(self):
        self.intelligence = IntelligenceAPI()
        self.data = DataAPI()
        self.governance = GovernanceAPI()
        self.trust = TrustAPI()
        self.analytics = AnalyticsAPI()
        self.streaming = StreamingAPI()

    def get_services(self) -> Dict[str, Any]:
        return {
            "intelligence": self.intelligence,
            "data": self.data,
            "governance": self.governance,
            "trust": self.trust,
            "analytics": self.analytics,
            "streaming": self.streaming,
        }


class CreatorBundle:
    """Creator tier — ARCHITECT access (highest level)."""
    CONFIG = BundleConfig(
        name="Creator",
        tier=APITier.METATRON,
        services=["intelligence", "data", "governance", "trust", "analytics", "streaming"],
        price_monthly=9999.99,
        features=[
            "METATRON-level architect access", "System creation authority",
            "Protocol design", "Charter authoring",
            "AI being creation", "Custom cognitive languages",
            "Infinite rate limits", "Global deployment",
            "Direct Sovereign access", "PHI-resonance tuning",
        ],
        limits={"rpm": 100000, "rpd": 10000000, "streams": 1000},
        description="Architect-level creation authority over Sovereign systems",
    )

    def __init__(self):
        self.intelligence = IntelligenceAPI()
        self.data = DataAPI()
        self.governance = GovernanceAPI()
        self.trust = TrustAPI()
        self.analytics = AnalyticsAPI()
        self.streaming = StreamingAPI()

    def get_services(self) -> Dict[str, Any]:
        return {
            "intelligence": self.intelligence,
            "data": self.data,
            "governance": self.governance,
            "trust": self.trust,
            "analytics": self.analytics,
            "streaming": self.streaming,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# BUNDLE MANAGER
# ═══════════════════════════════════════════════════════════════════════════════

class BundleManager:
    """Manages bundle subscriptions and provisioning."""

    BUNDLES = {
        "free": FreeBundle,
        "basic": BasicBundle,
        "pro": ProBundle,
        "enterprise": EnterpriseBundle,
        "sovereign": SovereignBundle,
        "creator": CreatorBundle,
    }

    def __init__(self):
        self.subscriptions: Dict[str, Dict[str, Any]] = {}
        self.api = SovereignAPI()

    def subscribe(self, owner: str, bundle_name: str) -> Dict[str, Any]:
        """Subscribe an owner to a bundle."""
        if bundle_name not in self.BUNDLES:
            return {"error": f"Unknown bundle: {bundle_name}", "available": list(self.BUNDLES.keys())}

        bundle_cls = self.BUNDLES[bundle_name]
        config = bundle_cls.CONFIG
        bundle = bundle_cls()

        # Generate API key
        api_key = self.api.generate_key(owner, config.tier, expires_days=30)

        subscription = {
            "owner": owner,
            "bundle": bundle_name,
            "tier": config.tier.value,
            "services": config.services,
            "price_monthly": config.price_monthly,
            "features": config.features,
            "limits": config.limits,
            "api_key": api_key.key_id,
            "created_at": time.time(),
            "status": "active",
        }
        self.subscriptions[owner] = subscription
        return subscription

    def get_subscription(self, owner: str) -> Optional[Dict[str, Any]]:
        """Get subscription details for an owner."""
        return self.subscriptions.get(owner)

    def upgrade(self, owner: str, new_bundle: str) -> Dict[str, Any]:
        """Upgrade subscription to a higher bundle."""
        if owner in self.subscriptions:
            old = self.subscriptions[owner]["bundle"]
            # Revoke old key
            old_key = self.subscriptions[owner].get("api_key")
            if old_key:
                self.api.revoke_key(old_key)
        return self.subscribe(owner, new_bundle)

    def list_bundles(self) -> List[Dict[str, Any]]:
        """List all available bundles with pricing."""
        bundles = []
        for name, cls in self.BUNDLES.items():
            config = cls.CONFIG
            bundles.append({
                "name": config.name,
                "key": name,
                "tier": config.tier.value,
                "price_monthly": config.price_monthly,
                "services": config.services,
                "features": config.features,
                "limits": config.limits,
                "description": config.description,
            })
        return bundles

    def get_revenue_metrics(self) -> Dict[str, Any]:
        """Get revenue metrics across all subscriptions."""
        total_mrr = sum(
            self.BUNDLES[s["bundle"]].CONFIG.price_monthly
            for s in self.subscriptions.values()
            if s["status"] == "active"
        )
        return {
            "total_subscribers": len(self.subscriptions),
            "monthly_recurring_revenue": total_mrr,
            "annual_run_rate": total_mrr * 12,
            "phi_factor": total_mrr * PHI_INV,
            "tier_distribution": {
                name: sum(1 for s in self.subscriptions.values() if s["bundle"] == name)
                for name in self.BUNDLES
            },
        }
