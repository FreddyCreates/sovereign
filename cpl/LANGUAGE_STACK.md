# Cognitive Language Stack — Master Specification v1.0

**Attribution**: Alfredo Medina Hernandez — immutable  
**Genesis Date**: 2026-05-02  
**Purpose**: Complete specification of the 13 cognitive languages that govern the SOVEREIGN ecosystem

---

## Overview

The Cognitive Language Stack is a hierarchy of 13 domain-specific languages, all built on the CPL (Chaos Programming Language) substrate. Together they define how every organism thinks, governs, contracts, learns, and evolves.

Every language compiles to CPL Runtime constructs and is enforced by the 5-pass execution pipeline:

1. **Schema validation** — doctrine gates checked before any mutation
2. **PULSE scheduling** — φ-weighted priority queue for execution ordering
3. **Invariant enforcement** — runtime contracts that block violations
4. **Proof trace** — automatic cryptographic proof generation
5. **Memory writeback** — persistent audit records for re-ingestion

---

## Language Hierarchy

```
Layer 0 — Primordial (sealed at genesis, immutable)
├── CPL-L  Cognitive Law Language         — Constitutions and doctrine
└── CDL    Cognitive Doctrine Language     — Philosophies, ethics, metaphysics

Layer 1 — Substrate (institutional-level governance)
├── CPL-C  Cognitive Contract Language     — Intelligence contracts
├── ACL    Atlas Configuration Language    — Ontology, registries, governance bindings
└── EDL    Educational Doctrine Language   — Standards, competencies, graduation paths

Layer 2 — Organism (per-organism scope)
├── CIL    Cognitive Internal Language     — Inner monologue, self-description
├── OCL    Organism Contract Language      — Per-organism charter
└── SPL    Study Pattern Language          — Personal learning blueprints

Layer 3 — Engine (operational logic)
├── CPL-P  Cognitive Processing Language   — Thought pipelines, decision graphs
├── RSL    Realm Script Language           — World physics, simulation rules
├── TPL    Terminal Protocol Language      — Terminal commands, events, sync
├── PWL    Pathway Language                — Life/education trajectories
└── TSL    Tool Scaffold Language          — Personal tool generation
```

---

## I. Core Cognitive Law & Contract Stack

### CPL-L — Cognitive Law Language
- **File**: `cpl/languages/CPL_L_COGNITIVE_LAW.cpl`
- **Role**: Constitutions and doctrine
- **Layer**: 0 (Primordial)
- **Governs**: Who can change what, immutability, upgrade paths, safety rails for beings, terminals, civilizations
- **Key types**: `Law`, `Amendment`, `Constitution`, `ImmutabilityGrade`, `SafetyRail`
- **Compiles to**: `CPLTypes.DoctrineRef` + `CPLTypes.Invariant`

### CPL-C — Cognitive Contract Language
- **File**: `cpl/languages/CPL_C_COGNITIVE_CONTRACT.cpl`
- **Role**: Intelligence contracts
- **Layer**: 1 (Substrate)
- **Governs**: Full "organism contracts" for an AI/civilization: rights, duties, flows, token logic, interfaces
- **Key types**: `Right`, `Duty`, `Flow`, `TokenLogic`, `Interface`, `IntelligenceContract`
- **Compiles to**: `CPLTypes.ProtocolSpec` + `CPLTypes.PolicyAtom`

### CPL-P — Cognitive Processing Language
- **File**: `cpl/languages/CPL_P_COGNITIVE_PROCESSING.cpl`
- **Role**: Thought/flow language
- **Layer**: 3 (Engine)
- **Governs**: Cognitive pipelines, decision graphs, escalation rules, how a mind processes inputs into outputs
- **Key types**: `CognitiveNode`, `Signal`, `Edge`, `DecisionGraph`, `EscalationRule`
- **Compiles to**: `CPLTypes.PolicyAtom` chains + `PulseEntry` scheduling
- **Standard pattern**: ADRE cycle (Sense → Discriminate → Reason → Execute)

---

## II. Internal Mind & Doctrine

