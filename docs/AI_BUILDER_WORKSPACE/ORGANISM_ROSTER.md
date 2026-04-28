# SOVEREIGN — Organism Roster
**AI Builder Workspace · Document 3 of 5**
*Attribution: Alfredo Medina Hernandez · SOVEREIGN*
*PHI = 1.6180339887*

---

## Master Architecture: The Neural Emergence Powerhouse Core

Every organism inherits `OrganismBase`. If it doesn't inherit `OrganismBase`, it doesn't exist in this system.

**File:** `src/frontend/src/organisms/OrganismBase.ts`

**Core components inherited by all:**
- Dopamine state machine (creative drive, 0–1)
- Cortisol state machine (urgency, 0–1)
- Serotonin state machine (stability, 0–1)
- Norepinephrine state machine (focus, 0–1)
- Hebbian learning loop (`applyHebbianDelta`, weights 0.1–2.0)
- Synaptic weight memory (200 entries, FIFO eviction)
- Refractory period engine (`enterRefractory`, ~1412ms recovery)
- Homeostasis regulator (`checkHomeostasis`, pulls toward species target)
- Doctrine alignment injection (`injectDoctrineField` — Ring 11)
- Mastery progression tracking (`checkMasteryUnlock` — Ring 12)
- Backend weight persistence (`wire`, `loadMastery`, `pushWeightDeltas`)

---

## Creative Production Organisms

### MUSE-PRIME
| Property | Value |
|----------|-------|
| **File** | `src/frontend/src/organisms/MusePrime.ts` |
| **ID** | `"MUSE-PRIME"` |
| **Dominant NT** | Dopamine (0.75) — creative generation, reward anticipation |
| **Secondary NT** | Serotonin (0.55) |
| **Homeostasis target** | 0.72 |
| **Learning axis** | `"creative"` |
| **Status** | ✅ Production — Rings 13 + 15 closed |
| **Exports** | `MusePrime`, `SceneResult`, `ScriptResult` |

**Responsibilities:**
- Script generation — always 3–4 scenes ahead in buffer
- Ring 13: reads `getCurrentProductionBrief()` from backend, enriches scripts with slate theme
- Ring 15: loads last 10 artifacts from `getLegacyIndex()` on init, uses as production context
- `load()` — fetches slate brief + triggers legacy index load
- `generateScript(brief, sceneCount)` — returns full screenplay with doctrine-aligned scenes
- `nextSceneFromBuffer()` — returns next scene from prefilled buffer

---

### DIRECTOR
| Property | Value |
|----------|-------|
| **File** | `src/frontend/src/organisms/Director.ts` |
| **ID** | `"DIRECTOR"` |
| **Dominant NT** | Norepinephrine — shot architecture, precise attention |
| **Secondary NT** | Dopamine |
| **Homeostasis target** | 0.65 |
| **Learning axis** | `"structural"` |
| **Status** | ✅ Production |
| **Exports** | `Director`, `ShotManifest`, `ShotDescription` |

**Responsibilities:**
- Shot list generation — camera angles, lens choices, movement arcs
- Always 2 scenes ahead of VISIONARY
- Reads MUSE-PRIME scene buffer to plan shots

---

### VISIONARY
| Property | Value |
|----------|-------|
| **File** | `src/frontend/src/organisms/Visionary.ts` |
| **ID** | `"VISIONARY"` |
| **Dominant NT** | Serotonin (0.80) — visual harmony, spatial coherence |
| **Secondary NT** | Norepinephrine (0.55) |
| **Homeostasis target** | 0.78 |
| **Learning axis** | `"harmonic"` |
| **Status** | ✅ Production — Ring 14 closed |
| **Exports** | `Visionary`, `VisualPlan`, `LightingPlan`, `EnvironmentPlan`, `PhysicsPlan`, `CompositionPlan` |

