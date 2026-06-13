"""
SOVEREIGN DATA — Trust Operations
═══════════════════════════════════════════════════════════════════════════════

Attribution: Alfredo Medina Hernandez — immutable

Trust operation framework for verification, attestation, audit chains,
and trust scoring. Forms the foundation for "trust op" — the trust
operations layer that validates all sovereign transactions and entities.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional
import hashlib
import math
import time

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class TrustLevel(Enum):
    UNTRUSTED = "untrusted"
    PROVISIONAL = "provisional"
    BASIC = "basic"
    VERIFIED = "verified"
    CERTIFIED = "certified"
    SOVEREIGN = "sovereign"


class AttestationType(Enum):
    IDENTITY = "identity"
    COMPLIANCE = "compliance"
    FINANCIAL = "financial"
    OPERATIONAL = "operational"
    SECURITY = "security"
    GOVERNANCE = "governance"


class AuditScope(Enum):
    FINANCIAL = "financial"
    OPERATIONAL = "operational"
    COMPLIANCE = "compliance"
    SECURITY = "security"
    FULL = "full"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA STRUCTURES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class TrustScore:
    """Trust score for an entity with component breakdown."""
    entity: str
    overall: float
    components: Dict[str, float] = field(default_factory=dict)
    level: TrustLevel = TrustLevel.UNTRUSTED
    history: List[Dict[str, Any]] = field(default_factory=list)
    last_updated: float = field(default_factory=time.time)

    def __post_init__(self):
        self._update_level()

    def _update_level(self):
        if self.overall >= 0.95:
            self.level = TrustLevel.SOVEREIGN
        elif self.overall >= 0.85:
            self.level = TrustLevel.CERTIFIED
        elif self.overall >= 0.70:
            self.level = TrustLevel.VERIFIED
        elif self.overall >= 0.50:
            self.level = TrustLevel.BASIC
        elif self.overall >= 0.25:
            self.level = TrustLevel.PROVISIONAL
        else:
            self.level = TrustLevel.UNTRUSTED

    def update(self, component: str, score: float):
        """Update a trust component and recalculate overall."""
        self.components[component] = score
        if self.components:
            # PHI-weighted average of components
            weights = [PHI ** (-i) for i in range(len(self.components))]
            values = list(self.components.values())
            self.overall = sum(w * v for w, v in zip(weights, values)) / sum(weights)
        self._update_level()
        self.last_updated = time.time()
        self.history.append({"component": component, "score": score, "overall": self.overall, "time": time.time()})


@dataclass
class TrustAttestation:
    """A trust attestation issued for an entity."""
    attestation_id: str
    entity: str
    attestation_type: AttestationType
    statement: str
    issuer: str
    evidence: Dict[str, Any] = field(default_factory=dict)
    valid_from: float = field(default_factory=time.time)
    valid_until: Optional[float] = None
    revoked: bool = False
    sigil: str = ""

    def __post_init__(self):
        if not self.sigil:
            raw = f"{self.entity}:{self.attestation_type.value}:{self.valid_from}"
            self.sigil = hashlib.sha256(raw.encode()).hexdigest()[:16]

    @property
    def valid(self) -> bool:
        if self.revoked:
            return False
        if self.valid_until and time.time() > self.valid_until:
            return False
        return True


@dataclass
class TrustAudit:
    """Trust audit record."""
    audit_id: str
    target: str
    scope: AuditScope
    findings: List[Dict[str, Any]] = field(default_factory=list)
    score: float = 0.0
    passed: bool = False
    auditor: str = "SOVEREIGN_TRUST_ENGINE"
    started_at: float = field(default_factory=time.time)
    completed_at: Optional[float] = None

    def complete(self, findings: List[Dict[str, Any]], score: float):
        """Complete the audit with findings."""
        self.findings = findings
        self.score = score
        self.passed = score >= PHI_INV
        self.completed_at = time.time()


# ═══════════════════════════════════════════════════════════════════════════════
# TRUST CHAIN
# ═══════════════════════════════════════════════════════════════════════════════

class TrustChain:
    """Immutable chain of trust attestations and audits."""

    def __init__(self):
        self.chain: List[Dict[str, Any]] = []
        self.genesis_hash: str = hashlib.sha256(b"SOVEREIGN_TRUST_GENESIS").hexdigest()

    def add_block(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Add a new block to the trust chain."""
        prev_hash = self.chain[-1]["hash"] if self.chain else self.genesis_hash
        block = {
            "index": len(self.chain),
            "data": data,
            "prev_hash": prev_hash,
            "timestamp": time.time(),
            "hash": "",
        }
        block_str = f"{block['index']}:{prev_hash}:{block['timestamp']}:{str(data)}"
        block["hash"] = hashlib.sha256(block_str.encode()).hexdigest()
        self.chain.append(block)
        return block

    def verify_chain(self) -> Dict[str, Any]:
        """Verify integrity of the trust chain."""
        valid = True
        issues = []
        for i in range(1, len(self.chain)):
            if self.chain[i]["prev_hash"] != self.chain[i - 1]["hash"]:
                valid = False
                issues.append(f"Chain break at block {i}")
        return {
            "valid": valid,
            "blocks": len(self.chain),
            "issues": issues,
            "genesis_hash": self.genesis_hash,
        }

    def get_latest(self, count: int = 10) -> List[Dict[str, Any]]:
        """Get latest blocks from chain."""
        return self.chain[-count:]

    @property
    def length(self) -> int:
        return len(self.chain)


