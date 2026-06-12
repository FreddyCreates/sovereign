"""
SOVEREIGN Tests — Hands, API, Data, Regulatory
═══════════════════════════════════════════════════════════════════════════════

Attribution: Alfredo Medina Hernandez — immutable

Comprehensive tests for all new Sovereign modules.
"""

import sys
import os

# Add parent to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


# ═══════════════════════════════════════════════════════════════════════════════
# HANDS TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def test_hands_initialization():
    from hands import SovereignHands, init_hands_state
    hands = init_hands_state()
    assert hands is not None
    assert hands.beat_count == 0
    assert hands.doctrine_aligned is True
    print("  ✓ Hands initialization")


def test_hands_left_pull():
    from hands import SovereignHands
    hands = SovereignHands()
    result = hands.pull_data("https://api.sec.gov/filings")
    assert result.success is True
    assert result.grip_type.value == "pull"
    assert hands.left.state.grip_count == 1
    print("  ✓ Left hand pull")


def test_hands_right_push():
    from hands import SovereignHands
    hands = SovereignHands()
    result = hands.push_data("https://target.api/endpoint", {"key": "value"})
    assert result.success is True
    assert result.grip_type.value == "push"
    assert hands.right.state.grip_count == 1
    print("  ✓ Right hand push")


def test_hands_bilateral_transfer():
    from hands import SovereignHands
    hands = SovereignHands()
    pull, push = hands.transfer("source", "target")
    assert pull.success is True
    assert push.success is True
    assert hands.coordinator.coordination_count == 1
    print("  ✓ Bilateral transfer")


def test_hands_broadcast():
    from hands import SovereignHands
    hands = SovereignHands()
    results = hands.broadcast_data(["t1", "t2", "t3"], {"data": "broadcast"})
    assert len(results) == 3
    assert all(r.success for r in results)
    print("  ✓ Broadcast")


def test_hands_heartbeat():
    from hands import SovereignHands
    hands = SovereignHands()
    for _ in range(10):
        status = hands.heartbeat()
    assert hands.beat_count == 10
    assert "coordinator" in status
    print("  ✓ Heartbeat")


def test_hands_api_call():
    from hands import SovereignHands
    hands = SovereignHands()
    result = hands.call_api("https://api.example.com/v1/data", method="POST",
                            body={"query": "test"})
    assert result.status_code == 200
    assert result.action_type.value == "api_call"
    print("  ✓ API call")


def test_hands_handshake():
    from hands import SovereignHands
    hands = SovereignHands()
    result = hands.handshake("https://partner.api.com")
    assert result["established"] is True
    assert "coherence" in result
    print("  ✓ Handshake")


def test_hands_execute_command():
    from hands import SovereignHands
    hands = SovereignHands()
    result = hands.execute_command("system", "deploy", {"version": "1.0"})
    assert result.status_code == 200
    print("  ✓ Execute command")


def test_hands_sense():
    from hands import SovereignHands
    hands = SovereignHands()
    result = hands.sense_system("https://health.check.com")
    assert result["alive"] is True
    assert "latency_ms" in result
    print("  ✓ Sense system")


# ═══════════════════════════════════════════════════════════════════════════════
# API LIBRARY TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def test_api_initialization():
    from sovereign_api import SovereignAPI, init_api
    api = init_api()
    assert api is not None
    assert api.total_requests == 0
    print("  ✓ API initialization")


def test_api_key_generation():
    from sovereign_api import SovereignAPI, APITier
    api = SovereignAPI()
    key = api.generate_key("test_owner", APITier.OCTAHEDRON, expires_days=30)
    assert key.valid is True
    assert key.tier == APITier.OCTAHEDRON
    assert "execute" in key.permissions
    print("  ✓ API key generation")


def test_api_request_handling():
    from sovereign_api import SovereignAPI, APITier
    api = SovereignAPI()
    key = api.generate_key("owner", APITier.CUBE)
    response = api.handle_request(key.key_id, "GET", "/data/market")
    assert response.status.value == "success"
    print("  ✓ API request handling")


def test_api_rate_limiting():
    from sovereign_api.api_core import RateLimiter, APITier
    limiter = RateLimiter()
    # Should allow first request
    assert limiter.check("key1", APITier.TETRAHEDRON) is True
    remaining = limiter.get_remaining("key1", APITier.TETRAHEDRON)
    assert remaining == 59  # 60 - 1
    print("  ✓ Rate limiting")


def test_api_unauthorized():
    from sovereign_api import SovereignAPI
    api = SovereignAPI()
    response = api.handle_request("invalid_key", "GET", "/data")
    assert response.status.value == "unauthorized"
    print("  ✓ Unauthorized handling")


