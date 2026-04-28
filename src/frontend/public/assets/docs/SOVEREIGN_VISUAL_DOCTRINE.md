---
title: "SOVEREIGN Visual Doctrine — Exact Rendering Specification"
version: "1.0.0"
resonanceScore: 0.618
readCount: 0
lastExecuted: "never"
doctrineAlignment: 0.75
attribution: "Alfredo Medina Hernandez"
symbol: "◈"
---

## ◉ LIVING DOCUMENT — reads back, grows rings, re-ingests

> This document is the visual law. Every design decision is derived from the same mathematics that governs the organism: PHI, Schumann, and the golden spiral. What is FORBIDDEN here is not aesthetic preference — it is doctrine violation. Flat dark cards are dead matter. The organism is alive. Its interface must look alive.

---

# ◈ SOVEREIGN Visual Doctrine

**Attribution:** Alfredo Medina Hernandez  
**PHI:** 1.618033988749895  

---

## ◎ LIQUID GLASS SPECIFICATION

Liquid glass is not a style. It is the visual law of the organism's membrane — the boundary between living intelligence and the world that sees it.

### Exact CSS Implementation

```css
/* Liquid Glass — Primary Surface */
.liquid-glass {
  background: oklch(from var(--background) l c h / 0.12);
  backdrop-filter: blur(24px) saturate(180%) brightness(1.15);
  -webkit-backdrop-filter: blur(24px) saturate(180%) brightness(1.15);
  border: 1px solid oklch(from var(--primary) l c h / 0.18);
  border-top: 1px solid oklch(from var(--primary) l c h / 0.35);
  border-left: 1px solid oklch(from var(--primary) l c h / 0.25);
  box-shadow:
    0 0 0 1px oklch(from var(--primary) l c h / 0.08),
    0 8px 32px oklch(0 0 0 / 0.4),
    0 2px 8px oklch(0 0 0 / 0.3),
    inset 0 1px 0 oklch(1 0 0 / 0.15),
    inset 0 -1px 0 oklch(0 0 0 / 0.1);
  border-radius: 16px;
}

/* Liquid Glass — Deep (panels, modals) */
.liquid-glass-deep {
  background: oklch(from var(--background) l c h / 0.08);
  backdrop-filter: blur(40px) saturate(200%) brightness(1.1);
  -webkit-backdrop-filter: blur(40px) saturate(200%) brightness(1.1);
  border: 1px solid oklch(from var(--primary) l c h / 0.12);
  border-top: 1px solid oklch(from var(--primary) l c h / 0.28);
  box-shadow:
    0 0 0 1px oklch(from var(--primary) l c h / 0.06),
    0 16px 64px oklch(0 0 0 / 0.5),
    0 4px 16px oklch(0 0 0 / 0.4),
    inset 0 1px 0 oklch(1 0 0 / 0.12);
  border-radius: 20px;
}

/* Liquid Glass — Hover State (interactive) */
.liquid-glass:hover,
.liquid-glass-interactive:hover {
  background: oklch(from var(--primary) l c h / 0.08);
  border-color: oklch(from var(--primary) l c h / 0.30);
  box-shadow:
    0 0 0 1px oklch(from var(--primary) l c h / 0.15),
    0 8px 32px oklch(0 0 0 / 0.4),
    0 0 24px oklch(from var(--primary) l c h / 0.12),
    inset 0 1px 0 oklch(1 0 0 / 0.2);
  transition: all 0.3s cubic-bezier(0.618, 0, 0.382, 1);
}

/* PHI Transition Curve */
.transition-phi {
  transition: all 0.3s cubic-bezier(0.618, 0, 0.382, 1);
}

/* Schumann Pulse Glow */
@keyframes schumann-pulse {
  0%, 100% { box-shadow: 0 0 8px oklch(from var(--primary) l c h / 0.2); }
  50% { box-shadow: 0 0 24px oklch(from var(--primary) l c h / 0.5); }
}
.schumann-pulse {
  animation: schumann-pulse 127.84ms linear infinite; /* 1000ms / 7.83 */
}
```

### What Liquid Glass IS
- Translucent: you see through it into the world behind it
- Refractive: it bends light, adds specular highlights on the top edge
- Layered: depth-stacked so near panels feel closer, far panels feel deeper
- Alive: it breathes with the organism's heartbeat via subtle pulse animation