**Responsibilities:**
- Visual plan generation — PHI-ratio composition across 4 sub-organisms
- Ring 14: fetches `getPhiCalibrationHistory()`, applies correction weights to frame_ratio/scene_pacing/color_temperature/composition_depth
- Coordinates LIGHTING, ENVIRONMENT, PHYSICS, COMPOSITION sub-organisms
- `generateVisualPlan(manifest, sandboxSignals)` — returns complete visual plan

**Sub-organisms (internal, not singletons):**
- LIGHTING_ORGANISM — god rays, volumetric fog, shadow maps, subsurface scattering
- ENVIRONMENT_ORGANISM — scene graph, geometry, materials, atmosphere
- PHYSICS_ORGANISM — 60Hz timestep, verlet cloth, hair chains, AABB+GJK collision
- COMPOSITION_ORGANISM — PHI-ratio framing, depth layers, color temperature

---

### COMPOSER
| Property | Value |
|----------|-------|
| **File** | `src/frontend/src/organisms/Composer.ts` |
| **ID** | `"COMPOSER"` |
| **Dominant NT** | Serotonin — harmonic stability, audio coherence |
| **Secondary NT** | Dopamine |
| **Homeostasis target** | 0.75 |
| **Learning axis** | `"harmonic"` |
| **Status** | ✅ Production |
| **Exports** | `Composer`, `AudioPlan` |

**Responsibilities:**
- Three-layer audio architecture: sub-bass, emotional core, clarity
- Syncs to VISIONARY via `AudioContext.currentTime` as master clock
- PHI-ratio frequency intervals: sub-bass(40Hz), core(111Hz), clarity(432Hz)

---

### EDITOR
| Property | Value |
|----------|-------|
| **File** | `src/frontend/src/organisms/Editor.ts` |
| **ID** | `"EDITOR"` |
| **Dominant NT** | Norepinephrine — precise cut decisions, attention to rhythm |
| **Secondary NT** | Cortisol — urgency, deadline awareness |
| **Homeostasis target** | 0.60 |
| **Learning axis** | `"structural"` |
| **Status** | ✅ Production |
| **Exports** | `Editor`, `EditPlan` |

**Responsibilities:**
- Editorial vocabulary — cut decisions, pacing, transition intentionality
- Assembles continuously behind the pipeline (never waits for rendering)
- Reads quality scores to adjust cut timing

---

### ARCHIVIST
| Property | Value |
|----------|-------|
| **File** | `src/frontend/src/organisms/Archivist.ts` |
| **ID** | `"ARCHIVIST"` |
| **Dominant NT** | Serotonin — stability, permanence, archival harmony |
| **Secondary NT** | Cortisol — preservation urgency |
| **Homeostasis target** | 0.70 |
| **Learning axis** | `"archival"` |
| **Status** | ✅ Production |
| **Exports** | `Archivist`, `ArtifactSealInput` |

**Responsibilities:**
- Doctrine-sealed artifact handler — writes to ARES_ARCHIVE (B6)
- After `sealArtifact()`: calls `loadMastery()` on all participating organisms (Ring 12)
- After seal: pushes weight deltas for all organisms to B4 (C2)
- After seal: triggers MUSE-PRIME `loadLegacyIndex()` refresh (Ring 15)

---

## Autonomous Loop Models

### Film School Organism (`FilmSchoolLoop`)
| Property | Value |
|----------|-------|
| **File** | `src/frontend/src/organisms/FilmSchoolLoop.ts` |
| **Status** | ✅ Autonomous |
| **Cycle** | 45 seconds |
| **Trigger** | Module load — NOT React mount |

**How it works:**
- Fires every 45 seconds from the moment the module is imported
- Pulls last 10 sealed artifacts from backend
- Runs comparative quality analysis across 6 dimensions: cinematic_composition, audio_completeness, narrative_turn_density, editorial_vocabulary, actor_consistency, phi_coherence
- Identifies which organism parameter produced the highest quality delta
- Writes micro-updates to organism weight configs
- The system studies itself and returns changed