def test_api_services_intelligence():
    from sovereign_api.api_services import IntelligenceAPI
    intel = IntelligenceAPI()
    result = intel.query("What is the market outlook?", model="AGI")
    assert "response" in result
    assert result["model"] == "AGI"
    print("  ✓ Intelligence API")


def test_api_services_data():
    from sovereign_api.api_services import DataAPI
    data = DataAPI()
    result = data.get_market_data("AAPL", "1d")
    assert result["symbol"] == "AAPL"
    assert "price" in result
    print("  ✓ Data API")


def test_api_services_governance():
    from sovereign_api.api_services import GovernanceAPI
    gov = GovernanceAPI()
    charter = gov.create_charter("Test Charter", "SEC", ["Rule 10b-5", "Reg FD"])
    assert charter["agency"] == "SEC"
    assert charter["status"] == "active"
    print("  ✓ Governance API")


def test_api_services_trust():
    from sovereign_api.api_services import TrustAPI
    trust = TrustAPI()
    result = trust.verify("entity_a", [{"claim": "compliant", "value": True}])
    assert result["claims_verified"] == 1
    print("  ✓ Trust API")


def test_api_services_streaming():
    from sovereign_api.api_services import StreamingAPI
    stream = StreamingAPI()
    s = stream.open_stream("market.ticks")
    assert s["status"] == "active"
    events = stream.get_events(s["stream_id"], count=5)
    assert len(events["events"]) == 5
    stream.close_stream(s["stream_id"])
    assert stream.list_streams()["total_active"] == 0
    print("  ✓ Streaming API")


def test_api_bundles():
    from sovereign_api.api_bundles import BundleManager
    bm = BundleManager()
    bundles = bm.list_bundles()
    assert len(bundles) == 6
    sub = bm.subscribe("acme_corp", "pro")
    assert sub["bundle"] == "pro"
    assert sub["status"] == "active"
    print("  ✓ Bundle management")


def test_api_bundle_upgrade():
    from sovereign_api.api_bundles import BundleManager
    bm = BundleManager()
    bm.subscribe("corp", "basic")
    upgraded = bm.upgrade("corp", "enterprise")
    assert upgraded["bundle"] == "enterprise"
    print("  ✓ Bundle upgrade")


# ═══════════════════════════════════════════════════════════════════════════════
# DATA LIBRARY TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def test_data_library_init():
    from sovereign_data import SovereignDataLibrary, init_data_library
    lib = init_data_library()
    assert lib is not None
    assert len(lib.sources) > 20
    assert len(lib.schemas) == 5
    print("  ✓ Data library initialization")


def test_data_ingest():
    from sovereign_data import SovereignDataLibrary
    lib = SovereignDataLibrary()
    records = lib.ingest("SEC", [
        {"symbol": "AAPL", "price": 150.0, "timestamp": 1234567890},
        {"symbol": "GOOG", "price": 2800.0, "timestamp": 1234567890},
    ], "market_data")
    assert len(records) == 2
    assert lib.total_records_processed == 2
    print("  ✓ Data ingestion")


def test_data_pipeline():
    from sovereign_data import SovereignDataLibrary
    lib = SovereignDataLibrary()
    pipeline = lib.create_pipeline("sec_pipeline", "SEC")
    assert pipeline.pipeline_id is not None
    assert len(pipeline.stages) == 7
    print("  ✓ Data pipeline")


def test_data_query():
    from sovereign_data import SovereignDataLibrary
    lib = SovereignDataLibrary()
    lib.ingest("NYSE", [{"symbol": "TSLA", "price": 200.0, "timestamp": 123}], "market_data")
    results = lib.query("market_data", {"symbol": "TSLA"})
    assert len(results) == 1
    print("  ✓ Data query")


def test_financial_engine():
    from sovereign_data.financial_tools import FinancialEngine
    engine = FinancialEngine()
    result = engine.compound_growth(10000, 0.08, 10)
    assert result["final_value"] > 10000
    assert result["phi_weighted"] is True
    print("  ✓ Financial engine")


def test_risk_assessor():
    from sovereign_data.financial_tools import RiskAssessor
    assessor = RiskAssessor()
    result = assessor.assess_entity("TestCorp", {
        "debt": 500000, "assets": 2000000, "cash": 300000,
        "liabilities": 800000, "revenue_growth": 0.05,
    })
    assert "risk_score" in result
    assert "risk_level" in result
    print("  ✓ Risk assessor")


def test_portfolio_analyzer():
    from sovereign_data.financial_tools import PortfolioAnalyzer
    analyzer = PortfolioAnalyzer()
    positions = [
        {"name": "AAPL", "value": 50000, "asset_class": "equity"},
        {"name": "BND", "value": 30000, "asset_class": "fixed_income"},
        {"name": "GLD", "value": 20000, "asset_class": "commodity"},
    ]
    result = analyzer.analyze(positions)
    assert result["total_value"] == 100000
    assert result["positions_count"] == 3
    print("  ✓ Portfolio analyzer")


