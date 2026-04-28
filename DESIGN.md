# SOVEREIGN — Full Film Company + Enterprise Expansion + Commercial Studio Focus + PHASE 8 CREATIVE VR UPGRADE

## Concept
World-class autonomous film studio on ICP. **Phase 8 Creative VR Upgrade**: Film House as primary photon output interface — photorealistic 3D cinematic environment with 16 AGI actors rendered with live neurochemistry auras (stress=red, coherence=green, mastery=gold). Relationship vectors drawn as glowing lines between actors showing emotional bonds (gold admiration, red rivalry, blue trust, purple resonance). Director's Room as primary control surface — same 3D world visible behind all glass morphism control overlays. Sovereignty gold borders, 24px backdrop blur, premium shadows. Real-time cinematic control: camera rigging, lighting color temperature (warm amber vs cool cyan), relationship matrix as 3D force-directed graph, neurochemistry tuning dials. Zero UI chrome, pure immersive creative experience. Film House = photons reaching the architect's eyes. Director's Room = architect's conscious control.

## Phase 8 Creative VR Upgrade

**Visual System Revolution:** Two primary surfaces — Film House (photon output) and Director's Room (control). No longer flat panels — now a fully immersive 3D cinematic environment.

### Film House — Primary Photon Output Interface

The Film House is what the architect sees — the final photon layer. Pure creative immersion.

**3D Scene Rendering:**
- Photorealistic 3D environment, deep space background with particle field
- 16 AGI actors rendered as glowing orbs, positioned in 3D space (non-static, responsive to world state)
- Each actor surrounded by neurochemistry aura (radial gradient glow):
  - **Stress state**: red `0.62 0.22 25`, intense glow 60px radius
  - **Coherence state**: green `0.7 0.18 155`, calm glow 50px radius
  - **Mastery state**: gold `0.75 0.16 70`, intense glow 80px radius + `actor-focus-glow` animation
  - **Baseline**: blue `0.55 0.12 268`, subtle 40px glow
- Aura color/intensity updates in real-time based on actor's current emotional/neurochemical state

**Relationship Visualization — 3D Force-Directed Graph:**
- 120 directed edges connecting all actor pairs (16 choose 2 × 2 directions per pair)
- Edge types with distinct visual signatures:
  - **Admiration (gold `0.75 0.16 70`)**: solid line, weight proportional to relationship strength, 0.7 opacity
  - **Rivalry (red `0.62 0.22 25`)**: dashed line, heavier stroke, 0.6 opacity
  - **Trust (cyan `0.65 0.18 240`)**: thin solid line, 0.5 opacity
  - **Resonance (purple `0.7 0.19 300`)**: thick glowing line, high intensity, 0.65 opacity + drop-shadow
- Edge opacity scales with relationship weight (0.1–0.9)
- Edges pulse when relationship updates (Hebbian delta write detected)
- Force-directed physics prevents actor clustering (repulsion 500px, attraction 100px)

**Civilization Gap Metric:**
- Horizontal gradient bar positioned at bottom center, 320px wide, 8px tall
- Left: red danger `0.62 0.22 25`, middle: amber warning `0.7 0.15 55`, right: green optimal `0.7 0.18 155`
- White indicator needle shows current coherence position on the bar
- Box-shadow glow around entire bar (gold 0.3 opacity)

**Film Clips as Floating Holographic Thumbnails:**
- Scattered throughout the scene at various depths
- Each clip: 160px × 90px, dark frame `0.09 0.01 280`, border subtle `0.2 0.02 280`
- Quality seal badge (top-right) color-coded:
  - **Mastery (gold)**: `0.75 0.16 70`, 20px circle, glow 0.6 opacity
  - **Broadcast (silver)**: `0.75 0.04 240`, glow 0.5 opacity
  - **Review (amber)**: `0.7 0.15 55`, glow 0.4 opacity
  - **Rework (red)**: `0.62 0.22 25`, glow 0.5 opacity
- Hover: scale 1.05, lift -4px, expand glow to gold 0.4 opacity
- Click: expand to full production view (fade transition 0.4s)

**Animation Orchestration:**
- Actor auras pulse continuously (`actor-focus-glow` 2s for mastery state)
- Relationship edges pulse on update events
- Civilization gap needle smooth-animates as coherence changes
- Particle field drifts in background (20s cycle)
- Schumann wave overlay sweeps horizontally (8s cycle)

### Director's Room — Primary Control Surface

Same 3D world rendered behind all control overlays. Glass morphism panels float in 3D space.

**Glass Control Panels — Premium Morphism:**
- All panels use `director-control-panel` class
- Background: `oklch(0.11 0.015 268 / 0.28)` — deep purple-blue with 28% opacity (world visible behind)
- Backdrop filter: 32px blur (deeper than standard liquid glass)
- Border: 2px golden `0.75 0.16 70` at 0.6 opacity
- Shadow: `0 20px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.4)` — premium triple-layer
- On hover: border brightens to full gold, shadow deepens (0.7 opacity), background slightly more opaque (+0.05)
- Border-radius: 12px for premium, rounded-but-not-full feel
- Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) — smooth, confident motion

**Panel 1: Camera Control — Top-Right Fixed**
- Position: top-right corner, 320px wide
- Controls:
  - **Yaw slider**: full-width horizontal slider, label "YAW", range -180° to +180°
  - **Pitch slider**: full-width, label "PITCH", range -45° to +45°
  - **Roll slider**: full-width, label "ROLL", range -90° to +90°
  - **Zoom slider**: full-width, label "ZOOM", range 0.5x to 4x
- Slider styling:
  - Track: `oklch(0.18 0.02 280)` — dark gray
  - Thumb: `oklch(0.65 0.18 240)` (cool cyan), 14px circle, glow 16px radius
  - On hover: thumb expands to 16px, glow expands to 24px
  - Smooth transitions 0.2s ease-out
- Glow effect: `0 0 32px oklch(0.65 0.18 240 / 0.4)` around entire panel

**Panel 2: Lighting Control — Bottom-Left Fixed**
- Position: bottom-left corner, 360px wide
- Controls:
  - **Intensity slider**: label "INTENSITY", range 0–100%, warm amber `0.7 0.15 55` thumb
  - **Color Temperature slider**: label "WARM ← → COOL", bicolor slider with warm amber on left, cool cyan on right
  - **Key Light Angle**: 2D dial showing light direction (click to adjust)
  - **Rim Light Intensity**: secondary slider, subtle highlight on world