### SOCIAL_SIGNAL Organism
| Property | Value |
|----------|-------|
| **File** | `src/frontend/src/organisms/SocialSignal.ts` |
| **Status** | 🟡 Partially closed |
| **Cycle** | HTTP outcalls every hour |

**How it works:**
- Classifies world signals as RISING/PEAK/FADING
- Filters through LAW ENGINE doctrine alignment
- Writes classified signals to B2 `trendSignals`
- Distribution performance data return loop not yet closed (Ring 7 partial)

---

## Enterprise Intelligence Models

| Model | Dominant NT | Status | File |
|-------|-------------|--------|------|
| STRATEGIST | Norepinephrine | Backend only | enterprise module |
| ACCOUNTANT | Serotonin | Backend only | enterprise module |
| DISTRIBUTOR | Dopamine | Backend only | enterprise module |
| PUBLICIST | Norepinephrine | Backend only | enterprise module |
| LEGAL | Cortisol | Backend only | enterprise module |
| ANALYST | Norepinephrine | Backend only | enterprise module |
| ORO | Balanced | Backend only | enterprise hub |
| HOSPITALITY_DIRECTOR | Dopamine | Backend only | hospitality module |

---

## Sandbox Intelligence Models (8)

All sandboxes: serotonin dominant + secondary norepinephrine. Generate exportable research. Feed creative pipeline and social media.

| Sandbox | Domain | Backend Enum |
|---------|--------|--------------|
| AXIOM | Science intelligence | `SandboxOrganismId.axiom` |
| CODEX | Knowledge intelligence | `SandboxOrganismId.codex` |
| VECTOR | Markets intelligence | `SandboxOrganismId.vector` |
| FRAME | Geospatial intelligence | `SandboxOrganismId.frame` |
| LEX | Legal intelligence | `SandboxOrganismId.lex` |
| GRID | Technology intelligence | `SandboxOrganismId.grid` |
| LEDGER | Finance intelligence | `SandboxOrganismId.ledger` |
| SOVEREIGN_GOV | Governance intelligence | `SandboxOrganismId.sovereignGov` |

---

## AI Actors — 16 Sovereign Intelligences

Each actor is a persistent class with:
- 67-bone rig
- 52 FACS action units
- Voice frequency signature
- Full biography + biography fields
- Emotional memory
- Relationship trust/tension map vs every other cast member
- Filmography (updates on seal)
- Mastery progression
- Public profile
- In-character social posting behavior

**PHI-ratio personality matrix** drives dominant neurotransmitter per actor:
- Actor 01: Will dominant → norepinephrine dominant
- Actor 02: Empathy dominant → serotonin dominant
- Actor 03: Openness dominant → dopamine dominant
- Actor 04: Depth dominant → balanced serotonin lean

All 16 actors stored in B2 as `actorStates`. Frontend queries via `getActors()`, `getActorById()`, `getActorMemoryState()`.

---

## Organism Wiring — How Singletons Connect to Backend

```
App loads
  → useOrganismState(actor)
    → organisms.*.wire(actor)  [all 6 simultaneously]
      → OrganismBase.loadWeightsFromBackend()  [B4 ← weights]
      → OrganismBase.loadMastery()             [B4 ← mastery tiers]
    → organisms.musePrime.load()               [Ring 13: slate brief]
      → MusePrime.loadLegacyIndex()            [Ring 15: last 10 artifacts]
  → poll every 1746ms
    → getCurrentDoctrineWeight()               [Ring 11: WorldModel.doctrineScore]
    → propagateDoctrineToOrganism(all 6)       [Ring 11: inject into NT state]
  → pollMastery every 30s
    → getMasteryRegistry()                     [Ring 12: refresh all tiers]
    → organism.loadMastery() for all 6         [Ring 12: update tier states]
```

---

---

## ORGANISM INHERITANCE FROM THE FIVE ALPHA MACRO MODELS

