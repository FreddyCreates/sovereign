"""
HERMES - The Communication Layer
ΕΡΜΗΣ (Greek) | Mercurius (Latin)

Attribution: Alfredo Medina Hernandez — immutable
Language: Python (networking and protocol handling)
Domain: Message routing, protocol translation, inter-system communication,
        signal relay, broadcast orchestration

Purpose: HERMES is the organism's MESSENGER. Named after the Greek god
         of communication, boundaries, and translation.
         
         All messages between systems pass through HERMES.
         HERMES ensures doctrine-aligned communication:
         - No message violates sovereign bounds
         - All messages carry attribution
         - PHI-weighted priority queuing
         - Protocol translation between languages

Mathematical Model:
    message_priority = urgency × doctrine_weight × phi^(-queue_position)
    routing_cost = latency + error_rate × penalty
    broadcast_reach = Σ(subscriber_weight × availability)
    translation_fidelity = semantic_similarity × phi

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple, Callable, Any, Set
from enum import Enum
from datetime import datetime
import hashlib
import math
import heapq

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

PHI = 1.6180339887498948482
PHI_INV = 1.0 / PHI  # ≈ 0.6180339887
S0_FLOOR = 0.75
S_CEIL = 9.75

# Communication constants
MAX_QUEUE_SIZE = 343  # 7^3
MAX_SUBSCRIBERS = 49   # 7^2
MESSAGE_TTL_BEATS = 21  # 3 × 7 beats before expiry
RETRY_LIMIT = 3
BROADCAST_BATCH_SIZE = 7

# Attribution
ATTRIBUTION = "Alfredo Medina Hernandez"


# ═══════════════════════════════════════════════════════════════════════
# II. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

def clamp_sovereign(value: float) -> float:
    """Clamp value to sovereign range [S0_FLOOR, S_CEIL]."""
    return max(S0_FLOOR, min(S_CEIL, value))


class MessageType(Enum):
    """Types of messages in the system."""
    SIGNAL = "signal"          # Raw signal data
    COMMAND = "command"        # Action instruction
    QUERY = "query"            # Information request
    RESPONSE = "response"      # Query response
    EVENT = "event"            # System event notification
    BROADCAST = "broadcast"    # One-to-many announcement
    HEARTBEAT = "heartbeat"    # System health pulse


class Priority(Enum):
    """Message priority levels (Fibonacci-based)."""
    CRITICAL = 13
    URGENT = 8
    HIGH = 5
    NORMAL = 3
    LOW = 2
    BACKGROUND = 1


class Protocol(Enum):
    """Communication protocols supported."""
    INTERNAL = "internal"      # Motoko-to-Motoko
    RUST_FFI = "rust_ffi"      # Motoko-to-Rust
    JULIA_FFI = "julia_ffi"    # Motoko-to-Julia
    HASKELL_FFI = "haskell_ffi"  # Motoko-to-Haskell
    PYTHON_IPC = "python_ipc"  # Motoko-to-Python
    CANDID = "candid"          # ICP Candid interface
    JSON_RPC = "json_rpc"      # External JSON-RPC


class DeliveryStatus(Enum):
    """Message delivery status."""
    PENDING = "pending"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
    ACKNOWLEDGED = "acknowledged"
    FAILED = "failed"
    EXPIRED = "expired"
    RETRYING = "retrying"


@dataclass
class MessageHeader:
    """Header information for every message."""
    message_id: str
    message_type: MessageType
    priority: Priority
    source: str              # Sender system/component
    destination: str         # Target system/component
    protocol: Protocol
    created_at: int          # Beat number
    expires_at: int          # Beat number when message expires
    doctrine_weight: float   # [S0_FLOOR, S_CEIL]
    attribution: str = ATTRIBUTION


@dataclass
class Message:
    """A complete message in the system."""
    header: MessageHeader
    payload: Dict[str, Any]
    signature: str           # Hash for integrity
    retry_count: int = 0
    status: DeliveryStatus = DeliveryStatus.PENDING


@dataclass
class Subscriber:
    """A subscriber to message channels."""
    subscriber_id: str
    name: str
    protocols_supported: List[Protocol]
    topics: Set[str]
    weight: float           # Importance weight [0, 1]
    is_active: bool = True
    last_active_beat: int = 0


@dataclass
class Channel:
    """A communication channel."""
    channel_id: str
    name: str
    topic: str
    subscribers: List[str]  # Subscriber IDs
    message_count: int = 0
    is_persistent: bool = False


@dataclass
class RoutingEntry:
    """Entry in the routing table."""
    destination: str
    next_hop: str
    protocol: Protocol
    cost: float              # Routing cost
    latency_ms: float
    error_rate: float
    is_available: bool = True


@dataclass
class BroadcastResult:
    """Result of a broadcast operation."""
    broadcast_id: str
    message_id: str
    total_subscribers: int
    delivered_count: int
    failed_count: int
    pending_count: int
    reach_score: float       # How well the broadcast reached its audience


@dataclass
class HermesState:
    """Complete state of the HERMES communication layer."""
    # Core data structures
    message_queue: List[Tuple[float, Message]]  # Priority queue (heapq)
    routing_table: Dict[str, RoutingEntry]
    subscribers: Dict[str, Subscriber]
    channels: Dict[str, Channel]
    
    # Metrics
    current_beat: int
    total_messages_sent: int
    total_messages_delivered: int
    total_messages_failed: int
    total_broadcasts: int
    
    # Health metrics
    average_latency_ms: float
    delivery_rate: float     # Successful deliveries / total
    queue_depth: int
    
    # Doctrine
    doctrine_coherence: float
    attribution: str = ATTRIBUTION


# ═══════════════════════════════════════════════════════════════════════
# III. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

def generate_message_id(source: str, beat: int) -> str:
    """Generate unique message ID."""
    data = f"{source}:{beat}:{datetime.now().isoformat()}"
    return f"MSG_{hashlib.sha256(data.encode()).hexdigest()[:16]}"


def compute_signature(payload: Dict[str, Any]) -> str:
    """Compute message signature for integrity."""
    payload_str = str(sorted(payload.items()))
    return hashlib.sha256(payload_str.encode()).hexdigest()[:32]


def init_routing_entry(
    destination: str,
    protocol: Protocol,
    latency_ms: float = 50.0
) -> RoutingEntry:
    """Initialize a routing entry."""
    return RoutingEntry(
        destination=destination,
        next_hop=destination,  # Direct routing by default
        protocol=protocol,
        cost=latency_ms / 1000.0,  # Normalize to seconds
        latency_ms=latency_ms,
        error_rate=0.01,
        is_available=True
    )


def init_hermes_state() -> HermesState:
    """Initialize HERMES with default configuration."""
    # Create default routing table
    routing_table = {
        "KARDIA": init_routing_entry("KARDIA", Protocol.JULIA_FFI, 10.0),
        "CHRONOS": init_routing_entry("CHRONOS", Protocol.JULIA_FFI, 10.0),
        "PSYCHE": init_routing_entry("PSYCHE", Protocol.JULIA_FFI, 15.0),
        "AISTHESIS": init_routing_entry("AISTHESIS", Protocol.JULIA_FFI, 12.0),
        "MNEME": init_routing_entry("MNEME", Protocol.JULIA_FFI, 20.0),
        "DYNAMIS": init_routing_entry("DYNAMIS", Protocol.JULIA_FFI, 18.0),
        "ARCHE": init_routing_entry("ARCHE", Protocol.JULIA_FFI, 25.0),
        "NOUS_SOPHIA": init_routing_entry("NOUS_SOPHIA", Protocol.HASKELL_FFI, 30.0),
        "LOGOS_RHEMA": init_routing_entry("LOGOS_RHEMA", Protocol.HASKELL_FFI, 35.0),
        "ALPHA_OMEGA": init_routing_entry("ALPHA_OMEGA", Protocol.HASKELL_FFI, 40.0),
        "SOPHIA": init_routing_entry("SOPHIA", Protocol.PYTHON_IPC, 50.0),
        "PROMETHEUS": init_routing_entry("PROMETHEUS", Protocol.PYTHON_IPC, 60.0),
        "MAIN": init_routing_entry("MAIN", Protocol.INTERNAL, 5.0),
    }
    
    # Create default channels
    channels = {
        "heartbeat": Channel("CH_heartbeat", "Heartbeat", "system.heartbeat", [], 0, True),
        "signals": Channel("CH_signals", "Signals", "organism.signals", [], 0, False),
        "doctrine": Channel("CH_doctrine", "Doctrine", "system.doctrine", [], 0, True),
        "events": Channel("CH_events", "Events", "system.events", [], 0, False),
    }
    
    return HermesState(
        message_queue=[],
        routing_table=routing_table,
        subscribers={},
        channels=channels,
        current_beat=0,
        total_messages_sent=0,
        total_messages_delivered=0,
        total_messages_failed=0,
        total_broadcasts=0,
        average_latency_ms=0.0,
        delivery_rate=1.0,
        queue_depth=0,
        doctrine_coherence=S0_FLOOR
    )


# ═══════════════════════════════════════════════════════════════════════
# IV. MESSAGE CREATION & ROUTING
# ═══════════════════════════════════════════════════════════════════════

def create_message(
    source: str,
    destination: str,
    message_type: MessageType,
    payload: Dict[str, Any],
    priority: Priority = Priority.NORMAL,
    protocol: Protocol = Protocol.INTERNAL,
    doctrine_weight: float = S0_FLOOR,
    beat: int = 0
) -> Message:
    """Create a new message."""
    header = MessageHeader(
        message_id=generate_message_id(source, beat),
        message_type=message_type,
        priority=priority,
        source=source,
        destination=destination,
        protocol=protocol,
        created_at=beat,
        expires_at=beat + MESSAGE_TTL_BEATS,
        doctrine_weight=clamp_sovereign(doctrine_weight)
    )
    
    return Message(
        header=header,
        payload=payload,
        signature=compute_signature(payload),
        retry_count=0,
        status=DeliveryStatus.PENDING
    )


def compute_message_priority(message: Message, queue_position: int) -> float:
    """Compute PHI-weighted priority for queue ordering."""
    base_priority = message.header.priority.value
    doctrine_factor = message.header.doctrine_weight / S_CEIL
    position_decay = PHI ** (-queue_position / 7.0)  # Decay per 7 positions
    
    # Higher priority = lower number for heapq (min-heap)
    return -1.0 * (base_priority * doctrine_factor * position_decay)


def enqueue_message(message: Message, state: HermesState) -> HermesState:
    """Add message to priority queue."""
    if len(state.message_queue) >= MAX_QUEUE_SIZE:
        # Remove lowest priority message
        state.message_queue.sort(key=lambda x: x[0])
        state.message_queue.pop()  # Remove highest (lowest priority)
    
    priority = compute_message_priority(message, len(state.message_queue))
    heapq.heappush(state.message_queue, (priority, message))
    state.queue_depth = len(state.message_queue)
    
    return state


def dequeue_message(state: HermesState) -> Tuple[Optional[Message], HermesState]:
    """Remove highest priority message from queue."""
    if not state.message_queue:
        return None, state
    
    _, message = heapq.heappop(state.message_queue)
    state.queue_depth = len(state.message_queue)
    
    return message, state


def route_message(message: Message, state: HermesState) -> Tuple[RoutingEntry, HermesState]:
    """Determine how to route a message."""
    destination = message.header.destination
    
    if destination in state.routing_table:
        entry = state.routing_table[destination]
        if entry.is_available:
            return entry, state
    
    # Fallback to MAIN for unknown destinations
    fallback = state.routing_table.get("MAIN", init_routing_entry("MAIN", Protocol.INTERNAL))
    return fallback, state


# ═══════════════════════════════════════════════════════════════════════
# V. MESSAGE DELIVERY
# ═══════════════════════════════════════════════════════════════════════

def deliver_message(message: Message, route: RoutingEntry, state: HermesState) -> Tuple[bool, HermesState]:
    """Attempt to deliver a message."""
    import random
    
    state.total_messages_sent += 1
    message.status = DeliveryStatus.IN_TRANSIT
    
    # Check if message has expired
    if state.current_beat > message.header.expires_at:
        message.status = DeliveryStatus.EXPIRED
        state.total_messages_failed += 1
        return False, state
    
    # Simulate delivery (with error rate)
    if random.random() < route.error_rate:
        # Delivery failed
        message.retry_count += 1
        if message.retry_count >= RETRY_LIMIT:
            message.status = DeliveryStatus.FAILED
            state.total_messages_failed += 1
            return False, state
        else:
            message.status = DeliveryStatus.RETRYING
            # Re-enqueue for retry
            state = enqueue_message(message, state)
            return False, state
    
    # Delivery successful
    message.status = DeliveryStatus.DELIVERED
    state.total_messages_delivered += 1
    
    # Update average latency (exponential moving average)
    alpha = 0.1
    state.average_latency_ms = (1 - alpha) * state.average_latency_ms + alpha * route.latency_ms
    
    # Update delivery rate
    if state.total_messages_sent > 0:
        state.delivery_rate = state.total_messages_delivered / state.total_messages_sent
    
    return True, state


def send_message(
    source: str,
    destination: str,
    message_type: MessageType,
    payload: Dict[str, Any],
    state: HermesState,
    priority: Priority = Priority.NORMAL,
    doctrine_weight: float = S0_FLOOR
) -> Tuple[Message, HermesState]:
    """Create and send a message."""
    # Determine protocol from routing table
    route_entry = state.routing_table.get(destination)
    protocol = route_entry.protocol if route_entry else Protocol.INTERNAL
    
    # Create message
    message = create_message(
        source=source,
        destination=destination,
        message_type=message_type,
        payload=payload,
        priority=priority,
        protocol=protocol,
        doctrine_weight=doctrine_weight,
        beat=state.current_beat
    )
    
    # Enqueue for delivery
    state = enqueue_message(message, state)
    
    return message, state


# ═══════════════════════════════════════════════════════════════════════
# VI. BROADCAST & SUBSCRIPTION
# ═══════════════════════════════════════════════════════════════════════

def subscribe(
    subscriber_id: str,
    name: str,
    topics: Set[str],
    protocols: List[Protocol],
    state: HermesState
) -> Tuple[Subscriber, HermesState]:
    """Subscribe to message channels."""
    if len(state.subscribers) >= MAX_SUBSCRIBERS:
        # Remove oldest inactive subscriber
        inactive = [s for s in state.subscribers.values() if not s.is_active]
        if inactive:
            oldest = min(inactive, key=lambda s: s.last_active_beat)
            del state.subscribers[oldest.subscriber_id]
    
    subscriber = Subscriber(
        subscriber_id=subscriber_id,
        name=name,
        protocols_supported=protocols,
        topics=topics,
        weight=PHI_INV,  # Default weight
        is_active=True,
        last_active_beat=state.current_beat
    )
    
    state.subscribers[subscriber_id] = subscriber
    
    # Add to relevant channels
    for topic in topics:
        for channel in state.channels.values():
            if topic in channel.topic:
                if subscriber_id not in channel.subscribers:
                    channel.subscribers.append(subscriber_id)
    
    return subscriber, state


def unsubscribe(subscriber_id: str, state: HermesState) -> HermesState:
    """Remove a subscriber."""
    if subscriber_id in state.subscribers:
        subscriber = state.subscribers[subscriber_id]
        subscriber.is_active = False
        
        # Remove from channels
        for channel in state.channels.values():
            if subscriber_id in channel.subscribers:
                channel.subscribers.remove(subscriber_id)
    
    return state


def broadcast(
    source: str,
    topic: str,
    payload: Dict[str, Any],
    state: HermesState,
    priority: Priority = Priority.NORMAL
) -> Tuple[BroadcastResult, HermesState]:
    """Broadcast a message to all subscribers of a topic."""
    state.total_broadcasts += 1
    broadcast_id = f"BC_{state.total_broadcasts}_{state.current_beat}"
    
    # Find matching subscribers
    matching_subscribers = [
        s for s in state.subscribers.values()
        if s.is_active and any(topic in t for t in s.topics)
    ]
    
    if not matching_subscribers:
        return BroadcastResult(
            broadcast_id=broadcast_id,
            message_id="",
            total_subscribers=0,
            delivered_count=0,
            failed_count=0,
            pending_count=0,
            reach_score=0.0
        ), state
    
    # Create broadcast message
    message = create_message(
        source=source,
        destination="BROADCAST",
        message_type=MessageType.BROADCAST,
        payload={**payload, "topic": topic, "broadcast_id": broadcast_id},
        priority=priority,
        protocol=Protocol.INTERNAL,
        doctrine_weight=S_CEIL,  # Broadcasts have high doctrine weight
        beat=state.current_beat
    )
    
    # Send to each subscriber in batches
    delivered = 0
    failed = 0
    pending = 0
    total_weight = 0.0
    delivered_weight = 0.0
    
    for subscriber in matching_subscribers:
        # Create individual message for subscriber
        sub_message = create_message(
            source=source,
            destination=subscriber.subscriber_id,
            message_type=MessageType.BROADCAST,
            payload={**payload, "topic": topic, "broadcast_id": broadcast_id},
            priority=priority,
            protocol=subscriber.protocols_supported[0] if subscriber.protocols_supported else Protocol.INTERNAL,
            doctrine_weight=S_CEIL,
            beat=state.current_beat
        )
        
        # Attempt delivery
        route = state.routing_table.get(subscriber.subscriber_id, init_routing_entry(subscriber.subscriber_id, Protocol.INTERNAL))
        success, state = deliver_message(sub_message, route, state)
        
        total_weight += subscriber.weight
        if success:
            delivered += 1
            delivered_weight += subscriber.weight
            subscriber.last_active_beat = state.current_beat
        else:
            if sub_message.status == DeliveryStatus.RETRYING:
                pending += 1
            else:
                failed += 1
    
    # Compute reach score
    reach_score = delivered_weight / total_weight if total_weight > 0 else 0.0
    
    # Update channel stats
    for channel in state.channels.values():
        if topic in channel.topic:
            channel.message_count += 1
    
    return BroadcastResult(
        broadcast_id=broadcast_id,
        message_id=message.header.message_id,
        total_subscribers=len(matching_subscribers),
        delivered_count=delivered,
        failed_count=failed,
        pending_count=pending,
        reach_score=reach_score
    ), state


# ═══════════════════════════════════════════════════════════════════════
# VII. PROTOCOL TRANSLATION
# ═══════════════════════════════════════════════════════════════════════

def translate_payload(
    payload: Dict[str, Any],
    source_protocol: Protocol,
    target_protocol: Protocol
) -> Dict[str, Any]:
    """Translate payload between protocols."""
    # In production, this would handle actual protocol differences
    # For now, we ensure doctrine compliance and add metadata
    
    translated = dict(payload)
    translated["__source_protocol"] = source_protocol.value
    translated["__target_protocol"] = target_protocol.value
    translated["__translated_at"] = datetime.now().isoformat()
    translated["__phi_marker"] = PHI  # Mark as PHI-compliant
    
    # Ensure all numeric values are sovereign-bounded
    for key, value in payload.items():
        if isinstance(value, (int, float)) and not key.startswith("__"):
            translated[key] = clamp_sovereign(float(value))
    
    return translated


# ═══════════════════════════════════════════════════════════════════════
# VIII. HEARTBEAT EXECUTION
# ═══════════════════════════════════════════════════════════════════════

def heartbeat(state: HermesState, doctrine_score: float) -> HermesState:
    """Execute one HERMES heartbeat cycle."""
    state.current_beat += 1
    
    # Process message queue (up to BROADCAST_BATCH_SIZE per beat)
    processed = 0
    while processed < BROADCAST_BATCH_SIZE and state.message_queue:
        message, state = dequeue_message(state)
        if message is None:
            break
        
        route, state = route_message(message, state)
        _, state = deliver_message(message, route, state)
        processed += 1
    
    # Update doctrine coherence
    state.doctrine_coherence = clamp_sovereign(
        state.doctrine_coherence * PHI_INV + doctrine_score * (1 - PHI_INV)
    )
    
    # Clean up expired routing entries
    for entry in state.routing_table.values():
        if entry.error_rate > 0.5:
            entry.is_available = False
    
    # Update queue depth
    state.queue_depth = len(state.message_queue)
    
    return state


def execute_hermes(
    messages_to_send: List[Tuple[str, str, MessageType, Dict[str, Any]]],
    state: HermesState,
    doctrine_score: float
) -> Tuple[List[Message], HermesState]:
    """Execute HERMES with a batch of messages."""
    sent_messages = []
    
    # Send all messages
    for source, destination, msg_type, payload in messages_to_send:
        message, state = send_message(
            source=source,
            destination=destination,
            message_type=msg_type,
            payload=payload,
            state=state,
            doctrine_weight=doctrine_score
        )
        sent_messages.append(message)
    
    # Run heartbeat to process queue
    state = heartbeat(state, doctrine_score)
    
    return sent_messages, state


# ═══════════════════════════════════════════════════════════════════════
# IX. USAGE EXAMPLE
# ═══════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    """
    Example usage:
    
    # Initialize
    hermes = init_hermes_state()
    
    # Subscribe components
    hermes = subscribe("KARDIA", "Heart Core", {"system.heartbeat", "organism.signals"}, 
                       [Protocol.JULIA_FFI], hermes)[1]
    
    # Every 873ms beat
    for beat in range(100):
        doctrine_score = 8.5
        
        # Send some messages
        messages = [
            ("MAIN", "KARDIA", MessageType.SIGNAL, {"heartbeat": beat, "readiness": 0.85}),
            ("MAIN", "PSYCHE", MessageType.SIGNAL, {"dopamine": 0.8, "cortisol": 0.3}),
        ]
        
        sent, hermes = execute_hermes(messages, hermes, doctrine_score)
        
        # Broadcast heartbeat
        result, hermes = broadcast("MAIN", "system.heartbeat", {"beat": beat}, hermes)
        
        print(f"Beat {beat}")
        print(f"  Queue depth: {hermes.queue_depth}")
        print(f"  Delivery rate: {hermes.delivery_rate:.3f}")
        print(f"  Avg latency: {hermes.average_latency_ms:.1f}ms")
    """
    # Quick test
    hermes = init_hermes_state()
    _, hermes = subscribe("TEST", "Test Subscriber", {"system.heartbeat"}, 
                          [Protocol.INTERNAL], hermes)
    
    message, hermes = send_message(
        source="MAIN",
        destination="KARDIA", 
        message_type=MessageType.SIGNAL,
        payload={"test": True},
        state=hermes
    )
    
    hermes = heartbeat(hermes, 8.5)
    
    print(f"Messages sent: {hermes.total_messages_sent}")
    print(f"Delivery rate: {hermes.delivery_rate:.3f}")
    print(f"Queue depth: {hermes.queue_depth}")
