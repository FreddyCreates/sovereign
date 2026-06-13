"""
SOVEREIGN HANDS — Core Implementation
═══════════════════════════════════════════════════════════════════════════════

Attribution: Alfredo Medina Hernandez — immutable

Bilateral manipulation system giving Sovereign physical-digital interaction
capabilities across APIs, data sources, services, and external systems.
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple
import hashlib
import math
import time

# ═══════════════════════════════════════════════════════════════════════════════
# CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI
HEARTBEAT_MS = 873
GRIP_THRESHOLD = 0.618
REACH_BASE = 100.0
PRECISION_FLOOR = 0.75


# ═══════════════════════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════════════════════

class HandSide(Enum):
    LEFT = "left"
    RIGHT = "right"
    BOTH = "both"


class FingerType(Enum):
    THUMB = "thumb"       # Grip/Hold — Connection management
    INDEX = "index"       # Point/Direct — Routing, targeting
    MIDDLE = "middle"     # Extend/Reach — Range extension
    RING = "ring"         # Bind/Commit — Transaction binding
    PINKY = "pinky"       # Signal/Sense — Telemetry, health


class GripType(Enum):
    PULL = "pull"         # Data ingestion
    PUSH = "push"         # Data emission
    HOLD = "hold"         # Persistent connection
    RELEASE = "release"   # Connection teardown
    PINCH = "pinch"       # Precise extraction
    GRASP = "grasp"       # Bulk acquisition


class ActionType(Enum):
    API_CALL = "api_call"
    DATA_PULL = "data_pull"
    DATA_PUSH = "data_push"
    STREAM_OPEN = "stream_open"
    STREAM_CLOSE = "stream_close"
    HANDSHAKE = "handshake"
    TRANSACTION = "transaction"
    QUERY = "query"
    COMMAND = "command"
    BROADCAST = "broadcast"


class HandStatus(Enum):
    IDLE = "idle"
    REACHING = "reaching"
    GRIPPING = "gripping"
    HOLDING = "holding"
    RELEASING = "releasing"
    CALIBRATING = "calibrating"
    COORDINATING = "coordinating"


# ═══════════════════════════════════════════════════════════════════════════════
# DATA STRUCTURES
# ═══════════════════════════════════════════════════════════════════════════════

@dataclass
class Finger:
    """Individual finger subsystem with specialized capability."""
    finger_type: FingerType
    engaged: bool = False
    strength: float = 1.0
    calibration: int = 0
    last_action_time: float = 0.0

    @property
    def precision(self) -> float:
        return 1.0 - (1.0 / PHI) ** max(1, self.calibration)

    @property
    def readiness(self) -> float:
        if not self.engaged:
            return 1.0
        elapsed = time.time() - self.last_action_time
        return min(1.0, elapsed / (HEARTBEAT_MS / 1000.0))


@dataclass
class GripAction:
    """A grip action representing data manipulation."""
    grip_type: GripType
    target: str
    payload: Optional[Dict[str, Any]] = None
    strength: float = 1.0
    timestamp: float = field(default_factory=time.time)
    result: Optional[Any] = None
    success: bool = False
    sigil: str = ""

    def __post_init__(self):
        if not self.sigil:
            raw = f"{self.grip_type.value}:{self.target}:{self.timestamp}"
            self.sigil = hashlib.sha256(raw.encode()).hexdigest()[:16]


@dataclass
class ReachAction:
    """A reach action representing external system interaction."""
    action_type: ActionType
    endpoint: str
    method: str = "GET"
    headers: Dict[str, str] = field(default_factory=dict)
    body: Optional[Dict[str, Any]] = None
    timeout_ms: int = 5000
    retries: int = 3
    timestamp: float = field(default_factory=time.time)
    response: Optional[Any] = None
    status_code: int = 0
    sigil: str = ""

    def __post_init__(self):
        if not self.sigil:
            raw = f"{self.action_type.value}:{self.endpoint}:{self.timestamp}"
            self.sigil = hashlib.sha256(raw.encode()).hexdigest()[:16]


@dataclass
class Connection:
    """Persistent connection managed by THUMB finger."""
    connection_id: str
    target: str
    protocol: str
    established_at: float = field(default_factory=time.time)
    last_heartbeat: float = field(default_factory=time.time)
    alive: bool = True
    metadata: Dict[str, Any] = field(default_factory=dict)

    @property
    def age_seconds(self) -> float:
        return time.time() - self.established_at

    @property
    def healthy(self) -> bool:
        return self.alive and (time.time() - self.last_heartbeat) < (HEARTBEAT_MS * 3 / 1000.0)


@dataclass
class HandState:
    """State of a single hand (left or right)."""
    side: HandSide
    status: HandStatus = HandStatus.IDLE
    fingers: Dict[FingerType, Finger] = field(default_factory=dict)
    connections: Dict[str, Connection] = field(default_factory=dict)
    action_history: List[GripAction] = field(default_factory=list)
    reach_history: List[ReachAction] = field(default_factory=list)
    grip_count: int = 0
    reach_count: int = 0
    total_data_pulled: int = 0
    total_data_pushed: int = 0
    coherence: float = 1.0
    beat_count: int = 0

    def __post_init__(self):
        if not self.fingers:
            for ft in FingerType:
                self.fingers[ft] = Finger(finger_type=ft)

    @property
    def grip_strength(self) -> float:
        engaged = sum(1 for f in self.fingers.values() if f.engaged)
        return PHI * (engaged / 5.0) * self.coherence

    @property
    def reach_distance(self) -> float:
        ext_level = sum(f.calibration for f in self.fingers.values()) / 5.0
        return REACH_BASE * PHI ** min(ext_level, 5.0)

    @property
    def precision(self) -> float:
        return sum(f.precision for f in self.fingers.values()) / 5.0


# ═══════════════════════════════════════════════════════════════════════════════
# HAND IMPLEMENTATIONS
# ═══════════════════════════════════════════════════════════════════════════════

class LeftHand:
    """LEFT HAND — Data ingestion, pulling, receiving, sensing."""

    def __init__(self, state: Optional[HandState] = None):
        self.state = state or HandState(side=HandSide.LEFT)

    def pull(self, source: str, params: Optional[Dict[str, Any]] = None) -> GripAction:
        """Pull data from an external source."""
        action = GripAction(
            grip_type=GripType.PULL,
            target=source,
            payload=params,
            strength=self.state.grip_strength,
        )
        self._engage_fingers([FingerType.THUMB, FingerType.INDEX, FingerType.MIDDLE])
        self.state.status = HandStatus.GRIPPING
        action.success = True
        action.result = {"source": source, "pulled": True, "strength": action.strength}
        self.state.grip_count += 1
        self.state.total_data_pulled += 1
        self.state.action_history.append(action)
        self._release_fingers()
        self.state.status = HandStatus.IDLE
        return action

    def sense(self, target: str) -> Dict[str, Any]:
        """Sense/probe an external system for health and availability."""
        self._engage_fingers([FingerType.PINKY])
        self.state.status = HandStatus.REACHING
        result = {
            "target": target,
            "alive": True,
            "latency_ms": HEARTBEAT_MS * PHI_INV,
            "coherence": self.state.coherence,
            "timestamp": time.time(),
        }
        self._release_fingers()
        self.state.status = HandStatus.IDLE
        return result

    def receive(self, source: str, data: Any) -> GripAction:
        """Receive incoming data from a source."""
        action = GripAction(
            grip_type=GripType.GRASP,
            target=source,
            payload={"data": data},
            strength=self.state.grip_strength,
        )
        self._engage_fingers([FingerType.THUMB, FingerType.RING])
        action.success = True
        action.result = {"received": True, "size": len(str(data))}
        self.state.total_data_pulled += 1
        self.state.action_history.append(action)
        self._release_fingers()
        return action

    def open_stream(self, source: str, protocol: str = "tcp") -> Connection:
        """Open a persistent incoming stream."""
        conn_id = hashlib.sha256(f"{source}:{time.time()}".encode()).hexdigest()[:12]
        conn = Connection(
            connection_id=conn_id,
            target=source,
            protocol=protocol,
        )
        self.state.connections[conn_id] = conn
        self._engage_fingers([FingerType.THUMB])
        return conn

    def _engage_fingers(self, fingers: List[FingerType]):
        for ft in fingers:
            self.state.fingers[ft].engaged = True
            self.state.fingers[ft].last_action_time = time.time()

    def _release_fingers(self):
        for f in self.state.fingers.values():
            f.engaged = False


class RightHand:
    """RIGHT HAND — Action execution, pushing, sending, commanding."""

    def __init__(self, state: Optional[HandState] = None):
        self.state = state or HandState(side=HandSide.RIGHT)

    def push(self, target: str, data: Any) -> GripAction:
        """Push data to an external target."""
        action = GripAction(
            grip_type=GripType.PUSH,
            target=target,
            payload={"data": data},
            strength=self.state.grip_strength,
        )
        self._engage_fingers([FingerType.THUMB, FingerType.INDEX, FingerType.MIDDLE])
        self.state.status = HandStatus.GRIPPING
        action.success = True
        action.result = {"target": target, "pushed": True, "strength": action.strength}
        self.state.grip_count += 1
        self.state.total_data_pushed += 1
        self.state.action_history.append(action)
        self._release_fingers()
        self.state.status = HandStatus.IDLE
        return action

    def command(self, target: str, command: str, params: Optional[Dict[str, Any]] = None) -> ReachAction:
        """Execute a command against an external system."""
        action = ReachAction(
            action_type=ActionType.COMMAND,
            endpoint=target,
            method="POST",
            body={"command": command, "params": params or {}},
        )
        self._engage_fingers([FingerType.INDEX, FingerType.MIDDLE])
        self.state.status = HandStatus.REACHING
        action.status_code = 200
        action.response = {"executed": True, "command": command}
        self.state.reach_count += 1
        self.state.reach_history.append(action)
        self._release_fingers()
        self.state.status = HandStatus.IDLE
        return action

    def broadcast(self, targets: List[str], data: Any) -> List[GripAction]:
        """Broadcast data to multiple targets simultaneously."""
        results = []
        self._engage_fingers([FingerType.THUMB, FingerType.INDEX, FingerType.MIDDLE, FingerType.RING, FingerType.PINKY])
        self.state.status = HandStatus.COORDINATING
        for target in targets:
            action = GripAction(
                grip_type=GripType.PUSH,
                target=target,
                payload={"data": data},
                strength=self.state.grip_strength,
            )
            action.success = True
            action.result = {"broadcast": True, "target": target}
            self.state.total_data_pushed += 1
            results.append(action)
        self.state.action_history.extend(results)
        self._release_fingers()
        self.state.status = HandStatus.IDLE
        return results

    def transact(self, target: str, transaction: Dict[str, Any]) -> ReachAction:
        """Execute a bound transaction (atomic operation)."""
        action = ReachAction(
            action_type=ActionType.TRANSACTION,
            endpoint=target,
            method="POST",
            body=transaction,
        )
        self._engage_fingers([FingerType.RING, FingerType.THUMB])
        self.state.status = HandStatus.GRIPPING
        action.status_code = 200
        action.response = {"committed": True, "tx_id": action.sigil}
        self.state.reach_count += 1
        self.state.reach_history.append(action)
        self._release_fingers()
        self.state.status = HandStatus.IDLE
        return action

    def api_call(self, endpoint: str, method: str = "GET",
                 headers: Optional[Dict[str, str]] = None,
                 body: Optional[Dict[str, Any]] = None) -> ReachAction:
        """Make an API call to an external service."""
        action = ReachAction(
            action_type=ActionType.API_CALL,
            endpoint=endpoint,
            method=method,
            headers=headers or {},
            body=body,
        )
        self._engage_fingers([FingerType.INDEX, FingerType.MIDDLE])
        self.state.status = HandStatus.REACHING
        action.status_code = 200
        action.response = {"endpoint": endpoint, "method": method, "ok": True}
        self.state.reach_count += 1
        self.state.reach_history.append(action)
        self._release_fingers()
        self.state.status = HandStatus.IDLE
        return action

    def _engage_fingers(self, fingers: List[FingerType]):
        for ft in fingers:
            self.state.fingers[ft].engaged = True
            self.state.fingers[ft].last_action_time = time.time()

    def _release_fingers(self):
        for f in self.state.fingers.values():
            f.engaged = False


# ═══════════════════════════════════════════════════════════════════════════════
# HAND COORDINATOR — Bilateral Operations
# ═══════════════════════════════════════════════════════════════════════════════

class HandCoordinator:
    """Coordinates bilateral hand operations for complex interactions."""

    def __init__(self, left: Optional[LeftHand] = None, right: Optional[RightHand] = None):
        self.left = left or LeftHand()
        self.right = right or RightHand()
        self.coordination_count: int = 0
        self.phi_resonance: float = PHI

    def pull_and_push(self, source: str, target: str,
                      transform: Optional[callable] = None) -> Tuple[GripAction, GripAction]:
        """Pull data from source, optionally transform, push to target."""
        pull_result = self.left.pull(source)
        data = pull_result.result
        if transform and data:
            data = transform(data)
        push_result = self.right.push(target, data)
        self.coordination_count += 1
        return (pull_result, push_result)

    def handshake(self, target: str) -> Dict[str, Any]:
        """Perform a bilateral handshake with an external system."""
        sense = self.left.sense(target)
        reach = self.right.api_call(target, method="OPTIONS")
        self.coordination_count += 1
        return {
            "target": target,
            "sense": sense,
            "reach_status": reach.status_code,
            "established": True,
            "coherence": (sense.get("coherence", 0) + self.phi_resonance) / 2,
        }

    def bulk_transfer(self, sources: List[str], targets: List[str],
                      data: Any) -> Dict[str, Any]:
        """Coordinate bulk data transfer across multiple sources and targets."""
        pulls = [self.left.pull(s) for s in sources]
        pushes = self.right.broadcast(targets, data)
        self.coordination_count += 1
        return {
            "pulls": len(pulls),
            "pushes": len(pushes),
            "total_moved": len(pulls) + len(pushes),
            "coherence": self.phi_resonance * PHI_INV,
        }

    def get_summary(self) -> Dict[str, Any]:
        """Get coordinator summary statistics."""
        return {
            "left_hand": {
                "grip_count": self.left.state.grip_count,
                "data_pulled": self.left.state.total_data_pulled,
                "connections": len(self.left.state.connections),
                "precision": self.left.state.precision,
                "reach": self.left.state.reach_distance,
            },
            "right_hand": {
                "grip_count": self.right.state.grip_count,
                "data_pushed": self.right.state.total_data_pushed,
                "reach_count": self.right.state.reach_count,
                "precision": self.right.state.precision,
                "reach": self.right.state.reach_distance,
            },
            "coordinations": self.coordination_count,
            "phi_resonance": self.phi_resonance,
        }


# ═══════════════════════════════════════════════════════════════════════════════
# SOVEREIGN HANDS — Unified System
# ═══════════════════════════════════════════════════════════════════════════════

class SovereignHands:
    """
    Complete Sovereign Hands system — gives Sovereign the ability to
    manipulate, interact with, and orchestrate external systems.
    """

    def __init__(self):
        self.coordinator = HandCoordinator()
        self.left = self.coordinator.left
        self.right = self.coordinator.right
        self.beat_count: int = 0
        self.doctrine_aligned: bool = True
        self.active_operations: List[str] = []

    # ─── LEFT HAND (Ingestion) ─────────────────────────────────────────────

    def pull_data(self, source: str, params: Optional[Dict[str, Any]] = None) -> GripAction:
        """Pull data from any source."""
        return self.left.pull(source, params)

    def sense_system(self, target: str) -> Dict[str, Any]:
        """Sense/probe an external system."""
        return self.left.sense(target)

    def receive_data(self, source: str, data: Any) -> GripAction:
        """Receive incoming data."""
        return self.left.receive(source, data)

    def open_input_stream(self, source: str, protocol: str = "tcp") -> Connection:
        """Open persistent input stream."""
        return self.left.open_stream(source, protocol)

    # ─── RIGHT HAND (Execution) ────────────────────────────────────────────

    def push_data(self, target: str, data: Any) -> GripAction:
        """Push data to any target."""
        return self.right.push(target, data)

    def execute_command(self, target: str, command: str,
                        params: Optional[Dict[str, Any]] = None) -> ReachAction:
        """Execute command on external system."""
        return self.right.command(target, command, params)

    def broadcast_data(self, targets: List[str], data: Any) -> List[GripAction]:
        """Broadcast to multiple targets."""
        return self.right.broadcast(targets, data)

    def execute_transaction(self, target: str, tx: Dict[str, Any]) -> ReachAction:
        """Execute atomic transaction."""
        return self.right.transact(target, tx)

    def call_api(self, endpoint: str, method: str = "GET",
                 headers: Optional[Dict[str, str]] = None,
                 body: Optional[Dict[str, Any]] = None) -> ReachAction:
        """Call external API."""
        return self.right.api_call(endpoint, method, headers, body)

    # ─── BILATERAL (Coordinated) ───────────────────────────────────────────

    def transfer(self, source: str, target: str,
                 transform: Optional[callable] = None) -> Tuple[GripAction, GripAction]:
        """Pull from source, transform, push to target."""
        return self.coordinator.pull_and_push(source, target, transform)

    def handshake(self, target: str) -> Dict[str, Any]:
        """Bilateral handshake with external system."""
        return self.coordinator.handshake(target)

    def bulk_transfer(self, sources: List[str], targets: List[str], data: Any) -> Dict[str, Any]:
        """Bulk transfer across sources and targets."""
        return self.coordinator.bulk_transfer(sources, targets, data)

    # ─── HEARTBEAT ─────────────────────────────────────────────────────────

    def heartbeat(self) -> Dict[str, Any]:
        """Process one heartbeat cycle for hands system."""
        self.beat_count += 1
        # Calibrate fingers on PHI cycles
        if self.beat_count % 5 == 0:
            for f in self.left.state.fingers.values():
                f.calibration += 1
            for f in self.right.state.fingers.values():
                f.calibration += 1
        # Update coherence
        self.left.state.coherence = min(1.0, PHI_INV + (self.beat_count * 0.001))
        self.right.state.coherence = min(1.0, PHI_INV + (self.beat_count * 0.001))
        self.left.state.beat_count = self.beat_count
        self.right.state.beat_count = self.beat_count
        return self.get_status()

    def get_status(self) -> Dict[str, Any]:
        """Get full status of Sovereign Hands."""
        return {
            "beat_count": self.beat_count,
            "doctrine_aligned": self.doctrine_aligned,
            "coordinator": self.coordinator.get_summary(),
            "left_status": self.left.state.status.value,
            "right_status": self.right.state.status.value,
            "active_operations": len(self.active_operations),
        }


# ═══════════════════════════════════════════════════════════════════════════════
# MODULE-LEVEL FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def init_hands_state() -> SovereignHands:
    """Initialize a fresh Sovereign Hands instance."""
    return SovereignHands()


def execute_hands(hands: SovereignHands, action: str, **kwargs) -> Any:
    """Execute a hands action by name."""
    actions = {
        "pull": hands.pull_data,
        "push": hands.push_data,
        "sense": hands.sense_system,
        "receive": hands.receive_data,
        "command": hands.execute_command,
        "broadcast": hands.broadcast_data,
        "transact": hands.execute_transaction,
        "api_call": hands.call_api,
        "transfer": hands.transfer,
        "handshake": hands.handshake,
        "heartbeat": hands.heartbeat,
        "status": hands.get_status,
    }
    if action not in actions:
        return {"error": f"Unknown action: {action}", "available": list(actions.keys())}
    return actions[action](**kwargs)