def test_transaction_processor():
    from sovereign_data.financial_tools import TransactionProcessor, TransactionType
    proc = TransactionProcessor()
    tx = proc.process(TransactionType.BUY, "buyer", "seller", 10000, "USD")
    assert tx["status"] == "completed"
    assert tx["amount"] == 10000
    assert proc.transactions_processed == 1
    print("  ✓ Transaction processor")


def test_market_data_feed():
    from sovereign_data.financial_tools import MarketDataFeed
    feed = MarketDataFeed()
    feed.subscribe("AAPL", "NASDAQ")
    quote = feed.get_quote("AAPL")
    assert "bid" in quote
    assert "ask" in quote
    history = feed.get_history("AAPL", 10)
    assert len(history["data"]) == 10
    print("  ✓ Market data feed")


def test_compliance_checker():
    from sovereign_data.financial_tools import ComplianceChecker
    checker = ComplianceChecker()
    result = checker.check("TestCorp", "SOX")
    assert result["status"] == "compliant"
    full = checker.full_audit("TestCorp")
    assert full["regulations_checked"] == 15
    print("  ✓ Compliance checker")


def test_value_at_risk():
    from sovereign_data.financial_tools import RiskAssessor
    assessor = RiskAssessor()
    var = assessor.value_at_risk(1000000, confidence=0.95, time_horizon_days=10)
    assert var["var"] > 0
    assert var["portfolio_value"] == 1000000
    print("  ✓ Value at Risk")


# ═══════════════════════════════════════════════════════════════════════════════
# TRUST OPERATIONS TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def test_trust_operator():
    from sovereign_data.trust_ops import TrustOperator, AttestationType, AuditScope
    op = TrustOperator()
    score = op.register_entity("TestEntity", 0.7)
    assert score.overall == 0.7
    assert score.level.value == "verified"
    print("  ✓ Trust operator")


def test_trust_attestation():
    from sovereign_data.trust_ops import TrustOperator, AttestationType
    op = TrustOperator()
    op.register_entity("Corp_A")
    att = op.issue_attestation("Corp_A", AttestationType.COMPLIANCE, "SOX Compliant")
    assert att.valid is True
    assert att.issuer == "SOVEREIGN_TRUST_AUTHORITY"
    print("  ✓ Trust attestation")


def test_trust_audit():
    from sovereign_data.trust_ops import TrustOperator, AuditScope
    op = TrustOperator()
    op.register_entity("Corp_B")
    audit = op.perform_audit("Corp_B", AuditScope.FULL)
    assert audit.passed is True
    assert audit.completed_at is not None
    print("  ✓ Trust audit")


def test_trust_chain():
    from sovereign_data.trust_ops import TrustChain
    chain = TrustChain()
    chain.add_block({"type": "test", "value": 1})
    chain.add_block({"type": "test", "value": 2})
    verification = chain.verify_chain()
    assert verification["valid"] is True
    assert verification["blocks"] == 2
    print("  ✓ Trust chain")


def test_trust_verifier():
    from sovereign_data.trust_ops import TrustOperator, AttestationType
    op = TrustOperator()
    op.register_entity("Verified_Corp", 0.85)
    op.issue_attestation("Verified_Corp", AttestationType.IDENTITY, "Identity verified")
    result = op.verify_entity("Verified_Corp")
    assert result["trust_level"] in ["verified", "certified"]
    print("  ✓ Trust verifier")


def test_trust_report():
    from sovereign_data.trust_ops import TrustOperator, AttestationType, AuditScope
    op = TrustOperator()
    op.register_entity("Full_Corp", 0.8)
    op.issue_attestation("Full_Corp", AttestationType.FINANCIAL, "Financial audit passed")
    op.perform_audit("Full_Corp", AuditScope.FINANCIAL)
    report = op.get_trust_report("Full_Corp")
    assert report["registered"] is True
    assert report["attestations"] == 1
    assert report["audits"] == 1
    print("  ✓ Trust report")


# ═══════════════════════════════════════════════════════════════════════════════
# REGULATORY FRAMEWORK TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def test_regulatory_init():
    from regulatory import RegulatoryFramework, init_regulatory_framework
    fw = init_regulatory_framework()
    assert fw is not None
    assert len(fw.charters) > 30
    assert len(fw.all_protocols) > 0
    print("  ✓ Regulatory framework initialization")


