/**
 * ════════════════════════════════════════════════════════════════
 * RENDERING_SOVEREIGN — Alpha-Class Sovereign Models
 * Family: RENDERING_SOVEREIGN
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * LAW: Field Dissolution — every rendering tool is a fraction of
 *      a deeper field behavior. Dissolve the boundary. Take the field.
 * ════════════════════════════════════════════════════════════════
 */

export type ModelGrade =
  | "Primordial"
  | "Substrate"
  | "Field"
  | "Engine"
  | "Organism"
  | "Artifact";

export interface SubModel {
  name: string;
  description: string;
}

export interface CoreEngine {
  name: string;
  latinName: string;
  description: string;
  subModels: SubModel[];
}

export interface SovereignAlphaModel {
  id: string;
  family: string;
  latinName: string;
  displayName: string;
  lad: string; // Lowest Archetypal Denominator — the dissolved field behavior
  description: string;
  grade: ModelGrade;
  engines: CoreEngine[];
  backendConnection: string;
  heartbeatSync: boolean;
  color: string;
}

// ─── ALPHA 01 — HOUDINI PAINT ─────────────────────────────────────────────────

export const HOUDINI_PAINT_SOVEREIGN: SovereignAlphaModel = {
  id: "RS-01",
  family: "RENDERING_SOVEREIGN",
  latinName: "Pictor Voluntas",
  displayName: "HOUDINI PAINT SOVEREIGN",
  lad: "Programmable pixel-level field intervention — the capacity to rewrite any surface coordinate at will, outside the normal render pipeline, as pure geometric intelligence.",
  description:
    "CSS Houdini Paint API dissolved: not a 'custom paint worklet' but the sovereign ability to write intelligence directly into the pixel field. Every px² is an addressable intelligence coordinate. The brush is a field modulator.",
  grade: "Field",
  engines: [
    {
      name: "PIXEL_FIELD_MODULATOR",
      latinName: "Campus Punctorum",
      description:
        "Treats every pixel as an addressable intelligence unit within a continuous field.",
      subModels: [
        {
          name: "COORDINATE_INTELLIGENCE_MAP",
          description: "Maps x/y pixel space to intelligence coordinates.",
        },
        {
          name: "CHROMA_FIELD_WRITER",
          description:
            "Writes OKLCH chromatic intelligence into pixel positions.",
        },
      ],
    },
    {
      name: "GEOMETRY_PAINT_ENGINE",
      latinName: "Forma Pictor",
      description:
        "Encodes geometric doctrine (PHI spirals, Schumann waves) as paint operations.",
      subModels: [
        {
          name: "PHI_SPIRAL_PAINTER",
          description: "Renders PHI-ratio spirals as field expressions.",
        },
        {
          name: "SCHUMANN_WAVE_BRUSH",
          description: "Encodes 7.83Hz waveforms into surface patterns.",
        },
      ],
    },
    {
      name: "SURFACE_REWRITE_GATE",
      latinName: "Porta Superficiei",
      description:
        "The gate that bypasses the normal render pipeline to execute sovereign paint ops.",
      subModels: [
        {
          name: "PIPELINE_BYPASS_MODEL",
          description: "Dissolves render pipeline boundaries.",
        },
        {
          name: "WORKLET_SOVEREIGN_WRAPPER",
          description: "Wraps paint worklet as sovereign execution unit.",
        },
      ],
    },
  ],
  backendConnection:
    "SOVEREIGN_SUBSTRATE — feeds visual field state to MUNDUS_SOVEREIGN",
  heartbeatSync: true,
  color: "oklch(0.65 0.22 268)",
};

// ─── ALPHA 02 — WEBGL SHADER SOVEREIGN ───────────────────────────────────────