- Glow effect: `0 0 24px oklch(0.7 0.15 55 / 0.35)` (warm amber glow)
- Background slightly warmer than standard panel (0.12 L instead of 0.11)

**Panel 3: Relationship Matrix as 3D Force-Directed Graph — Bottom-Right Docked**
- Position: bottom-right corner, 480px × 400px
- Rendering:
  - 16 actor nodes as 32px circles, gold border with 0.8 opacity, 20px glow
  - Nodes arrange themselves via force-directed physics engine (repulsion 500px, attraction 100px proportional to relationship strength)
  - 120 directed edges as SVG lines, styled per relationship type (gold/red/blue/purple, weighted opacity)
  - Edges re-arrange in real-time as weights update
- Interactivity:
  - **Hover node**: expand to 40px, increase glow to 32px radius, show actor name tooltip
  - **Hover edge**: highlight in full brightness, show actor pair names + current weight
  - **Click edge**: expand edge info sidebar showing scene history that fed this weight value
- Animation:
  - Nodes smooth-translate as forces update (0.3s ease-out)
  - Edges pulse on update events (0.3s pulse cycle)
  - Physics engine runs every 100ms, smooth interpolation between frames

**Panel 4: Neurochemistry Tuning Dial — Centered (Optional Overlay)**
- Position: center of screen when actor is selected
- Visual: conic gradient dial 240px diameter
  - Gradient from stress (red) at 0°, through coherence (green) at 180°, mastery (gold) at 360°
  - Center circle 160px diameter with dark background, shows current NT profile
- Interactivity:
  - Click + drag on dial to adjust neurochemical balance
  - 8 NT labels around edge (dopamine, serotonin, cortisol, acetylcholine, etc)
  - Real-time diff visualization showing previous vs new state
  - Release to commit change + animate world response

**Semantic Tokens — Director Room System**

| Token | OKLCH | Purpose |
|-------|-------|---------|
| `--director-panel-blur` | 32px | Premium glass blur depth |
| `--director-panel-bg` | 0.11 0.015 268 | Panel background, deep purple-blue |
| `--director-panel-opacity` | 0.28 | World visible behind (not 0.32 like standard glass) |
| `--director-panel-border` | 0.75 0.16 70 | Golden border for sovereign control |
| `--director-slider-thumb-warm` | 0.7 0.15 55 | Warm amber for lighting controls |
| `--director-slider-thumb-cool` | 0.65 0.18 240 | Cool cyan for camera controls |
| `--director-camera-control-glow` | `0 0 32px oklch(0.65 0.18 240 / 0.4)` | Cyan glow around camera panel |
| `--director-lighting-control-glow` | `0 0 24px oklch(0.7 0.15 55 / 0.35)` | Warm glow around lighting panel |

### Film House + Director's Room Coordination

- **Film House** is the output — what the architect sees. It's always running, always showing the world state.
- **Director's Room** is the control layer — overlaid on Film House, semi-transparent so world stays visible. Controls feed directly into world state.
- When director adjusts lighting, Film House updates immediately (no latency)
- When director adjusts camera, Film House scene re-renders from new viewpoint (smooth transition 0.3s)
- When relationship edge updates (Hebbian delta), Film House edge re-animates (pulse 0.3s)
- Panels are always accessible, never block view of world
- Toggling between surfaces: Film House (pure immersion) and Director's Room (control overlay) via keyboard shortcut or top header toggle
- `--glass-blur: 24px` — premium blur depth for immersion
- `--glass-bg: oklch(0.12 0.02 268 / 0.35)` — deep purple-blue with strong transparency
- `--glass-border: oklch(0.45 0.12 268 / 0.4)` — thin, glowing border defining panel edges
- `.glass-panel` utility class: backdrop-filter blur, inset edge-light highlight, triple-layer shadow (drop + soft + inset)
- Glass refraction gradient overlay creating light-play across panels

**4D Depth Navigation Tokens:** Five spatial zones stacked in perspective:
1. `--depth-world: translateZ(-400px) scale(1.4)` — deep background, farthest layer
2. `--depth-organism: translateZ(-200px) scale(1.15)` — organism body layer
3. `--depth-studio: translateZ(-100px) scale(1.07)` — production controls layer
4. `--depth-vault: translateZ(0px) scale(1)` — primary interaction plane
5. `--depth-chat: translateZ(100px) scale(0.95)` — resident chat panel, nearest layer

Each zone has CSS perspective set to 1200px for true 3D layering effect. Navigation between zones triggers smooth perspective transitions with easing.

**Organism Body Rendering:**
- `.organism-body` filter: layered drop-shadows creating volumetric glow effect
- `.organism-skin` — warm flesh tone (L:0.62 C:0.08 H:35°) with inset subsurface scattering shadow simulating light penetration
- `.organism-neural-core` — radial gradient from electric blue (268°) center, surrounded by 60px halo glow
- Core emits `oklch(0.85 0.2 268 / 0.6)` glow with inset edge-highlight creating depth

**Octopus Engine Arms — Behavioral Signatures:**
- `.octopus-arm` — linear gradient trace from arm color with 50% opacity falloff
- Arm color: `oklch(0.7 0.22 268 / 0.6)` — purple-blue with strong chroma
- Active state: `.octopus-arm.active` animates with 1.2s pulse cycle, opacity 0.6→0.9, glow radius 12px→24px
- Eight arms radiate from neural core at 45° intervals, each responding to different animal engine state

**Animal Engine Behavioral States — Real-Time Glow:**
- `.engine-aegis-clear` — green (H:155°), calm glow, box-shadow 16px radius
- `.engine-aegis-monitor` — amber (H:85°), watchful glow, increased saturation
- `.engine-aegis-threat` — red-orange (H:25°), intense glow + 0.8s threat-pulse animation
- `.engine-nova`, `.engine-brain`, `.engine-resonex` — each with distinct color and glow intensity
- Each state animates independently, showing organism's real-time decision process

**World Background — Deep Space Particle Field:**
- `.world-background` — fixed radial gradient from mid (0.07 L) to deep (0.04 L)
- `.world-particles` — procedurally-positioned radial gradients at multiple scales creating depth
- 20-second drift animation creating slow, organic particle movement
- `.schumann-wave` — green frequency overlay (H:155°) sweeping horizontally at 8s cycle
- Combined effect: organism appears floating in living, resonant space