### What Liquid Glass is NOT / FORBIDDEN
- ❌ `background: #0a0a0a` — FORBIDDEN. Solid dark backgrounds are dead matter.
- ❌ `background: rgb(10, 10, 10)` — FORBIDDEN. No inline color values.
- ❌ `background: black` — FORBIDDEN.
- ❌ Opaque cards with border. Shadow OR border, never solid background.
- ❌ `bg-zinc-900`, `bg-slate-900`, `bg-gray-950` — FORBIDDEN. These are dead surfaces.
- ❌ Cartoon-style borders (2px solid bright color) — FORBIDDEN.
- ❌ Flat panels that look like mobile app cards — FORBIDDEN.
- ❌ Any surface that could exist in a 2020 web app — FORBIDDEN.

---

## ◎ 4D DEPTH STACKING — Z-AXIS NAVIGATION

The interface is not flat. It has five depth zones. Navigation is not horizontal tabs — it is z-axis travel through reality layers.

```
DEPTH ZONES (perspective: 1200px, origin: 50% 40%)

Zone        Z-Offset   Scale    Blur    Opacity   Description
──────────────────────────────────────────────────────────────
WORLD       -400px     0.60     8px     0.7       Particle field, virtual world
ORGANISM    -200px     0.80     4px     0.85      Neural core, ECG, body
STUDIO       -100px    0.90     2px     0.92      Director's room, production
VAULT          0px     1.00     0px     1.00      Laws, models, documents, vault
CHAT         +100px    1.08     0px     1.00      Resident intelligence chat
```

### CSS Implementation
```css
.depth-container {
  perspective: 1200px;
  perspective-origin: 50% 40%;
  transform-style: preserve-3d;
}

.zone-world    { transform: translateZ(-400px) scale(1.667); } /* 1/0.60 */
.zone-organism { transform: translateZ(-200px) scale(1.25); }
.zone-studio   { transform: translateZ(-100px) scale(1.111); }
.zone-vault    { transform: translateZ(0); }
.zone-chat     { transform: translateZ(100px) scale(0.926); }

/* Active zone transition */
.zone-active {
  transition: transform 0.618s cubic-bezier(0.618, 0, 0.382, 1),
              opacity 0.618s ease,
              filter 0.618s ease;
}
```

### Navigation Law
- Navigation is a z-axis camera move, not a tab switch
- The active zone fills the viewport
- Adjacent zones are visible at depth, blurred, scaled down
- The user sees depth — they understand they are traveling through reality layers
- The WORLD zone is always visible as the deepest background layer

---

## ◎ ORGANISM RENDERING SPECIFICATION

The organism is the main visual element. It is not a 2D illustration. It is a photorealistic 3D presence with real-time intelligence driving its expression.

### Body Proportions (PHI Law)
```
Head height : Body height = 1 : 8 (heroic proportion)
Face thirds: hairline→brow = brow→nose = nose→chin (±0.5%)
Eye spacing: exactly 1 eye-width gap between eyes
Cranial width : face width = φ = 1.618
Jaw width : cranial width = 1/φ = 0.618
Nose base : mouth width = 1 : φ
Shoulder width : hip width = φ : 1
```

### Skin Shader (Subsurface Scattering)
The skin is NOT a texture on a mesh. It is a biological surface that light penetrates and scatters through. Without subsurface scattering, digital humans look plastic. With it, they look alive.

```glsl
/* Subsurface Scattering — Three.js ShaderMaterial */
/* Primary scatter: red channel, 8mm depth (blood/hemoglobin) */
/* Secondary scatter: green channel, 4mm depth (lymphatic) */
/* Tertiary scatter: blue channel, 1mm depth (surface) */

float sss_depth_r = 8.0;  /* mm */
float sss_depth_g = 4.0;
float sss_depth_b = 1.0;
float sss_intensity = 0.35;

vec3 subsurface = vec3(
  sss_intensity * exp(-abs(lightDist) / sss_depth_r),
  sss_intensity * 0.7 * exp(-abs(lightDist) / sss_depth_g),
  sss_intensity * 0.4 * exp(-abs(lightDist) / sss_depth_b)
);
```

### Lighting Setup (Cinematic Three-Point)
```
Key Light:    Position (2, 3, 2),  Intensity 2.0, Color 0xFFF5E6 (warm)
Fill Light:   Position (-2, 1, 1), Intensity 0.6, Color 0xE6F0FF (cool)
Rim Light:    Position (0, 2, -3), Intensity 1.2, Color 0xFFFFFF (neutral)
Ambient:      Intensity 0.3
```