# ═══════════════════════════════════════════════════════════════════════════════
# TRUST VERIFIER
# ═══════════════════════════════════════════════════════════════════════════════

class TrustVerifier:
    """Verifies trust claims and attestations."""

    def __init__(self):
        self.verifications_performed: int = 0

    def verify_attestation(self, attestation: TrustAttestation) -> Dict[str, Any]:
        """Verify an attestation is valid and current."""
        self.verifications_performed += 1
        return {
            "attestation_id": attestation.attestation_id,
            "entity": attestation.entity,
            "valid": attestation.valid,
            "type": attestation.attestation_type.value,
            "issuer": attestation.issuer,
            "sigil": attestation.sigil,
            "verified_at": time.time(),
        }

    def verify_entity(self, entity: str, trust_score: TrustScore,
                      attestations: List[TrustAttestation]) -> Dict[str, Any]:
        """Comprehensive entity verification."""
        self.verifications_performed += 1
        valid_attestations = [a for a in attestations if a.valid]
        return {
            "entity": entity,
            "trust_level": trust_score.level.value,
            "trust_score": trust_score.overall,
            "attestations_total": len(attestations),
            "attestations_valid": len(valid_attestations),
            "verification_score": trust_score.overall * (len(valid_attestations) / max(len(attestations), 1)),
            "phi_confidence": PHI_INV * trust_score.overall,
            "verified_at": time.time(),
        }

    def cross_verify(self, entity_a: str, entity_b: str,
                     score_a: TrustScore, score_b: TrustScore) -> Dict[str, Any]:
        """Cross-verify trust between two entities."""
        self.verifications_performed += 1
        mutual_trust = (score_a.overall + score_b.overall) / 2
        return {
            "entity_a": entity_a,
            "entity_b": entity_b,
            "score_a": score_a.overall,
            "score_b": score_b.overall,
            "mutual_trust": mutual_trust,
            "phi_harmony": abs(mutual_trust - PHI_INV),
            "can_transact": mutual_trust >= PHI_INV * 0.8,
        }

    def get_status(self) -> Dict[str, Any]:
        return {"verifications_performed": self.verifications_performed}


# ═══════════════════════════════════════════════════════════════════════════════
# TRUST OPERATOR — Main Trust Operations Interface
# ═══════════════════════════════════════════════════════════════════════════════