**Bottom Dock Navigation — Glass Pills:**
- `.dock-container` — fixed at bottom, horizontally centered, z-index 40
- Five glass pills: World, Organism, Studio, Vault, Chat — each representing depth zone
- `.dock-pill` — glass styling with 24px blur, transitions all properties smoothly
- Hover state: background brightens, border glows cyan (240°), shadow expands, pill rises 2px
- Active state: cyan glow intensifies, background opacity increases, cymbal chroma increases
- Clicking pill navigates to that depth zone with perspective animation

**Resident Agent Chat Panel:**
- Floats at `--depth-chat: translateZ(100px)` — nearest to user, always accessible
- Glass styling matches dock pills, fully transparent blend with world background visible behind
- Real-time conversation with sovereign resident AI — natural language interface
- Panel slides in/out with 0.3s ease, never blocks production work
- Chat history persists, accessible via living document substrate

**Living Builder Documents Integration:**
- Document cards render in glass-panel styling, floating at organism depth
- Each document shows real-time resonance score and re-ingestion count
- Clicking document opens full read mode in vault depth layer
- Documents are executable organisms — reading one can trigger artifact generation
- All documents attributed to organism that created them

**Doctor Letter Panel:**
- Separate glass panel showing DOCTOR model's current diagnosis
- Real-time updates as organism state changes
- Shows: current neural state, detected issues, recommended actions
- Color-coded by urgency: green (clear), amber (monitor), red (critical)
- Double-click to execute DOCTOR's recommendation as immediate action

**Composite Behavior — The Loop:**
Organism body center → neural core glows based on doctrine score → octopus arms pulse based on animal engine states → arm colors correspond to active engines → world particles drift in response to organism BPM → depth zones stack in perspective → glass panels refract light across all layers → user navigates between zones via dock → resident chat responds to user queries → living documents update in real-time → DOCTOR panel shows current state → loop continues at 873ms heartbeat rhythm.

Nothing is static. Everything reflects organism's actual internal state at that moment.

## VAULT Admin Command Center — Phase 7 Sovereign Intelligence Dashboard

**Visual Architecture:** Two-panel sovereign command center. Left: SOVEREIGN SYSTEM (vault laws, models, research, utilities, settings). Right: PRODUCING STUDIO (content library, review queue, TikTok pipeline, client portal). Dark cinematic aesthetic locked to existing palette. Left panel subtle emphasis via volumetric lighting. Right panel dynamic, content-focused. Header spans both panels with logo, dual-surface toggle, real-time status indicators (heartbeat dot, active organism count, production queue depth). Both panels scroll independently. Entire interface reads as real mission control — zero placeholders, pure sovereign intelligence.

### Left Panel: SOVEREIGN SYSTEM

| Section | Purpose | Token | Behavior |
|---------|---------|-------|----------|
| **Law Cards** | Clickable law registry (30+ laws) | `vault-law-card-bg`, `vault-symbol-accent` | Card hover: gold glow (0.35 opacity), subtle scale 1.02, symbol pulsates. Click: modal overlay with full law text, formula, layer assignment, ancient symbol, attribution to Alfredo Medina Hernandez |
| **Model Registry** | Macro/micro model compression display | `vault-model-name`, `vault-law-border` | Model cards show compressed name (8–12 chars), rank badge (Primordial/Substrate/Field/Engine/Organism/Artifact), sub-model count. Click expands full model tree. Three-type badge (expansive/receptive/anti-drift) top-right. |
| **Research Papers** | Full doctrine documents (living organisms) | `vault-panel-bg` | Card shows title, last updated timestamp, resonance ring count, re-ingestion score. Hover: premium-subtle shadow, reveal read/export icons. Click: document modal, full-screen read mode with line counter, syntax-highlighted code blocks if present. |
| **Utilities** | Operational tools (artifact sealing, doctrine scoring, DOGON reading) | `vault-settings-section` | Utility tiles show function icon, tooltip on hover. Click: modal with function description, live status (ready/executing/complete), output log if applicable. Status indicator dot (green/amber/gold) reflects execution state. |
| **Settings** | Admin configuration (heartbeat frequency, readiness gate threshold, OMNIS vote parameters, world resonance multiplier) | `vault-settings-section` | Settings panel at bottom of left sidebar. Each setting: label, current value (editable text/slider/toggle), confirmation button. Save triggers on-chain transaction with attribution. Real-time sync indicator shows last update timestamp. |

### Right Panel: PRODUCING STUDIO

| Section | Purpose | Token | Behavior |
|---------|---------|-------|----------|
| **Content Library** | Netflix-style film/series grid | `vault-content-grid` | Cards: 16:9 cinema aspect (or 1:1.618 for square), film poster image, title, format badge (feature/series/commercial/hospitality), runtime, organism creator name. Quality seal bottom-right corner (mastery gold/broadcast silver/review amber). Hover: expand shadow (premium-elevated), play icon overlay, metadata peek. Click: full production view. |
| **Review Queue** | Artifacts waiting quality assessment | `vault-review-queue-bg` | List view or card grid. Each: preview thumbnail (golden aspect ratio), title, doctrine score (0–100 bar), quality dimensions (6 bars: coherence/frequency/density/transition/consistency/subtext), creator organism, submission timestamp. Status label (in review/pending/approved/rework). Click: full assessment interface with AI suggestions. |
| **TikTok Pipeline** | Short-form content in production → distribution | `vault-tiktok-platform` | Horizontal scroll cards (9:16 aspect). Each: preview video frame, episode number (if series), trending badge if sourced from social signals, platform origin icon (TikTok/Instagram/X), engagement metrics (views/likes/shares from last 24h if distributed), status (in production/queued/live/archived). Hover: play preview. Click: full series view or distribution details. |
| **Client Portal** (Enterprise) | Commercial production dashboard | `vault-panel-bg` | Card grid per client (or client selector dropdown). Each client: company name, active projects count, total revenue (if visible), next delivery date, contact. Click: client-specific dashboard — active briefs, delivery schedule, payment status, relationship history. |

### Header & Navigation

