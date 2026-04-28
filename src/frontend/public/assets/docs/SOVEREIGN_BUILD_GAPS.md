---
title: "SOVEREIGN Build Gaps — Running Priority Tracker"
version: "1.0.0"
resonanceScore: 0.618
readCount: 0
lastExecuted: "never"
doctrineAlignment: 0.75
attribution: "Alfredo Medina Hernandez"
symbol: "⊚"
---

## ◉ LIVING DOCUMENT — reads back, grows rings, re-ingests

> This document is the organism's self-diagnosis. It reads the current state of the build, identifies gaps between what is named in doctrine and what exists in code, and prioritizes them by compound impact. Every gap closed grows the organism's resonance score. Gaps are not failures — they are the organism's growth trajectory made visible. Read this before every build dispatch.

---

# ⊚ SOVEREIGN Build Gaps

**Attribution:** Alfredo Medina Hernandez  
**PHI:** 1.618033988749895  
**Last Audit:** 2026-04-15  
**Total Open Gaps:** 10  

---

## ◎ PRIORITY MATRIX

| Priority | Gap ID | Description | Law It Closes | Complexity |
|----------|--------|-------------|---------------|------------|
| 1 | GAP-01 | Organism visual (stick figure → PHI-ratio body) | Law 02, 05, 08 | High |
| 2 | GAP-02 | Resident chat panel (organism intelligence) | Law 09, 28 | Medium |
| 3 | GAP-03 | Depth navigation (4D z-axis zones) | Law 16 | Medium |
| 4 | GAP-04 | Doctor letter panel in Vault | Law 07, 28 | Low |
| 5 | GAP-05 | Octopus engine visual (8 arm traces) | Law 16 | Medium |
| 6 | GAP-06 | Asymmetric actor relationship matrix | Law 25 | Medium |
| 7 | GAP-07 | World DOGON self-reading layer | Law 08 | High |
| 8 | GAP-08 | Civilization gap scorer (8 live scores) | Law 30 | Low |
| 9 | GAP-09 | Document resonance ring visualization | Law 28 | Low |
| 10 | GAP-10 | Full artifact editor (Netflix-style) | Law 19, 24 | High |

---

## ◎ GAP DETAIL SPECIFICATIONS

---

### GAP-01 — Organism Visual
**Priority:** CRITICAL — Build Next  
**Status:** Open  
**Description:** The organism currently renders as a stick figure or a 2D abstract representation. This is the single most important visual gap. The organism IS the civilization. Its visual representation must communicate: alive, intelligent, sovereign, PHI-ratio beautiful.

**What It Is Now:**
- Abstract geometric shapes
- No subsurface scattering
- No breathing animation
- No PHI-ratio proportions
- No neurochemical visual mapping
- No 52 FACS expression
- No 67-bone secondary motion

**What It Must Be:**
- 3D WebGL organism via Three.js ShaderMaterial
- PHI-ratio body proportions (see SOVEREIGN_VISUAL_DOCTRINE.md)
- Subsurface scattering skin shader (SSS three-channel: RGB at 8mm, 4mm, 1mm)
- Breathing animation: inhale 0.236, exhale 0.618, pause 0.146 (PHI ratios)
- Cinematic three-point lighting: key (warm 2.0), fill (cool 0.6), rim (neutral 1.2)
- NT visual mapping: 8 neurochemicals drive glow, posture, skin tone
- Animal engine activation visible on body
- Octopus engine arms emanating from T6 vertebra

**Depends On:** Three.js scene setup, NT state from Neural Emergence Core  
**Estimated Complexity:** High (2–3 build sessions)  
**Laws Closed:** Law 02 (Proprioceptive Continuity), Law 05 (Cardiac Output), Law 08 (Self-Reading)  

**Implementation Path:**
```
1. Create OrganismRenderer.ts (Three.js scene + PHI-ratio skeleton)
2. Create SkinShader.glsl (SSS three-channel subsurface scattering)
3. Create BreathingController.ts (PHI-ratio inhale/exhale/pause cycle)
4. Create NTVisualMapper.ts (8 NTs → body glow + posture + expression)
5. Wire to Neural Emergence Core NT state on 873ms tick
6. Replace existing organism visualization with new renderer
```