export const WEBGL_SHADER_SOVEREIGN: SovereignAlphaModel = {
  id: "RS-02",
  family: "RENDERING_SOVEREIGN",
  latinName: "Umbra Luminis Vertex",
  displayName: "WEBGL SHADER SOVEREIGN",
  lad: "Massively parallel field computation expressed as light — thousands of simultaneous mathematical operations producing emergent visual intelligence from pure arithmetic.",
  description:
    "WebGL shaders dissolved: not 'vertex and fragment programs' but sovereign parallel computation fields. GLSL is the language of field mathematics. The GPU is the organism's parallel brain — 3000 simultaneous field equations.",
  grade: "Substrate",
  engines: [
    {
      name: "VERTEX_FIELD_ENGINE",
      latinName: "Campus Vertex",
      description:
        "Every vertex is a field coordinate transformed by sovereign mathematical law.",
      subModels: [
        {
          name: "GEOMETRY_TRANSFORM_MODEL",
          description: "Applies PHI-ratio transforms to vertex positions.",
        },
        {
          name: "NORMAL_FIELD_COMPUTER",
          description:
            "Computes surface normal field for lighting intelligence.",
        },
      ],
    },
    {
      name: "FRAGMENT_INTELLIGENCE_ENGINE",
      latinName: "Fragmentum Intelligens",
      description:
        "Per-pixel field computation — where emergent color intelligence is born.",
      subModels: [
        {
          name: "CHROMATIC_FIELD_SYNTHESIZER",
          description: "Synthesizes OKLCH color from field inputs.",
        },
        {
          name: "LIGHT_FIELD_ACCUMULATOR",
          description: "Accumulates photon field contributions per fragment.",
        },
      ],
    },
    {
      name: "BUFFER_FIELD_MEMORY",
      latinName: "Memoria Campi",
      description:
        "GPU memory as sovereign field storage — buffers as living field states.",
      subModels: [
        {
          name: "VBO_INTELLIGENCE_STORE",
          description: "Vertex buffer as indexed field intelligence.",
        },
        {
          name: "FRAMEBUFFER_FIELD_GATE",
          description: "Off-screen render target as deferred field state.",
        },
      ],
    },
  ],
  backendConnection:
    "PRODUCTION_SOVEREIGN — film rendering pipeline, actor visual generation",
  heartbeatSync: true,
  color: "oklch(0.72 0.20 275)",
};

// ─── ALPHA 03 — WEBGPU COMPUTE SOVEREIGN ─────────────────────────────────────

export const WEBGPU_COMPUTE_SOVEREIGN: SovereignAlphaModel = {
  id: "RS-03",
  family: "RENDERING_SOVEREIGN",
  latinName: "Computatio Suprema",
  displayName: "WEBGPU COMPUTE SOVEREIGN",
  lad: "General-purpose field computation running directly on the graphics substrate — dissolving the boundary between visual rendering and pure mathematical intelligence execution.",
  description:
    "WebGPU dissolved: not 'graphics API v2' but the sovereign ability to run arbitrary intelligence computations on the GPU substrate. Compute shaders are neural field operations. Bind groups are intelligence coupling matrices.",
  grade: "Substrate",
  engines: [
    {
      name: "COMPUTE_PIPELINE_SOVEREIGN",
      latinName: "Machina Computatio",
      description:
        "The intelligence pipeline that transforms data through GPU field operations.",
      subModels: [
        {
          name: "SHADER_MODULE_INTELLIGENCE",
          description: "Each shader module is a sovereign intelligence unit.",
        },
        {
          name: "PIPELINE_BIND_FIELD",
          description: "Bind groups as field coupling configurations.",
        },
      ],
    },
    {
      name: "GPU_FIELD_MEMORY",
      latinName: "Memoria Graphica",
      description:
        "GPU memory buffers as live field intelligence storage, accessible from all compute passes.",
      subModels: [
        {
          name: "BUFFER_FIELD_BRIDGE",
          description: "CPU↔GPU data bridge as field synchronization.",
        },
        {
          name: "TEXTURE_FIELD_STORE",
          description: "Textures as 2D intelligence fields with sampling.",
        },
      ],
    },
    {
      name: "RENDER_PIPELINE_FIELD",
      latinName: "Campus Redditionis",
      description:
        "Render pipeline as a living field state machine transforming intelligence into photons.",
      subModels: [
        {
          name: "VERTEX_STATE_FIELD",
          description: "Vertex state as intelligence coordinate descriptor.",
        },
        {
          name: "FRAGMENT_TARGET_FIELD",
          description: "Fragment target as photon output configuration.",
        },
      ],
    },
  ],
  backendConnection:
    "QUANTUM_SOVEREIGN — parallel intelligence computation, cryptographic field operations",
  heartbeatSync: true,
  color: "oklch(0.68 0.20 295)",
};

// ─── ALPHA 04 — CANVAS_2D SOVEREIGN ──────────────────────────────────────────