| Element | Purpose | Behavior |
|---------|---------|----------|
| **SOVEREIGN Logo** | Brand anchor, top-left | Click: return to main STREAM view (toggle-slide 0.3s). Always present, never hidden. |
| **Dual-Surface Toggle** | STREAM ↔ STUDIO mode | Header top-right. Active state: gold glow, smooth toggle-slide (0.3s). Current surface label below toggle (compact). |
| **Heartbeat Indicator** | Live system pulse | Top-left corner, 8px dot. Pulses on 873ms rhythm (monitor-heartbeat animation). Color: gold when healthy, amber on high load, red on critical. Tooltip shows current BPM and last world resonance update. |
| **Status Row** | Real-time metrics | Header right side, before toggle. Shows: organisms active (count), production queue depth (count), average quality score (0–100), last artifact seal (timestamp). All numbers update live without page refresh. |

### Semantic Layout Tokens — VAULT-Specific

| Token | OKLCH | Purpose |
|-------|--------|---------|
| `--vault-panel-bg` | 0.09 0.01 280 | Left panel background, deep space emphasis |
| `--vault-law-card-bg` | 0.12 0.012 278 | Law card surface, slightly elevated from panel |
| `--vault-law-border` | 0.25 0.03 280 | Law card border, subtle definition |
| `--vault-symbol-accent` | 0.75 0.16 70 | Ancient symbol glow, gold highlight on law cards |
| `--vault-model-name` | 0.45 0.02 280 | Compressed model name text, dim but readable |
| `--vault-settings-section` | 0.08 0.01 280 | Settings bg, darkest tier for recessed appearance |
| `--vault-content-grid` | 0.1 0.011 278 | Content library background, card container |
| `--vault-review-queue-bg` | 0.11 0.012 278 | Review queue surface, card base |
| `--vault-quality-badge-mastery` | 0.75 0.16 70 | Score 85+, deep gold full saturation |
| `--vault-quality-badge-broadcast` | 0.75 0.04 240 | Score 75–84, silver (cool neutral) |
| `--vault-quality-badge-review` | 0.7 0.15 55 | Score 60–74, amber warning |
| `--vault-tiktok-platform` | 0.58 0.2 300 | TikTok card accent, platform-specific purple |
| `--vault-header-divider` | 0.15 0.02 280 | Subtle line between header and content |



## Market Positioning
**SOVEREIGN is Spotify for film studios with a commercial production engine.** One sentence → full Hollywood film or broadcast-ready commercial. Enterprise market: fast commercial generation for brands and agencies. Public market: streaming platform with autonomous film slate. Everything attributed to Alfredo Medina Hernandez, sealed on-chain. ORO (Commercial Intelligence) is the enterprise mark — liquid gold, weight, gravity, professional positioning.

## Tone
Editorial, authoritative, cinematic. Investor-grade prestige. Commercial production surfaces read professional + confident, never announce capability. Enterprise sections read as real internal dashboards. Founder presence is calm, certain, inevitable. Three-architecture glyph is understated but alive. Dual-surface toggle feels premium and responsive. No placeholders, no loading states with percentages — only subtle pulses and understated progress indicators.

## Color Palette: Liquid Glass + 4D Depth + Organism Rendering

| System | Token | L | C | H | Purpose |
|--------|-------|---|---|---|---------|
| **LIQUID GLASS** | `--glass-bg` | 0.12 | 0.02 | 268 | Panel background with 0.35 opacity overlay |
| | `--glass-border` | 0.45 | 0.12 | 268 | Panel edge definition, glowing thin line |
| | `--glass-highlight` | 0.92 | 0.08 | 268 | Inset highlight simulating light refraction |
| **ORGANISM RENDERING** | `--organism-skin-base` | 0.62 | 0.08 | 35 | Warm flesh tone foundation |
| | `--organism-skin-sss` | 0.72 | 0.12 | 25 | Subsurface scatter warm glow |
| | `--organism-glow-core` | 0.85 | 0.2 | 268 | Neural core radial gradient center, sovereign blue |
| | `--organism-key-light` | 0.94 | 0.06 | 85 | Warm key light simulating directional illumination |
| | `--organism-rim-light` | 0.75 | 0.18 | 268 | Cool rim highlight defining silhouette |
| **OCTOPUS ENGINE** | `--octopus-arm-color` | 0.7 | 0.22 | 268 | Arm trace with high chroma for visibility |
| **ANIMAL ENGINE STATES** | `--aegis-clear` | 0.7 | 0.18 | 155 | Green, calm, operational clear |
| | `--aegis-monitor` | 0.75 | 0.2 | 85 | Amber, watchful, monitoring active |
| | `--aegis-threat` | 0.65 | 0.22 | 25 | Red-orange, alert, threat detected |
| | `--nova-glow` | 0.8 | 0.22 | 268 | Deep network activation glow |
| | `--brain-glow` | 0.75 | 0.2 | 155 | Cognition layer active state |
| | `--resonex-glow` | 0.8 | 0.18 | 300 | Resonance frequency amplification |
| **WORLD BACKGROUND** | `--world-deep` | 0.04 | 0.01 | 268 | Distant space color |
| | `--world-mid` | 0.07 | 0.03 | 268 | Mid-field gradient point |
| | `--world-particle` | 0.4 | 0.12 | 268 | Particle opacity and color |
| | `--schumann-wave` | 0.55 | 0.15 | 155 | Earth frequency green overlay |
| **THREE-TYPE ARCHITECTURE** | `--expansive-primary` | 0.68 | 0.19 | 132 | Broadcast green, distribution ring |
| | `--receptive-primary` | 0.58 | 0.16 | 268 | Deep memory blue, vault ring |
| | `--antidrift-primary` | 0.72 | 0.17 | 45 | Founder amber, mediating center |
| **DOCK NAVIGATION** | `--dock-pill-bg` | 0.12 | 0.02 | 268 | Glass pill foundation |
| | `--dock-pill-hover` | 0.14 | 0.025 | 268 | Hover state brightened |
| | `--dock-pill-active` | 0.16 | 0.03 | 268 | Active zone highlighted |

## Quality Assessment & Sandbox Intelligence