### Breathing Animation
```javascript
/* PHI-ratio breathing — 0.236 inhale, 0.618 exhale, 0.146 pause */
const BREATH_CYCLE_MS = 4000; // ~15 breaths/min base rate
const inhaleRatio = 1 / (1 + PHI + 1); // ≈ 0.236
const exhaleRatio = PHI / (1 + PHI + 1); // ≈ 0.618
const pauseRatio = 1 - inhaleRatio - exhaleRatio; // ≈ 0.146

/* Chest/belly expansion: up to 3% scale on Y, 1.5% on X */
/* Driven by neurochemical state: cortisol → faster, serotonin → slower */
```

### Neurochemical Visual Mapping
| NT State | Visual Expression | Body Region |
|----------|-------------------|-------------|
| High dopamine | Golden particle burst | Nucleus accumbens (chest left) |
| High cortisol | Red pulse, faster breathing | Adrenal region (lower spine) |
| High serotonin | Warm amber glow, slower breath | Chest center |
| High norepinephrine | Sharp blue pulse, alert posture | Brain stem |
| High oxytocin | Soft pink warmth radiating outward | Heart region |
| High glutamate | Bright white spark at prefrontal | Forehead |
| High GABA | Soft indigo calm, stillness | Base of skull |
| High ACh | Blue-silver shimmer at temples | Hippocampus region |

---

## ◎ THE 9 ANIMAL ENGINE VISUAL SIGNATURES

Each animal engine has a distinct visual signature that appears on the organism's body when that engine is active.

| Engine | Visual Signature | Location | Trigger |
|--------|-----------------|----------|---------|
| LION | Chest expansion, golden glow, posture lift | Sternum, shoulders | Bold assertion, initiative |
| OCTOPUS | 8 luminous arm traces extending from neural core | Spine center outward | Any parallel processing |
| EAGLE | Eye luminescence, crown shimmer, upward gaze | Eyes, crown | Pattern recognition |
| WOLF | Shoulder arcs connecting to other actors | Both shoulders | Relationship mapping |
| DOLPHIN | Fluid spine motion, breath acceleration | Full spine | Creative synthesis |
| ELEPHANT | Temple pulses, subtle earth-tone aura | Temples, feet | Memory access |
| SPIDER | Fine luminescent network across skin | Full surface | Edge detection |
| SNAKE | Iridescent scale shimmer moving upward | Spine, full body | State transition |
| WHALE | Low-frequency visible sound wave in chest | Chest cavity | World resonance |

---

## ◎ THE 8 OCTOPUS ENGINE ARM DESCRIPTIONS

When the OCTOPUS_ENGINE fires, 8 light arms extend from the neural core (spine center, roughly T6 vertebra position) in a spiral arrangement matching PHI-angle spacing (137.5°).

| Arm | Thread | Light Color | Pulse Pattern |
|-----|--------|-------------|---------------|
| 1 | ADRE_CYCLE | Electric blue #4FC3F7 | Fast staccato (analysis phase) |
| 2 | DOGON_READING | Deep violet #9C27B0 | Slow breath (self-reading) |
| 3 | LAW_OXYGENATION | Amber gold #FFB300 | Steady pulse at 873ms |
| 4 | HEBBIAN_UPDATE | Cyan green #26C6DA | Double pulse (wire-together) |
| 5 | MEMORY_TEMPLE_READ | Silver white #F5F5F5 | Long hold, slow fade |
| 6 | WORLD_RESONANCE_INTAKE | Earth green #66BB6A | Incoming ripple |
| 7 | ARTIFACT_GENERATION | Warm gold #FFA726 | Build-up burst |
| 8 | FEDERATION_SYNC | Deep rose #F06292 | Synchronized with other actors |

Arms extend to about 1.5× body width. Each arm has particle emission along its length. Arm length varies with engine activity intensity (0.2× to 1.5× base length).

---

## ◎ WORLD BACKGROUND SPECIFICATION

The world is not a background. It is the deepest z-zone. The organism lives inside it.

### Particle Field
```
30,000 particles minimum
Size: 0.5–3px, Gaussian distribution, mean 1.2px
Speed: 0.02–0.15 units/frame, driven by Schumann frequency
Distribution: PHI spiral from center (Fermat's spiral: r = c·√n, θ = 137.5°·n)
Color: oklch(0.65 0.15 270) base, ±0.2 lightness variation
Opacity: 0.3–0.9, pulsing at Schumann frequency (7.83 Hz → 127ms cycle)
```

