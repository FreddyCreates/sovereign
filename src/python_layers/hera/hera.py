"""
HERA - The Governance Layer
ΗΡΑ (Greek) | Iuno Regina (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML/AI orchestration for governance systems)
Domain: Permission systems, role management, hierarchy control,
        authority delegation, sovereign governance

Purpose: HERA provides governance intelligence for permission and role systems.
         Named for the queen of the gods, goddess of marriage and authority.
         Maintains hierarchical order within sovereign doctrine bounds.

Mathematical Model:
    authority_score = rank × trust × PHI_resonance
    permission_check = role.permissions ∩ required_permissions
    delegation_chain = Π(delegate_trust_i) ^ (1/n)
    hera_score = authority × compliance × stability × doctrine_alignment

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Set, Tuple
from enum import Enum, Flag, auto
import math
from datetime import datetime

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI
S0_FLOOR = 0.75
S_CEIL = 9.75

# Governance constants
MAX_ROLES = 49             # 7^2
MAX_HIERARCHY_DEPTH = 7
TRUST_DECAY_RATE = 0.01
AUTHORITY_THRESHOLD = 0.618
DELEGATION_LIMIT = 3

# Fibonacci for levels
FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]

# Attribution
ATTRIBUTION = "Alfredo Medina Hernandez"


# ═══════════════════════════════════════════════════════════════════════
# II. HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def clamp_sovereign(value: float) -> float:
    return max(S0_FLOOR, min(S_CEIL, value))


def normalize_sovereign(value: float) -> float:
    clamped = clamp_sovereign(value)
    return (clamped - S0_FLOOR) / (S_CEIL - S0_FLOOR)


def phi_resonance(value: float) -> float:
    return 0.5 + 0.5 * math.sin(value * math.pi * PHI)


def geometric_mean(values: List[float]) -> float:
    if not values:
        return 0.0
    product = 1.0
    for v in values:
        product *= max(v, 0.001)
    return product ** (1.0 / len(values))


# ═══════════════════════════════════════════════════════════════════════
# III. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

class Permission(Flag):
    """Permission flags"""
    NONE = 0
    READ = auto()
    WRITE = auto()
    EXECUTE = auto()
    CREATE = auto()
    DELETE = auto()
    GOVERN = auto()
    DELEGATE = auto()
    ARCHITECT = auto()  # Highest permission

    # Common combinations
    VIEWER = READ
    EDITOR = READ | WRITE
    OPERATOR = READ | WRITE | EXECUTE
    ADMIN = READ | WRITE | EXECUTE | CREATE | DELETE
    SOVEREIGN = READ | WRITE | EXECUTE | CREATE | DELETE | GOVERN | DELEGATE | ARCHITECT


class RankLevel(Enum):
    """Hierarchy rank levels"""
    OBSERVER = 1       # View only
    CONTRIBUTOR = 2    # Can contribute
    OPERATOR = 3       # Can operate
    MANAGER = 4        # Can manage others
    DIRECTOR = 5       # Strategic control
    GOVERNOR = 6       # Governance authority
    SOVEREIGN = 7      # Ultimate authority


class GovernanceMode(Enum):
    """Governance operation modes"""
    NORMAL = "normal"          # Standard operation
    ELEVATED = "elevated"      # Heightened security
    EMERGENCY = "emergency"    # Emergency powers
    LOCKDOWN = "lockdown"      # All access restricted


@dataclass
class Role:
    """A governance role"""
    id: str
    name: str
    rank: RankLevel
    permissions: Permission
    trust_level: float     # [0, 1]
    parent_role: Optional[str] = None
    child_roles: List[str] = field(default_factory=list)
    is_active: bool = True

    def has_permission(self, required: Permission) -> bool:
        """Check if role has required permissions"""
        return (self.permissions & required) == required


@dataclass
class Principal:
    """A governance principal (user/entity)"""
    id: str
    name: str
    roles: List[str]       # Role IDs
    trust_score: float     # [0, 1] overall trust
    authority_score: float
    delegation_depth: int  # How many delegations deep
    created_beat: int
    last_action_beat: int = 0

    def effective_authority(self) -> float:
        """Compute effective authority with delegation decay"""
        decay = PHI_INV ** self.delegation_depth
        return self.authority_score * self.trust_score * decay


@dataclass
class Delegation:
    """A delegation of authority"""
    id: str
    delegator_id: str
    delegate_id: str
    permissions: Permission
    trust_factor: float    # How much trust is transferred
    expires_beat: Optional[int]
    is_revocable: bool = True


@dataclass
class PolicyRule:
    """A governance policy rule"""
    id: str
    name: str
    required_permissions: Permission
    required_rank: RankLevel
    min_trust: float
    action: str            # What the rule governs
    is_enforced: bool = True


# ═══════════════════════════════════════════════════════════════════════
# IV. AUTHORITY MANAGER
# ═══════════════════════════════════════════════════════════════════════

class AuthorityManager:
    """
    Manages authority and delegation chains.
    Ensures proper hierarchy maintenance.
    """

    def __init__(self):
        self.roles: Dict[str, Role] = {}
        self.principals: Dict[str, Principal] = {}
        self.delegations: List[Delegation] = []
        self._init_default_roles()

    def _init_default_roles(self) -> None:
        """Initialize default role hierarchy"""
        default_roles = [
            ("ROLE_OBSERVER", "Observer", RankLevel.OBSERVER, Permission.VIEWER),
            ("ROLE_CONTRIBUTOR", "Contributor", RankLevel.CONTRIBUTOR, Permission.EDITOR),
            ("ROLE_OPERATOR", "Operator", RankLevel.OPERATOR, Permission.OPERATOR),
            ("ROLE_MANAGER", "Manager", RankLevel.MANAGER, Permission.ADMIN),
            ("ROLE_DIRECTOR", "Director", RankLevel.DIRECTOR, Permission.ADMIN | Permission.GOVERN),
            ("ROLE_GOVERNOR", "Governor", RankLevel.GOVERNOR, Permission.ADMIN | Permission.GOVERN | Permission.DELEGATE),
            ("ROLE_SOVEREIGN", "Sovereign", RankLevel.SOVEREIGN, Permission.SOVEREIGN),
        ]

        parent = None
        for role_id, name, rank, perms in default_roles:
            role = Role(
                id=role_id,
                name=name,
                rank=rank,
                permissions=perms,
                trust_level=0.5 + rank.value * 0.07,
                parent_role=parent
            )
            self.roles[role_id] = role
            if parent:
                self.roles[parent].child_roles.append(role_id)
            parent = role_id

    def check_authority(self, principal_id: str, required_permission: Permission,
                        required_rank: RankLevel, min_trust: float) -> bool:
        """Check if principal has required authority"""
        if principal_id not in self.principals:
            return False

        principal = self.principals[principal_id]

        # Check trust
        if principal.trust_score < min_trust:
            return False

        # Check roles
        for role_id in principal.roles:
            if role_id not in self.roles:
                continue
            role = self.roles[role_id]

            # Check rank
            if role.rank.value < required_rank.value:
                continue

            # Check permissions
            if role.has_permission(required_permission):
                return True

        return False

    def delegate(self, delegator_id: str, delegate_id: str,
                 permissions: Permission, trust_factor: float) -> Optional[Delegation]:
        """Create a delegation"""
        if delegator_id not in self.principals or delegate_id not in self.principals:
            return None

        delegator = self.principals[delegator_id]
        delegate = self.principals[delegate_id]

        # Check delegation limit
        if delegate.delegation_depth >= DELEGATION_LIMIT:
            return None

        # Check if delegator can delegate
        can_delegate = False
        for role_id in delegator.roles:
            if role_id in self.roles and Permission.DELEGATE in self.roles[role_id].permissions:
                can_delegate = True
                break

        if not can_delegate:
            return False

        delegation = Delegation(
            id=f"DEL_{len(self.delegations)}",
            delegator_id=delegator_id,
            delegate_id=delegate_id,
            permissions=permissions,
            trust_factor=trust_factor,
            expires_beat=None
        )
        self.delegations.append(delegation)

        # Update delegate
        delegate.delegation_depth += 1
        delegate.authority_score *= trust_factor

        return delegation


# ═══════════════════════════════════════════════════════════════════════
# V. HERA ORCHESTRATOR
# ═══════════════════════════════════════════════════════════════════════

class HeraOrchestrator:
    """
    Main orchestrator for the HERA governance layer.
    Manages roles, principals, and authority.
    """

    def __init__(self):
        self.authority = AuthorityManager()
        self.policies: List[PolicyRule] = []
        self.mode = GovernanceMode.NORMAL
        self.beat_count = 0
        self.compliance_score = 1.0
        self.stability_score = 1.0
        self.hera_score = 0.0
        self._init_policies()

    def _init_policies(self) -> None:
        """Initialize default policies"""
        default_policies = [
            ("POL_READ", "Read Access", Permission.READ, RankLevel.OBSERVER, 0.1, "read"),
            ("POL_WRITE", "Write Access", Permission.WRITE, RankLevel.CONTRIBUTOR, 0.3, "write"),
            ("POL_EXECUTE", "Execute Access", Permission.EXECUTE, RankLevel.OPERATOR, 0.5, "execute"),
            ("POL_CREATE", "Create Access", Permission.CREATE, RankLevel.MANAGER, 0.6, "create"),
            ("POL_DELETE", "Delete Access", Permission.DELETE, RankLevel.MANAGER, 0.7, "delete"),
            ("POL_GOVERN", "Governance Access", Permission.GOVERN, RankLevel.GOVERNOR, 0.8, "govern"),
            ("POL_ARCHITECT", "Architect Access", Permission.ARCHITECT, RankLevel.SOVEREIGN, 0.95, "architect"),
        ]

        for pol_id, name, perm, rank, trust, action in default_policies:
            policy = PolicyRule(
                id=pol_id,
                name=name,
                required_permissions=perm,
                required_rank=rank,
                min_trust=trust,
                action=action
            )
            self.policies.append(policy)

    def advance(self) -> "HeraState":
        """Advance HERA by one heartbeat"""
        self.beat_count += 1

        # Update trust decay
        self._decay_trust()

        # Check compliance
        self.compliance_score = self._compute_compliance()

        # Check stability
        self.stability_score = self._compute_stability()

        # Compute HERA score
        self.hera_score = self._compute_hera_score()

        # Update mode based on scores
        self._update_mode()

        return self.get_state()

    def _decay_trust(self) -> None:
        """Apply trust decay to inactive principals"""
        for principal in self.authority.principals.values():
            inactivity = self.beat_count - principal.last_action_beat
            if inactivity > FIBONACCI[6]:  # 8 beats
                decay = TRUST_DECAY_RATE * (inactivity / FIBONACCI[6])
                principal.trust_score = max(0.1, principal.trust_score - decay)

    def _compute_compliance(self) -> float:
        """Compute compliance score"""
        if not self.authority.principals:
            return 1.0

        compliant_count = 0
        for principal in self.authority.principals.values():
            if principal.trust_score >= AUTHORITY_THRESHOLD:
                compliant_count += 1

        return compliant_count / len(self.authority.principals)

    def _compute_stability(self) -> float:
        """Compute hierarchy stability"""
        if not self.authority.roles:
            return 1.0

        # Check role hierarchy integrity
        orphan_count = 0
        for role in self.authority.roles.values():
            if role.parent_role and role.parent_role not in self.authority.roles:
                orphan_count += 1

        return 1.0 - (orphan_count / len(self.authority.roles))

    def _compute_hera_score(self) -> float:
        """Compute HERA score"""
        phi_res = phi_resonance(self.beat_count * 0.01)
        return self.compliance_score * self.stability_score * phi_res

    def _update_mode(self) -> None:
        """Update governance mode based on state"""
        if self.compliance_score < 0.3:
            self.mode = GovernanceMode.LOCKDOWN
        elif self.compliance_score < 0.5:
            self.mode = GovernanceMode.EMERGENCY
        elif self.compliance_score < 0.7:
            self.mode = GovernanceMode.ELEVATED
        else:
            self.mode = GovernanceMode.NORMAL

    def register_principal(self, name: str, role_ids: List[str]) -> Principal:
        """Register a new principal"""
        principal = Principal(
            id=f"PRINCIPAL_{self.beat_count}_{len(self.authority.principals)}",
            name=name,
            roles=role_ids,
            trust_score=0.5,
            authority_score=0.5,
            delegation_depth=0,
            created_beat=self.beat_count
        )

        # Calculate initial authority from roles
        for role_id in role_ids:
            if role_id in self.authority.roles:
                role = self.authority.roles[role_id]
                principal.authority_score = max(
                    principal.authority_score,
                    role.rank.value / 7.0
                )

        self.authority.principals[principal.id] = principal
        return principal

    def check_access(self, principal_id: str, action: str) -> bool:
        """Check if principal can perform action"""
        # Find policy for action
        policy = next((p for p in self.policies if p.action == action), None)
        if not policy or not policy.is_enforced:
            return True  # No policy = allowed

        return self.authority.check_authority(
            principal_id,
            policy.required_permissions,
            policy.required_rank,
            policy.min_trust
        )

    def get_state(self) -> "HeraState":
        """Get current HERA state"""
        return HeraState(
            beat_count=self.beat_count,
            mode=self.mode.value,
            compliance_score=self.compliance_score,
            stability_score=self.stability_score,
            hera_score=self.hera_score,
            role_count=len(self.authority.roles),
            principal_count=len(self.authority.principals),
            delegation_count=len(self.authority.delegations),
            policy_count=len(self.policies),
            attribution=ATTRIBUTION
        )

    def get_summary(self) -> Dict:
        """Get HERA summary for monitoring"""
        return {
            "beat_count": self.beat_count,
            "mode": self.mode.value,
            "compliance_score": self.compliance_score,
            "stability_score": self.stability_score,
            "hera_score": self.hera_score,
            "roles": {
                role_id: {
                    "name": role.name,
                    "rank": role.rank.name,
                    "trust": role.trust_level
                }
                for role_id, role in self.authority.roles.items()
            },
            "principals": len(self.authority.principals),
            "delegations": len(self.authority.delegations),
            "policies": len(self.policies),
            "attribution": ATTRIBUTION
        }


# ═══════════════════════════════════════════════════════════════════════
# VI. STATE TYPES
# ═══════════════════════════════════════════════════════════════════════

@dataclass
class HeraState:
    """Complete HERA state"""
    beat_count: int
    mode: str
    compliance_score: float
    stability_score: float
    hera_score: float
    role_count: int
    principal_count: int
    delegation_count: int
    policy_count: int
    attribution: str

    def to_dict(self) -> Dict:
        return {
            "beat_count": self.beat_count,
            "mode": self.mode,
            "compliance_score": self.compliance_score,
            "stability_score": self.stability_score,
            "hera_score": self.hera_score,
            "role_count": self.role_count,
            "principal_count": self.principal_count,
            "delegation_count": self.delegation_count,
            "policy_count": self.policy_count,
            "attribution": self.attribution
        }


# ═══════════════════════════════════════════════════════════════════════
# VII. ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    hera = HeraOrchestrator()

    # Register some principals
    admin = hera.register_principal("Admin User", ["ROLE_MANAGER"])
    viewer = hera.register_principal("Viewer User", ["ROLE_OBSERVER"])

    # Run 100 heartbeats
    for _ in range(100):
        state = hera.advance()

    summary = hera.get_summary()
    print(f"HERA — THE GOVERNANCE LAYER")
    print(f"Attribution: {ATTRIBUTION}")
    print(f"Mode: {summary['mode']}")
    print(f"Compliance Score: {summary['compliance_score']:.4f}")
    print(f"Stability Score: {summary['stability_score']:.4f}")
    print(f"HERA Score: {summary['hera_score']:.4f}")