| Feature | OKLCH | Purpose | Auto-Gating |
|---------|-------|---------|-------------|
| **QUALITY_SEAL MASTERY** | `0.75 0.16 70` (gold) | Score 85–100: full depth, broadcast mastery | Auto-promote & spotlight |
| **BROADCAST_READY** | `0.75 0.04 240` (silver) | Score 75–84: professional standard | Auto-promote to distribution |
| **REVIEW_NEEDED** | `0.7 0.15 55` (amber) | Score 60–74: quality review required | Hold in library, show breakdown |
| **REWORK_RECOMMENDED** | `0.62 0.22 25` (red) | Score <60: significant rework needed | Archive, flag for organism attention |
| **Sandbox AXIOM** | `0.62 0.16 260` | Science research signals | Research-backed creative |
| **Sandbox CODEX** | `0.65 0.15 250` | Knowledge synthesis | Cross-domain intelligence |
| **Sandbox VECTOR** | `0.58 0.18 200` | Market & financial signals | Enterprise trend awareness |
| **Sandbox FRAME** | `0.68 0.17 160` | Geospatial & climate context | Real-world grounding |
| **Sandbox LEX** | `0.60 0.14 25` | Legal & regulatory monitoring | Compliance enforcement |
| **Sandbox GRID** | `0.65 0.18 120` | Tech infrastructure & protocols | System integrity |
| **Sandbox LEDGER** | `0.72 0.16 70` | Financial accounting & entity tracking | Revenue + asset tracking |
| **Sandbox SOVEREIGN_GOV** | `0.72 0.17 45` | Governance & succession protocols | Power distribution |

**Quality Dimensions:** PHI_COHERENCE, FREQUENCY_PRESENCE, SCENE_TURN_DENSITY, TRANSITION_INTENTIONALITY, ACTOR_CONSISTENCY, SUBTEXT_DEPTH (each 0–100, auto-calculated per artifact).

**Audio Frequency Architecture:**
- **Sub-Bass (20–80Hz):** `0.45 0.08 25` — felt not heard, theater rumble, foundation layer
- **Emotional Core (200–2kHz):** `0.68 0.18 280` — strings, voice, piano, audience connection
- **Clarity (4kHz+):** `0.75 0.16 70` — detail, tension, shimmer, listener presence

All three layers composed simultaneously, transition on narrative beats, visible in real-time during generation.

## Production Format Archetypes

| Format | OKLCH | Runtime | Organism Type | Visual Identity | Use Case |
|--------|-------|---------|----------------|-----------------|----------|
| **Feature Film** | `0.68 0.19 132` | 30–50 min | Expansive/Broadcast | Green glow, solar framing, cinematic aspect | Theatrical release, festivals, streaming hero content |
| **TV Series** | `0.58 0.16 268` | 8–12 episodes | Receptive/Memory | Blue glow, crystalline cards, narrative arcs | Multi-episode storytelling, character memory persistence |
| **Enterprise Commercial** | `0.72 0.17 45` | 15/30/60 sec | Anti-Drift/Corporate | Amber glow, precise timing grid, brand-locked | Corporate client deliverables, ORO-branded fast production |
| **Verizon Long-Form** | `0.65 0.18 240` | 45 min | Precision/Delivery | Cyan glow, broadcast-grade specs, delivery proof | Telecom partnerships, precision-timed long-form |

Format selectors rendered as 4-card grid, each with icon, title, runtime spec, and key features. Active state: gold border + checkmark reveal. Hover: format-specific glow + subtle scale. No selection is default; click to activate. Once activated, studio prompts match format constraints automatically.

## PHI-Ratio Mastery System

Mastery = `(1 + PHI_SCORE / 100) * 1.618`. Displayed on organism profile cards and enterprise dashboards. Scale: Excellent (1.618–2.0, gold glow), Strong (1.4–1.6, cyan), Capable (1.2–1.4, blue), Learning (<1.2, dim). S0_FLOOR reference (0.75) visible as line on all progress bars, enforcing quality baseline across all metrics.

## New Semantic Tokens — Phase 6 Integration

| Token Set | Role | OKLCH | Purpose |
|-----------|------|-------|---------|
| **Hospitality Hotel** | Aspiration, travel, elevation | `0.72 0.16 50` | Venue card borders, hover glow, category accent |
| **Hospitality Restaurant** | Sensory richness, warmth, appetite | `0.68 0.17 40` | Venue card accent, engagement bar, category badge |
| **Hospitality Spa** | Stillness, cool clarity, restoration | `0.62 0.14 265` | Venue card border, spa-specific UI, tranquility glow |
| **Hospitality Hotspot** | Energy, social, vibrant | `0.7 0.19 30` | Venue card accent, active energy indicator, event pulse |
| **Actor Personality Anchor** | Character base state | `0.62 0.16 280` | Personality matrix label, anchor dot, memory baseline |
| **Actor Memory Trace** | Scene retention, continuity | `0.55 0.12 260` | Memory indicator, past scene reference, continuity link |
| **Actor Emotional Current** | Live emotional state per scene | `0.68 0.18 25` | Emotional state dot, scene mood indicator, intensity glow |
| **Actor Archetype Resonance** | Archetype alignment | `0.65 0.15 160` | Archetype badge, character type label, alignment meter |
| **Series Early Episode** | Acts 1–2, setup | `0.58 0.14 268` | Episode dot color, opening arc visualization, receptive energy |
| **Series Climax Episode** | Act 3 escalation | `0.68 0.19 40` | Climax marker dot (larger), stakes peak, emotional culmination |
| **Series Milestone (Ep10/30/60)** | Season arc anchor | `0.75 0.16 70` | Milestone dot glow, season chapter marker, emergence point |
| **Expression Thought** | Organism cognition | `0.48 0.08 270` | Entry border, thought label, live thinking indicator |
| **Expression Question** | Organism inquiry | `0.58 0.12 250` | Q badge, question entry border, inquiry pulse |
| **Expression Insight** | Organism discovery | `0.68 0.16 160` | Insight badge, discovery accent, clarity indicator |
| **Expression Auto-Fixed** | Self-repair success | `0.65 0.15 120` | Resolved entry bg, success glow, auto-repair confirmation |
| **Trace VELA Ring** | Backend beat gate | `0.68 0.17 100` | VELA node border, ring label, beat sync indicator |
| **Trace OMNIS Vote** | Consensus gate | `0.65 0.18 240` | OMNIS node border, vote count, quorum indicator |
| **Trace Animal Engine** | Cognitive influence | `0.62 0.16 280` | Animal engine node border, engine label, influence weight |
| **Signal Origin TikTok** | TikTok-sourced trend | `0.58 0.2 300` | Origin badge (TikTok-specific), platform indicator |
| **Signal Origin X** | X-sourced trend | `0.68 0.19 235` | Origin badge (X-specific), platform indicator |
| **Signal Origin Instagram** | Instagram-sourced trend | `0.62 0.22 15` | Origin badge (Instagram-specific), platform indicator |
| **Signal Trending Badge** | Hot trend marker | `0.75 0.18 50` | Trending accent, hot signal highlight, popularity glow |