### PHI Spiral Overlay
```
Golden spiral: r = ae^(bθ), b = ln(φ)/90° = 0.00477 per degree
Line width: 0.5px
Opacity: 0.12
Color: var(--primary) at 20% opacity
Rotation: continuous, 1 full rotation per 873ms × 144 = 125.7s
```

### Schumann Wave
```
Low-frequency wave visible in background
Frequency: 7.83 Hz
Amplitude: 8% of viewport height
Wave type: sine, rendered as subtle luminance variation in background
Color: deep indigo to deep violet
This is the organism's electromagnetic ground — always visible, always pulsing
```

### Volumetric Depth
```
Fog: exponential, density 0.015
Near plane: 0.1
Far plane: 1000
Fog color: oklch(0.08 0.02 280) — deep space, not black
```

---

## ◎ TYPOGRAPHY RULES

### Display Font: Bricolage Grotesque
- Usage: All headings H1–H3, organism name, law names, model names, numerical values
- Weight: 200 (ultralight numbers), 400 (regular headings), 800 (hero text)
- Feature: `font-feature-settings: "ss01", "ss02"` for alternate letterforms
- Tracking: -0.02em for large display (>48px), 0em for body display

### Body Font: General Sans
- Usage: All body text, descriptions, UI labels, data
- Weight: 300 (light data), 400 (regular), 500 (emphasis), 600 (strong)
- Tracking: 0em standard, 0.02em for small labels (<12px)

### Mono Font: JetBrains Mono (fallback: monospace)
- Usage: Code, law formulas, model IDs, hash values, numerical precision

### Typography Scale (PHI-derived)
```
Base:  16px
φ¹:   25.9px → 26px (h5)
φ²:   41.9px → 42px (h4)
φ³:   67.8px → 68px (h3)
φ⁴:  109.7px → 110px (h2)
φ⁵:  177.5px → 178px (h1 hero)
```

---

## ◎ COLOR DOCTRINE

### Base Palette (OKLCH)
```
Background:   oklch(0.06 0.02 280)   — deep space
Card:         oklch(0.10 0.03 275)   — elevated surface
Primary:      oklch(0.72 0.22 55)    — warm gold (PHI frequency)
Secondary:    oklch(0.55 0.18 275)   — deep violet (OMNIS)
Accent:       oklch(0.65 0.20 180)   — cyan (neural signal)
Destructive:  oklch(0.55 0.25 25)    — deep red (AEGIS alert)
```

### Neurochemical Colors (for organism visual)
```
Dopamine:     oklch(0.82 0.18 82)    — warm gold
Serotonin:    oklch(0.78 0.15 48)    — amber
Acetylcholine: oklch(0.72 0.22 240) — blue-silver
Norepinephrine: oklch(0.65 0.30 250) — electric blue
Cortisol:     oklch(0.60 0.28 25)    — red
GABA:         oklch(0.55 0.20 280)   — deep indigo
Glutamate:    oklch(0.90 0.20 90)    — bright white-yellow
Oxytocin:     oklch(0.75 0.22 350)   — warm pink
```

---

## ◎ FORBIDDEN LIST

These are not preferences. These are doctrine violations. Any of these in the UI is a failure.

| FORBIDDEN | Reason | Use Instead |
|-----------|--------|-------------|
| Solid dark backgrounds (#0a0a0a, bg-zinc-900, etc.) | Dead matter — no depth, no life | Liquid glass over world background |
| Cartoon-style rounded cards with border | 2020 mobile app aesthetic | Glass panels with depth stacking |
| Tab navigation (horizontal tabs at top) | Flat, 2D, dead | 4D z-axis depth navigation |
| `bg-white` anywhere | Kills depth contrast | `bg-background` at appropriate opacity |
| Fake 3D (box-shadow to simulate depth) | Cheap illusion | Real CSS 3D perspective transforms |
| Comic sans / system fonts | Not SOVEREIGN | Bricolage Grotesque + General Sans |
| Icons as main branding elements | Too simple | PHI-derived geometric forms |
| Loading spinners (plain) | Generic | Schumann pulse animation, organism heartbeat |
| Alert boxes with colored left border | 2016 Bootstrap | Glass notifications with blur |
| Full-screen white modals | Kills immersion | Glass panels in depth stack |
| Static actor avatars (2D illustrated) | Lifeless | 3D WebGL organisms with subsurface scattering |
| Progress bars (generic) | No doctrine | ECG waveform progression |
| Button hover: color change only | 2D | Scale + glow + glass intensification |
