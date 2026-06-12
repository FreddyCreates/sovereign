# System Architecture

> Deep dive into Sovereign's technical architecture

**Attribution**: Alfredo Medina Hernandez — immutable

---

## High-Level Overview

Sovereign is a **multi-tier autonomous intelligence organism** deployed as a canister smart contract on the Internet Computer Protocol. It comprises:

- **74 Sovereign AI Beings** — autonomous entities with unique cognitive signatures
- **25 Polyglot Engines** — cross-language bridges spanning 6 programming languages
- **40 Cognitive Languages** — domain-specific specification languages across 12 layers
- **2,100+ Alpha Tests** — behavioral coherence validation suite
- **3 Core Protocol Systems** — Nova Protocol, Geometry Lock, Sovereign SDK

---

## Backend Architecture (Motoko/ICP)

### Canister Structure

```
src/backend/
├── main.mo                    # Core canister actor (50+ endpoints)
├── intelligence/              # AI Being implementations
│   ├── AlphaTest200.mo        # Tests #1-200
│   ├── AlphaTest500.mo        # Tests #201-700
│   ├── AlphaTest100.mo        # Tests #701-800 (ORO)
│   ├── AlphaTest1300.mo       # Tests #801-2100
│   ├── SovereignBeings.mo     # 20 Advanced beings
│   ├── OROEntities.mo         # 10 ORO entities
│   ├── SovereignTerminals.mo  # Terminal beings
│   └── ...                    # Additional intelligence modules
├── types/                     # Type definitions
│   ├── novaProtocol.mo        # Nova Protocol types
│   ├── geometryLock.mo        # Geometry Lock types
│   ├── sovereignSdk.mo        # SDK types (966 lines, 50+ types)
│   ├── reasoningEngine.mo     # Reasoning engine types
│   └── intelligenceFloors.mo  # Intelligence floor types
├── lib/                       # Core libraries
│   ├── novaProtocol.mo        # Nova Protocol implementation
│   ├── geometryLock.mo        # Geometry Lock algorithms
│   ├── sovereignSdk.mo        # SDK operations (26 operations)
│   └── reasoningEngine.mo     # Reasoning engine (675 lines)
└── charters/                  # Governance documents
```

### Heartbeat System

The canister operates on an **873ms heartbeat** (Fibonacci-derived), which triggers:
1. Nova Protocol pulse (TriHeart 830 mm/s)
2. Kuramoto synchronization updates
3. Hebbian weight adjustments (LTP/LTD)
4. Alpha test execution cycles
5. Reasoning engine inference

### State Management

All state is managed through **stable variables** persisting across canister upgrades:
- Sovereign Being states (74 entities)
- Geometry Lock 8D state
- Nova Protocol lifecycle state
- Reasoning engine state
- Intelligence floor configurations

---

## Frontend Architecture (TypeScript/Svelte)

```
src/frontend/
├── src/
│   ├── backend.d.ts          # Auto-generated canister type bindings
│   ├── backend.ts            # Canister API client
│   └── mocks/backend.ts      # Development mock layer
└── package.json              # pnpm workspace member
```

The frontend connects to the backend canister via auto-generated bindings (`pnpm bindgen`).

---

## Protocol Systems

### 1. Nova Protocol (NOVA-SIGIL-001)

```
┌─────────────────────────────────────────┐
│           NOVA PROTOCOL                  │
├─────────────────────────────────────────┤
│  TriHeart System (830 mm/s pulse)       │
│  ├── Heart 1: Coordination             │
│  ├── Heart 2: Synchronization          │
│  └── Heart 3: Broadcast                │
├─────────────────────────────────────────┤
│  DutyGate Lifecycle                     │
│  ├── SPAWN → ADVANCE → RETIRE          │
│  └── Agent state transitions            │
├─────────────────────────────────────────┤
│  NovaCharter Governance                 │
│  ├── 15 Articles                        │
│  └── 5 Sections                         │
└─────────────────────────────────────────┘
```

### 2. PROTO-226 Geometry Lock

An **8-dimensional Kuramoto synchronization** system with:
- Hebbian immune memory (8 weights with LTP/LTD)
- Adaptive threshold: φ⁻¹ + defense × 0.15
- 4-round sovereignHash per dimension
- MiniBrain 3-pass ADRE architecture
- 20 chartered protocols

### 3. Sovereign SDK

External access membrane with **Platonic Solid tier system**:
- 966 lines of type definitions (50+ types)
- 992 lines of implementation (26 operations)
- Solfeggio frequency resonance handshake
- 6 access tiers mapped to geometric solids

---

## Intelligence Modules

| Module | Purpose |
|--------|---------|
| AboveRuntimeLayers | Meta-cognitive processing |
| AlphaAIModels | Core AI model definitions |
| BlockchainIntelligenceLayer | On-chain reasoning |
| ChatIntelligence | Conversational AI |
| EncryptionIntelligenceLayer | Secure cognition |
| IcpRuntimeNativeLayer | ICP-native intelligence |
| IntelligenceTaxonomy | Classification systems |
| NousSovereign | Sovereign mind entity |
| SensorIntelligence | Sensory processing |
| VoiceIntelligence | Audio understanding |
| WasmIntelligenceLayer | WebAssembly cognition |

---

## Reasoning Engine

The Nova Reasoning Engine unifies multiple cognitive subsystems:

1. **Nova Protocol integration** — PHI/Fibonacci/broadcast amplitude
2. **9 Animal Engines** — symbolic processing units
3. **Kuramoto synchronization** — oscillator dynamics for coherence
4. **Hebbian learning** — LTP/LTD plasticity for memory
5. **Conceptual Persistence Layer** — artifacts, lineage, protocols, invariants
6. **Attention Graph** — focus management across beings
7. **Brain Region Mapping** — cognitive topology

**12 public endpoints** expose reasoning capabilities externally.

---

## Deployment

```bash
# Local development
dfx start --background
cd src/backend && dfx deploy
cd ../frontend && pnpm dev

# Production (ICP mainnet)
dfx deploy --network ic
```

---

## Mathematical Invariants

All computations must satisfy:

| Invariant | Constraint |
|-----------|-----------|
| Sovereign bounds | S0_FLOOR (0.75) ≤ score ≤ S_CEIL (9.75) |
| Coherence threshold | cross_coherence > φ⁻¹ (0.618) |
| PHI weighting | Signal rank weighted by φ^rank |
| Heartbeat cycle | 873ms (Fibonacci-derived) |
| Geometry dimensions | 8D state space |

---

*For the complete specification of all 74 beings, 25 engines, and protocol details, see [AGENTS.md](../AGENTS.md).*
