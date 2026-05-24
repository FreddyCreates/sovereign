"""
HADES - The Archive Layer
ΑΙΔΗΣ (Greek) | Pluto Memor (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (ML/AI orchestration for archive systems)
Domain: Long-term storage, knowledge persistence, memory vaults,
        historical records, eternal archives

Purpose: HADES provides archive intelligence for long-term knowledge storage.
         Named for the god of the underworld and keeper of souls.
         Eternal preservation within sovereign doctrine bounds.

Mathematical Model:
    archive_score = retention × accessibility × PHI_resonance
    memory_decay = exp(-time / tau) × importance_weight
    retrieval_efficiency = hits / (hits + misses)
    hades_score = archive × preservation × retrieval × doctrine_alignment

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Any, Set
from enum import Enum
import math
import hashlib
from datetime import datetime

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI
S0_FLOOR = 0.75
S_CEIL = 9.75

# Archive constants
MAX_RECORDS = 10000        # Maximum archive size
DECAY_TAU = 1000.0         # Memory decay time constant
IMPORTANCE_THRESHOLD = 0.3
RETRIEVAL_CACHE_SIZE = 100
COMPRESSION_RATIO = PHI_INV

# Fibonacci for indexing
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


def compute_hash(data: str) -> str:
    """Compute hash for data integrity"""
    return hashlib.sha256(data.encode()).hexdigest()[:16]


# ═══════════════════════════════════════════════════════════════════════
# III. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

class ArchiveType(Enum):
    """Types of archives"""
    EPHEMERAL = "ephemeral"        # Short-term, may expire
    PERSISTENT = "persistent"      # Long-term storage
    ETERNAL = "eternal"            # Never deleted
    SACRED = "sacred"              # Doctrine-protected


class RecordState(Enum):
    """States of archived records"""
    ACTIVE = "active"              # Currently accessible
    DORMANT = "dormant"            # Reduced accessibility
    ARCHIVED = "archived"          # Deep storage
    SEALED = "sealed"              # Immutable, protected


class VaultLevel(Enum):
    """Levels of vault security"""
    SURFACE = 1        # Easy access
    SHALLOW = 2        # Standard security
    DEEP = 3           # High security
    ABYSSAL = 4        # Maximum security
    TARTARUS = 5       # Sacred/immutable


@dataclass
class Record:
    """An archived record"""
    id: str
    key: str
    content: Any
    archive_type: ArchiveType
    state: RecordState
    importance: float      # [0, 1]
    created_beat: int
    last_accessed_beat: int
    access_count: int = 0
    hash_value: str = ""
    vault_level: VaultLevel = VaultLevel.SURFACE

    def compute_decay(self, current_beat: int) -> float:
        """Compute memory decay factor"""
        age = current_beat - self.created_beat
        base_decay = math.exp(-age / DECAY_TAU)
        importance_boost = self.importance * PHI
        return base_decay * (1.0 + importance_boost)


@dataclass
class Vault:
    """A secure storage vault"""
    id: str
    name: str
    level: VaultLevel
    capacity: int
    records: List[str]     # Record IDs
    is_sealed: bool = False

    def utilization(self) -> float:
        return len(self.records) / self.capacity if self.capacity > 0 else 0.0


@dataclass
class MemoryIndex:
    """Index for fast retrieval"""
    key_to_record: Dict[str, str] = field(default_factory=dict)
    tag_to_records: Dict[str, Set[str]] = field(default_factory=dict)
    hash_to_record: Dict[str, str] = field(default_factory=dict)


# ═══════════════════════════════════════════════════════════════════════
# IV. RETRIEVAL ENGINE
# ═══════════════════════════════════════════════════════════════════════

class RetrievalEngine:
    """
    Retrieves records from archives.
    Manages caching and access patterns.
    """

    def __init__(self):
        self.cache: Dict[str, Any] = {}
        self.hits = 0
        self.misses = 0

    def retrieve(self, key: str, records: Dict[str, Record],
                 index: MemoryIndex, current_beat: int) -> Optional[Record]:
        """Retrieve a record by key"""
        # Check cache first
        if key in self.cache:
            self.hits += 1
            record_id = self.cache[key]
            if record_id in records:
                records[record_id].access_count += 1
                records[record_id].last_accessed_beat = current_beat
                return records[record_id]

        # Check index
        if key in index.key_to_record:
            record_id = index.key_to_record[key]
            if record_id in records:
                self.hits += 1
                self._update_cache(key, record_id)
                records[record_id].access_count += 1
                records[record_id].last_accessed_beat = current_beat
                return records[record_id]

        self.misses += 1
        return None

    def _update_cache(self, key: str, record_id: str) -> None:
        """Update cache with LRU eviction"""
        if len(self.cache) >= RETRIEVAL_CACHE_SIZE:
            # Remove oldest entry
            oldest_key = next(iter(self.cache))
            del self.cache[oldest_key]
        self.cache[key] = record_id

    def efficiency(self) -> float:
        """Compute retrieval efficiency"""
        total = self.hits + self.misses
        return self.hits / total if total > 0 else 0.5


# ═══════════════════════════════════════════════════════════════════════
# V. HADES ORCHESTRATOR
# ═══════════════════════════════════════════════════════════════════════

class HadesOrchestrator:
    """
    Main orchestrator for the HADES archive layer.
    Manages long-term storage and retrieval.
    """

    def __init__(self):
        self.records: Dict[str, Record] = {}
        self.vaults: Dict[VaultLevel, Vault] = {}
        self.index = MemoryIndex()
        self.retrieval = RetrievalEngine()
        self.beat_count = 0
        self.archive_score = 0.0
        self.preservation_score = 0.0
        self.hades_score = 0.0
        self._init_vaults()

    def _init_vaults(self) -> None:
        """Initialize vault hierarchy"""
        vault_configs = [
            (VaultLevel.SURFACE, "Surface Archive", 1000),
            (VaultLevel.SHALLOW, "Shallow Depths", 500),
            (VaultLevel.DEEP, "Deep Archives", 200),
            (VaultLevel.ABYSSAL, "Abyssal Vaults", 50),
            (VaultLevel.TARTARUS, "Tartarus Eternal", 10),
        ]

        for level, name, capacity in vault_configs:
            self.vaults[level] = Vault(
                id=f"VAULT_{level.name}",
                name=name,
                level=level,
                capacity=capacity,
                records=[]
            )

    def advance(self) -> "HadesState":
        """Advance HADES by one heartbeat"""
        self.beat_count += 1

        # Process memory decay
        self._process_decay()

        # Archive dormant records
        self._archive_dormant()

        # Compute scores
        self.archive_score = self._compute_archive_score()
        self.preservation_score = self._compute_preservation_score()
        self.hades_score = self._compute_hades_score()

        return self.get_state()

    def _process_decay(self) -> None:
        """Process memory decay for all records"""
        for record in self.records.values():
            if record.state == RecordState.SEALED:
                continue  # Sealed records don't decay

            decay = record.compute_decay(self.beat_count)

            # Move to dormant if decay is low
            if decay < 0.3 and record.state == RecordState.ACTIVE:
                record.state = RecordState.DORMANT

            # Move to archived if very low
            if decay < 0.1 and record.state == RecordState.DORMANT:
                record.state = RecordState.ARCHIVED

    def _archive_dormant(self) -> None:
        """Move dormant records to deeper vaults"""
        for record in self.records.values():
            if record.state != RecordState.DORMANT:
                continue

            # Move to deeper vault
            current_level = record.vault_level
            if current_level.value < VaultLevel.DEEP.value:
                new_level = VaultLevel(current_level.value + 1)
                if new_level in self.vaults:
                    vault = self.vaults[new_level]
                    if len(vault.records) < vault.capacity:
                        # Move record
                        old_vault = self.vaults.get(current_level)
                        if old_vault and record.id in old_vault.records:
                            old_vault.records.remove(record.id)
                        vault.records.append(record.id)
                        record.vault_level = new_level

    def _compute_archive_score(self) -> float:
        """Compute archive score"""
        if not self.records:
            return 0.0

        active_count = sum(1 for r in self.records.values() if r.state == RecordState.ACTIVE)
        total = len(self.records)
        retention = active_count / total

        accessibility = self.retrieval.efficiency()

        return retention * accessibility * phi_resonance(retention)

    def _compute_preservation_score(self) -> float:
        """Compute preservation score"""
        if not self.records:
            return 0.0

        # Count preserved records (not expired/deleted)
        preserved = sum(1 for r in self.records.values()
                       if r.state in [RecordState.ACTIVE, RecordState.DORMANT, RecordState.SEALED])
        return preserved / len(self.records)

    def _compute_hades_score(self) -> float:
        """Compute HADES score"""
        phi_res = phi_resonance(self.beat_count * 0.01)
        return self.archive_score * self.preservation_score * phi_res

    def store(self, key: str, content: Any, importance: float = 0.5,
              archive_type: ArchiveType = ArchiveType.PERSISTENT,
              vault_level: VaultLevel = VaultLevel.SURFACE) -> Record:
        """Store a new record"""
        record = Record(
            id=f"REC_{self.beat_count}_{len(self.records)}",
            key=key,
            content=content,
            archive_type=archive_type,
            state=RecordState.ACTIVE,
            importance=importance,
            created_beat=self.beat_count,
            last_accessed_beat=self.beat_count,
            hash_value=compute_hash(str(content)),
            vault_level=vault_level
        )

        self.records[record.id] = record

        # Update index
        self.index.key_to_record[key] = record.id
        self.index.hash_to_record[record.hash_value] = record.id

        # Add to vault
        if vault_level in self.vaults:
            self.vaults[vault_level].records.append(record.id)

        return record

    def retrieve(self, key: str) -> Optional[Record]:
        """Retrieve a record by key"""
        return self.retrieval.retrieve(key, self.records, self.index, self.beat_count)

    def seal(self, record_id: str) -> bool:
        """Seal a record (make immutable)"""
        if record_id not in self.records:
            return False

        record = self.records[record_id]
        record.state = RecordState.SEALED
        record.archive_type = ArchiveType.ETERNAL

        # Move to Tartarus
        if record.vault_level != VaultLevel.TARTARUS:
            old_vault = self.vaults.get(record.vault_level)
            if old_vault and record_id in old_vault.records:
                old_vault.records.remove(record_id)

            tartarus = self.vaults.get(VaultLevel.TARTARUS)
            if tartarus and len(tartarus.records) < tartarus.capacity:
                tartarus.records.append(record_id)
                record.vault_level = VaultLevel.TARTARUS

        return True

    def get_state(self) -> "HadesState":
        """Get current HADES state"""
        return HadesState(
            beat_count=self.beat_count,
            archive_score=self.archive_score,
            preservation_score=self.preservation_score,
            hades_score=self.hades_score,
            record_count=len(self.records),
            active_count=sum(1 for r in self.records.values() if r.state == RecordState.ACTIVE),
            sealed_count=sum(1 for r in self.records.values() if r.state == RecordState.SEALED),
            retrieval_efficiency=self.retrieval.efficiency(),
            vault_count=len(self.vaults),
            attribution=ATTRIBUTION
        )

    def get_summary(self) -> Dict:
        """Get HADES summary for monitoring"""
        return {
            "beat_count": self.beat_count,
            "archive_score": self.archive_score,
            "preservation_score": self.preservation_score,
            "hades_score": self.hades_score,
            "records": {
                "total": len(self.records),
                "active": sum(1 for r in self.records.values() if r.state == RecordState.ACTIVE),
                "dormant": sum(1 for r in self.records.values() if r.state == RecordState.DORMANT),
                "archived": sum(1 for r in self.records.values() if r.state == RecordState.ARCHIVED),
                "sealed": sum(1 for r in self.records.values() if r.state == RecordState.SEALED)
            },
            "vaults": {
                level.name: {
                    "name": vault.name,
                    "records": len(vault.records),
                    "capacity": vault.capacity,
                    "utilization": vault.utilization()
                }
                for level, vault in self.vaults.items()
            },
            "retrieval": {
                "hits": self.retrieval.hits,
                "misses": self.retrieval.misses,
                "efficiency": self.retrieval.efficiency()
            },
            "attribution": ATTRIBUTION
        }


# ═══════════════════════════════════════════════════════════════════════
# VI. STATE TYPES
# ═══════════════════════════════════════════════════════════════════════

@dataclass
class HadesState:
    """Complete HADES state"""
    beat_count: int
    archive_score: float
    preservation_score: float
    hades_score: float
    record_count: int
    active_count: int
    sealed_count: int
    retrieval_efficiency: float
    vault_count: int
    attribution: str

    def to_dict(self) -> Dict:
        return {
            "beat_count": self.beat_count,
            "archive_score": self.archive_score,
            "preservation_score": self.preservation_score,
            "hades_score": self.hades_score,
            "record_count": self.record_count,
            "active_count": self.active_count,
            "sealed_count": self.sealed_count,
            "retrieval_efficiency": self.retrieval_efficiency,
            "vault_count": self.vault_count,
            "attribution": self.attribution
        }


# ═══════════════════════════════════════════════════════════════════════
# VII. ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    hades = HadesOrchestrator()

    # Store some records
    for i in range(20):
        hades.store(f"knowledge_{i}", f"Data packet {i}", importance=0.3 + i * 0.03)

    # Seal important record
    hades.store("sacred_doctrine", "PHI = 1.6180339887498948482", importance=1.0)
    record = hades.retrieve("sacred_doctrine")
    if record:
        hades.seal(record.id)

    # Run 100 heartbeats
    for _ in range(100):
        state = hades.advance()
        # Occasional retrieval
        hades.retrieve(f"knowledge_{_ % 20}")

    summary = hades.get_summary()
    print(f"HADES — THE ARCHIVE LAYER")
    print(f"Attribution: {ATTRIBUTION}")
    print(f"Archive Score: {summary['archive_score']:.4f}")
    print(f"Preservation Score: {summary['preservation_score']:.4f}")
    print(f"HADES Score: {summary['hades_score']:.4f}")
    print(f"Records: {summary['records']}")