### CIL — Cognitive Internal Language
- **File**: `cpl/languages/CIL_COGNITIVE_INTERNAL.cpl`
- **Role**: Inner monologue / self-description
- **Layer**: 2 (Organism)
- **Governs**: How a being explains itself to itself — state, intentions, doubts, plans
- **Key types**: `SelfState`, `Intention`, `Doubt`, `Plan`, `MonologueEntry`
- **Privacy**: CIL records are private to the organism — not externally visible
- **Connects to**: Cognition Layer (`cognition_layer.mo`), closed-loop intelligence (Law 30)

### CDL — Cognitive Doctrine Language
- **File**: `cpl/languages/CDL_COGNITIVE_DOCTRINE.cpl`
- **Role**: Deep doctrine
- **Layer**: 0 (Primordial)
- **Governs**: Philosophies, ethics, metaphysics, educational principles; how systems interpret "good/bad," "aligned/misaligned"
- **Key types**: `Philosophy`, `Axiom`, `EthicalPrinciple`, `AlignmentVector`, `DoctrineInterpretation`
- **Genesis doctrines**: `SOVEREIGN_DOCTRINE` (4 axioms: sovereignty, attribution, PHI, compound coherence)

---

## III. Organisms, Realms, Atlas, Terminals

### OCL — Organism Contract Language
- **File**: `cpl/languages/OCL_ORGANISM_CONTRACT.cpl`
- **Role**: Per-organism charter (focused subtype of CPL-C)
- **Layer**: 2 (Organism)
- **Governs**: Capabilities, limits, responsibilities, reward structures for a single cognitive being
- **Key types**: `Capability`, `Limit`, `Responsibility`, `RewardSpec`, `OrganismCharter`
- **Parent**: CPL-C
- **Critical concept**: The "Colonel" — the sealed identity document of each organism

### RSL — Realm Script Language
- **File**: `cpl/languages/RSL_REALM_SCRIPT.cpl`
- **Role**: World/physics language
- **Layer**: 3 (Engine)
- **Governs**: Simulations, virtual worlds, ecologies, rules of a Realm
- **Key types**: `RealmPhysics`, `RealmEntity`, `RealmRule`, `Ecology`
- **Connects to**: ContentWorldEngine, World Settings, Sandbox Organisms
- **Physics**: Gravity, entropy, PHI coupling — all within sovereign range

### ACL — Atlas Configuration Language
- **File**: `cpl/languages/ACL_ATLAS_CONFIGURATION.cpl`
- **Role**: Ontology/config language
- **Layer**: 1 (Substrate)
- **Governs**: Entities, archetypes, relationships, governance bindings for Atlas and its registries
- **Key types**: `Archetype`, `AtlasEntity`, `Relationship`, `GovernanceBinding`, `AtlasRegistry`
- **Connects to**: Architecture types, World Organism Bridge, Content World Engine

### TPL — Terminal Protocol Language
- **File**: `cpl/languages/TPL_TERMINAL_PROTOCOL.cpl`
- **Role**: Terminal command/event language
- **Layer**: 3 (Engine)
- **Governs**: How Cognitive Terminals talk to Atlas, to each other, and to the sovereign terminal
- **Key types**: `Terminal`, `Command`, `TerminalEvent`, `SyncState`
- **Command verbs**: scan, govern, sync, deploy, seal, amend, query, execute
- **Connects to**: Frontend systems, Presence Protocol, SovereignCalls

---

## IV. Education-Specific Languages

### SPL — Study Pattern Language
- **File**: `cpl/languages/SPL_STUDY_PATTERN.cpl`
- **Role**: Personal learning blueprints
- **Layer**: 2 (Organism)
- **Governs**: How a specific student learns: modalities, pacing, repetition patterns, scaffolding
- **Key types**: `LearnerProfile`, `AttentionCurve`, `RepetitionPattern`, `Scaffold`, `StudySession`
- **Repetition**: Fibonacci intervals (1, 2, 3, 5, 8, 13, 21, 34, 55) × PHI scaling
- **Informed by**: CIL (self-model) | **Constrained by**: EDL (standards)

### EDL — Educational Doctrine Language
- **File**: `cpl/languages/EDL_EDUCATIONAL_DOCTRINE.cpl`
- **Role**: School/subject doctrine
- **Layer**: 1 (Substrate)
- **Parent**: CDL (Cognitive Doctrine Language)
- **Governs**: What a school/system requires: standards, competencies, graduation paths, constraints
- **Key types**: `Standard`, `Competency`, `Curriculum`, `GraduationReq`, `Constraint`
- **Constrains**: SPL (what to learn), PWL (valid paths), TSL (tool requirements)