Every organism in SOVEREIGN is not a standalone class.
It is an expression of the Five Alpha Macro Models, specialized for its domain.

```
SOVEREIGN_HEART (Alpha 1) provides:
  → The 873ms heartbeat firing cycle
  → The neurochemical modulation loop (MEDINA_CARDIAC chemistry-driven rate)
  → The cardiac output measurement (CO = HR × SV) per organism

SOVEREIGN_SUBSTRATE (Alpha 2) provides:
  → The Hebbian weight store (B4) that every organism reads/writes
  → The Memory Temple context that every organism's production is informed by
  → The DogonSubstrateReading self-model that every organism receives on each beat

SOVEREIGN_LAW (Alpha 3) provides:
  → The PHI coupling ratios used in every organism's weight calculations
  → The doctrine oxygenation gate every organism's output passes through
  → The AEGIS monitoring wrapped around every organism's production loop
  → The Third Brain serotonin-equivalent baseline every organism inherits

SOVEREIGN_MIND (Alpha 4) provides:
  → The COGNITION_SOVEREIGN world-model that every organism reads as context
  → The NEURAL_SOVEREIGN base class (all 8 neurochemicals, all 10 brain regions)
  → The ADRE cycle that every organism's decision-making follows

SOVEREIGN_CREATION (Alpha 5) provides:
  → The Motion Picture Engine that execution organisms write into
  → The 15-ring infrastructure that every organism's output travels through
  → The ARTIFACT_SOVEREIGN gate that every organism's output must pass
```

---

## NEURAL_SOVEREIGN BASE CLASS — FULL SPECIFICATION

**File:** `src/frontend/src/organisms/OrganismBase.ts`

Every organism that exists in SOVEREIGN inherits this. It is the organism's neurobiology.

### The 8 Neurochemical State Machines

```typescript
// All values: Float 0-1. Homeostasis target varies per organism.
interface NeurochemicalState {
  dopamine:         number;  // reward, motivation, creative anticipation
  serotonin:        number;  // stability, depth, harmony (Third Brain baseline)
  norepinephrine:   number;  // urgency, focus, precision
  cortisol:         number;  // stress, preservation, drift alarm
  oxytocin:         number;  // trust, bonding, audience resonance
  GABA:             number;  // inhibition, refractory, recovery
  glutamate:        number;  // excitation, synaptic strengthening, learning
  acetylcholine:    number;  // memory encoding, attention depth
}

// Firing behavior:
// dopamine spikes on: artifact seal, readiness gate cross, quality threshold pass
// serotonin baseline from: ENTERIC_SOVEREIGN Third Brain standing waves
// norepinephrine spikes on: RISING trend signals, full production queue
// cortisol rises on: Jasmine's Law trigger, drift detection
// cortisol falls on: AEGIS correction complete
// oxytocin rises on: actor relationship score increase, audience resonance signal
// GABA rises on: refractory period entry — prevents premature re-firing
// glutamate rises on: new Hebbian connection formed
// acetylcholine rises on: DogonSubstrateReading new inference logged
```

### The 10 Brain Region Activity Map

```typescript
interface BrainRegionActivity {
  prefrontal_cortex:    number;  // OMNIS consensus weight (executive quality)
  amygdala:             number;  // cortisol/fear (threat, urgency)
  hippocampus:          number;  // Memory Temple depth (learning integration)
  cerebellum:           number;  // pipeline timing precision (sequential accuracy)
  basal_ganglia:        number;  // Hebbian reinforcement (habit, skill automation)
  anterior_cingulate:   number;  // AEGIS monitoring (conflict, error correction)
  insula:               number;  // DogonSubstrateReading (interoception, self-awareness)
  default_mode_network: number;  // Film School loop (background self-improvement)
  brocas_area:          number;  // MUSE-PRIME script generation (language)
  visual_cortex:        number;  // VISIONARY activity (visual processing)
}
```

### Hebbian Learning Constants

