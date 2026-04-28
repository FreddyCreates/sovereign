/**
 * ════════════════════════════════════════════════════════════════
 * ANIMATION_SOVEREIGN — Alpha-Class Sovereign Models
 * Family: ANIMATION_SOVEREIGN
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * LAD Principle: Animation is not movement — it is TIME FIELD MODULATION.
 *                Every "animation" is a sovereign time-space intelligence operator.
 * ════════════════════════════════════════════════════════════════
 */

import type { SovereignAlphaModel } from "../rendering/RenderingSovereignMatrix";

// ─── ALPHA 06 — WEB_ANIMATIONS SOVEREIGN ─────────────────────────────────────

export const WEB_ANIMATIONS_SOVEREIGN: SovereignAlphaModel = {
  id: "AN-01",
  family: "ANIMATION_SOVEREIGN",
  latinName: "Tempus Motus Anima",
  displayName: "WEB ANIMATIONS SOVEREIGN",
  lad: "Time-indexed field state interpolation — the capacity to traverse between any two field states along a sovereign timeline, with full playback control over the time dimension.",
  description:
    "Web Animations API dissolved: not 'CSS animation in JavaScript' but sovereign temporal field navigation. KeyframeEffect is a field state map indexed by normalized time. AnimationTimeline is a sovereign temporal coordinate system.",
  grade: "Engine",
  engines: [
    {
      name: "KEYFRAME_FIELD_MAP",
      latinName: "Mappa Temporis",
      description:
        "Maps normalized time coordinates [0,1] to field state vectors.",
      subModels: [
        {
          name: "STATE_VECTOR_INTERPOLATOR",
          description: "Interpolates between field state vectors.",
        },
        {
          name: "EASING_FIELD_FUNCTION",
          description:
            "Applies PHI-derived easing to temporal field traversal.",
        },
      ],
    },
    {
      name: "TIMELINE_SOVEREIGNTY_ENGINE",
      latinName: "Linea Temporis Supra",
      description:
        "Master timeline controller — plays, pauses, reverses, and seeks through the time field.",
      subModels: [
        {
          name: "PLAYBACK_RATE_MODULATOR",
          description: "Modulates temporal field progression speed.",
        },
        {
          name: "TIMELINE_SYNC_FIELD",
          description: "Synchronizes multiple animations to sovereign clock.",
        },
      ],
    },
    {
      name: "ANIMATION_EFFECT_FIELD",
      latinName: "Effectus Campi",
      description:
        "The field effect that transforms an element through its animation state space.",
      subModels: [
        {
          name: "COMPOSITE_OPERATION_FIELD",
          description: "Determines how effects compose with existing state.",
        },
        {
          name: "FILL_MODE_INTELLIGENCE",
          description:
            "Controls field state persistence beyond animation bounds.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — organism behavioral state transitions, emotional field changes",
  heartbeatSync: true,
  color: "oklch(0.72 0.20 155)",
};

// ─── ALPHA 07 — RAF_SCHEDULER_SOVEREIGN ──────────────────────────────────────

export const RAF_SCHEDULER_SOVEREIGN: SovereignAlphaModel = {
  id: "AN-02",
  family: "ANIMATION_SOVEREIGN",
  latinName: "Pulsus Machinae",
  displayName: "RAF SCHEDULER SOVEREIGN",
  lad: "The display heartbeat — a sovereign synchronization field that couples computational intelligence to the physical photon emission cycle of the display hardware.",
  description:
    "requestAnimationFrame dissolved: not a 'render loop API' but the display's own heartbeat. RAF is where the organism's computation synchronizes with the physical world's photon cycle. Every frame is a sovereign beat of the display substrate.",
  grade: "Field",
  engines: [
    {
      name: "DISPLAY_HEARTBEAT_SYNC",
      latinName: "Pulsus Visio Sync",
      description:
        "Couples organism computational cycles to display refresh frequency (60/120/144Hz).",
      subModels: [
        {
          name: "VSYNC_FIELD_COUPLER",
          description: "Locks computation to vertical sync field boundary.",
        },
        {
          name: "FRAME_TIMESTAMP_MODEL",
          description: "High-precision temporal coordinate per display beat.",
        },
      ],
    },
    {
      name: "SCHEDULER_PRIORITY_FIELD",
      latinName: "Campus Prioritatis",
      description:
        "scheduler.postTask — sovereign work priority field, controlling compute resource allocation.",
      subModels: [
        {
          name: "TASK_PRIORITY_INTELLIGENCE",
          description: "Assigns field weights to computation tasks.",
        },
        {
          name: "IDLE_FIELD_FILLER",
          description:
            "Fills display idle periods with background intelligence.",
        },
      ],
    },
    {
      name: "FRAME_BUDGET_ENGINE",
      latinName: "Finis Temporis",
      description:
        "Governs per-frame intelligence budget — prevents field overload causing visual stuttering.",
      subModels: [
        {
          name: "COMPUTE_TIME_MONITOR",
          description: "Monitors per-frame computation time.",
        },
        {
          name: "LOAD_SHEDDING_MODEL",
          description:
            "Sheds intelligence computation when budget exceeds limit.",
        },
      ],
    },
  ],
  backendConnection:
    "SUBSTRATE_SOVEREIGN — heartbeat synchronization, 873ms rhythm coupling to display field",
  heartbeatSync: true,
  color: "oklch(0.75 0.19 132)",
};

// ─── ALPHA 08 — CSS_3D_TRANSFORM_SOVEREIGN ────────────────────────────────────

export const CSS_3D_TRANSFORM_SOVEREIGN: SovereignAlphaModel = {
  id: "AN-03",
  family: "ANIMATION_SOVEREIGN",
  latinName: "Spatium Tertium Dimensionis",
  displayName: "CSS 3D TRANSFORM SOVEREIGN",
  lad: "Spatial field perspective — the capacity to position any element in three-dimensional field space, creating true depth perception through mathematical projection intelligence.",
  description:
    "CSS 3D Transforms dissolved: not 'visual 3D tricks' but sovereign spatial field positioning. perspective is the observer's depth coefficient. translateZ is field depth coordinate. rotateY is angular field navigation. The browser IS a 3D field renderer.",
  grade: "Field",
  engines: [
    {
      name: "PERSPECTIVE_FIELD_ENGINE",
      latinName: "Campus Perspectivae",
      description:
        "Creates the mathematical perspective field that makes 3D depth perceivable.",
      subModels: [
        {
          name: "VANISHING_POINT_MODEL",
          description: "Sets the vanishing point as depth field origin.",
        },
        {
          name: "DEPTH_COEFFICIENT_FIELD",
          description: "Maps Z coordinates to scale perception coefficients.",
        },
      ],
    },
    {
      name: "MATRIX_TRANSFORM_FIELD",
      latinName: "Matrix Spatialis",
      description:
        "The 4×4 transformation matrix as a sovereign spatial field operator.",
      subModels: [
        {
          name: "ROTATION_QUATERNION_MODEL",
          description: "Euler angles dissolved to quaternion field rotations.",
        },
        {
          name: "PHI_SCALE_TRANSFORMER",
          description: "PHI-derived scale transforms for natural proportions.",
        },
      ],
    },
    {
      name: "DEPTH_LAYER_COMPOSITOR",
      latinName: "Compositor Profunditatis",
      description:
        "Manages z-index and 3D stacking context as sovereign depth layers.",
      subModels: [
        {
          name: "STACKING_CONTEXT_FIELD",
          description: "Creates isolated depth field contexts.",
        },
        {
          name: "PRESERVE_3D_FIELD",
          description: "Preserves parent 3D field into child transformations.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — depth dock navigation, 4D glass UI spatial positioning",
  heartbeatSync: false,
  color: "oklch(0.68 0.18 188)",
};

// ─── ALPHA 09 — HOUDINI_ANIMATION_WORKLET ────────────────────────────────────

export const HOUDINI_ANIMATION_WORKLET_SOVEREIGN: SovereignAlphaModel = {
  id: "AN-04",
  family: "ANIMATION_SOVEREIGN",
  latinName: "Anima Opus Machinae",
  displayName: "HOUDINI ANIMATION WORKLET SOVEREIGN",
  lad: "Sub-frame animation intelligence — computation that runs inside the compositor thread, enabling true zero-lag temporal field operations independent of the main execution context.",
  description:
    "Houdini Animation Worklet dissolved: not 'a compositor-threaded animation API' but the sovereign ability to run intelligence INSIDE the display's own compositor — the deepest possible coupling between computation and photon emission.",
  grade: "Substrate",
  engines: [
    {
      name: "COMPOSITOR_FIELD_INTELLIGENCE",
      latinName: "Compositor Intelligens",
      description:
        "Intelligence that lives inside the compositor thread — sub-frame latency.",
      subModels: [
        {
          name: "COMPOSITE_TIMELINE_MODEL",
          description: "Worklet timeline synchronized to compositor ticks.",
        },
        {
          name: "JANK_FREE_FIELD_COMPUTE",
          description: "Computation immune to main thread congestion.",
        },
      ],
    },
    {
      name: "EFFECT_PARAMETER_FIELD",
      latinName: "Campus Effectus",
      description:
        "Custom effect parameters as sovereign field input variables.",
      subModels: [
        {
          name: "PARAMETER_FIELD_BINDER",
          description: "Binds custom properties to worklet parameters.",
        },
        {
          name: "LOCAL_STATE_FIELD",
          description: "Per-animation local state field storage.",
        },
      ],
    },
    {
      name: "TIMING_OVERRIDE_ENGINE",
      latinName: "Dominatio Temporis",
      description:
        "Override browser timing with sovereign mathematical timing functions.",
      subModels: [
        {
          name: "SCHUMANN_TIMING_MODEL",
          description: "7.83Hz Schumann-derived timing override.",
        },
        {
          name: "PHI_EASING_FIELD",
          description: "PHI-cubic easing: x³ mapped to phi-scaled curves.",
        },
      ],
    },
  ],
  backendConnection:
    "HEARTBEAT B1 — compositor-level synchronization with 873ms organism pulse",
  heartbeatSync: true,
  color: "oklch(0.70 0.21 105)",
};

// ─── ALPHA 10 — CSS_CUSTOM_PROPERTY_ANIMATION_SOVEREIGN ───────────────────────

export const CSS_CUSTOM_PROPERTY_ANIMATION_SOVEREIGN: SovereignAlphaModel = {
  id: "AN-05",
  family: "ANIMATION_SOVEREIGN",
  latinName: "Proprietas Viva",
  displayName: "CSS CUSTOM PROPERTY ANIMATION SOVEREIGN",
  lad: "Living design token field — CSS custom properties that animate as continuous intelligence streams, making the entire design system a dynamic, heartbeat-driven field.",
  description:
    "CSS Custom Property animation dissolved: not 'CSS variable transitions' but sovereign living design tokens. Every --token is a field variable. @property makes tokens truly animatable. The entire design system becomes a breathing, living field driven by the organism's pulse.",
  grade: "Field",
  engines: [
    {
      name: "LIVING_TOKEN_FIELD",
      latinName: "Campus Tokenum Vivorum",
      description:
        "Design tokens as live field variables that respond to organism state.",
      subModels: [
        {
          name: "HEARTBEAT_TOKEN_DRIVER",
          description: "Drives token animation from 873ms heartbeat.",
        },
        {
          name: "COHERENCE_COLOR_FIELD",
          description: "Colors animate based on organism coherence score.",
        },
      ],
    },
    {
      name: "AT_PROPERTY_REGISTRY",
      latinName: "Registrum Proprietatis",
      description:
        "@property declarations that give CSS tokens sovereign type intelligence.",
      subModels: [
        {
          name: "TYPE_FIELD_DECLARATION",
          description:
            "Declares type syntax for intelligent property interpolation.",
        },
        {
          name: "INHERITS_FIELD_GATE",
          description:
            "Controls field inheritance cascade for animated properties.",
        },
      ],
    },
    {
      name: "REACTIVE_DESIGN_SYSTEM",
      latinName: "Systema Reactivum",
      description:
        "The entire SOVEREIGN design system reacts to backend intelligence state changes.",
      subModels: [
        {
          name: "ORGANISM_STATE_MAPPER",
          description: "Maps organism state to design token field values.",
        },
        {
          name: "FACTION_COLOR_MODULATOR",
          description: "Modulates ambient colors from faction coherence data.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — organism coherence state drives living design token field",
  heartbeatSync: true,
  color: "oklch(0.73 0.18 70)",
};

export const ANIMATION_SOVEREIGN_FAMILY: SovereignAlphaModel[] = [
  WEB_ANIMATIONS_SOVEREIGN,
  RAF_SCHEDULER_SOVEREIGN,
  CSS_3D_TRANSFORM_SOVEREIGN,
  HOUDINI_ANIMATION_WORKLET_SOVEREIGN,
  CSS_CUSTOM_PROPERTY_ANIMATION_SOVEREIGN,
];