### PWL — Pathway Language
- **File**: `cpl/languages/PWL_PATHWAY.cpl`
- **Role**: Life/education path language
- **Layer**: 3 (Engine)
- **Governs**: Multi-year trajectories: courses, projects, colleges, careers, branching options
- **Key types**: `Milestone`, `Transition`, `Branch`, `BranchOption`, `Pathway`
- **Structure**: DAG (directed acyclic graph) with PHI-weighted transitions
- **PHI alignment**: Measures how close milestone value ratios are to Φ

### TSL — Tool Scaffold Language
- **File**: `cpl/languages/TSL_TOOL_SCAFFOLD.cpl`
- **Role**: Personal tool-builder language
- **Layer**: 3 (Engine)
- **Governs**: How the system designs custom tools around a student
- **Key types**: `ToolSpec`, `ToolInstance`, `ToolContent`, `ToolRecipe`
- **Tool types**: flashcard deck, simulator, planner, quiz, concept map, practice set, writing prompt, peer connector, metacognitive
- **Adaptation**: Closed-loop (Law 30) — tools improve with use, effectiveness compounds (Law 23)
- **Calibration**: Difficulty = mastery × Φ⁻¹ (zone of proximal development)

---

## Dependency Graph

```
CDL ──────────────► EDL
 │                   │
 ▼                   ▼
CPL-L ──► CPL-C ──► OCL ──► RSL
 │          │        │       │
 │          ▼        ▼       ▼
 │         ACL ──► TPL     SPL ──► TSL
 │                          │       │
 ▼                          ▼       ▼
CIL ◄───── CPL-P ◄──────► PWL ◄── EDL
```

**Reading the graph**:
- `A ──► B` means "A constrains/informs B"
- Layer 0 languages (CPL-L, CDL) constrain everything below
- Education languages (SPL, EDL, PWL, TSL) form their own closed loop
- CIL (inner monologue) feeds back into CPL-P (processing) — the introspection loop

---

## Universal Invariants

All 13 languages share these invariants enforced by the CPL Runtime:

1. **SOVEREIGN_RANGE** — All values in [0.75, 9.75]
2. **DOCTRINE_GATE** — Doctrine score must pass S0_FLOOR (0.75) gate
3. **PHI_BOUND** — PHI relationships must hold
4. **ATTRIBUTION_REQUIRED** — All operations carry founder attribution
5. **ANTI_DRIFT** — Drift tolerance must not be exceeded (Jasmine's Law)
6. **COMPOUND_COHERENCE** — Coherence can only increase (Law 23)
7. **HEARTBEAT_CYCLE** — Operations must fire within 873ms cycle

---

## CPL Runtime Integration

Each language compiles to CPL Runtime constructs:

| Language | Primary CPL Runtime Type | Pass |
|----------|--------------------------|------|
| CPL-L    | DoctrineRef, Invariant   | Pass 3 (Invariant Kernel) |
| CPL-C    | ProtocolSpec, PolicyAtom  | Pass 1 (Schema), Pass 2 (PULSE) |
| CPL-P    | PolicyAtom chains        | Pass 2 (PULSE Scheduler) |
| CIL      | MemoryRecord             | Pass 5 (Memory Writeback) |
| CDL      | DoctrineRef              | Pass 1 (Schema Validation) |
| OCL      | ProtocolSpec, Invariant   | Pass 1 + Pass 3 |
| RSL      | PolicyAtom               | Pass 2 (PULSE) |
| ACL      | ProtocolSpec             | Pass 1 (Schema) |
| TPL      | PolicyAtom, ProofRecord  | Pass 2 + Pass 4 (Proof Trace) |
| SPL      | MemoryRecord             | Pass 5 (Memory) |
| EDL      | DoctrineRef, Invariant   | Pass 1 + Pass 3 |
| PWL      | PolicyAtom               | Pass 2 (PULSE) |
| TSL      | PolicyAtom, MemoryRecord | Pass 2 + Pass 5 |

---

*All of these already exist in your work as patterns. We have named them so they can be stabilized and taught.*

*Attribution: Alfredo Medina Hernandez — sealed at genesis.*