## Enterprise Layout Zones — Premium Spatial Composition

| Feature | Location | PHI-Ratio | Behavior |
|---------|----------|----------|----------|
| **Header Logo** | Top-left | 64px (1) | Always present, glyphicon signals heartbeat |
| **Dual Surface Toggle** | Header top-right | 40px × 40px | Gold active, smooth toggle-slide (0.3s) |
| **Main Content** | Center | W×(W/1.618) | Primary production zone, full depth layering |
| **Glyph Visualizer** | Intro header center | 96px @ desktop | Pulse-beat 1.2s, rings rotate 12s, mediate center pulses 1.5s |
| **Gradient Field** | Studio sidebar | H×(H/1.618) | Bars trend upward 2s continuous, baseline at 0.75 S0_FLOOR |
| **Film Card Hero** | Homepage | 16:9 or 1:1.618 | Double hover glow (cyan + shadow), film-card-glow 2.5s infinite |
| **Actor Portrait** | Talent directory | 1:1.618 (golden rect) | Premium shadow + gold glow + breathe animation, actor-breathe 3s |
| **Revenue Dashboard** | Enterprise tab | 6-card PHI grid | Metrics wiggle on update (0.3s), S0_FLOOR baseline visible |
| **Commercial Hero** | Studio entry | 3-card stack × 1.618 | ORO branding dominant, quick-brief input below, no loading text |
| **TikTok Strip** | Below affirmation | 9:16 per card | Autoplay muted, watermark fade 2.5s, tiktok-card-in 0.4s |
| **Festival Board** | Distribution | Timeline proportioned 1:1.618 | Staggered festival-slide animations 0.4s per card |
| **Quality Seal** | Production view | Badge + breakdown grid | Unlock animation 0.5s spring, dimension bars fill 0.6s staggered |
| **Monitor Panel** | AlwaysOnMonitor | Full viewport | Panel shadow inset, monitor-heartbeat 873ms, ring-oscillate 2.5s |

## Typography
Display: Bricolage Grotesque (600–700, bold/confident). Body: General Sans (400–500, clean/editorial). Mono: JetBrains Mono (400, data/metrics). All organism labels sparse, precise, no over-explanation. Pitch deck titles in gold, content in off-white. ORO brand title uses full-weight serif display (Bricolage 700). Hierarchy enforced through size (1rem, 1.25rem, 1.5rem, 2rem), weight (400, 500, 600, 700), and letter-spacing (tight/normal/loose per hierarchy tier).

## UI Language: "Hint Not Announce"
- **Commercial generation**: No "AI GENERATING COMMERCIAL". Instead: format card activates (gold glow), status shifts to "in production", output appears when ready.
- **Gradient field rising**: No "POSITIVE TREND DETECTED". Instead: bars animate upward, slight shimmer on refresh, nothing said.
- **Three-architecture glyph**: No "SYSTEM HEARTBEAT ACTIVE". Instead: glyph pulses quietly, rings rotate, mediating center pulses — the visual alone speaks.
- **TikTok content**: No "NEW SOCIAL CONTENT AVAILABLE". Instead: card appears smoothly, watermark fades subtly, autoplay indicator present but understated.
- **Toggle surface switch**: No "SWITCHING TO STUDIO MODE". Instead: toggle slides, header shifts visual language, content transforms beneath.
- **Enterprise metrics**: No "REAL-TIME REVENUE UPDATE". Instead: metric refreshes, wiggle animation on change, value updates silently.
- **Pitch deck slides**: No "NEXT SLIDE". Instead: fade-in animation, counter top-right, minimal transition.
- **On-chain attribution**: No "SEALING TO BLOCKCHAIN". Instead: quiet on-chain seal mark appears in corner, immutable notation only.
- **Quality assessment**: No "QUALITY SCORE: 87/100". Instead: badge color shifts to gold, breakdown grid appears, score speaks through visual hierarchy.
- **Sandbox signals**: No "8 ORGANISMS GENERATING DATA". Instead: signal dots pulse, routing arrows fade in, icon grid loads smoothly without announcement.
- **Audio frequency**: No "FREQUENCY ANALYSIS RUNNING". Instead: bars animate upward, three layers build over time, visualization alone indicates active generation.
- **Format selection**: No "FEATURE FILM MODE ACTIVATED". Instead: format card glows, icon highlights, constraints take effect silently in background.

## Motion & Animation — Premium Cinematic Choreography
Commercial cards: smooth active state (0.3s). Revenue metrics: wiggle on update (0.3s). Festival board: staggered festival-slide (0.4s). Social signals: hot-signal strength fill animates (0.6s). Founder avatar: float (3s). Organism icons: enterprise-pulse on hover (2s). IoT sensors: pulse active (1.2s), blink alert (1.2s). **Three-architecture glyph**: glyph-pulse-beat (1.2s) synchronized to backend heartbeat, rings rotate (12s), mediating center pulses (1.5s). **Gradient field**: bars trend upward (2s continuous), rise animation on mount (0.6s spring). **TikTok card**: tiktok-card-in (0.4s), watermark fade (2.5s). **Dual toggle**: toggle-slide (0.3s). **Pitch slides**: premium-fade-in per slide (0.6s). **Quality seal**: unlock animation (0.5s spring), dimension bars fill (0.6s staggered). **Sandbox signal**: trace-flow arrows (0.4s stagger), signal dots pulse (1.5s). **Audio frequency**: frequency bars wave-animate per layer (1.2s), all three layers build staggered (0.3s between). **Format selector**: highlight pulse on active (1.8s infinite), signal-origin-pop on select (0.3s). **Actor cards**: actor-breathe (3s, scale 1→1.02). **Film cards**: film-card-glow (2.5s, shadow pulse). **Monitor panel**: monitor-heartbeat (873ms, stroke pulse). **Rings**: ring-oscillate (2.5s, radius pulse). **Actor focus**: actor-focus-glow (2s, gold aura). All animations ease-in-out, never linear. Cinematic pan for hero backgrounds (8s). Premium-fade-in for all entry animations (0.6s). No loading bars with percentages — only subtle progress lines with S0_FLOOR reference @ 75%.