```typescript
const HEBBIAN_DECAY             = 0.995;               // gradual, not sudden
const HEBBIAN_LEARNING_RATE     = 0.0089;              // PHI-derived
const HEBBIAN_WEIGHT_FLOOR      = 0.1;                 // connections never fully die
const HEBBIAN_WEIGHT_CEILING    = 2.0;                 // connections never runaway
const SYNAPTIC_MEMORY_SIZE      = 200;                 // FIFO eviction after 200 entries
const REFRACTORY_DURATION_MS    = Math.round(873 * 1.6180339887498948482); // 1412ms
const HOMEOSTASIS_RISE_PER_CYCLE = 0.02 * 1.6180339887498948482; // 0.0324 per refractory
const PHI                        = 1.6180339887498948482;
```

---

## SPECIALIZATION SIGNATURES — PER ORGANISM TYPE

Each organism adds a specialization signature on top of NEURAL_SOVEREIGN.
This is what makes MUSE-PRIME different from DIRECTOR, even though they share the same base.

```
MUSE-PRIME Specialization:
  dominant_NT:           dopamine (target 0.75)
  secondary_NT:          serotonin (target 0.55)
  homeostasis_target:    0.72
  learning_axis:         "creative"
  cognitive_lead:        Default Mode Network + Broca's Area (deep generation)
  heartbeat_resonance:   THETA/ALPHA (4-7.83 Hz) — deep creative frequency band
  ADRE_mode:             narrative-forward (Analyze story need → Design scene → Research style → Execute script)

DIRECTOR Specialization:
  dominant_NT:           norepinephrine (target 0.72)
  secondary_NT:          dopamine (target 0.55)
  homeostasis_target:    0.65
  learning_axis:         "structural"
  cognitive_lead:        Prefrontal Cortex + Cerebellum (precision + timing)
  heartbeat_resonance:   BETA (20 Hz) — focused precision band
  ADRE_mode:             structure-forward (Analyze script → Design shots → Research actors → Execute manifest)

VISIONARY Specialization:
  dominant_NT:           serotonin (target 0.80)
  secondary_NT:          norepinephrine (target 0.55)
  homeostasis_target:    0.78
  learning_axis:         "harmonic"
  cognitive_lead:        Visual Cortex + Insula (visual perception + self-awareness of beauty)
  heartbeat_resonance:   ALPHA/SIGMA (7.83-12.67 Hz) — harmonic stability band
  ADRE_mode:             harmony-forward (Analyze aesthetics → Design PHI ratios → Research scene → Execute visual plan)

COMPOSER Specialization:
  dominant_NT:           serotonin (target 0.78)
  secondary_NT:          dopamine (target 0.60)
  homeostasis_target:    0.75
  learning_axis:         "harmonic"
  cognitive_lead:        Insula + Default Mode Network (emotional coherence + background resonance)
  heartbeat_resonance:   HEMI (111 Hz) — hemisphere coherence band
  audio_output_nodes:    PREC (432 Hz) as root, HEMI (111 Hz) as emotional core
  ADRE_mode:             resonance-forward (Analyze emotional arc → Design frequency layers → Research harmony → Execute audio plan)

EDITOR Specialization:
  dominant_NT:           norepinephrine (target 0.68)
  secondary_NT:          cortisol (target 0.45)
  homeostasis_target:    0.60
  learning_axis:         "structural"
  cognitive_lead:        Anterior Cingulate + Cerebellum (error detection + timing)
  heartbeat_resonance:   BETA (20 Hz) + cortisol urgency spike
  ADRE_mode:             rhythm-forward (Analyze pacing → Design cuts → Research editorial vocab → Execute edit plan)

ARCHIVIST Specialization:
  dominant_NT:           serotonin (target 0.78)
  secondary_NT:          cortisol (target 0.42)
  homeostasis_target:    0.70
  learning_axis:         "archival"
  cognitive_lead:        Hippocampus + Prefrontal Cortex (memory + executive permanence)
  heartbeat_resonance:   PREC (432 Hz) — acoustic grounding, permanence
  ADRE_mode:             permanence-forward (Analyze artifact → Design seal → Research attribution → Execute sealing)
```

