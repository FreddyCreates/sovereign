"""
SOVEREIGN DATA — Core Data Infrastructure
═══════════════════════════════════════════════════════════════════════════════

Attribution: Alfredo Medina Hernandez — immutable

Core data pipeline infrastructure: sources, schemas, records, pipelines.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set
import hashlib
import math
import time

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class DataSourceType(Enum):
    GOVERNMENT = "government"
    FINANCIAL = "financial"
    REGULATORY = "regulatory"
    MARKET = "market"
    INSTITUTIONAL = "institutional"
    PUBLIC = "public"


class PipelineStage(Enum):
    INGEST = "ingest"
    VALIDATE = "validate"
    TRANSFORM = "transform"
    ENRICH = "enrich"
    STORE = "store"
    INDEX = "index"
    SERVE = "serve"


class DataQuality(Enum):
    RAW = "raw"
    CLEANED = "cleaned"
    VALIDATED = "validated"
    ENRICHED = "enriched"
    CERTIFIED = "certified"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA STRUCTURES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class DataSchema:
    """Schema definition for data records."""
    name: str
    version: str
    fields: Dict[str, str]  # field_name -> type
    required_fields: List[str] = field(default_factory=list)
    indexes: List[str] = field(default_factory=list)
    validators: Dict[str, str] = field(default_factory=dict)

    @property
    def field_count(self) -> int:
        return len(self.fields)


@dataclass
class DataRecord:
    """A single data record with provenance tracking."""
    record_id: str
    schema_name: str
    data: Dict[str, Any]
    source: str
    quality: DataQuality = DataQuality.RAW
    created_at: float = field(default_factory=time.time)
    updated_at: float = field(default_factory=time.time)
    version: int = 1
    lineage: List[str] = field(default_factory=list)
    sigil: str = ""

    def __post_init__(self):
        if not self.sigil:
            raw = f"{self.record_id}:{self.schema_name}:{self.created_at}"
            self.sigil = hashlib.sha256(raw.encode()).hexdigest()[:16]


@dataclass
class DataSource:
    """External data source definition."""
    name: str
    source_type: DataSourceType
    endpoint: str
    agency: str = ""
    jurisdiction: str = "US_FEDERAL"
    refresh_interval_seconds: int = 3600
    last_fetch: float = 0.0
    total_records: int = 0
    active: bool = True
    schemas: List[str] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def stale(self) -> bool:
        return (time.time() - self.last_fetch) > self.refresh_interval_seconds


@dataclass
class DataPipeline:
    """Data processing pipeline."""
    pipeline_id: str
    name: str
    source: str
    stages: List[PipelineStage] = field(default_factory=list)
    transforms: List[str] = field(default_factory=list)
    records_processed: int = 0
    errors: int = 0
    last_run: float = 0.0
    active: bool = True

    @property
    def success_rate(self) -> float:
        if self.records_processed == 0:
            return 1.0
        return 1.0 - (self.errors / self.records_processed)

    def run(self, records: List[DataRecord]) -> List[DataRecord]:
        """Process records through pipeline stages."""
        processed = []
        for record in records:
            record.quality = DataQuality.VALIDATED
            record.lineage.append(self.pipeline_id)
            record.updated_at = time.time()
            record.version += 1
            self.records_processed += 1
            processed.append(record)
        self.last_run = time.time()
        return processed


# ═══════════════════════════════════════════════════════════════════════════════
# SOVEREIGN DATA LIBRARY
# ═══════════════════════════════════════════════════════════════════════════════

class SovereignDataLibrary:
    """
    Central data library managing all data sources, pipelines,
    schemas, and records for the Sovereign system.
    """

    # Government & Financial Sources
    GOVERNMENT_SOURCES = {
        "SEC": DataSource("SEC", DataSourceType.GOVERNMENT, "https://api.sec.gov", "SEC", "US_FEDERAL"),
        "FINRA": DataSource("FINRA", DataSourceType.REGULATORY, "https://api.finra.org", "FINRA", "US_FEDERAL"),
        "OCC": DataSource("OCC", DataSourceType.GOVERNMENT, "https://api.occ.gov", "OCC", "US_FEDERAL"),
        "FDIC": DataSource("FDIC", DataSourceType.GOVERNMENT, "https://api.fdic.gov", "FDIC", "US_FEDERAL"),
        "FRB": DataSource("FRB", DataSourceType.GOVERNMENT, "https://api.federalreserve.gov", "FRB", "US_FEDERAL"),
        "CFPB": DataSource("CFPB", DataSourceType.GOVERNMENT, "https://api.cfpb.gov", "CFPB", "US_FEDERAL"),
        "CFTC": DataSource("CFTC", DataSourceType.GOVERNMENT, "https://api.cftc.gov", "CFTC", "US_FEDERAL"),
        "TREASURY": DataSource("TREASURY", DataSourceType.GOVERNMENT, "https://api.treasury.gov", "TREASURY", "US_FEDERAL"),
        "IRS": DataSource("IRS", DataSourceType.GOVERNMENT, "https://api.irs.gov", "IRS", "US_FEDERAL"),
        "SBA": DataSource("SBA", DataSourceType.GOVERNMENT, "https://api.sba.gov", "SBA", "US_FEDERAL"),
        "NCUA": DataSource("NCUA", DataSourceType.GOVERNMENT, "https://api.ncua.gov", "NCUA", "US_FEDERAL"),
        "FHFA": DataSource("FHFA", DataSourceType.GOVERNMENT, "https://api.fhfa.gov", "FHFA", "US_FEDERAL"),
        "FTC": DataSource("FTC", DataSourceType.GOVERNMENT, "https://api.ftc.gov", "FTC", "US_FEDERAL"),
        "DOJ": DataSource("DOJ", DataSourceType.GOVERNMENT, "https://api.justice.gov", "DOJ", "US_FEDERAL"),
        "GAO": DataSource("GAO", DataSourceType.GOVERNMENT, "https://api.gao.gov", "GAO", "US_FEDERAL"),
        "CBO": DataSource("CBO", DataSourceType.GOVERNMENT, "https://api.cbo.gov", "CBO", "US_FEDERAL"),
        "OMB": DataSource("OMB", DataSourceType.GOVERNMENT, "https://api.whitehouse.gov/omb", "OMB", "US_FEDERAL"),
        "NIST": DataSource("NIST", DataSourceType.GOVERNMENT, "https://api.nist.gov", "NIST", "US_FEDERAL"),
    }

    MARKET_SOURCES = {
        "NYSE": DataSource("NYSE", DataSourceType.MARKET, "https://api.nyse.com", "NYSE", "US_MARKET"),
        "NASDAQ": DataSource("NASDAQ", DataSourceType.MARKET, "https://api.nasdaq.com", "NASDAQ", "US_MARKET"),
        "CME": DataSource("CME", DataSourceType.MARKET, "https://api.cmegroup.com", "CME", "US_MARKET"),
        "CBOE": DataSource("CBOE", DataSourceType.MARKET, "https://api.cboe.com", "CBOE", "US_MARKET"),
        "ICE": DataSource("ICE", DataSourceType.MARKET, "https://api.ice.com", "ICE", "US_MARKET"),
        "DTCC": DataSource("DTCC", DataSourceType.FINANCIAL, "https://api.dtcc.com", "DTCC", "US_MARKET"),
        "SIPC": DataSource("SIPC", DataSourceType.FINANCIAL, "https://api.sipc.org", "SIPC", "US_MARKET"),
        "MSRB": DataSource("MSRB", DataSourceType.REGULATORY, "https://api.msrb.org", "MSRB", "US_MARKET"),
        "PCAOB": DataSource("PCAOB", DataSourceType.REGULATORY, "https://api.pcaobus.org", "PCAOB", "US_MARKET"),
    }

    def __init__(self):
        self.sources: Dict[str, DataSource] = {}
        self.sources.update(self.GOVERNMENT_SOURCES)
        self.sources.update(self.MARKET_SOURCES)
        self.schemas: Dict[str, DataSchema] = {}
        self.records: Dict[str, DataRecord] = {}
        self.pipelines: Dict[str, DataPipeline] = {}
        self.total_records_processed: int = 0
        self._init_schemas()

    def _init_schemas(self):
        """Initialize built-in data schemas."""
        self.schemas["market_data"] = DataSchema(
            name="market_data", version="1.0",
            fields={"symbol": "str", "price": "float", "volume": "int",
                    "timestamp": "float", "exchange": "str", "change_pct": "float"},
            required_fields=["symbol", "price", "timestamp"],
            indexes=["symbol", "timestamp"],
        )
        self.schemas["regulatory_filing"] = DataSchema(
            name="regulatory_filing", version="1.0",
            fields={"filing_id": "str", "agency": "str", "type": "str",
                    "entity": "str", "date": "str", "status": "str", "data": "dict"},
            required_fields=["filing_id", "agency", "type"],
            indexes=["filing_id", "agency", "entity"],
        )
        self.schemas["financial_metric"] = DataSchema(
            name="financial_metric", version="1.0",
            fields={"entity": "str", "metric": "str", "value": "float",
                    "period": "str", "source": "str", "confidence": "float"},
            required_fields=["entity", "metric", "value"],
            indexes=["entity", "metric", "period"],
        )
        self.schemas["trust_record"] = DataSchema(
            name="trust_record", version="1.0",
            fields={"entity": "str", "trust_score": "float", "attestations": "int",
                    "audits_passed": "int", "last_audit": "float", "grade": "str"},
            required_fields=["entity", "trust_score"],
            indexes=["entity", "trust_score"],
        )
        self.schemas["transaction"] = DataSchema(
            name="transaction", version="1.0",
            fields={"tx_id": "str", "from_entity": "str", "to_entity": "str",
                    "amount": "float", "currency": "str", "timestamp": "float",
                    "status": "str", "type": "str"},
            required_fields=["tx_id", "from_entity", "to_entity", "amount"],
            indexes=["tx_id", "from_entity", "to_entity", "timestamp"],
        )

    def add_source(self, name: str, source: DataSource):
        """Register a new data source."""
        self.sources[name] = source

    def ingest(self, source_name: str, raw_data: List[Dict[str, Any]],
               schema_name: str) -> List[DataRecord]:
        """Ingest raw data from a source into records."""
        records = []
        for i, data in enumerate(raw_data):
            record_id = hashlib.sha256(
                f"{source_name}:{i}:{time.time()}".encode()
            ).hexdigest()[:16]
            record = DataRecord(
                record_id=record_id,
                schema_name=schema_name,
                data=data,
                source=source_name,
            )
            self.records[record_id] = record
            records.append(record)
        if source_name in self.sources:
            self.sources[source_name].last_fetch = time.time()
            self.sources[source_name].total_records += len(records)
        self.total_records_processed += len(records)
        return records

    def create_pipeline(self, name: str, source: str,
                        stages: Optional[List[PipelineStage]] = None) -> DataPipeline:
        """Create a data processing pipeline."""
        pipeline_id = hashlib.sha256(f"{name}:{time.time()}".encode()).hexdigest()[:12]
        pipeline = DataPipeline(
            pipeline_id=pipeline_id,
            name=name,
            source=source,
            stages=stages or [
                PipelineStage.INGEST, PipelineStage.VALIDATE,
                PipelineStage.TRANSFORM, PipelineStage.ENRICH,
                PipelineStage.STORE, PipelineStage.INDEX, PipelineStage.SERVE,
            ],
        )
        self.pipelines[pipeline_id] = pipeline
        return pipeline

    def query(self, schema_name: str, filters: Optional[Dict[str, Any]] = None) -> List[DataRecord]:
        """Query records by schema and optional filters."""
        results = [
            r for r in self.records.values()
            if r.schema_name == schema_name
        ]
        if filters:
            for key, value in filters.items():
                results = [r for r in results if r.data.get(key) == value]
        return results

    def get_source_status(self) -> Dict[str, Any]:
        """Get status of all data sources."""
        return {
            "total_sources": len(self.sources),
            "government_sources": len(self.GOVERNMENT_SOURCES),
            "market_sources": len(self.MARKET_SOURCES),
            "active_sources": sum(1 for s in self.sources.values() if s.active),
            "stale_sources": sum(1 for s in self.sources.values() if s.stale),
            "total_records": self.total_records_processed,
            "schemas": list(self.schemas.keys()),
            "pipelines": len(self.pipelines),
        }

    def get_summary(self) -> Dict[str, Any]:
        """Get library summary."""
        return {
            "sources": len(self.sources),
            "schemas": len(self.schemas),
            "records": len(self.records),
            "pipelines": len(self.pipelines),
            "total_processed": self.total_records_processed,
            "phi_health": PHI_INV,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE-LEVEL
# ═══════════════════════════════════════════════════════════════════════════════

def init_data_library() -> SovereignDataLibrary:
    """Initialize the Sovereign Data Library."""
    return SovereignDataLibrary()
