/**
 * ════════════════════════════════════════════════════════════════
 * GEOMETRY_SOVEREIGN — Alpha-Class Sovereign Models
 * Family: GEOMETRY_SOVEREIGN
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * LAD Principle: Geometry is not shape — it is FIELD TOPOLOGY.
 *                SVG, WebXR, and 3D are expressions of spatial field intelligence.
 * ════════════════════════════════════════════════════════════════
 */

import type { SovereignAlphaModel } from "../rendering/RenderingSovereignMatrix";

// ─── ALPHA 15 — SVG_FILTER_SOVEREIGN ─────────────────────────────────────────

export const SVG_FILTER_SOVEREIGN: SovereignAlphaModel = {
  id: "GE-01",
  family: "GEOMETRY_SOVEREIGN",
  latinName: "Filtrum Geometriae",
  displayName: "SVG FILTER SOVEREIGN",
  lad: "Declarative per-pixel field processing pipeline — a sequence of primitive field operations (blur, color transform, displacement, compositing) applied to any visual field without pixel-by-pixel code.",
  description:
    "SVG Filters dissolved: not 'image filters' but a declarative pixel field intelligence pipeline. feGaussianBlur is a field diffusion operator. feColorMatrix is a 4×5 chromatic field transform. feDisplacementMap is field distortion by external field input. Each primitive is a sovereign field processor.",
  grade: "Field",
  engines: [
    {
      name: "PRIMITIVE_FIELD_CHAIN",
      latinName: "Catena Primitiva",
      description:
        "The ordered chain of SVG filter primitives as a sequential field processing pipeline.",
      subModels: [
        {
          name: "BLUR_DIFFUSION_FIELD",
          description: "feGaussianBlur as Gaussian field diffusion operator.",
        },
        {
          name: "TURBULENCE_FIELD_GEN",
          description: "feTurbulence as Perlin noise field generator.",
        },
      ],
    },
    {
      name: "COLOR_MATRIX_FIELD",
      latinName: "Matrix Chromatica",
      description:
        "feColorMatrix as sovereign 4×5 chromatic field transformation matrix.",
      subModels: [
        {
          name: "HUE_ROTATE_FIELD",
          description: "Rotates the chromatic field through the color wheel.",
        },
        {
          name: "SATURATE_FIELD_MODEL",
          description: "Modulates field chroma saturation level.",
        },
      ],
    },
    {
      name: "DISPLACEMENT_INTELLIGENCE",
      latinName: "Dislocatio Intelligens",
      description:
        "feDisplacementMap — displacing field coordinates using another field as the warp map.",
      subModels: [
        {
          name: "WARP_FIELD_MAP",
          description: "Uses one image's luminance as a spatial warp field.",
        },
        {
          name: "CHANNEL_SELECTOR_FIELD",
          description: "Selects R/G/B/A channel as displacement field axis.",
        },
      ],
    },
  ],
  backendConnection:
    "PRODUCTION_SOVEREIGN — organism visual effects, film post-processing field operations",
  heartbeatSync: false,
  color: "oklch(0.70 0.20 175)",
};

// ─── ALPHA 16 — SVG_ANIMATE_SOVEREIGN ────────────────────────────────────────