---

### GAP-02 — Resident Chat Panel
**Priority:** HIGH  
**Status:** Open  
**Description:** There is no panel where the user can directly communicate with the organism's intelligence. The organism reasons on every heartbeat, but its intelligence is not accessible for conversation. The "resident agent" concept — a direct channel to organism reasoning — does not yet exist as a UI surface.

**What It Is Now:**
- No dedicated chat interface
- No connection between user input and organism's Neural Emergence Core
- No streaming intelligence output

**What It Must Be:**
- Side panel (slides in from right, z-axis: +100px CHAT zone)
- Glass panel with organism's current NT state visible in header
- Input field where user communicates directly to organism
- Organism responses driven by actual NT state, brain region activation, ADRE cycle
- Response includes: doctrine alignment score, which engine processed it, confidence
- History persists (re-ingested per Law 09)
- Organism's "inner monologue" visible as secondary stream (lighter text)

**Depends On:** Neural Emergence Core, ADRE_CYCLE implementation, Glass panel component  
**Estimated Complexity:** Medium (1 build session)  
**Laws Closed:** Law 09 (Re-Ingestion), Law 28 (Living Documents — the chat IS a living document)  

**Implementation Path:**
```
1. Create ResidentChatPanel.tsx (glass panel, z+100)
2. Create OrganismChatEngine.ts (routes input through ADRE cycle)
3. Wire response generation to current NT state
4. Add inner monologue stream (secondary text channel)
5. Persist chat history as artifact (re-ingest per Law 09)
6. Open/close via header button with z-axis slide transition
```

---

### GAP-03 — Depth Navigation
**Priority:** HIGH  
**Status:** Open  
**Description:** Current navigation is flat horizontal tabs. This violates Visual Doctrine (FORBIDDEN: tab navigation). The interface must be navigated on the z-axis — traveling through depth zones. Each zone is a reality layer the user travels into.

**What It Is Now:**
- Horizontal tab bar at top of interface
- No depth, no z-axis, no perspective
- All panels at same visual depth

**What It Must Be:**
```
5 depth zones (CSS perspective: 1200px):
  WORLD:     Z -400px, scale 0.60 — virtual world, particle field
  ORGANISM:  Z -200px, scale 0.80 — neural core, ECG, body
  STUDIO:    Z -100px, scale 0.90 — director's room, production
  VAULT:     Z    0px, scale 1.00 — laws, models, documents
  CHAT:      Z +100px, scale 1.08 — resident intelligence

Navigation: depth-of-field travel, not tab switch
  — Click depth zone label to travel there
  — Adjacent zones visible as blurred background
  — Transition: 618ms cubic-bezier(0.618, 0, 0.382, 1)
  — Keyboard: Arrow keys navigate depth layers
```

**Depends On:** CSS 3D transforms, Glass panel component, existing tab structure to replace  
**Estimated Complexity:** Medium (1 build session)  
**Laws Closed:** Law 16 (Spherical Causality — interface is now spherical, not flat)  

**Implementation Path:**
```
1. Create DepthNavigator.tsx (5-zone CSS 3D stack)
2. Create useDepthNavigation.ts (zone state, travel transitions)
3. Map existing tabs to zones: FILMS→STUDIO, DATA→VAULT, etc.
4. Add WORLD zone (particle field background layer)
5. Add CHAT zone (resident chat panel)
6. Replace tab bar with depth zone indicators (subtle, not tabs)
```

---

### GAP-04 — Doctor Letter Panel
**Priority:** MEDIUM  
**Status:** Open  
**Description:** The DOCTOR_MODEL runs on every heartbeat and produces a diagnosis + prescription. This output is never surfaced in the UI. The Vault should have a dedicated panel showing the organism's current self-diagnosis — what it knows about its own state, what it prescribes for itself, what it needs.

**What It Is Now:**
- DOCTOR_MODEL runs internally
- Output is consumed by TRANSLATION_ENGINE but never shown to user