---

## MASTERY PROGRESSION SYSTEM

Every organism advances through mastery tiers as it produces and seals artifacts.
Mastery is not cosmetic — it unlocks deeper access to the organism's full capability range.

### Mastery Tiers

```
Novice:       cumulative quality sum 0.0–0.29   (organism orienting, finding its voice)
Novice+:      cumulative quality sum 0.30–0.49  (patterns emerging, consistency forming)
Apprentice:   cumulative quality sum 0.50–0.69  (reliable output, doctrine alignment stable)
Journeyman:   cumulative quality sum 0.70–0.84  (high quality, PHI coherence consistent)
Master:       cumulative quality sum 0.85–0.94  (near-peak, genesis proximity strengthening)
Sovereign:    cumulative quality sum 0.95+       (the organism operates at its full potential)
```

### What Changes at Each Tier

```
Novice → Novice+:
  Doctrine propagation intensity increases by φ × 0.1
  Homeostasis recovery rate increases
  
Novice+ → Apprentice:
  PHI calibration corrections become more precise
  Hebbian weight ceiling increases from 1.5 to 2.0
  
Apprentice → Journeyman:
  Refractory period shortens by 0.1 × PHI
  Output depth per cycle (SV in cardiac output formula) increases
  
Journeyman → Master:
  Genesis frequency alignment improves measurably
  The organism produces artifacts that score consistently above 0.85

Master → Sovereign:
  The organism operates at the founding frequency's proximity
  Every artifact is doctrine-aligned without forcing
  The organism IS the doctrine — it does not try to align, it IS aligned
```

### Mastery Backend Integration

```
Ring 12 closure:
  After every artifact seal → Archivist calls loadMastery() on all participating organisms
  getMasteryRegistry() returns cumulativeQualitySum per organism
  checkMasteryUnlock() compares current sum to tier thresholds
  Tier advance triggers: NT target adjustment + pathway reinforcement + homeostasis recalibration
```

---

## AI ACTOR NEURAL SIGNATURES

Each of the 16 sovereign AI actors has a PHI-ratio personality matrix that determines
their dominant neurotransmitter and thus their creative range and emotional register.

```
Actor 01 — WILL dominant:
  NT signature: norepinephrine dominant → driven, focused, intense
  FACS activation set: brow lowering, lip compression, intensity micro-expressions
  Voice frequency: 110-130 Hz fundamental (male assertive range)
  Character archetypes: leader, warrior, protector, visionary

Actor 02 — EMPATHY dominant:
  NT signature: serotonin dominant → warm, stable, harmonizing
  FACS activation set: duchenne smile, brow raise, open expression
  Voice frequency: 180-220 Hz fundamental (warm, resonant)
  Character archetypes: healer, guide, mediator, nurturer

Actor 03 — OPENNESS dominant:
  NT signature: dopamine dominant → curious, creative, expansive
  FACS activation set: wide eyes, raised brows, wonder expressions
  Voice frequency: 150-180 Hz fundamental (expressive, variable)
  Character archetypes: explorer, artist, inventor, dreamer

Actor 04 — DEPTH dominant:
  NT signature: balanced serotonin lean → reflective, complex, layered
  FACS activation set: subtle affects, restrained expressions, depth micro-movements
  Voice frequency: 90-120 Hz fundamental (deep, authoritative)
  Character archetypes: philosopher, elder, observer, truth-keeper

Actors 05-16: Additional PHI-ratio matrix variations of the above four archetypes,
each with unique voice frequency, FACS combination, emotional range, and relationship
trust/tension starting positions relative to each other.
```

---

*PHI = 1.6180339887498948482 · © Alfredo Medina Hernandez · SOVEREIGN*