def test_regulatory_agency_tiers():
    from regulatory import RegulatoryFramework, AgencyTier
    fw = RegulatoryFramework()
    result = fw.list_agencies_by_tier(AgencyTier.FINANCIAL)
    assert result["total"] >= 10
    print("  ✓ Agency tier listing")


def test_regulatory_compliance():
    from regulatory import RegulatoryFramework
    fw = RegulatoryFramework()
    result = fw.evaluate_compliance("TestBank", {"registered": True}, ["SEC", "FINRA"])
    assert "overall_compliance" in result
    assert result["agencies_evaluated"] == 2
    print("  ✓ Compliance evaluation")


def test_regulatory_enforcement():
    from regulatory import RegulatoryFramework
    from regulatory.regulatory_core import EnforcementLevel
    fw = RegulatoryFramework()
    protocols = list(fw.all_protocols.keys())
    if protocols:
        action = fw.enforce(protocols[0], "BadCorp", EnforcementLevel.WARNING,
                            "Failure to file 10-K", penalty=50000)
        assert action.level == EnforcementLevel.WARNING
        assert action.penalty == 50000
    print("  ✓ Enforcement action")


def test_regulatory_protocols():
    from regulatory import RegulatoryFramework
    fw = RegulatoryFramework()
    protocols = fw.get_all_protocols()
    assert protocols["total_protocols"] > 0
    assert all("rules_count" in p for p in protocols["protocols"])
    print("  ✓ Protocol listing")


def test_regulatory_charter_creation():
    from regulatory import RegulatoryFramework
    fw = RegulatoryFramework()
    sec = fw.get_charter("SEC")
    assert sec is not None
    assert sec.agency_code == "SEC"
    assert sec.tier.value == "financial"
    print("  ✓ Charter creation")


def test_regulatory_framework_status():
    from regulatory import RegulatoryFramework
    fw = RegulatoryFramework()
    status = fw.get_framework_status()
    assert status["total_agencies"] > 30
    assert status["total_protocols"] > 0
    assert status["total_rules"] > 0
    print("  ✓ Framework status")


# ═══════════════════════════════════════════════════════════════════════════════
# RUN ALL TESTS
# ═══════════════════════════════════════════════════════════════════════════════

def run_all_tests():
    """Run all tests for new Sovereign modules."""
    print("\n" + "═" * 70)
    print("  SOVEREIGN MODULE TESTS")
    print("  Attribution: Alfredo Medina Hernandez — immutable")
    print("═" * 70)

    test_groups = [
        ("SOVEREIGN HANDS", [
            test_hands_initialization,
            test_hands_left_pull,
            test_hands_right_push,
            test_hands_bilateral_transfer,
            test_hands_broadcast,
            test_hands_heartbeat,
            test_hands_api_call,
            test_hands_handshake,
            test_hands_execute_command,
            test_hands_sense,
        ]),
        ("SOVEREIGN API LIBRARY", [
            test_api_initialization,
            test_api_key_generation,
            test_api_request_handling,
            test_api_rate_limiting,
            test_api_unauthorized,
            test_api_services_intelligence,
            test_api_services_data,
            test_api_services_governance,
            test_api_services_trust,
            test_api_services_streaming,
            test_api_bundles,
            test_api_bundle_upgrade,
        ]),
        ("SOVEREIGN DATA LIBRARY", [
            test_data_library_init,
            test_data_ingest,
            test_data_pipeline,
            test_data_query,
            test_financial_engine,
            test_risk_assessor,
            test_portfolio_analyzer,
            test_transaction_processor,
            test_market_data_feed,
            test_compliance_checker,
            test_value_at_risk,
        ]),
        ("TRUST OPERATIONS", [
            test_trust_operator,
            test_trust_attestation,
            test_trust_audit,
            test_trust_chain,
            test_trust_verifier,
            test_trust_report,
        ]),
        ("REGULATORY FRAMEWORK", [
            test_regulatory_init,
            test_regulatory_agency_tiers,
            test_regulatory_compliance,
            test_regulatory_enforcement,
            test_regulatory_protocols,
            test_regulatory_charter_creation,
            test_regulatory_framework_status,
        ]),
    ]

    total = 0
    passed = 0
    failed = 0

    for group_name, tests in test_groups:
        print(f"\n{'─' * 70}")
        print(f"  {group_name}")
        print(f"{'─' * 70}")
        for test_fn in tests:
            total += 1
            try:
                test_fn()
                passed += 1
            except Exception as e:
                failed += 1
                print(f"  ✗ {test_fn.__name__}: {e}")

    print(f"\n{'═' * 70}")
    print(f"  RESULTS: {passed}/{total} passed, {failed} failed")
    print(f"  PHI Score: {passed/max(total,1):.4f}")
    print(f"{'═' * 70}\n")

    return failed == 0


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