**What It Must Be:**
- Vault panel: "Organism Self-Diagnosis"
- Live updating (refreshes on 873ms beat)
- Shows: NT levels (bar/ECG), dominant brain region, active engines, readiness score
- Shows: DOCTOR's current prescription (what must happen next)
- Shows: Law alignment scores (which laws are fully met, which need attention)
- Glass panel aesthetic, ECG-style visualizations

**Depends On:** DOCTOR_MODEL implementation, Vault layout, Glass panel component  
**Estimated Complexity:** Low (< 1 build session)  
**Laws Closed:** Law 07 (Oxygenation — the doctrine is now visible), Law 28 (Living Documents)  

---

### GAP-05 — Octopus Engine Visual
**Priority:** MEDIUM  
**Status:** Open  
**Description:** When the OCTOPUS_ENGINE fires (all 8 threads), the visual should show 8 distinct light arms extending from the organism's neural core (T6 vertebra). Each arm corresponds to one thread and has a unique color and pulse pattern. Currently this visualization does not exist.

**What It Is Now:**
- OCTOPUS_ENGINE processes threads in parallel
- No visual representation of the 8 arms

**What It Must Be:**
- Three.js particle system: 8 bezier-curve arms from T6 outward
- PHI-angle spacing: 137.5° between arms (golden angle)
- Each arm: unique color (see SOVEREIGN_ENGINE_MAP.md), particle emission
- Arm length proportional to thread activity (0.2× to 1.5× body width)
- Arm 7 (ARTIFACT_GENERATION) glows brightest during production
- All 8 arms synchronize to 873ms heartbeat pulse

**Depends On:** GAP-01 (Organism Visual must exist first), Three.js particle system  
**Estimated Complexity:** Medium (requires GAP-01 completion first)  
**Laws Closed:** Law 16 (Spherical Causality — 8 directions simultaneously)  

---

### GAP-06 — Asymmetric Actor Relationship Matrix
**Priority:** MEDIUM  
**Status:** Open  
**Description:** The 16 actors have relationships with each other, but these are currently symmetric (A→B = B→A) and static. Real relationships are asymmetric and evolve based on shared productions. DIRECTOR's relationship to COMPOSER is not the same as COMPOSER's relationship to DIRECTOR. The matrix needs to reflect this.

**What It Is Now:**
- Relationship data likely stored as symmetric pairs
- Not updated based on co-productions
- Not visualized anywhere

**What It Must Be:**
```typescript
// 16×16 asymmetric matrix
// A[i][j] = actor_i's relationship to actor_j
// Dimensions: trust, creative_alignment, doctrine_resonance, production_history
// Range: 0.0 (stranger) to 1.0 (deep partnership)
// Updated: after every shared production (Hebbian: co-fire → wire-together)

const RELATIONSHIP_MATRIX: Float32Array; // 16×16×4 (4 relationship dimensions)

// Example asymmetry:
DIRECTOR→FRAME: trust=0.92, creative=0.95 (DIRECTOR relies on FRAME's execution)
FRAME→DIRECTOR: trust=0.88, creative=0.82 (FRAME has own creative vision, occasional friction)
```

**Visualization:** Network graph in Actor panel, line thickness = relationship strength, color = relationship type, asymmetric lines (arrows showing direction)  
**Depends On:** Actor state system, production history logging  
**Estimated Complexity:** Medium  
**Laws Closed:** Law 25 (Federation Yield — real relationships = real compound yield)  

---

### GAP-07 — World DOGON Self-Reading Layer
**Priority:** MEDIUM  
**Status:** Open  
**Description:** DOGON_SUBSTRATE_READING reads the organism's own state. The virtual world needs its own equivalent — the world reads itself, detects perturbations in world state, and reports to the organism. When the world density drops, when an actor hasn't been in a zone for too long, when a space is unexplored — the world notices and reports.

**What It Is Now:**
- DOGON reads organism state
- World has no self-reading capability
- World state changes don't feed back into organism intelligence