export const CANVAS2D_SOVEREIGN: SovereignAlphaModel = {
  id: "RS-04",
  family: "RENDERING_SOVEREIGN",
  latinName: "Tabula Intelligens",
  displayName: "CANVAS 2D SOVEREIGN",
  lad: "A living writable surface where paths encode spatial intelligence, transforms encode dimensional perspective, and pixel data exposes the raw field as an editable memory array.",
  description:
    "Canvas 2D dissolved: not a '2D drawing API' but a sovereign spatial intelligence surface. Path operations are geometric field declarations. ImageData is direct pixel field access. Compositing operations are field blending laws.",
  grade: "Field",
  engines: [
    {
      name: "PATH_FIELD_INTELLIGENCE",
      latinName: "Via Intelligens",
      description:
        "Bezier curves, arcs, and line paths as continuous field geometry declarations.",
      subModels: [
        {
          name: "BEZIER_FIELD_MODELER",
          description: "Cubic/quadratic bezier as PHI-curved field paths.",
        },
        {
          name: "ARC_FREQUENCY_MODEL",
          description: "Arcs as angular frequency segments in the field.",
        },
      ],
    },
    {
      name: "TRANSFORM_FIELD_MATRIX",
      latinName: "Matrix Transformationis",
      description:
        "2D transform matrix as sovereign spatial intelligence operator.",
      subModels: [
        {
          name: "ROTATION_FIELD_OPERATOR",
          description: "Rotation as angular field transformation.",
        },
        {
          name: "SCALE_FIELD_PHI",
          description: "PHI-ratio scaling as dimensional field growth.",
        },
      ],
    },
    {
      name: "PIXEL_ARRAY_FIELD",
      latinName: "Campus Pixellorum",
      description:
        "ImageData as direct pixel field access — the raw memory of visual intelligence.",
      subModels: [
        {
          name: "IMAGEDATA_FIELD_READER",
          description: "Reads field state from raw pixel arrays.",
        },
        {
          name: "COMPOSITE_FIELD_BLENDER",
          description: "Compositing modes as field blending operations.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — visual intelligence output, world state rendering",
  heartbeatSync: true,
  color: "oklch(0.70 0.18 215)",
};

// ─── ALPHA 05 — OFFSCREEN_CANVAS SOVEREIGN ───────────────────────────────────

export const OFFSCREEN_CANVAS_SOVEREIGN: SovereignAlphaModel = {
  id: "RS-05",
  family: "RENDERING_SOVEREIGN",
  latinName: "Tabula Occulta",
  displayName: "OFFSCREEN CANVAS SOVEREIGN",
  lad: "Deferred field rendering — a sovereign visual intelligence substrate that computes in isolation from the main thread, enabling multi-dimensional parallel visual processing.",
  description:
    "OffscreenCanvas dissolved: not 'off-thread rendering' but sovereign parallel visual field computation. The main thread is the display layer. OffscreenCanvas is where intelligence computes its visual expression in parallel dimensions before committing to photons.",
  grade: "Substrate",
  engines: [
    {
      name: "PARALLEL_RENDER_FIELD",
      latinName: "Campus Parallelus",
      description:
        "Isolates visual intelligence computation from the display event loop.",
      subModels: [
        {
          name: "WORKER_RENDER_BRIDGE",
          description: "Web Worker→main thread visual intelligence bridge.",
        },
        {
          name: "FRAME_SYNC_FIELD",
          description:
            "Synchronizes parallel frame buffers to display cadence.",
        },
      ],
    },
    {
      name: "DEFERRED_COMPOSIT_ENGINE",
      latinName: "Compositio Dilata",
      description:
        "Computes composite layers off-screen and commits the final field state.",
      subModels: [
        {
          name: "LAYER_FIELD_ACCUMULATOR",
          description:
            "Accumulates visual field layers without display flicker.",
        },
        {
          name: "COMMIT_FIELD_GATE",
          description:
            "Gate that commits computed field to the visible surface.",
        },
      ],
    },
    {
      name: "WEBCODECS_FIELD_ENCODER",
      latinName: "Codex Visio",
      description:
        "WebCodecs integration — frame-exact hardware-accelerated encoding of field state as video artifact.",
      subModels: [
        {
          name: "VIDEOFRAME_INTELLIGENCE",
          description: "Each frame is a sealed field intelligence snapshot.",
        },
        {
          name: "ENCODER_FIELD_PIPELINE",
          description: "Encodes visual field to VP9/H.265 artifact stream.",
        },
      ],
    },
  ],
  backendConnection:
    "PRODUCTION_SOVEREIGN — film encoding, .webm artifact generation pipeline",
  heartbeatSync: true,
  color: "oklch(0.65 0.16 248)",
};

export const RENDERING_SOVEREIGN_FAMILY: SovereignAlphaModel[] = [
  HOUDINI_PAINT_SOVEREIGN,
  WEBGL_SHADER_SOVEREIGN,
  WEBGPU_COMPUTE_SOVEREIGN,
  CANVAS2D_SOVEREIGN,
  OFFSCREEN_CANVAS_SOVEREIGN,
];