class TrustOperator:
    """
    Main trust operations interface — coordinates all trust activities
    including scoring, attestation, audit, and verification.
    """

    def __init__(self):
        self.scores: Dict[str, TrustScore] = {}
        self.attestations: Dict[str, TrustAttestation] = {}
        self.audits: Dict[str, TrustAudit] = {}
        self.chain = TrustChain()
        self.verifier = TrustVerifier()
        self.operations_count: int = 0

    def register_entity(self, entity: str, initial_score: float = 0.5) -> TrustScore:
        """Register a new entity in the trust system."""
        self.operations_count += 1
        score = TrustScore(
            entity=entity,
            overall=initial_score,
            components={"baseline": initial_score},
        )
        self.scores[entity] = score
        self.chain.add_block({"type": "register", "entity": entity, "score": initial_score})
        return score

    def issue_attestation(self, entity: str, attestation_type: AttestationType,
                          statement: str, evidence: Optional[Dict[str, Any]] = None,
                          valid_days: int = 365) -> TrustAttestation:
        """Issue a trust attestation for an entity."""
        self.operations_count += 1
        att_id = hashlib.sha256(
            f"{entity}:{attestation_type.value}:{time.time()}".encode()
        ).hexdigest()[:20]
        attestation = TrustAttestation(
            attestation_id=att_id,
            entity=entity,
            attestation_type=attestation_type,
            statement=statement,
            issuer="SOVEREIGN_TRUST_AUTHORITY",
            evidence=evidence or {},
            valid_until=time.time() + (valid_days * 86400),
        )
        self.attestations[att_id] = attestation
        # Update trust score
        if entity in self.scores:
            self.scores[entity].update(attestation_type.value, PHI_INV * 1.1)
        self.chain.add_block({"type": "attestation", "id": att_id, "entity": entity})
        return attestation

    def perform_audit(self, entity: str, scope: AuditScope = AuditScope.FULL) -> TrustAudit:
        """Perform a trust audit on an entity."""
        self.operations_count += 1
        audit_id = hashlib.sha256(f"{entity}:{scope.value}:{time.time()}".encode()).hexdigest()[:16]
        audit = TrustAudit(audit_id=audit_id, target=entity, scope=scope)

        # Simulate audit findings
        score = PHI_INV * 1.2 if entity in self.scores else PHI_INV * 0.8
        findings = [
            {"area": "documentation", "status": "pass", "score": PHI_INV * 1.1},
            {"area": "controls", "status": "pass", "score": PHI_INV * 1.0},
            {"area": "governance", "status": "pass", "score": PHI_INV * 0.95},
        ]
        audit.complete(findings, score)
        self.audits[audit_id] = audit

        # Update trust score
        if entity in self.scores:
            self.scores[entity].update("audit", score)

        self.chain.add_block({"type": "audit", "id": audit_id, "entity": entity, "passed": audit.passed})
        return audit

    def verify_entity(self, entity: str) -> Dict[str, Any]:
        """Full verification of an entity."""
        self.operations_count += 1
        score = self.scores.get(entity)
        if not score:
            return {"error": f"Entity '{entity}' not registered", "entity": entity}
        entity_attestations = [a for a in self.attestations.values() if a.entity == entity]
        return self.verifier.verify_entity(entity, score, entity_attestations)

    def get_trust_report(self, entity: str) -> Dict[str, Any]:
        """Get comprehensive trust report for an entity."""
        score = self.scores.get(entity)
        entity_attestations = [a for a in self.attestations.values() if a.entity == entity]
        entity_audits = [a for a in self.audits.values() if a.target == entity]
        return {
            "entity": entity,
            "registered": entity in self.scores,
            "trust_score": score.overall if score else 0.0,
            "trust_level": score.level.value if score else TrustLevel.UNTRUSTED.value,
            "attestations": len(entity_attestations),
            "valid_attestations": sum(1 for a in entity_attestations if a.valid),
            "audits": len(entity_audits),
            "audits_passed": sum(1 for a in entity_audits if a.passed),
            "chain_blocks": self.chain.length,
            "phi_trust": (score.overall * PHI_INV) if score else 0.0,
        }

    def get_system_status(self) -> Dict[str, Any]:
        """Get trust system status."""
        return {
            "entities_registered": len(self.scores),
            "attestations_issued": len(self.attestations),
            "audits_completed": len(self.audits),
            "chain_length": self.chain.length,
            "operations_count": self.operations_count,
            "verifications": self.verifier.verifications_performed,
            "chain_valid": self.chain.verify_chain()["valid"],
        }