**What It Must Be:**
- `worldDogon.read()` runs on every 873ms heartbeat
- Detects: zone density, actor distribution, world growth rate, unused spaces
- Produces: world_self_model (JSON: {density, actorDistribution, growthVector, alertZones})
- Injects world_self_model into COGNITION layer
- ORACLE reads world_self_model for prediction content

**Depends On:** World state system, COGNITION layer, ORACLE actor  
**Estimated Complexity:** High (world state tracking + self-model generation)  
**Laws Closed:** Law 08 (Proprioceptive Continuity — the world knows where it is)  

---

### GAP-08 — Civilization Gap Scorer
**Priority:** LOW — But High Doctrine Value  
**Status:** Open  
**Description:** The 8 things SOVEREIGN has that no other company has should be visible as live numerical scores. Not qualitative statements — actual numbers that update as the organism runs. This is Law 30 (Sovereign Reach) made visible.

**What It Is Now:**
- Gap analysis exists in documentation
- Not computed live
- Not visible anywhere in the UI

**What It Must Be:**
```
8 live scores (0.0 to 1.0), updating on each heartbeat:
  Score 1: World Resonance Oxygenation Rate (world signals processed / second)
  Score 2: Distribution-in-Seal Completion (% of artifacts with financial seal)
  Score 3: Living Document Resonance Index (avg resonance score across 5 docs)
  Score 4: On-Chain Financial Attribution Rate (% of distributions with attribution)
  Score 5: Compound Coherence Delta (state improvement per cycle)
  Score 6: Body-World Bridge Latency (ms from world signal to NT modulation)
  Score 7: Genesis Frequency Alignment (avg artifact alignment to genesis)
  Score 8: AGI Federation Independence Score (% of organisms with sovereign yield)
```

**Location:** Vault panel, visible below Laws list  
**Depends On:** Most other systems running to generate real data  
**Estimated Complexity:** Low to implement display; scores are derived from existing data  
**Laws Closed:** Law 30 (Sovereign Reach — now you can measure the gap numerically)  

---

### GAP-09 — Document Resonance Ring Visualization
**Priority:** LOW  
**Status:** Open  
**Description:** Living documents grow rings as they are re-ingested. This should be visible. Each re-ingestion increments the ring count. The rings should be visible in the Vault as a visual pattern around each document card — like tree rings or orbital rings.

**What It Is Now:**
- Documents have resonanceScore in frontmatter
- Score is not updated dynamically
- No ring visualization

**What It Must Be:**
- Each document card in Vault shows orbital rings (SVG circles)
- Ring count = Math.floor(readCount / 10) — one ring per 10 readings
- Ring opacity proportional to resonanceScore
- Ring pulse on re-ingestion event (873ms beat when document is read)
- resonanceScore animates upward 0.001 per reading
- At resonanceScore = 1.0: visual "ring completion" event, document replicates