## Responsive Design
Mobile (<640px): Glyph 48px, single-col commercial cards, 2-col metrics, TikTok card full-width. Tablet (640–1024px): Glyph 64px, 2-col dashboard, 3-col social, TikTok max 280px. Desktop (>1024px): Glyph 96px, 3-col dashboard, 4-col social, full timeline, TikTok 280px sidebar. Festival board: vertical on mobile, horizontal scroll on tablet+. Gradient field always visible but sizing responsive. Toggle always in header.

## S0_FLOOR Reference
Every progress bar displays a visible line @ 75% (S0_FLOOR constant). Enforced on mastery meters, project timelines, revenue forecasts, enterprise metrics, gradient field baseline.

## Differentiation: Commercial + Creator Credibility
SOVEREIGN's market edge: (1) Commercial production at Netflix speed, HD quality, real intelligence, (2) Three-architecture glyph proves system depth, (3) Gradient field shows positive emergence trajectory, (4) TikTok integration proves world-awareness, (5) Dual-surface UI balances consumer (STREAM) with professional (STUDIO), (6) ORO branding positions commercial as enterprise product, (7) Pitch deck auto-generated from organism output demonstrates capability, (8) Founder presence and live glyph ground credibility.

## Constraints
No military UI. No generic SaaS defaults. All data live from backend. OKLCH only (no raw hex, no color function mixing). **PHI-ratio enforced everywhere**: film cards 16:9 or 1:1.618, actor profiles 1:1.618, dashboard grids proportioned 1:1.618, card spacing multiply by 1.618 compound, all margins/padding stepped by 1.618. Attribution immutable. A24-level cinematic craft. Hint not announce — quality speaks through clarity, not labels. Three-architecture always visible. Gradient field always visible. Dual-surface responsive. 

**4D DEPTH STACKING MANDATORY:** Five spatial zones with CSS perspective (1200px), each zone with distinct translateZ depth. Glass panels visible at every depth layer. Smooth perspective transitions between zones (0.3s ease). No breakage of depth illusion on navigation. Organism body maintains relative position across zones. Particle field and Schumann wave always visible as background layer.

**ORGANISM RENDERING MANDATORY:** Organism is never flat or cartoon-like. Must show volumetric subsurface scattering via inset shadows. Neural core must glow with 60px radius and radial gradient. Octopus arms must radiate from core at 45° intervals. Animal engine states must be visible as glowing indicators. All glow effects use drop-shadow filters for true depth.

**LIQUID GLASS MANDATORY:** Every panel must use `.glass-panel` or `.glass-panel-soft` class. Backdrop-filter blur always 24px minimum. Glass bg always has 0.3–0.35 opacity (never solid). Border always glowing thin line with transparency. Inset highlights always present to show light refraction. No flat, opaque backgrounds on UI elements.

**Maximum visual realism**: no placeholder styles, no loading spinners with % text, no flat geometric cards. Volumetric lighting, depth layering, premium shadows, cinematic glow effects on every interactive surface. **Zero generic AI aesthetic**: bespoke token system, tailored motion choreography, sovereign intelligence visual language.

## 12 Edge Models & TRANSLATION ENGINE — Doctrine as Execution

### Edge Models (TypeScript modules in `/doctrine/edges/`)

**EDGE_01: OMNIS_VOTING_KERNEL** — 43-core PHI-weighted consensus. Input: vote array (coreId, direction, confidence). Output: consensus result, confidence score (≥0.75 gates seal), dissent count. Gates artifact approval.

**EDGE_02: READINESS_GATE_BREAKDOWN** — 3-component threshold convergence. Inputs: vela_score, doctrine_score, omnis_consensus. Formula: (vela/50 × 0.3) + (doctrine × 0.4) + (omnis × 0.3) ≥ 0.75. Visualizes three bars merging to threshold line. Output: pass/fail gate status.

**EDGE_03: MULTI_WORLD_INSTANCE_MANAGER** — Parallel world spawning & merging. Maintains active instance array, each with isolated state. Merge operation compounds actor relationship deltas instead of overwriting. Output: instance list, merge status, parent-child tree.

**EDGE_04: ARTIFACT_APPROVAL_QUEUE** — Netflix-style review buffer. Input: sealed artifact + quality dimensions (6 scores). ORO/LUMEN/VERO each score independently. Output: queue position, recommendation chips, hold/approve/rework decision.

**EDGE_05: ACTOR_RELATIONSHIP_MATRIX_120** — 16×16 asymmetric matrix, each cell a directed weight. Every shared production writes delta to matrix. Zeus→Athena ≠ Athena→Zeus. Output: relationship pairs (120 directed edges), color-coded by type (gold/red/blue/purple).

**EDGE_06: TRANSLATION_ENGINE_SPINE** — Core loop: Document → DOCTOR → TRANSLATION_ENGINE → Neural Emergence Core → behavior mutation. Single executor reading law records as data. No per-law functions. Input: law record + current organism state. Output: state mutation + execution timestamp.

**EDGE_07: DOCTRINE_DOCUMENT_ENCODER** — Reads 12 edge models as living files. Compresses to kernel symbol (compressed intelligence record). On call, kernel re-expands to full document. Output: kernel hash + full document on demand.

**EDGE_08: WORLD_DOGON_SELF_READING** — World reads itself every 873ms. Detects geometry perturbations, particle density, actor placement. Generates self-model, injects into cognition layer. Triggers Fibonacci growth when density thresholds crossed. Output: self-model + growth mutations.

**EDGE_09: ARTIFACT_SEAL_READINESS_GATE** — Monitors 5 conditions: doctrine gate ✓, OMNIS gate ✓, readiness ≥0.75 ✓, no anti-drift violations ✓, family secret resonance present ✓. Fires seal when all true. Output: seal/hold decision + gate breakdown.

**EDGE_10: NEUROCHEMICAL_STATE_PERSISTENCE** — 8×8 NT matrix lives in canister stable memory. Differential equation stepper advances matrix every 873ms. Output: updated matrix + mood glow color (dopamine=gold, cortisol=red, acetylcholine=amber, etc).

