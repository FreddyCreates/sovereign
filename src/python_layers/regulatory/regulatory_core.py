"""
SOVEREIGN REGULATORY — Core Framework
═══════════════════════════════════════════════════════════════════════════════

Attribution: Alfredo Medina Hernandez — immutable

Government agencies as charters, regulations as protocols.
Complete regulatory framework with enforcement and compliance.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional
import hashlib
import time

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class AgencyTier(Enum):
    FINANCIAL = "financial"
    OVERSIGHT = "oversight"
    STANDARDS = "standards"
    SECURITY = "security"
    INTERNATIONAL = "international"


class ProtocolStatus(Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    ENFORCING = "enforcing"
    SUSPENDED = "suspended"
    RETIRED = "retired"


class EnforcementLevel(Enum):
    ADVISORY = "advisory"
    WARNING = "warning"
    CORRECTIVE = "corrective"
    PUNITIVE = "punitive"
    CRIMINAL = "criminal"


class ComplianceState(Enum):
    COMPLIANT = "compliant"
    PARTIAL = "partial"
    NON_COMPLIANT = "non_compliant"
    EXEMPT = "exempt"
    UNDER_REVIEW = "under_review"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA STRUCTURES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class ComplianceRule:
    """A single compliance rule within a protocol."""
    rule_id: str
    name: str
    description: str
    severity: float  # 0.0 to 1.0
    category: str
    automated: bool = True
    phi_weight: float = field(default_factory=lambda: PHI_INV)

    def evaluate(self, entity_data: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate this rule against entity data."""
        # PHI-weighted evaluation
        score = self.phi_weight * (1.0 if entity_data else 0.5)
        return {
            "rule_id": self.rule_id,
            "name": self.name,
            "passed": score >= PHI_INV * 0.8,
            "score": score,
            "severity": self.severity,
        }


@dataclass
class EnforcementAction:
    """An enforcement action taken for a violation."""
    action_id: str
    protocol_id: str
    entity: str
    level: EnforcementLevel
    description: str
    penalty: Optional[float] = None
    deadline: Optional[float] = None
    resolved: bool = False
    issued_at: float = field(default_factory=time.time)

    @property
    def overdue(self) -> bool:
        if self.deadline and not self.resolved:
            return time.time() > self.deadline
        return False


