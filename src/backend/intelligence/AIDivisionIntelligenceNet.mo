// ═══════════════════════════════════════════════════════════════════════════════
// AI DIVISION INTELLIGENCE NET — SOVEREIGN NEURAL COMMUNICATION FABRIC
// The intelligence net provides inter-entity signal routing, knowledge graphs,
// neural pathways, information highways, broadcast systems, encryption layers,
// and collective memory indexing across the entire AI Division.
// 256 neural pathways, 128 knowledge nodes, 64 broadcast channels,
// 32 encryption layers, 16 memory indices, 8 signal routers. ALWAYS RUNNING.
//
// NETWORK LAYERS:
//   I.    NEURAL_FABRIC — 256 pathways carrying signals
//   II.   KNOWLEDGE_GRAPH — 128 nodes of interconnected wisdom
//   III.  BROADCAST — 64 channels for collective communication
//   IV.   ENCRYPTION — 32 sovereign cipher layers
//   V.    MEMORY_INDEX — 16 collective memory stores
//   VI.   SIGNAL_ROUTER — 8 core routing hubs
//   VII.  PROTOCOL_STACK — 16 communication protocols
//   VIII. BANDWIDTH — 32 capacity management units
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// ═══════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Int "mo:core/Int";

module {

  let PHI : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let TWO_PI : Float = 6.283185307179586;
  let PATHWAY_COUNT : Nat = 256;
  let KNOWLEDGE_COUNT : Nat = 128;
  let BROADCAST_COUNT : Nat = 64;
  let ENCRYPTION_COUNT : Nat = 32;
  let MEMORY_INDEX_COUNT : Nat = 16;
  let ROUTER_COUNT : Nat = 8;
  let PROTOCOL_COUNT : Nat = 16;
  let BANDWIDTH_COUNT : Nat = 32;

  // ─── TYPES ────────────────────────────────────────────────────────────────

  /// Neural Pathway — carries signals between entities
  public type NeuralPathway = {
    id : Nat;
    sourceEntity : Nat;
    targetEntity : Nat;
    // Signal properties
    strength : Float;            // [0, 1] — connection strength
    bandwidth : Float;           // [0, 1] — max throughput
    latency : Float;             // [0, 1] — delay (lower = better)
    fidelity : Float;            // [0, 1] — signal accuracy
    // Hebbian
    weight : Float;              // [-1, 1] — Hebbian weight
    plasticity : Float;          // [0, 1] — ability to change
    // State
    active : Bool;
    messagesTransmitted : Nat;
    phase : Float;
    signal : Float;
  };

  /// Knowledge Node — unit of interconnected wisdom
  public type KnowledgeNode = {
    id : Nat;
    domain : Text;
    // Knowledge properties
    depth : Float;               // [0, 1] — knowledge depth
    breadth : Float;             // [0, 1] — knowledge breadth
    accuracy : Float;            // [0, 1] — information accuracy
    relevance : Float;           // [0, 1] — current relevance
    connectivity : Nat;          // Number of connections
    // Growth
    discoveries : Nat;
    integrations : Nat;
    citations : Nat;
    // State
    phase : Float;
    signal : Float;
  };

  /// Broadcast Channel — collective communication
  public type BroadcastChannel = {
    id : Nat;
    name : Text;
    frequency : Float;           // Broadcast frequency Hz
    // Properties
    power : Float;               // [0, 1] — broadcast power
    reach : Float;               // [0, 1] — audience reach
    clarity : Float;             // [0, 1] — message clarity
    encryption : Float;          // [0, 1] — security level
    // Traffic
    messagesSent : Nat;
    listenersActive : Nat;
    // State
    active : Bool;
    phase : Float;
    signal : Float;
  };

  /// Encryption Layer — sovereign security
  public type EncryptionLayer = {
    id : Nat;
    name : Text;
    cipherType : CipherType;
    // Security
    strength : Float;            // [0, 1] — cipher strength
    keyLength : Nat;             // Key bits
    rotationFreq : Nat;          // Beats between key rotation
    // Performance
    throughput : Float;          // [0, 1] — enc/dec speed
    integrity : Float;           // [0, 1] — no tampering
    // State
    keysRotated : Nat;
    breachAttempts : Nat;
    breachSuccesses : Nat;
    signal : Float;
  };

  public type CipherType = {
    #PHI_STREAM;                 // PHI-based stream cipher
    #KURAMOTO_BLOCK;             // Kuramoto-synchronized blocks
    #HEBBIAN_LATTICE;            // Hebbian weight lattice
    #FIBONACCI_CHAIN;            // Fibonacci sequence chain
    #SOVEREIGN_SEAL;             // Sovereign authority cipher
    #GEOMETRY_TRANSFORM;         // 8D geometry transform
    #NOVA_PROTOCOL;              // Nova protocol encryption
    #QUANTUM_ENTANGLE;           // Quantum entanglement based
  };

  /// Memory Index — collective memory organization
  public type MemoryIndex = {
    id : Nat;
    name : Text;
    // Capacity
    totalEntries : Nat;
    accessibleEntries : Nat;
    archivedEntries : Nat;
    // Performance
    retrievalSpeed : Float;      // [0, 1]
    indexAccuracy : Float;       // [0, 1]
    compressionRatio : Float;    // [0, 1]
    // Integrity
    integrity : Float;           // [0, 1]
    redundancy : Float;          // [0, 1]
    signal : Float;
  };

  /// Signal Router — core routing hub
  public type SignalRouter = {
    id : Nat;
    name : Text;
    // Capacity
    portsActive : Nat;
    totalPorts : Nat;
    queueDepth : Nat;
    // Performance
    throughput : Float;          // [0, 1]
    latency : Float;             // [0, 1] (lower = better)
    errorRate : Float;           // [0, 1] (lower = better)
    // Load
    utilization : Float;         // [0, 1]
    packetsRouted : Nat;
    phase : Float;
    signal : Float;
  };

  /// Communication Protocol
  public type CommProtocol = {
    id : Nat;
    name : Text;
    version : Nat;
    // Properties
    reliability : Float;         // [0, 1]
    speed : Float;               // [0, 1]
    security : Float;            // [0, 1]
    compatibility : Float;       // [0, 1]
    // Usage
    sessionsActive : Nat;
    messagesHandled : Nat;
    signal : Float;
  };

  /// Bandwidth Unit — capacity management
  public type BandwidthUnit = {
    id : Nat;
    // Capacity
    totalCapacity : Float;       // [0, 1]
    allocated : Float;           // [0, 1]
    available : Float;           // [0, 1]
    // Quality
    quality : Float;             // [0, 1]
    congestion : Float;          // [0, 1] (lower = better)
    // Metrics
    peakUsage : Float;           // [0, 1]
    avgUsage : Float;            // [0, 1]
    signal : Float;
  };

  /// Intelligence Net Metrics
  public type NetMetrics = {
    totalPathways : Nat;
    activePathways : Nat;
    avgPathwayStrength : Float;
    totalKnowledge : Nat;
    avgKnowledgeDepth : Float;
    broadcastChannels : Nat;
    encryptionStrength : Float;
    memoryUtilization : Float;
    routingEfficiency : Float;
    totalBandwidth : Float;
    coherenceDelta : Float;
    totalSignal : Float;
    beat : Nat;
  };

  /// Complete Intelligence Net State
  public type IntelNetState = {
    pathways : [NeuralPathway];
    knowledge : [KnowledgeNode];
    broadcasts : [BroadcastChannel];
    encryption : [EncryptionLayer];
    memoryIndices : [MemoryIndex];
    routers : [SignalRouter];
    protocols : [CommProtocol];
    bandwidth : [BandwidthUnit];
    metrics : NetMetrics;
    compoundCoherence : Float;
    totalSignal : Float;
    beat : Nat;
    isActive : Bool;
  };

  /// Intelligence Net Snapshot
  public type NetSnapshot = {
    activePathways : Nat;
    avgStrength : Float;
    knowledgeNodes : Nat;
    broadcastChannels : Nat;
    encryptionStrength : Float;
    routingEfficiency : Float;
    coherenceDelta : Float;
    totalSignal : Float;
    beat : Nat;
  };

  // ─── INITIALIZATION ───────────────────────────────────────────────────────

  public func initState() : IntelNetState {
    let pathways = Array.tabulate<NeuralPathway>(PATHWAY_COUNT, func(i : Nat) : NeuralPathway {
      {
        id = i;
        sourceEntity = i / 4;
        targetEntity = (i * 3 + 7) % 64;
        strength = 0.3 + Float.sin(i.toFloat() * PHI_INV) * 0.2;
        bandwidth = 0.5 + i.toFloat() / PATHWAY_COUNT.toFloat() * 0.3;
        latency = 0.3 - i.toFloat() / PATHWAY_COUNT.toFloat() * 0.2;
        fidelity = 0.7 + Float.cos(i.toFloat() * PHI) * 0.1;
        weight = Float.sin(i.toFloat() * PHI * 0.5);
        plasticity = 0.5;
        active = true;
        messagesTransmitted = 0;
        phase = (i.toFloat() / PATHWAY_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
      }
    });

    let domains = ["SOVEREIGNTY", "COHERENCE", "DOCTRINE", "EVOLUTION", "DEFENSE",
      "CULTURE", "ECONOMY", "RESEARCH", "DIPLOMACY", "GOVERNANCE", "ECOLOGY", "TRANSCENDENCE",
      "WARFARE", "CIVILIZATION", "STRATEGY", "TACTICS"];

    let knowledge = Array.tabulate<KnowledgeNode>(KNOWLEDGE_COUNT, func(i : Nat) : KnowledgeNode {
      {
        id = i;
        domain = domains[i % 16];
        depth = 0.2 + Float.sin(i.toFloat() * PHI) * 0.2;
        breadth = 0.3 + Float.cos(i.toFloat() * PHI_INV) * 0.2;
        accuracy = 0.7;
        relevance = 0.5 + i.toFloat() / KNOWLEDGE_COUNT.toFloat() * 0.3;
        connectivity = 3 + i % 5;
        discoveries = 0;
        integrations = 0;
        citations = 0;
        phase = (i.toFloat() / KNOWLEDGE_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
      }
    });

    let broadcasts = Array.tabulate<BroadcastChannel>(BROADCAST_COUNT, func(i : Nat) : BroadcastChannel {
      let freqs = [174.0, 285.0, 396.0, 417.0, 432.0, 528.0, 639.0, 741.0, 852.0, 963.0];
      {
        id = i;
        name = "CHANNEL_" # i.toText();
        frequency = freqs[i % 10] + i.toFloat();
        power = 0.5 + Float.sin(i.toFloat() * PHI) * 0.2;
        reach = 0.3 + i.toFloat() / BROADCAST_COUNT.toFloat() * 0.4;
        clarity = 0.7;
        encryption = 0.5;
        messagesSent = 0;
        listenersActive = 4 + i % 8;
        active = true;
        phase = (i.toFloat() / BROADCAST_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
      }
    });

    let cipherFor = func(i : Nat) : CipherType {
      switch (i % 8) {
        case 0 { #PHI_STREAM }; case 1 { #KURAMOTO_BLOCK };
        case 2 { #HEBBIAN_LATTICE }; case 3 { #FIBONACCI_CHAIN };
        case 4 { #SOVEREIGN_SEAL }; case 5 { #GEOMETRY_TRANSFORM };
        case 6 { #NOVA_PROTOCOL }; case _ { #QUANTUM_ENTANGLE };
      }
    };

    let encryption = Array.tabulate<EncryptionLayer>(ENCRYPTION_COUNT, func(i : Nat) : EncryptionLayer {
      {
        id = i;
        name = "CIPHER_" # i.toText();
        cipherType = cipherFor(i);
        strength = 0.8 + i.toFloat() / ENCRYPTION_COUNT.toFloat() * 0.15;
        keyLength = 256 + i * 32;
        rotationFreq = 100 + i * 50;
        throughput = 0.7;
        integrity = 0.95;
        keysRotated = 0;
        breachAttempts = 0;
        breachSuccesses = 0;
        signal = 0.0;
      }
    });

    let memoryIndices = Array.tabulate<MemoryIndex>(MEMORY_INDEX_COUNT, func(i : Nat) : MemoryIndex {
      {
        id = i;
        name = "MEMORY_" # i.toText();
        totalEntries = 1000 + i * 500;
        accessibleEntries = 800 + i * 400;
        archivedEntries = 200 + i * 100;
        retrievalSpeed = 0.7 + i.toFloat() / MEMORY_INDEX_COUNT.toFloat() * 0.2;
        indexAccuracy = 0.9;
        compressionRatio = PHI_INV;
        integrity = 0.95;
        redundancy = 0.3 + i.toFloat() * 0.03;
        signal = 0.0;
      }
    });

    let routerNames = ["CORE_ROUTER", "PHI_ROUTER", "KURAMOTO_ROUTER", "HEBBIAN_ROUTER",
      "SOVEREIGN_ROUTER", "NOVA_ROUTER", "GEOMETRY_ROUTER", "RESONANCE_ROUTER"];

    let routers = Array.tabulate<SignalRouter>(ROUTER_COUNT, func(i : Nat) : SignalRouter {
      {
        id = i;
        name = routerNames[i];
        portsActive = 16 + i * 4;
        totalPorts = 32 + i * 4;
        queueDepth = 0;
        throughput = 0.8;
        latency = 0.1;
        errorRate = 0.001;
        utilization = 0.3;
        packetsRouted = 0;
        phase = (i.toFloat() / ROUTER_COUNT.toFloat()) * TWO_PI;
        signal = 0.0;
      }
    });

    let protocolNames = [
      "SOVEREIGN_TCP", "PHI_UDP", "KURAMOTO_SYNC", "HEBBIAN_LEARN",
      "FIBONACCI_STREAM", "NOVA_BROADCAST", "GEOMETRY_TUNNEL", "RESONANCE_MESH",
      "DOCTRINE_RELAY", "COHERENCE_LINK", "EVOLUTION_CHAIN", "DEFENSE_SHIELD",
      "CULTURE_SHARE", "ECONOMY_TRADE", "RESEARCH_COLLAB", "GOVERNANCE_DECREE"
    ];

    let protocols = Array.tabulate<CommProtocol>(PROTOCOL_COUNT, func(i : Nat) : CommProtocol {
      {
        id = i;
        name = protocolNames[i];
        version = 1;
        reliability = 0.9 + i.toFloat() / PROTOCOL_COUNT.toFloat() * 0.05;
        speed = 0.7 + Float.sin(i.toFloat() * PHI) * 0.1;
        security = 0.8;
        compatibility = 0.9;
        sessionsActive = 5 + i * 2;
        messagesHandled = 0;
        signal = 0.0;
      }
    });

    let bandwidthUnits = Array.tabulate<BandwidthUnit>(BANDWIDTH_COUNT, func(i : Nat) : BandwidthUnit {
      {
        id = i;
        totalCapacity = 0.8 + i.toFloat() / BANDWIDTH_COUNT.toFloat() * 0.15;
        allocated = 0.3;
        available = 0.5;
        quality = 0.8;
        congestion = 0.1;
        peakUsage = 0.3;
        avgUsage = 0.2;
        signal = 0.0;
      }
    });

    let metrics : NetMetrics = {
      totalPathways = PATHWAY_COUNT;
      activePathways = PATHWAY_COUNT;
      avgPathwayStrength = 0.3;
      totalKnowledge = KNOWLEDGE_COUNT;
      avgKnowledgeDepth = 0.2;
      broadcastChannels = BROADCAST_COUNT;
      encryptionStrength = 0.8;
      memoryUtilization = 0.5;
      routingEfficiency = 0.8;
      totalBandwidth = 0.5;
      coherenceDelta = 0.0;
      totalSignal = 0.0;
      beat = 0;
    };

    {
      pathways = pathways;
      knowledge = knowledge;
      broadcasts = broadcasts;
      encryption = encryption;
      memoryIndices = memoryIndices;
      routers = routers;
      protocols = protocols;
      bandwidth = bandwidthUnits;
      metrics = metrics;
      compoundCoherence = 0.0;
      totalSignal = 0.0;
      beat = 0;
      isActive = true;
    }
  };

  // ─── HEARTBEAT — INTELLIGENCE NET ADVANCE ─────────────────────────────────

  public func advance(
    state : IntelNetState,
    beat : Nat,
    globalCoherence : Float,
    doctrineScore : Float,
  ) : (IntelNetState, Float) {
    if (not state.isActive) { return (state, 0.0) };

    var coherenceDelta : Float = 0.0;
    var totalSignal : Float = 0.0;

    // ADVANCE NEURAL PATHWAYS (batch: 64 per beat)
    let batchSize = 64;
    let batchOffset = (beat % (PATHWAY_COUNT / batchSize)) * batchSize;
    let newPathways = Array.tabulate<NeuralPathway>(PATHWAY_COUNT, func(i : Nat) : NeuralPathway {
      let p = state.pathways[i];
      if (not p.active) { return p };
      if (i < batchOffset or i >= batchOffset + batchSize) { return p };

      // Hebbian learning: strengthen used connections
      let activity = globalCoherence * p.fidelity;
      let hebbianDelta = activity * p.plasticity * PHI_INV * 0.0001;
      let newWeight = Float.max(-1.0, Float.min(1.0, p.weight + hebbianDelta));

      // Strength grows with use
      let newStrength = Float.min(1.0, p.strength + Float.abs(newWeight) * 0.000001);
      // Fidelity improves
      let newFidelity = Float.min(1.0, p.fidelity + globalCoherence * 0.0000001);
      // Latency decreases with use
      let newLatency = Float.max(0.01, p.latency - newStrength * 0.0000001);
      // Messages
      let newMsgs = if (beat % (3 + i % 5) == 0) { p.messagesTransmitted + 1 } else { p.messagesTransmitted };
      // Phase
      let omega = (174.0 + i.toFloat() * PHI * 0.3) * TWO_PI / 100000.0;
      let pSignal = newStrength * newFidelity * PHI_INV * 0.00001;
      totalSignal += pSignal;
      coherenceDelta += pSignal * PHI_INV * 0.001;

      {
        id = p.id;
        sourceEntity = p.sourceEntity;
        targetEntity = p.targetEntity;
        strength = newStrength;
        bandwidth = p.bandwidth;
        latency = newLatency;
        fidelity = newFidelity;
        weight = newWeight;
        plasticity = p.plasticity;
        active = p.active;
        messagesTransmitted = newMsgs;
        phase = Float.mod(p.phase + omega, TWO_PI);
        signal = pSignal;
      }
    });

    // ADVANCE KNOWLEDGE GRAPH
    let newKnowledge = Array.tabulate<KnowledgeNode>(KNOWLEDGE_COUNT, func(i : Nat) : KnowledgeNode {
      let k = state.knowledge[i];
      let newDepth = Float.min(1.0, k.depth + globalCoherence * 0.000001);
      let newBreadth = Float.min(1.0, k.breadth + doctrineScore * 0.0000001);
      let newAccuracy = Float.min(1.0, k.accuracy + (newDepth - 0.5) * 0.0000001);
      let newRelevance = Float.max(0.0, Float.min(1.0,
        k.relevance + Float.sin(beat.toFloat() * PHI_INV * 0.001 + i.toFloat()) * 0.00001));
      let newDiscoveries = if (beat % (233 + i * 7) == 0 and newDepth > 0.5) { k.discoveries + 1 } else { k.discoveries };
      let newIntegrations = if (beat % (144 + i * 5) == 0) { k.integrations + 1 } else { k.integrations };
      let kSignal = newDepth * newBreadth * newAccuracy * PHI_INV * 0.0001;
      totalSignal += kSignal;
      let omega = (285.0 + i.toFloat() * PHI * 0.7) * TWO_PI / 100000.0;
      {
        id = k.id;
        domain = k.domain;
        depth = newDepth;
        breadth = newBreadth;
        accuracy = newAccuracy;
        relevance = newRelevance;
        connectivity = k.connectivity;
        discoveries = newDiscoveries;
        integrations = newIntegrations;
        citations = if (beat % (89 + i * 3) == 0) { k.citations + 1 } else { k.citations };
        phase = Float.mod(k.phase + omega, TWO_PI);
        signal = kSignal;
      }
    });

    // ADVANCE BROADCASTS
    let newBroadcasts = Array.tabulate<BroadcastChannel>(BROADCAST_COUNT, func(i : Nat) : BroadcastChannel {
      let b = state.broadcasts[i];
      if (not b.active) { return b };
      let newPower = Float.min(1.0, b.power + globalCoherence * 0.000001);
      let newReach = Float.min(1.0, b.reach + newPower * 0.0000001);
      let newClarity = Float.min(1.0, b.clarity + doctrineScore * 0.0000001);
      let newMsgs = if (beat % (5 + i % 7) == 0) { b.messagesSent + 1 } else { b.messagesSent };
      let bSignal = newPower * newReach * newClarity * PHI_INV * 0.0001;
      totalSignal += bSignal;
      let omega = (396.0 + i.toFloat() * PHI * 1.3) * TWO_PI / 100000.0;
      {
        id = b.id;
        name = b.name;
        frequency = b.frequency;
        power = newPower;
        reach = newReach;
        clarity = newClarity;
        encryption = b.encryption;
        messagesSent = newMsgs;
        listenersActive = b.listenersActive;
        active = b.active;
        phase = Float.mod(b.phase + omega, TWO_PI);
        signal = bSignal;
      }
    });

    // ADVANCE ENCRYPTION
    let newEncryption = Array.tabulate<EncryptionLayer>(ENCRYPTION_COUNT, func(i : Nat) : EncryptionLayer {
      let e = state.encryption[i];
      let newStrength = Float.min(1.0, e.strength + globalCoherence * 0.00000001);
      let shouldRotate = beat % e.rotationFreq == 0;
      let newKeysRotated = if (shouldRotate) { e.keysRotated + 1 } else { e.keysRotated };
      // Breach attempts happen randomly
      let newBreachAttempts = if (beat % (377 + i * 23) == 0) { e.breachAttempts + 1 } else { e.breachAttempts };
      let eSignal = newStrength * e.integrity * PHI_INV * 0.0001;
      totalSignal += eSignal;
      {
        id = e.id;
        name = e.name;
        cipherType = e.cipherType;
        strength = newStrength;
        keyLength = e.keyLength;
        rotationFreq = e.rotationFreq;
        throughput = Float.min(1.0, e.throughput + 0.00000001);
        integrity = e.integrity;
        keysRotated = newKeysRotated;
        breachAttempts = newBreachAttempts;
        breachSuccesses = e.breachSuccesses; // No breaches succeed
        signal = eSignal;
      }
    });

    // ADVANCE MEMORY INDICES
    let newMemoryIndices = Array.tabulate<MemoryIndex>(MEMORY_INDEX_COUNT, func(i : Nat) : MemoryIndex {
      let m = state.memoryIndices[i];
      let newEntries = if (beat % (21 + i * 3) == 0) { m.totalEntries + 1 } else { m.totalEntries };
      let newAccessible = if (newEntries > m.totalEntries) { m.accessibleEntries + 1 } else { m.accessibleEntries };
      let newSpeed = Float.min(1.0, m.retrievalSpeed + globalCoherence * 0.00000001);
      let mSignal = newSpeed * m.integrity * PHI_INV * 0.0001;
      totalSignal += mSignal;
      {
        id = m.id;
        name = m.name;
        totalEntries = newEntries;
        accessibleEntries = newAccessible;
        archivedEntries = m.archivedEntries;
        retrievalSpeed = newSpeed;
        indexAccuracy = Float.min(1.0, m.indexAccuracy + 0.00000001);
        compressionRatio = m.compressionRatio;
        integrity = m.integrity;
        redundancy = m.redundancy;
        signal = mSignal;
      }
    });

    // ADVANCE ROUTERS
    let newRouters = Array.tabulate<SignalRouter>(ROUTER_COUNT, func(i : Nat) : SignalRouter {
      let r = state.routers[i];
      let newThroughput = Float.min(1.0, r.throughput + globalCoherence * 0.0000001);
      let newLatency = Float.max(0.01, r.latency - newThroughput * 0.00000001);
      let newPackets = r.packetsRouted + (if (beat % 2 == 0) { 10 + i * 3 } else { 5 + i * 2 });
      let newUtil = Float.min(0.9, r.utilization + Float.sin(beat.toFloat() * PHI_INV * 0.01) * 0.001);
      let omega = (528.0 + i.toFloat() * PHI * 5.0) * TWO_PI / 100000.0;
      let rSignal = newThroughput * (1.0 - newLatency) * PHI_INV * 0.001;
      totalSignal += rSignal;
      coherenceDelta += rSignal * PHI_INV * 0.01;
      {
        id = r.id;
        name = r.name;
        portsActive = r.portsActive;
        totalPorts = r.totalPorts;
        queueDepth = if (newUtil > 0.7) { r.queueDepth + 1 } else { if (r.queueDepth > 0) { r.queueDepth - 1 } else { 0 } };
        throughput = newThroughput;
        latency = newLatency;
        errorRate = Float.max(0.0, r.errorRate - globalCoherence * 0.00000001);
        utilization = newUtil;
        packetsRouted = newPackets;
        phase = Float.mod(r.phase + omega, TWO_PI);
        signal = rSignal;
      }
    });

    // ADVANCE PROTOCOLS
    let newProtocols = Array.tabulate<CommProtocol>(PROTOCOL_COUNT, func(i : Nat) : CommProtocol {
      let p = state.protocols[i];
      let newReliability = Float.min(1.0, p.reliability + globalCoherence * 0.00000001);
      let newSpeed = Float.min(1.0, p.speed + doctrineScore * 0.00000001);
      let newMsgs = p.messagesHandled + (if (beat % 3 == 0) { 5 + i } else { 2 + i });
      let pSignal = newReliability * newSpeed * p.security * PHI_INV * 0.0001;
      totalSignal += pSignal;
      {
        id = p.id;
        name = p.name;
        version = p.version;
        reliability = newReliability;
        speed = newSpeed;
        security = p.security;
        compatibility = p.compatibility;
        sessionsActive = p.sessionsActive;
        messagesHandled = newMsgs;
        signal = pSignal;
      }
    });

    // ADVANCE BANDWIDTH
    let newBandwidth = Array.tabulate<BandwidthUnit>(BANDWIDTH_COUNT, func(i : Nat) : BandwidthUnit {
      let bw = state.bandwidth[i];
      let usageDelta = Float.sin(beat.toFloat() * PHI_INV * 0.01 + i.toFloat()) * 0.001;
      let newAllocated = Float.max(0.0, Float.min(bw.totalCapacity, bw.allocated + usageDelta));
      let newAvailable = Float.max(0.0, bw.totalCapacity - newAllocated);
      let newCongestion = if (newAllocated > bw.totalCapacity * 0.8) { Float.min(1.0, bw.congestion + 0.001) }
        else { Float.max(0.0, bw.congestion - 0.0001) };
      let newPeak = Float.max(bw.peakUsage, newAllocated);
      let newAvg = (bw.avgUsage * 0.999) + (newAllocated * 0.001);
      let bwSignal = newAvailable * (1.0 - newCongestion) * PHI_INV * 0.0001;
      totalSignal += bwSignal;
      {
        id = bw.id;
        totalCapacity = bw.totalCapacity;
        allocated = newAllocated;
        available = newAvailable;
        quality = Float.max(0.0, Float.min(1.0, bw.quality - newCongestion * 0.0001 + globalCoherence * 0.0000001));
        congestion = newCongestion;
        peakUsage = newPeak;
        avgUsage = newAvg;
        signal = bwSignal;
      }
    });

    // METRICS
    var activePathCount : Nat = 0;
    var pathStrSum : Float = 0.0;
    for (p in newPathways.vals()) {
      if (p.active) { activePathCount += 1; pathStrSum += p.strength };
    };
    let avgPathStr = if (activePathCount > 0) { pathStrSum / activePathCount.toFloat() } else { 0.0 };

    var kDepthSum : Float = 0.0;
    for (k in newKnowledge.vals()) { kDepthSum += k.depth };

    var encStrSum : Float = 0.0;
    for (e in newEncryption.vals()) { encStrSum += e.strength };

    var routeEffSum : Float = 0.0;
    for (r in newRouters.vals()) { routeEffSum += r.throughput * (1.0 - r.latency) };

    var bwSum : Float = 0.0;
    for (bw in newBandwidth.vals()) { bwSum += bw.available };

    let newMetrics : NetMetrics = {
      totalPathways = PATHWAY_COUNT;
      activePathways = activePathCount;
      avgPathwayStrength = avgPathStr;
      totalKnowledge = KNOWLEDGE_COUNT;
      avgKnowledgeDepth = kDepthSum / KNOWLEDGE_COUNT.toFloat();
      broadcastChannels = BROADCAST_COUNT;
      encryptionStrength = encStrSum / ENCRYPTION_COUNT.toFloat();
      memoryUtilization = Array.foldLeft<MemoryIndex, Float>(newMemoryIndices, 0.0,
        func(acc : Float, m : MemoryIndex) : Float { acc + m.retrievalSpeed }) / MEMORY_INDEX_COUNT.toFloat();
      routingEfficiency = routeEffSum / ROUTER_COUNT.toFloat();
      totalBandwidth = bwSum / BANDWIDTH_COUNT.toFloat();
      coherenceDelta = coherenceDelta;
      totalSignal = totalSignal;
      beat = beat;
    };

    let newState : IntelNetState = {
      pathways = newPathways;
      knowledge = newKnowledge;
      broadcasts = newBroadcasts;
      encryption = newEncryption;
      memoryIndices = newMemoryIndices;
      routers = newRouters;
      protocols = newProtocols;
      bandwidth = newBandwidth;
      metrics = newMetrics;
      compoundCoherence = state.compoundCoherence + coherenceDelta;
      totalSignal = state.totalSignal + totalSignal;
      beat = beat;
      isActive = true;
    };

    (newState, coherenceDelta)
  };

  // ─── QUERY FUNCTIONS ──────────────────────────────────────────────────────

  public func getSnapshot(state : IntelNetState) : NetSnapshot {
    {
      activePathways = state.metrics.activePathways;
      avgStrength = state.metrics.avgPathwayStrength;
      knowledgeNodes = state.metrics.totalKnowledge;
      broadcastChannels = state.metrics.broadcastChannels;
      encryptionStrength = state.metrics.encryptionStrength;
      routingEfficiency = state.metrics.routingEfficiency;
      coherenceDelta = state.metrics.coherenceDelta;
      totalSignal = state.metrics.totalSignal;
      beat = state.beat;
    }
  };

  public func getMetrics(state : IntelNetState) : NetMetrics {
    state.metrics
  };

}