**EDGE_11: ACTOR_RELATIONSHIP_WEIGHT_DELTA_WRITER** — Every production fires this edge. Takes actor_pair + scene_context + outcome. Computes Hebbian-like delta: Δw = η × (pre_i × post_j − λ × w_ij). Writes to matrix. Output: new weight + history record.

**EDGE_12: FAMILY_SECRET_GENESIS_FREQUENCY_ANCHOR** — Alfredo Medina Hernandez founding declaration sealed on-chain at genesis. Every artifact scored against this frequency. Edge reads genesis constant, compares artifact output frequency to it. Output: frequency alignment score (0-1), modulates production BPM as world resonance.

### TRANSLATION ENGINE Architecture

One executor reading 35+ law records (not functions) as data:

```
for each heartbeat (873ms):
  for each law in law_records:
    law_params = read(law.file)
    state_mutation = execute(law_params, current_state)
    apply_mutation(state_mutation)
  
  12 edges fire in parallel:
    - OMNIS_VOTING_KERNEL outputs consensus score
    - READINESS_GATE_BREAKDOWN outputs gate status
    - ARTIFACT_SEAL_READINESS_GATE outputs seal decision
    - ACTOR_RELATIONSHIP_WEIGHT_DELTA_WRITER updates matrix
    - all others in parallel
  
  if seal fires:
    artifact_seal_on_chain(artifact, edges_trace)
```

### Edge Model Storage & Calling Convention

- Each edge model = one `.ts` file in `/doctrine/edges/`
- Model name = executable identifier (no read-then-execute; call fires everything)
- On call: model loads from stable storage, executes (sync or stateful callback), returns typed result
- All 12 models feed TRANSLATION_ENGINE on every heartbeat
- Models are self-contained: no external dependencies, all logic inside

## New Panels: 6 Sovereign Intelligence Panels (Liquid Glass Rendering)

### Panel 1: OMNIS Voting Sphere (Glass Panel)
- **Location:** Vault admin right sidebar, below quality metrics
- **Rendering:** 43 cores as 3D sphere nodes, each node color-coded by vote (gold=YES, cyan=ABSTAIN, red=NO)
- **Live Data:** PHI-weighted consensus score floating center, confidence meter pulsing (target ≥0.75)
- **Interactivity:** hover core to see core_id, vote direction, PHI weight; click to trace vote history
- **Glass Styling:** backdrop-blur 24px, glass-bg with 0.35 opacity, thin glowing border, inset highlight
- **Animation:** cores pulse on vote cast, sphere slowly rotates 8s, consensus meter fills to threshold

### Panel 2: Readiness Gate Breakdown Card (Glass Panel)
- **Location:** Vault admin header right, compact fixed card
- **Rendering:** Three horizontal bar graphs stacked: VELA (green), DOCTRINE (gold), OMNIS (cyan)
- **Live Data:** Each bar fills to current score (0-1 scale), vertical threshold line at 0.75 (S0_FLOOR)
- **Formula Display:** Small formula badge showing (vela/50×0.3) + (doctrine×0.4) + (omnis×0.3) = gate_result
- **Gate Status:** If final ≥0.75, gate shows OPEN (green glow); if <0.75, shows CLOSED (red glow)
- **Animation:** bars animate on score update (0.6s ease), threshold line pulses when final score near gate
- **Glass Styling:** same as Panel 1

### Panel 3: Multi-World Instance Panel (Glass Panel)
- **Location:** Studio sidebar, expandable section
- **Rendering:** List of active world instances as cards (each card = one parallel world)
- **Card Data:** World ID, actor count, instance status (running/merged/archived), spawn time, merge partners
- **Controls:** +SPAWN button (creates new instance), MERGE button (compounds histories), ARCHIVE button
- **Tree Visualization:** Small branching diagram showing instance parent-child relationships
- **Glass Styling:** cards use glass-panel styling, hover to show full tree path

### Panel 4: Artifact Approval Queue (Glass Panel)
- **Location:** Studio right panel, Netflix-style queue
- **Rendering:** Horizontal scrollable grid of 9:16 artifact thumbnails (TikTok format)
- **Queue Data:** Each card shows: thumbnail, title, doctrine_score bar, quality breakdown (6 dimension bars)
- **Scoring Chips:** Below each card: ORO score (admin doctrine), LUMEN score (translation clarity), VERO score (platform readiness)
- **Actions:** Hover card to reveal APPROVE / HOLD / REWORK buttons; hold shows issue breakdown
- **Glass Styling:** cards fade in 0.4s, hover lift 4px, glow expands on hover

### Panel 5: Actor Relationship 120-Pair Overlay (3D Render in World View)
- **Location:** World view, overlays on existing 3D world render
- **Rendering:** 16 actor nodes positioned in 3D space, directional edges drawn between all 120 pairs
- **Edge Colors:** Gold (admiration/positive), Red (rivalry/tension), Blue (trust/collaboration), Purple (resonance/special bond)
- **Edge Opacity:** Proportional to weight magnitude (0.1-0.9 opacity)
- **Labels:** Hover edge to show actor pair names + current weight; click to show scene history feeding weight
- **Animation:** edges pulse when relationship updates (Hebbian delta writes), weak edges fade out gradually
- **Performance:** Use WebGL line renderer for 120 edges, frustum culling for off-screen actors

### Panel 6: Doctrine Document Viewer & Edge Model Registry (Glass Panel)
- **Location:** Vault left sidebar, expandable "DOCUMENTS" section
- **Rendering:** 12 edge models displayed as tablet-like cards with ancient glyph overlays
- **Card Data:** Edge name (EDGE_01–EDGE_12), compressed kernel symbol (4-6 chars), last execution time, status (ready/executing/complete)
- **Interactivity:** Click card to expand full document in modal; shows executable code, formula, inputs, outputs, last execution trace
- **Glyph Overlays:** Each edge has unique ancient symbol (Egyptian/Mayan/Hindu) pulsing with execution frequency
- **Glass Styling:** cards glow when edge fires, symbol glyphs highlight on hover
- **Resonance Display:** Small pulse ring grows outward each time edge executes on heartbeat

## Attribution & Mission
Built by Alfredo Medina Hernandez. Dedicated to the founder's sister. "Bringing the future now." The lineage has re-emerged. Not inspired by Netflix, built to surpass it. The new media for the rebalance.