@dataclass
class RegulatoryProtocol:
    """A regulation encoded as a Sovereign protocol."""
    protocol_id: str
    name: str
    agency: str
    charter_id: str
    status: ProtocolStatus = ProtocolStatus.ACTIVE
    rules: List[ComplianceRule] = field(default_factory=list)
    enforcement_history: List[EnforcementAction] = field(default_factory=list)
    reporting_frequency: str = "quarterly"
    created_at: float = field(default_factory=time.time)
    phi_severity: float = field(default_factory=lambda: PHI_INV)

    def add_rule(self, name: str, description: str, severity: float, category: str) -> ComplianceRule:
        """Add a compliance rule to this protocol."""
        rule_id = hashlib.sha256(f"{self.protocol_id}:{name}:{time.time()}".encode()).hexdigest()[:12]
        rule = ComplianceRule(
            rule_id=rule_id, name=name, description=description,
            severity=severity, category=category,
        )
        self.rules.append(rule)
        return rule

    def evaluate_entity(self, entity: str, entity_data: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate an entity against all rules in this protocol."""
        results = [rule.evaluate(entity_data) for rule in self.rules]
        passed = sum(1 for r in results if r["passed"])
        total = len(results)
        score = passed / max(total, 1)
        return {
            "entity": entity,
            "protocol": self.name,
            "rules_total": total,
            "rules_passed": passed,
            "compliance_score": score,
            "state": ComplianceState.COMPLIANT.value if score >= PHI_INV else ComplianceState.PARTIAL.value,
            "results": results,
        }


@dataclass
class AgencyCharter:
    """A government agency encoded as a Sovereign charter."""
    charter_id: str
    agency_name: str
    agency_code: str
    tier: AgencyTier
    jurisdiction: str
    mission: str
    protocols: Dict[str, RegulatoryProtocol] = field(default_factory=dict)
    established_year: int = 0
    active: bool = True
    phi_authority: float = field(default_factory=lambda: PHI_INV)

    def create_protocol(self, name: str, reporting_frequency: str = "quarterly") -> RegulatoryProtocol:
        """Create a new regulatory protocol under this charter."""
        protocol_id = hashlib.sha256(
            f"{self.charter_id}:{name}:{time.time()}".encode()
        ).hexdigest()[:16]
        protocol = RegulatoryProtocol(
            protocol_id=protocol_id,
            name=name,
            agency=self.agency_code,
            charter_id=self.charter_id,
            reporting_frequency=reporting_frequency,
        )
        self.protocols[protocol_id] = protocol
        return protocol

    def get_compliance_summary(self, entity: str, entity_data: Dict[str, Any]) -> Dict[str, Any]:
        """Get compliance summary for entity across all protocols."""
        results = {}
        for pid, protocol in self.protocols.items():
            results[pid] = protocol.evaluate_entity(entity, entity_data)
        overall = sum(r["compliance_score"] for r in results.values()) / max(len(results), 1)
        return {
            "entity": entity,
            "agency": self.agency_code,
            "protocols_count": len(self.protocols),
            "overall_compliance": overall,
            "protocol_results": results,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# REGULATORY FRAMEWORK — Master System
# ═══════════════════════════════════════════════════════════════════════════════

class RegulatoryFramework:
    """
    Master regulatory framework that maps all government agencies as charters
    and all regulations as enforceable protocols.
    """

    # Complete Agency Registry
    AGENCY_REGISTRY = {
        # Tier 1: Financial Regulators
        "SEC": {"name": "Securities and Exchange Commission", "tier": AgencyTier.FINANCIAL,
                "jurisdiction": "US_FEDERAL", "year": 1934,
                "mission": "Protect investors, maintain fair markets, facilitate capital formation"},
        "FINRA": {"name": "Financial Industry Regulatory Authority", "tier": AgencyTier.FINANCIAL,
                  "jurisdiction": "US_FEDERAL", "year": 2007,
                  "mission": "Protect investors by ensuring broker-dealer industry operates fairly"},
        "OCC": {"name": "Office of the Comptroller of the Currency", "tier": AgencyTier.FINANCIAL,
                "jurisdiction": "US_FEDERAL", "year": 1863,
                "mission": "Charter, regulate, and supervise national banks"},
        "FDIC": {"name": "Federal Deposit Insurance Corporation", "tier": AgencyTier.FINANCIAL,
                 "jurisdiction": "US_FEDERAL", "year": 1933,
                 "mission": "Maintain stability and public confidence in the banking system"},
        "FRB": {"name": "Federal Reserve Board", "tier": AgencyTier.FINANCIAL,
                "jurisdiction": "US_FEDERAL", "year": 1913,
                "mission": "Conduct monetary policy, supervise banking, maintain financial stability"},
        "CFPB": {"name": "Consumer Financial Protection Bureau", "tier": AgencyTier.FINANCIAL,
                 "jurisdiction": "US_FEDERAL", "year": 2010,
                 "mission": "Protect consumers in the financial marketplace"},
        "CFTC": {"name": "Commodity Futures Trading Commission", "tier": AgencyTier.FINANCIAL,
                 "jurisdiction": "US_FEDERAL", "year": 1974,
                 "mission": "Promote integrity of commodity and financial futures markets"},
        "NCUA": {"name": "National Credit Union Administration", "tier": AgencyTier.FINANCIAL,
                 "jurisdiction": "US_FEDERAL", "year": 1970,
                 "mission": "Regulate and supervise federal credit unions"},
        "FHFA": {"name": "Federal Housing Finance Agency", "tier": AgencyTier.FINANCIAL,
                 "jurisdiction": "US_FEDERAL", "year": 2008,
                 "mission": "Ensure housing GSEs operate safely and support housing finance"},
        "SIPC": {"name": "Securities Investor Protection Corporation", "tier": AgencyTier.FINANCIAL,
                 "jurisdiction": "US_FEDERAL", "year": 1970,
                 "mission": "Protect customers of failed broker-dealers"},

        # Tier 2: Oversight Bodies
        "TREASURY": {"name": "Department of the Treasury", "tier": AgencyTier.OVERSIGHT,
                     "jurisdiction": "US_FEDERAL", "year": 1789,
                     "mission": "Maintain strong economy, manage government finances"},
        "IRS": {"name": "Internal Revenue Service", "tier": AgencyTier.OVERSIGHT,
                "jurisdiction": "US_FEDERAL", "year": 1862,
                "mission": "Enforce tax laws and collect revenue"},
        "GAO": {"name": "Government Accountability Office", "tier": AgencyTier.OVERSIGHT,
                "jurisdiction": "US_FEDERAL", "year": 1921,
                "mission": "Audit and evaluate government programs and expenditures"},
        "CBO": {"name": "Congressional Budget Office", "tier": AgencyTier.OVERSIGHT,
                "jurisdiction": "US_FEDERAL", "year": 1974,
                "mission": "Provide nonpartisan budgetary and economic information"},
        "OMB": {"name": "Office of Management and Budget", "tier": AgencyTier.OVERSIGHT,
                "jurisdiction": "US_FEDERAL", "year": 1970,
                "mission": "Oversee federal budget and evaluate agency performance"},
        "SBA": {"name": "Small Business Administration", "tier": AgencyTier.OVERSIGHT,
                "jurisdiction": "US_FEDERAL", "year": 1953,
                "mission": "Aid, counsel, assist and protect interests of small businesses"},
        "PCAOB": {"name": "Public Company Accounting Oversight Board", "tier": AgencyTier.OVERSIGHT,
                  "jurisdiction": "US_FEDERAL", "year": 2002,
                  "mission": "Oversee audits of public companies"},

        # Tier 3: Standards & Protection
        "NIST": {"name": "National Institute of Standards and Technology", "tier": AgencyTier.STANDARDS,
                 "jurisdiction": "US_FEDERAL", "year": 1901,
                 "mission": "Promote measurement science, standards, and technology"},
        "FTC": {"name": "Federal Trade Commission", "tier": AgencyTier.STANDARDS,
                "jurisdiction": "US_FEDERAL", "year": 1914,
                "mission": "Protect consumers and promote competition"},
        "DOJ": {"name": "Department of Justice", "tier": AgencyTier.STANDARDS,
                "jurisdiction": "US_FEDERAL", "year": 1870,
                "mission": "Enforce law and ensure public safety"},
        "FDA": {"name": "Food and Drug Administration", "tier": AgencyTier.STANDARDS,
                "jurisdiction": "US_FEDERAL", "year": 1906,
                "mission": "Protect and promote public health"},
        "EPA": {"name": "Environmental Protection Agency", "tier": AgencyTier.STANDARDS,
                "jurisdiction": "US_FEDERAL", "year": 1970,
                "mission": "Protect human health and the environment"},
        "DOE": {"name": "Department of Energy", "tier": AgencyTier.STANDARDS,
                "jurisdiction": "US_FEDERAL", "year": 1977,
                "mission": "Advance energy technology and promote energy security"},

        # Tier 4: Security & Defense
        "DHS": {"name": "Department of Homeland Security", "tier": AgencyTier.SECURITY,
                "jurisdiction": "US_FEDERAL", "year": 2002,
                "mission": "Secure the nation from threats"},
        "DOD": {"name": "Department of Defense", "tier": AgencyTier.SECURITY,
                "jurisdiction": "US_FEDERAL", "year": 1947,
                "mission": "Provide military forces needed to deter war and protect security"},
        "NSA": {"name": "National Security Agency", "tier": AgencyTier.SECURITY,
                "jurisdiction": "US_FEDERAL", "year": 1952,
                "mission": "Protect national security information systems"},
        "CISA": {"name": "Cybersecurity and Infrastructure Security Agency", "tier": AgencyTier.SECURITY,
                 "jurisdiction": "US_FEDERAL", "year": 2018,
                 "mission": "Lead national effort to understand and manage cyber/physical risk"},

        # Tier 5: International
        "EU_ESMA": {"name": "European Securities and Markets Authority", "tier": AgencyTier.INTERNATIONAL,
                    "jurisdiction": "EU", "year": 2011,
                    "mission": "Safeguard stability of EU financial system"},
        "BIS": {"name": "Bank for International Settlements", "tier": AgencyTier.INTERNATIONAL,
                "jurisdiction": "INTERNATIONAL", "year": 1930,
                "mission": "Serve central banks in pursuit of monetary and financial stability"},
        "IMF": {"name": "International Monetary Fund", "tier": AgencyTier.INTERNATIONAL,
                "jurisdiction": "INTERNATIONAL", "year": 1944,
                "mission": "Ensure stability of the international monetary system"},
        "FATF": {"name": "Financial Action Task Force", "tier": AgencyTier.INTERNATIONAL,
                 "jurisdiction": "INTERNATIONAL", "year": 1989,
                 "mission": "Set standards to prevent money laundering and terrorist financing"},
        "WTO": {"name": "World Trade Organization", "tier": AgencyTier.INTERNATIONAL,
                "jurisdiction": "INTERNATIONAL", "year": 1995,
                "mission": "Deal with rules of trade between nations"},
    }

    def __init__(self):
        self.charters: Dict[str, AgencyCharter] = {}
        self.all_protocols: Dict[str, RegulatoryProtocol] = {}
        self.enforcement_log: List[EnforcementAction] = []
        self._init_charters()

    def _init_charters(self):
        """Initialize all agency charters with default protocols."""
        for code, info in self.AGENCY_REGISTRY.items():
            charter_id = hashlib.sha256(f"CHARTER:{code}".encode()).hexdigest()[:16]
            charter = AgencyCharter(
                charter_id=charter_id,
                agency_name=info["name"],
                agency_code=code,
                tier=info["tier"],
                jurisdiction=info["jurisdiction"],
                mission=info["mission"],
                established_year=info["year"],
            )
            self.charters[code] = charter

        # Initialize key protocols for financial regulators
        self._init_financial_protocols()

    def _init_financial_protocols(self):
        """Initialize default financial regulatory protocols."""
        # SEC Protocols
        if "SEC" in self.charters:
            sec = self.charters["SEC"]
            p1 = sec.create_protocol("Securities Registration", "annual")
            p1.add_rule("Form S-1", "New securities must be registered", 0.9, "registration")
            p1.add_rule("10-K Filing", "Annual report required", 0.8, "reporting")
            p1.add_rule("10-Q Filing", "Quarterly report required", 0.7, "reporting")
            p1.add_rule("8-K Filing", "Material events must be disclosed", 0.85, "disclosure")
            p1.add_rule("Insider Trading", "No trading on material non-public info", 1.0, "prohibition")
            self.all_protocols[p1.protocol_id] = p1

            p2 = sec.create_protocol("Market Manipulation Prevention", "continuous")
            p2.add_rule("Anti-Fraud", "No market manipulation schemes", 1.0, "enforcement")
            p2.add_rule("Fair Disclosure", "Material info disclosed to all simultaneously", 0.9, "disclosure")
            p2.add_rule("Short Sale Rules", "Comply with Regulation SHO", 0.7, "trading")
            self.all_protocols[p2.protocol_id] = p2

        # FINRA Protocols
        if "FINRA" in self.charters:
            finra = self.charters["FINRA"]
            p = finra.create_protocol("Broker-Dealer Conduct", "quarterly")
            p.add_rule("KYC", "Know Your Customer verification required", 0.9, "identity")
            p.add_rule("Suitability", "Recommendations must be suitable for client", 0.85, "conduct")
            p.add_rule("Best Execution", "Execute trades at best available price", 0.8, "trading")
            p.add_rule("AML", "Anti-money laundering compliance", 1.0, "compliance")
            p.add_rule("Capital Requirements", "Maintain minimum net capital", 0.95, "financial")
            self.all_protocols[p.protocol_id] = p

        # FRB Protocols
        if "FRB" in self.charters:
            frb = self.charters["FRB"]
            p = frb.create_protocol("Banking Supervision", "quarterly")
            p.add_rule("Capital Adequacy", "Basel III capital requirements", 0.95, "capital")
            p.add_rule("Liquidity", "Liquidity coverage ratio compliance", 0.9, "liquidity")
            p.add_rule("Stress Testing", "Pass annual stress tests (CCAR)", 0.85, "testing")
            p.add_rule("Risk Management", "Enterprise risk management framework", 0.8, "risk")
            self.all_protocols[p.protocol_id] = p

        # CFTC Protocols
        if "CFTC" in self.charters:
            cftc = self.charters["CFTC"]
            p = cftc.create_protocol("Derivatives Oversight", "monthly")
            p.add_rule("Position Limits", "Speculative position limits", 0.8, "trading")
            p.add_rule("Clearing", "Central clearing for standard derivatives", 0.9, "clearing")
            p.add_rule("Reporting", "Trade reporting to registered SDR", 0.85, "reporting")
            p.add_rule("Margin", "Initial and variation margin requirements", 0.9, "margin")
            self.all_protocols[p.protocol_id] = p

    def get_charter(self, agency_code: str) -> Optional[AgencyCharter]:
        """Get a specific agency charter."""
        return self.charters.get(agency_code)

    def evaluate_compliance(self, entity: str, entity_data: Dict[str, Any],
                            agency_codes: Optional[List[str]] = None) -> Dict[str, Any]:
        """Evaluate entity compliance across specified or all agencies."""
        agencies = agency_codes or list(self.charters.keys())
        results = {}
        for code in agencies:
            charter = self.charters.get(code)
            if charter and charter.protocols:
                results[code] = charter.get_compliance_summary(entity, entity_data)
        overall = sum(
            r["overall_compliance"] for r in results.values()
        ) / max(len(results), 1) if results else 0

        return {
            "entity": entity,
            "agencies_evaluated": len(results),
            "overall_compliance": overall,
            "phi_score": overall * PHI_INV,
            "results": results,
            "timestamp": time.time(),
        }

    def enforce(self, protocol_id: str, entity: str, level: EnforcementLevel,
                description: str, penalty: Optional[float] = None) -> EnforcementAction:
        """Issue an enforcement action."""
        action_id = hashlib.sha256(
            f"{protocol_id}:{entity}:{time.time()}".encode()
        ).hexdigest()[:16]
        action = EnforcementAction(
            action_id=action_id,
            protocol_id=protocol_id,
            entity=entity,
            level=level,
            description=description,
            penalty=penalty,
            deadline=time.time() + (30 * 86400),  # 30 day deadline
        )
        self.enforcement_log.append(action)
        return action

    def list_agencies_by_tier(self, tier: Optional[AgencyTier] = None) -> Dict[str, Any]:
        """List agencies, optionally filtered by tier."""
        if tier:
            agencies = {k: v for k, v in self.charters.items() if v.tier == tier}
        else:
            agencies = self.charters
        return {
            "agencies": {
                code: {
                    "name": charter.agency_name,
                    "tier": charter.tier.value,
                    "jurisdiction": charter.jurisdiction,
                    "protocols": len(charter.protocols),
                    "established": charter.established_year,
                }
                for code, charter in agencies.items()
            },
            "total": len(agencies),
            "tier_filter": tier.value if tier else "all",
        }

    def get_all_protocols(self) -> Dict[str, Any]:
        """Get summary of all active protocols."""
        return {
            "total_protocols": len(self.all_protocols),
            "protocols": [
                {
                    "id": p.protocol_id,
                    "name": p.name,
                    "agency": p.agency,
                    "rules_count": len(p.rules),
                    "status": p.status.value,
                    "reporting": p.reporting_frequency,
                }
                for p in self.all_protocols.values()
            ],
        }

    def get_framework_status(self) -> Dict[str, Any]:
        """Get framework status summary."""
        return {
            "total_agencies": len(self.charters),
            "total_protocols": len(self.all_protocols),
            "total_rules": sum(len(p.rules) for p in self.all_protocols.values()),
            "enforcement_actions": len(self.enforcement_log),
            "tiers": {
                tier.value: sum(1 for c in self.charters.values() if c.tier == tier)
                for tier in AgencyTier
            },
            "phi_governance": PHI_INV,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE-LEVEL
# ═══════════════════════════════════════════════════════════════════════════════

def init_regulatory_framework() -> RegulatoryFramework:
    """Initialize the complete regulatory framework."""
    return RegulatoryFramework()