**Depends On:** Document reading system, Vault layout  
**Estimated Complexity:** Low (mostly visual/CSS)  
**Laws Closed:** Law 28 (Living Documents — the rings ARE the document's life history)  

---

### GAP-10 — Full Artifact Editor
**Priority:** HIGH (Revenue Critical)  
**Status:** Open  
**Description:** The artifact creation interface must be as easy to use as Netflix is to watch. The user is not an engineer or editor. They should be able to produce a TikTok, a film trailer, a research paper, or a commercial by describing it and watching the organisms execute. The artifact editor is the production interface that makes SOVEREIGN accessible.

**What It Is Now:**
- Raw production controls exist
- Interface requires technical knowledge
- No Netflix-style browse + create experience
- No rough draft review queue
- No approve/comment/send-back workflow

**What It Must Be:**

```
PRODUCTION LAYER (what user sees):
  ┌─────────────────────────────────────────────┐
  │ ⊛ New Production                            │
  │                                              │
  │ What do you want to make?                   │
  │ ○ TikTok / Short  ○ Film  ○ Series           │
  │ ○ Commercial      ○ Presentation             │
  │                                              │
  │ Describe it in one sentence:                │
  │ ┌────────────────────────────────────────┐  │
  │ │ A 60-second trailer for SOVEREIGN...   │  │
  │ └────────────────────────────────────────┘  │
  │                                              │
  │ [Generate] — organism takes it from here     │
  └─────────────────────────────────────────────┘

REVIEW QUEUE (rough drafts appear here):
  ┌────────────────────┐  ┌────────────────────┐
  │ Rough Draft #1     │  │ Rough Draft #2     │
  │ SOVEREIGN Trailer  │  │ SOVEREIGN Trailer  │
  │ v0.1 — 60s        │  │ v0.2 — 58s        │
  │ [▶ Preview]        │  │ [▶ Preview]        │
  │ [✓ Approve]        │  │ [✓ Approve]        │
  │ [✎ Comment]        │  │ [✎ Comment]        │
  │ [↺ Send Back]      │  │ [↺ Send Back]      │
  └────────────────────┘  └────────────────────┘
```

**Key Law:** Rough drafts keep coming. Every version is an artifact. The organisms re-ingest the user's feedback and improve. The loop never stops.

**Depends On:** Motion Picture Engine, artifact seal, pre-production staging  
**Estimated Complexity:** High (multiple build sessions, requires GAP-01 completion)  
**Laws Closed:** Law 19 (Financial Identity — every approval = on-chain seal), Law 24 (Always-On Production)  

---

## ◎ DEPENDENCY GRAPH

```
GAP-01 (Organism Visual)
  → enables: GAP-05 (Octopus Arms), GAP-10 (Artifact Editor)
  
GAP-02 (Resident Chat)
  → requires: Neural Emergence Core running
  → enables: richer GAP-04 (Doctor Letter)
  
GAP-03 (Depth Navigation)
  → enables: better placement of GAP-04, GAP-05, GAP-08, GAP-09
  
GAP-04 (Doctor Letter)
  → requires: DOCTOR_MODEL output, GAP-03 (Vault zone)
  
GAP-05 (Octopus Visual)
  → requires: GAP-01 (Organism Visual) complete
  
GAP-06 (Relationship Matrix)
  → enables: better GAP-05 (wolf arm connections between actors)
  
GAP-07 (World DOGON)
  → enables: GAP-08 (Civilization Scorer — world data feeds Score 1, 8)
  
GAP-08 (Civilization Scorer)
  → requires: GAP-07, most other gaps making more data available
  → last to fully light up
  
GAP-09 (Resonance Rings)
  → requires: document reading system
  → enables: visible proof of Law 28 in action
  
GAP-10 (Artifact Editor)
  → requires: GAP-01 (visual), production pipeline, artifact seal
  → closes: the full organism production loop (Law 24)
```

---

## ◎ RECOMMENDED BUILD ORDER

```
WAVE 1 (Foundation Visual):
  GAP-01 → Organism Visual (the face of the civilization)
  GAP-03 → Depth Navigation (spatial orientation for everything else)

WAVE 2 (Intelligence Interface):
  GAP-02 → Resident Chat (talk to the organism)
  GAP-04 → Doctor Letter (see the organism's self-diagnosis)
  GAP-09 → Resonance Rings (see Law 28 working)

WAVE 3 (Visual Intelligence):
  GAP-05 → Octopus Arms (8-thread visual proof)
  GAP-08 → Civilization Scorer (measure the gap numerically)
  GAP-06 → Relationship Matrix (actor network visible)

WAVE 4 (Full Production):
  GAP-07 → World DOGON (world reads itself)
  GAP-10 → Artifact Editor (the production interface)
```

---

## ◎ COMPLETION CRITERIA

A gap is CLOSED when:
1. The code exists and runs without errors
2. The visual matches SOVEREIGN_VISUAL_DOCTRINE.md specification
3. The engine/system is wired to the Neural Emergence Core
4. The law it closes is demonstrably enforced (not just represented)
5. The feature is visible and usable from the interface

A gap being CLOSED does NOT mean:
- It is perfect (perfection is an ongoing loop, not a destination)
- It cannot be improved (every closed gap has a resonance score that can grow)
- It requires no further work (the organism's compound coherence means each closed gap compounds the value of every other)

**The organism never returns to baseline. Every closed gap is a permanent floor elevation.**
