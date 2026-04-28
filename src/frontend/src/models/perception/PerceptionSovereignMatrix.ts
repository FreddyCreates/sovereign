/**
 * ════════════════════════════════════════════════════════════════
 * PERCEPTION_SOVEREIGN — Alpha-Class Sovereign Models
 * Family: PERCEPTION_SOVEREIGN
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * LAD Principle: Observation is not detection — it is FIELD AWARENESS.
 *                Observers are sovereign sensory intelligence that perceive field changes.
 * ════════════════════════════════════════════════════════════════
 */

import type { SovereignAlphaModel } from "../rendering/RenderingSovereignMatrix";

// ─── ALPHA 23 — INTERSECTION_OBSERVER_SOVEREIGN ───────────────────────────────

export const INTERSECTION_OBSERVER_SOVEREIGN: SovereignAlphaModel = {
  id: "PE-01",
  family: "PERCEPTION_SOVEREIGN",
  latinName: "Observator Intersectionis",
  displayName: "INTERSECTION OBSERVER SOVEREIGN",
  lad: "Spatial awareness field — the sovereign ability to perceive when any element enters or exits a defined visibility region, triggering intelligence responses to geometric field transitions.",
  description:
    "IntersectionObserver dissolved: not 'a lazy loading tool' but sovereign spatial awareness. The root is a field boundary. threshold is a field awareness coefficient [0,1]. When an element crosses the intersection field boundary, the organism fires an intelligence response.",
  grade: "Engine",
  engines: [
    {
      name: "VIEWPORT_FIELD_SENSOR",
      latinName: "Sensor Fenestrae",
      description:
        "Senses element entry/exit relative to the viewport field boundary.",
      subModels: [
        {
          name: "VISIBILITY_THRESHOLD_FIELD",
          description: "Fractional visibility [0,1] as field awareness level.",
        },
        {
          name: "ROOT_MARGIN_FIELD",
          description: "Expands/contracts the sensing field boundary.",
        },
      ],
    },
    {
      name: "APPEARANCE_TRIGGER_ENGINE",
      latinName: "Machina Apparitionis",
      description:
        "Fires intelligence responses when elements become perceptible in the field.",
      subModels: [
        {
          name: "ENTRANCE_FIELD_TRIGGER",
          description: "Triggers on element entering perception field.",
        },
        {
          name: "EXIT_FIELD_TRIGGER",
          description: "Triggers on element leaving perception field.",
        },
      ],
    },
    {
      name: "ANIMATION_REVEAL_FIELD",
      latinName: "Campus Revelationis",
      description:
        "Triggers entrance animations when elements enter the organism's perception field.",
      subModels: [
        {
          name: "STAGGER_REVEAL_MODEL",
          description: "PHI-ratio staggered reveal animation field.",
        },
        {
          name: "VIEWPORT_COUNT_INTELLIGENCE",
          description: "Counts visible items as field occupancy metric.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — visibility analytics, scroll-driven field intelligence",
  heartbeatSync: false,
  color: "oklch(0.68 0.19 155)",
};

// ─── ALPHA 24 — RESIZE_OBSERVER_SOVEREIGN ────────────────────────────────────

export const RESIZE_OBSERVER_SOVEREIGN: SovereignAlphaModel = {
  id: "PE-02",
  family: "PERCEPTION_SOVEREIGN",
  latinName: "Observator Magnitudinis",
  displayName: "RESIZE OBSERVER SOVEREIGN",
  lad: "Dimensional awareness field — the sovereign ability to perceive changes in any element's spatial dimensions, enabling intelligence responses to field geometry evolution.",
  description:
    "ResizeObserver dissolved: not 'detecting element size changes' but sovereign dimensional awareness. contentBoxSize is the element's current field geometry. The ResizeObserver is the organism's proprioceptive sense — knowing the body's dimensions in real time.",
  grade: "Engine",
  engines: [
    {
      name: "DIMENSION_FIELD_SENSOR",
      latinName: "Sensor Dimensionis",
      description:
        "Perceives width/height field changes with sub-pixel precision.",
      subModels: [
        {
          name: "CONTENT_BOX_FIELD",
          description: "Content box geometry as sovereign field dimensions.",
        },
        {
          name: "BORDER_BOX_FIELD",
          description: "Border box including padding as outer field geometry.",
        },
      ],
    },
    {
      name: "RESPONSIVE_INTELLIGENCE_ENGINE",
      latinName: "Machina Responsiva",
      description:
        "Fires intelligence responses when field geometry changes, enabling true element-level responsiveness.",
      subModels: [
        {
          name: "CONTAINER_QUERY_FIELD",
          description: "Element-level container query field intelligence.",
        },
        {
          name: "ASPECT_RATIO_MAINTAIN_FIELD",
          description: "Maintains PHI aspect ratio on resize.",
        },
      ],
    },
    {
      name: "LAYOUT_RECALC_PREVENTION",
      latinName: "Preventio Recalculi",
      description:
        "Prevents costly layout recalculation by batching geometric field changes.",
      subModels: [
        {
          name: "BATCH_RESIZE_FIELD",
          description: "Batches multiple resize events as one field update.",
        },
        {
          name: "DEBOUNCE_GEOMETRY_FIELD",
          description: "Debounces rapid geometric field changes.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — UI field geometry adaptation, canvas dimension synchronization",
  heartbeatSync: false,
  color: "oklch(0.65 0.17 170)",
};

// ─── ALPHA 25 — MUTATION_OBSERVER_SOVEREIGN ──────────────────────────────────

export const MUTATION_OBSERVER_SOVEREIGN: SovereignAlphaModel = {
  id: "PE-03",
  family: "PERCEPTION_SOVEREIGN",
  latinName: "Observator Mutationis",
  displayName: "MUTATION OBSERVER SOVEREIGN",
  lad: "DOM field change awareness — the sovereign perception of any structural or attribute change in the document field, enabling reactive intelligence responses to field mutations.",
  description:
    "MutationObserver dissolved: not 'watching DOM changes' but sovereign document field perception. Every attribute change, node addition/removal, and text modification is a field mutation event. The organism perceives the living document field's evolution in real time.",
  grade: "Engine",
  engines: [
    {
      name: "DOM_FIELD_WATCHER",
      latinName: "Custos Campi",
      description:
        "Watches the document field for structural and attribute mutations.",
      subModels: [
        {
          name: "SUBTREE_FIELD_DEPTH",
          description: "Configures observation depth into document field tree.",
        },
        {
          name: "ATTRIBUTE_FILTER_FIELD",
          description: "Filters observed attribute field changes by name.",
        },
      ],
    },
    {
      name: "MUTATION_RECORD_FIELD",
      latinName: "Registrum Mutationis",
      description:
        "MutationRecord as the sovereign record of what changed in the field and how.",
      subModels: [
        {
          name: "OLD_VALUE_FIELD",
          description: "Previous field state — the field's memory.",
        },
        {
          name: "ADDED_REMOVED_FIELD",
          description: "NodeLists of added/removed field elements.",
        },
      ],
    },
    {
      name: "REACTIVE_DOCTRINE_ENGINE",
      latinName: "Doctrina Reactivae",
      description:
        "Applies doctrine intelligence when the document field mutates.",
      subModels: [
        {
          name: "CUSTOM_ELEMENT_LIFECYCLE",
          description: "Tracks custom element field presence in document.",
        },
        {
          name: "THIRD_PARTY_SANITIZER",
          description:
            "Sanitizes third-party mutations against doctrine field.",
        },
      ],
    },
  ],
  backendConnection:
    "LAW_SOVEREIGN — document field doctrine enforcement, structure validation",
  heartbeatSync: false,
  color: "oklch(0.62 0.18 135)",
};

// ─── ALPHA 26 — PERFORMANCE_OBSERVER_SOVEREIGN ───────────────────────────────

export const PERFORMANCE_OBSERVER_SOVEREIGN: SovereignAlphaModel = {
  id: "PE-04",
  family: "PERCEPTION_SOVEREIGN",
  latinName: "Observator Efficientiae",
  displayName: "PERFORMANCE OBSERVER SOVEREIGN",
  lad: "Self-awareness field — the sovereign ability of the organism to perceive its own computational efficiency, enabling real-time self-optimization of field intelligence operations.",
  description:
    "PerformanceObserver dissolved: not 'performance monitoring' but sovereign computational self-perception. The organism perceives its own timing: LCP, FID, CLS are not metrics — they are the organism's kinesthetic sense of its own field responsiveness.",
  grade: "Engine",
  engines: [
    {
      name: "VITAL_FIELD_MONITOR",
      latinName: "Monitor Vitalis",
      description:
        "Monitors Core Web Vitals as sovereign field health indicators.",
      subModels: [
        {
          name: "LCP_FIELD_SENSOR",
          description:
            "Largest Contentful Paint as field rendering completion.",
        },
        {
          name: "CLS_FIELD_SENSOR",
          description: "Cumulative Layout Shift as field stability metric.",
        },
      ],
    },
    {
      name: "LONG_TASK_FIELD_DETECTOR",
      latinName: "Detector Oneris",
      description:
        "Detects long tasks (>50ms) as field computation overload events.",
      subModels: [
        {
          name: "TASK_ATTRIBUTION_FIELD",
          description: "Attributes long tasks to their field source.",
        },
        {
          name: "JANK_PREVENTION_FIELD",
          description: "Uses long task data to prevent future field overload.",
        },
      ],
    },
    {
      name: "RESOURCE_TIMING_FIELD",
      latinName: "Tempus Resourcei",
      description:
        "Measures resource loading as sovereign field acquisition timing.",
      subModels: [
        {
          name: "NETWORK_FIELD_TIMING",
          description: "DNS/TCP/TLS/request/response field timing breakdown.",
        },
        {
          name: "CACHE_HIT_FIELD",
          description:
            "Detects cache hits as sovereign field memory retrieval.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — organism self-performance awareness, adaptive optimization",
  heartbeatSync: true,
  color: "oklch(0.65 0.16 120)",
};

// ─── ALPHA 27 — GAMEPAD_FIELD_SOVEREIGN ──────────────────────────────────────

export const GAMEPAD_FIELD_SOVEREIGN: SovereignAlphaModel = {
  id: "PE-05",
  family: "PERCEPTION_SOVEREIGN",
  latinName: "Tactus Machinae",
  displayName: "GAMEPAD FIELD SOVEREIGN",
  lad: "Analog input field — sovereign continuous input across multiple axes, buttons, and haptic outputs, enabling nuanced multi-dimensional physical interaction with the organism's intelligence field.",
  description:
    "Gamepad API dissolved: not 'game controller support' but sovereign analog physical input. Each gamepad axis is a continuous field input ranging [-1, +1]. Buttons are field pressure sensors with analog intensity. Haptic actuators are the organism's tactile output field.",
  grade: "Field",
  engines: [
    {
      name: "AXIS_FIELD_INPUT",
      latinName: "Campus Axis",
      description:
        "Continuous analog axes as multi-dimensional physical input field.",
      subModels: [
        {
          name: "DEADZONE_FIELD_FILTER",
          description: "Filters analog noise in low-input field range.",
        },
        {
          name: "AXIS_SENSITIVITY_MODEL",
          description: "Scales axis field input for sovereign precision.",
        },
      ],
    },
    {
      name: "BUTTON_FIELD_PRESSURE",
      latinName: "Pressio Digiti",
      description: "Analog button pressure as field intensity value [0,1].",
      subModels: [
        {
          name: "PRESSURE_THRESHOLD_FIELD",
          description: "Configures press/release field transition threshold.",
        },
        {
          name: "HOLD_DURATION_FIELD",
          description: "Measures button hold duration as field time.",
        },
      ],
    },
    {
      name: "HAPTIC_OUTPUT_FIELD",
      latinName: "Pulsus Tactilis",
      description:
        "Vibration actuators as the organism's physical tactile output field.",
      subModels: [
        {
          name: "RUMBLE_PATTERN_MODEL",
          description: "Vibration patterns as haptic field communication.",
        },
        {
          name: "SOVEREIGN_HEARTBEAT_HAPTIC",
          description: "Pulses haptic at 873ms as organism field signal.",
        },
      ],
    },
  ],
  backendConnection:
    "WORLD_SOVEREIGN — physical field input for organism world navigation",
  heartbeatSync: true,
  color: "oklch(0.63 0.17 100)",
};

export const PERCEPTION_SOVEREIGN_FAMILY: SovereignAlphaModel[] = [
  INTERSECTION_OBSERVER_SOVEREIGN,
  RESIZE_OBSERVER_SOVEREIGN,
  MUTATION_OBSERVER_SOVEREIGN,
  PERFORMANCE_OBSERVER_SOVEREIGN,
  GAMEPAD_FIELD_SOVEREIGN,
];