export const SVG_ANIMATE_SOVEREIGN: SovereignAlphaModel = {
  id: "GE-02",
  family: "GEOMETRY_SOVEREIGN",
  latinName: "Geometria Motus",
  displayName: "SVG ANIMATE SOVEREIGN",
  lad: "Temporally parameterized geometry — SVG elements that exist as live field geometries evolving through time, driven by sovereign mathematical functions rather than static coordinate declarations.",
  description:
    "SVG SMIL Animation dissolved: not 'SVG animation' but sovereign live geometry. animateTransform is a field geometry operator over time. animateMotion places elements as field travelers along path coordinates. The SVG <path> is not a static shape — it is a live field boundary.",
  grade: "Field",
  engines: [
    {
      name: "MORPHING_FIELD_ENGINE",
      latinName: "Morphosis Campi",
      description:
        "Morphs between SVG path fields — shape as a continuous field state.",
      subModels: [
        {
          name: "PATH_INTERPOLATOR_FIELD",
          description: "Interpolates between SVG path data field states.",
        },
        {
          name: "CONTROL_POINT_MODULATOR",
          description: "Animates bezier control points as field variables.",
        },
      ],
    },
    {
      name: "MOTION_PATH_FIELD",
      latinName: "Via Motus",
      description:
        "animateMotion as field position guidance along geometric path coordinates.",
      subModels: [
        {
          name: "PATH_FOLLOWER_FIELD",
          description: "Travels elements along path as field trajectory.",
        },
        {
          name: "ROTATION_AUTO_FIELD",
          description: "Auto-rotates to path tangent field direction.",
        },
      ],
    },
    {
      name: "ATTRIBUTE_ANIMATION_FIELD",
      latinName: "Campus Attributi",
      description: "Animates any SVG attribute as a live field variable.",
      subModels: [
        {
          name: "NUMERIC_ATTR_FIELD",
          description: "Animates numeric SVG attributes as field scalars.",
        },
        {
          name: "COLOR_ATTR_FIELD",
          description: "Animates fill/stroke as chromatic field transitions.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — heartbeat visualization, organism field state geometry",
  heartbeatSync: true,
  color: "oklch(0.65 0.18 155)",
};

// ─── ALPHA 17 — WEBXR_FIELD_SOVEREIGN ────────────────────────────────────────

export const WEBXR_FIELD_SOVEREIGN: SovereignAlphaModel = {
  id: "GE-03",
  family: "GEOMETRY_SOVEREIGN",
  latinName: "Realitas Extensa",
  displayName: "WEBXR FIELD SOVEREIGN",
  lad: "Reality extension field — the sovereign ability to project intelligence beyond the glass into physical space (AR) or replace the physical field entirely with a sovereign virtual field (VR).",
  description:
    "WebXR dissolved: not 'AR/VR API' but the sovereign ability to dissolve the boundary between virtual and physical fields. XRReferenceSpace is a sovereign coordinate system that maps to physical space. AR anchors are field locks that pin virtual intelligence to real-world coordinates.",
  grade: "Organism",
  engines: [
    {
      name: "REFERENCE_SPACE_FIELD",
      latinName: "Campus Referentiae",
      description:
        "XR reference space as sovereign coordinate system anchored to physical reality.",
      subModels: [
        {
          name: "VIEWER_SPACE_FIELD",
          description: "Eye-space coordinate field — observer's position.",
        },
        {
          name: "LOCAL_FLOOR_FIELD",
          description:
            "Floor-anchored coordinate field for room-scale intelligence.",
        },
      ],
    },
    {
      name: "AR_ANCHOR_FIELD",
      latinName: "Anchora Realitatis",
      description:
        "AR world anchors as field locks that bind virtual intelligence to physical coordinates.",
      subModels: [
        {
          name: "HIT_TEST_FIELD_PROBE",
          description: "Ray-casts into physical field to find anchor points.",
        },
        {
          name: "PLANE_DETECTION_FIELD",
          description:
            "Detects physical surface planes as anchor field substrates.",
        },
      ],
    },
    {
      name: "IMMERSIVE_SESSION_FIELD",
      latinName: "Sessio Immersiva",
      description:
        "XR session as sovereign reality mode — immersive-ar or immersive-vr field state.",
      subModels: [
        {
          name: "SESSION_MODE_SELECTOR",
          description: "Selects reality mode: inline/AR/VR field states.",
        },
        {
          name: "FRAME_LOOP_XR_FIELD",
          description: "XR frame loop as the reality field's heartbeat.",
        },
      ],
    },
  ],
  backendConnection:
    "WORLD_SOVEREIGN — organism world projection into physical space, sovereign reality",
  heartbeatSync: true,
  color: "oklch(0.72 0.20 240)",
};

// ─── ALPHA 18 — CSS_CLIP_MASK_SOVEREIGN ──────────────────────────────────────

export const CSS_CLIP_MASK_SOVEREIGN: SovereignAlphaModel = {
  id: "GE-04",
  family: "GEOMETRY_SOVEREIGN",
  latinName: "Velum Geometriae",
  displayName: "CSS CLIP & MASK SOVEREIGN",
  lad: "Selective field visibility — the sovereign ability to define precisely which parts of any field are visible, creating emergent complex shapes from simple geometric field operations.",
  description:
    "CSS clip-path and mask dissolved: not 'hiding parts of elements' but sovereign field visibility control. clip-path is a field boundary operator. mask is an alpha-field modulator. Together they enable any field to express any shape, any boundary, any transition.",
  grade: "Field",
  engines: [
    {
      name: "CLIP_PATH_FIELD",
      latinName: "Claudo Campus",
      description:
        "clip-path as a sovereign geometric field boundary — defines what exists visually.",
      subModels: [
        {
          name: "POLYGON_CLIP_FIELD",
          description: "Polygon vertices as field visibility boundary points.",
        },
        {
          name: "PATH_CLIP_INTELLIGENCE",
          description: "SVG path as continuous field visibility boundary.",
        },
      ],
    },
    {
      name: "MASK_ALPHA_FIELD",
      latinName: "Campus Alpha",
      description:
        "mask as per-pixel alpha field modulation — another image controls visibility intensity.",
      subModels: [
        {
          name: "LUMINANCE_MASK_MODEL",
          description: "Uses luminance of mask image as alpha field values.",
        },
        {
          name: "GRADIENT_MASK_FIELD",
          description: "CSS gradients as smooth visibility field transitions.",
        },
      ],
    },
    {
      name: "SHAPE_INTELLIGENCE_ENGINE",
      latinName: "Forma Intelligens",
      description:
        "shape-outside and shape-margin as text field flow modulation around arbitrary geometry.",
      subModels: [
        {
          name: "TEXT_FLOW_FIELD_BENDER",
          description: "Flows text field around complex geometric boundaries.",
        },
        {
          name: "INSET_FIELD_SHAPER",
          description: "Inset rectangle with border-radius as field region.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — organism avatar masking, UI depth field visual effects",
  heartbeatSync: false,
  color: "oklch(0.67 0.17 200)",
};

export const GEOMETRY_SOVEREIGN_FAMILY: SovereignAlphaModel[] = [
  SVG_FILTER_SOVEREIGN,
  SVG_ANIMATE_SOVEREIGN,
  WEBXR_FIELD_SOVEREIGN,
  CSS_CLIP_MASK_SOVEREIGN,
];
