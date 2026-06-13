"""
SOVEREIGN API — Core Engine
═══════════════════════════════════════════════════════════════════════════════

Attribution: Alfredo Medina Hernandez — immutable

Core API infrastructure: authentication, rate limiting, routing,
response formatting, and client management.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable, Dict, List, Optional
import hashlib
import math
import time

# ═══════════════════════════════════════════════════════════════════════════════
# CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI
SOLFEGGIO = [174, 285, 396, 417, 432, 528, 639, 741, 852, 963]


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class APITier(Enum):
    """API access tiers based on Platonic Solid resonance model."""
    TETRAHEDRON = "tetrahedron"    # 396 Hz — READ
    CUBE = "cube"                  # 417 Hz — WRITE
    OCTAHEDRON = "octahedron"      # 528 Hz — EXECUTE
    DODECAHEDRON = "dodecahedron"  # 639 Hz — CREATE
    ICOSAHEDRON = "icosahedron"    # 741 Hz — GOVERN
    METATRON = "metatron"          # 432 Hz — ARCHITECT


class APIStatus(Enum):
    SUCCESS = "success"
    ERROR = "error"
    RATE_LIMITED = "rate_limited"
    UNAUTHORIZED = "unauthorized"
    FORBIDDEN = "forbidden"
    NOT_FOUND = "not_found"


class ServiceType(Enum):
    INTELLIGENCE = "intelligence"
    DATA = "data"
    GOVERNANCE = "governance"
    TRUST = "trust"
    ANALYTICS = "analytics"
    STREAMING = "streaming"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA STRUCTURES
# ═══════════════════════════════════════════════════════════════════════════════

TIER_LIMITS = {
    APITier.TETRAHEDRON: {"rpm": 60, "rpd": 1000, "hz": 396},
    APITier.CUBE: {"rpm": 300, "rpd": 10000, "hz": 417},
    APITier.OCTAHEDRON: {"rpm": 1000, "rpd": 100000, "hz": 528},
    APITier.DODECAHEDRON: {"rpm": 5000, "rpd": 500000, "hz": 639},
    APITier.ICOSAHEDRON: {"rpm": 20000, "rpd": 2000000, "hz": 741},
    APITier.METATRON: {"rpm": 100000, "rpd": 10000000, "hz": 432},
}

TIER_PERMISSIONS = {
    APITier.TETRAHEDRON: ["read"],
    APITier.CUBE: ["read", "write"],
    APITier.OCTAHEDRON: ["read", "write", "execute"],
    APITier.DODECAHEDRON: ["read", "write", "execute", "create"],
    APITier.ICOSAHEDRON: ["read", "write", "execute", "create", "govern"],
    APITier.METATRON: ["read", "write", "execute", "create", "govern", "architect"],
}


@dataclass
class APIKey:
    """API authentication key with tier-based access."""
    key_id: str
    tier: APITier
    owner: str
    created_at: float = field(default_factory=time.time)
    expires_at: Optional[float] = None
    active: bool = True
    request_count: int = 0
    last_request: float = 0.0
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def permissions(self) -> List[str]:
        return TIER_PERMISSIONS.get(self.tier, [])

    @property
    def rate_limit(self) -> Dict[str, int]:
        return TIER_LIMITS.get(self.tier, {"rpm": 10, "rpd": 100, "hz": 174})

    @property
    def expired(self) -> bool:
        if self.expires_at is None:
            return False
        return time.time() > self.expires_at

    @property
    def valid(self) -> bool:
        return self.active and not self.expired


@dataclass
class APIResponse:
    """Standardized API response envelope."""
    status: APIStatus
    data: Optional[Any] = None
    error: Optional[str] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)
    request_id: str = ""
    latency_ms: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "status": self.status.value,
            "data": self.data,
            "error": self.error,
            "metadata": self.metadata,
            "timestamp": self.timestamp,
            "request_id": self.request_id,
            "latency_ms": self.latency_ms,
        }


@dataclass
class APIError:
    """API error with diagnostic information."""
    code: int
    message: str
    details: Optional[Dict[str, Any]] = None
    retry_after: Optional[int] = None

    def to_response(self) -> APIResponse:
        return APIResponse(
            status=APIStatus.ERROR,
            error=self.message,
            metadata={"code": self.code, "details": self.details, "retry_after": self.retry_after},
        )


# ═══════════════════════════════════════════════════════════════════════════════
# RATE LIMITER
# ═══════════════════════════════════════════════════════════════════════════════

class RateLimiter:
    """PHI-based rate limiter with sliding window."""

    def __init__(self):
        self.windows: Dict[str, List[float]] = {}

    def check(self, key_id: str, tier: APITier) -> bool:
        """Check if request is within rate limits."""
        now = time.time()
        limits = TIER_LIMITS.get(tier, {"rpm": 10, "rpd": 100})
        if key_id not in self.windows:
            self.windows[key_id] = []

        # Clean old entries (older than 1 minute)
        self.windows[key_id] = [t for t in self.windows[key_id] if now - t < 60]

        if len(self.windows[key_id]) >= limits["rpm"]:
            return False

        self.windows[key_id].append(now)
        return True

    def get_remaining(self, key_id: str, tier: APITier) -> int:
        """Get remaining requests in current window."""
        limits = TIER_LIMITS.get(tier, {"rpm": 10})
        current = len(self.windows.get(key_id, []))
        return max(0, limits["rpm"] - current)


# ═══════════════════════════════════════════════════════════════════════════════
# API CLIENT
# ═══════════════════════════════════════════════════════════════════════════════

class APIClient:
    """Client interface for consuming Sovereign API."""

    def __init__(self, api_key: APIKey):
        self.api_key = api_key
        self.base_url: str = "https://api.sovereign.ai/v1"
        self.request_count: int = 0
        self.last_response: Optional[APIResponse] = None

    def get(self, endpoint: str, params: Optional[Dict[str, Any]] = None) -> APIResponse:
        """GET request to API endpoint."""
        if "read" not in self.api_key.permissions:
            return APIError(403, "Insufficient permissions for READ").to_response()
        return self._make_request("GET", endpoint, params=params)

    def post(self, endpoint: str, body: Optional[Dict[str, Any]] = None) -> APIResponse:
        """POST request to API endpoint."""
        if "write" not in self.api_key.permissions:
            return APIError(403, "Insufficient permissions for WRITE").to_response()
        return self._make_request("POST", endpoint, body=body)

    def execute(self, endpoint: str, command: Dict[str, Any]) -> APIResponse:
        """Execute a command via API."""
        if "execute" not in self.api_key.permissions:
            return APIError(403, "Insufficient permissions for EXECUTE").to_response()
        return self._make_request("POST", f"{endpoint}/execute", body=command)

    def create(self, endpoint: str, resource: Dict[str, Any]) -> APIResponse:
        """Create a new resource via API."""
        if "create" not in self.api_key.permissions:
            return APIError(403, "Insufficient permissions for CREATE").to_response()
        return self._make_request("PUT", endpoint, body=resource)

    def govern(self, endpoint: str, policy: Dict[str, Any]) -> APIResponse:
        """Apply governance policy via API."""
        if "govern" not in self.api_key.permissions:
            return APIError(403, "Insufficient permissions for GOVERN").to_response()
        return self._make_request("POST", f"{endpoint}/govern", body=policy)

    def _make_request(self, method: str, endpoint: str,
                      params: Optional[Dict[str, Any]] = None,
                      body: Optional[Dict[str, Any]] = None) -> APIResponse:
        """Internal request handler."""
        start = time.time()
        self.request_count += 1
        self.api_key.request_count += 1
        self.api_key.last_request = start

        request_id = hashlib.sha256(
            f"{self.api_key.key_id}:{endpoint}:{start}".encode()
        ).hexdigest()[:16]

        response = APIResponse(
            status=APIStatus.SUCCESS,
            data={"method": method, "endpoint": endpoint, "params": params, "body": body},
            metadata={
                "tier": self.api_key.tier.value,
                "permissions": self.api_key.permissions,
                "remaining_rpm": TIER_LIMITS[self.api_key.tier]["rpm"] - self.request_count,
            },
            request_id=request_id,
            latency_ms=(time.time() - start) * 1000,
        )
        self.last_response = response
        return response


# ═══════════════════════════════════════════════════════════════════════════════
# SOVEREIGN API — Main Gateway
# ═══════════════════════════════════════════════════════════════════════════════

class SovereignAPI:
    """
    Main Sovereign API gateway — routes requests, manages keys,
    enforces rate limits, and coordinates service access.
    """

    def __init__(self):
        self.rate_limiter = RateLimiter()
        self.api_keys: Dict[str, APIKey] = {}
        self.routes: Dict[str, Callable] = {}
        self.request_log: List[Dict[str, Any]] = []
        self.total_requests: int = 0
        self.uptime_start: float = time.time()

    def generate_key(self, owner: str, tier: APITier,
                     expires_days: Optional[int] = None) -> APIKey:
        """Generate a new API key for a client."""
        key_id = hashlib.sha256(
            f"{owner}:{tier.value}:{time.time()}".encode()
        ).hexdigest()[:32]
        expires_at = None
        if expires_days:
            expires_at = time.time() + (expires_days * 86400)
        key = APIKey(
            key_id=key_id,
            tier=tier,
            owner=owner,
            expires_at=expires_at,
        )
        self.api_keys[key_id] = key
        return key

    def revoke_key(self, key_id: str) -> bool:
        """Revoke an API key."""
        if key_id in self.api_keys:
            self.api_keys[key_id].active = False
            return True
        return False

    def authenticate(self, key_id: str) -> Optional[APIKey]:
        """Authenticate a request by API key."""
        key = self.api_keys.get(key_id)
        if key and key.valid:
            return key
        return None

    def handle_request(self, key_id: str, method: str, endpoint: str,
                       params: Optional[Dict[str, Any]] = None,
                       body: Optional[Dict[str, Any]] = None) -> APIResponse:
        """Handle an incoming API request."""
        # Authenticate
        key = self.authenticate(key_id)
        if not key:
            return APIResponse(status=APIStatus.UNAUTHORIZED, error="Invalid or expired API key")

        # Rate limit
        if not self.rate_limiter.check(key_id, key.tier):
            return APIResponse(
                status=APIStatus.RATE_LIMITED,
                error="Rate limit exceeded",
                metadata={"retry_after": 60},
            )

        # Process
        self.total_requests += 1
        client = APIClient(key)

        if method == "GET":
            return client.get(endpoint, params)
        elif method == "POST":
            return client.post(endpoint, body)
        elif method == "PUT":
            return client.create(endpoint, body or {})
        else:
            return APIResponse(status=APIStatus.ERROR, error=f"Unsupported method: {method}")

    def get_metrics(self) -> Dict[str, Any]:
        """Get API gateway metrics."""
        uptime = time.time() - self.uptime_start
        return {
            "total_requests": self.total_requests,
            "active_keys": sum(1 for k in self.api_keys.values() if k.valid),
            "total_keys": len(self.api_keys),
            "uptime_seconds": uptime,
            "requests_per_second": self.total_requests / max(1, uptime),
            "tier_distribution": {
                tier.value: sum(1 for k in self.api_keys.values() if k.tier == tier)
                for tier in APITier
            },
        }

    def register_route(self, path: str, handler: Callable):
        """Register a route handler."""
        self.routes[path] = handler

    def list_routes(self) -> List[str]:
        """List all registered routes."""
        return list(self.routes.keys())


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE-LEVEL
# ═══════════════════════════════════════════════════════════════════════════════

def init_api() -> SovereignAPI:
    """Initialize Sovereign API gateway."""
    return SovereignAPI()
