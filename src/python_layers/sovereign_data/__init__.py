"""
SOVEREIGN DATA LIBRARY — Financial Tools & Trust Operations
═══════════════════════════════════════════════════════════════════════════════

Attribution: Alfredo Medina Hernandez — immutable

A comprehensive data library providing:
    - Financial data ingestion and analysis
    - Market data feeds and processing
    - Risk assessment and scoring
    - Trust operation frameworks
    - Regulatory data compliance
    - Audit trail management
    - Portfolio analytics
    - Transaction processing

Data Sources (Government & Financial):
    SEC, FINRA, OCC, FDIC, FRB, CFPB, CFTC, TREASURY, IRS,
    NYSE, NASDAQ, CME, CBOE, ICE, DTCC, SIPC, MSRB, PCAOB

Mathematical Foundation:
    All financial computations use PHI-weighted models for
    natural growth, risk distribution, and trust scoring.
"""

__version__ = "1.0.0"
__author__ = "Alfredo Medina Hernandez"
__attribution__ = "Alfredo Medina Hernandez — immutable"

from .data_core import (
    SovereignDataLibrary,
    DataSource,
    DataPipeline,
    DataSchema,
    DataRecord,
    init_data_library,
)

from .financial_tools import (
    FinancialEngine,
    RiskAssessor,
    PortfolioAnalyzer,
    TransactionProcessor,
    MarketDataFeed,
    ComplianceChecker,
)

from .trust_ops import (
    TrustOperator,
    TrustScore,
    TrustAttestation,
    TrustAudit,
    TrustChain,
    TrustVerifier,
)

__all__ = [
    "SovereignDataLibrary",
    "DataSource",
    "DataPipeline",
    "DataSchema",
    "DataRecord",
    "init_data_library",
    "FinancialEngine",
    "RiskAssessor",
    "PortfolioAnalyzer",
    "TransactionProcessor",
    "MarketDataFeed",
    "ComplianceChecker",
    "TrustOperator",
    "TrustScore",
    "TrustAttestation",
    "TrustAudit",
    "TrustChain",
    "TrustVerifier",
]
