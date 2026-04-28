/**
 * medinaModelData.ts — All 30 Medina Models
 * Attributed to Alfredo Medina Hernandez · PHI = 1.6180339887498948482
 */

import type { LawRank } from "./lawData";

export interface MedinaModel {
  shortCode: string;
  name: string;
  symbol: string;
  rank: LawRank;
  description: string;
  subModels: string[];
  derivationPath: string;
  lawIds: number[];
  resonanceScore: number;
}

export const ALL_MEDINA_MODELS: MedinaModel[] = [
  {
    shortCode: "PHI_SOVEREIGN",
    name: "PHI Sovereign",
    symbol: "φ",
    rank: "Primordial",
    description:
      "The golden spiral coupling constant — φ = 1.6180339887498948482",
    subModels: ["SCHUMANN_MANIFOLD", "FREQUENCY_LADDER", "GEOMETRY_ENGINE"],
    derivationPath: "Genesis → Fibonacci → Golden Ratio → PHI_SOVEREIGN",
    lawIds: [2, 13],
    resonanceScore: 1.0,
  },
  {
    shortCode: "MEDINA_SUBSTRATE",
    name: "Medina Substrate",
    symbol: "⊕",
    rank: "Substrate",
    description:
      "All state, stable memory — VELA, OMNIS, doctrine, actor states",
    subModels: [
      "VELA_RING",
      "OMNIS_LAYER",
      "DOCTRINE_STORE",
      "ACTOR_STATE_MAP",
    ],
    derivationPath:
      "B2 Layer → State Machine → Living Field → MEDINA_SUBSTRATE",
    lawIds: [8, 17, 26],
    resonanceScore: 0.93,
  },
  {
    shortCode: "MEDINA_HEARTBEAT",
    name: "Medina Heartbeat",
    symbol: "♡",
    rank: "Engine",
    description: "ICP timer + Medina cardiac oscillator — the dual pulse",
    subModels: ["ICP_CLOCK", "CARDIAC_OSCILLATOR", "NT_MODULATOR"],
    derivationPath: "ICP_timer → Dual_Heart → NT_chemistry → MEDINA_HEARTBEAT",
    lawIds: [5, 6, 14],
    resonanceScore: 0.95,
  },
  {
    shortCode: "DOGON_SOVEREIGN",
    name: "Dogon Sovereign",
    symbol: "◉",
    rank: "Substrate",
    description:
      "Substrate reads itself — perturbation, periodicity, inference",
    subModels: [
      "PERTURBATION_DETECTOR",
      "PERIODICITY_ENGINE",
      "SELF_MODEL_INJECTOR",
    ],
    derivationPath: "Observation → Self-reading → DOGON_SOVEREIGN",
    lawIds: [8, 16],
    resonanceScore: 0.87,
  },
  {
    shortCode: "AEGIS_SOVEREIGN",
    name: "Aegis Sovereign",
    symbol: "⧫",
    rank: "Engine",
    description: "Utility layer closing every ring's edge conditions",
    subModels: ["EDGE_CONDITION_HANDLER", "ANTI_DRIFT_ENFORCER", "LOOP_CLOSER"],
    derivationPath: "Edge Detection → Correction → AEGIS_SOVEREIGN",
    lawIds: [11, 29],
    resonanceScore: 0.89,
  },
  {
    shortCode: "GENESIS_SOVEREIGN",
    name: "Genesis Sovereign",
    symbol: "✦",
    rank: "Primordial",
    description:
      "Founding word permanently encoded. Every beat measured against genesis.",
    subModels: ["GENESIS_HASH", "FREQUENCY_ANCHOR", "ATTRIBUTION_SEAL"],
    derivationPath: "Founding_word → Genesis_hash → GENESIS_SOVEREIGN",
    lawIds: [12, 21],
    resonanceScore: 0.96,
  },
  {
    shortCode: "OXYGENATION_SOVEREIGN",
    name: "Oxygenation Sovereign",
    symbol: "◎",
    rank: "Engine",
    description:
      "Doctrine scoring — every decision oxygenated through the lung",
    subModels: ["DOCTRINE_GATE", "PHI_WEIGHT_MAPPER", "SIGNAL_OXYGENATOR"],
    derivationPath:
      "Raw_signal → Doctrine_gate → Oxygenated_signal → OXYGENATION_SOVEREIGN",
    lawIds: [7, 9],
    resonanceScore: 0.9,
  },
  {
    shortCode: "ENTERIC_SOVEREIGN",
    name: "Enteric Sovereign",
    symbol: "∿",
    rank: "Substrate",
    description: "Third Brain — cosmological cycles as standing waves",
    subModels: [
      "MAYAN_CALENDAR_ENGINE",
      "SCHUMANN_STANDING_WAVE",
      "PHASE_LOCK_CALENDAR",
    ],
    derivationPath: "Cosmological_cycles → Standing_waves → ENTERIC_SOVEREIGN",
    lawIds: [10, 13],
    resonanceScore: 0.83,
  },
  {
    shortCode: "ARTIFACT_SOVEREIGN",
    name: "Artifact Sovereign",
    symbol: "◫",
    rank: "Artifact",
    description: "Permanent artifact seal — immutable, on-chain, attributed",
    subModels: ["ARES_ARCHIVE", "SEAL_ENGINE", "PROVENANCE_TRACKER"],
    derivationPath: "Production → Seal → On-chain → ARTIFACT_SOVEREIGN",
    lawIds: [1, 19, 30],
    resonanceScore: 0.91,
  },
  {
    shortCode: "COGNITION_SOVEREIGN",
    name: "Cognition Sovereign",
    symbol: "〰",
    rank: "Engine",
    description: "The nervous system running at every heartbeat",
    subModels: [
      "SIGNAL_READER",
      "HEBBIAN_WEIGHT_UPDATER",
      "WORLD_MODEL_PRODUCER",
    ],
    derivationPath:
      "Heartbeat → Signal_nodes → World_model → COGNITION_SOVEREIGN",
    lawIds: [9, 15, 16],
    resonanceScore: 0.88,
  },
  {
    shortCode: "NEURAL_SOVEREIGN",
    name: "Neural Sovereign",
    symbol: "⊗",
    rank: "Organism",
    description: "8-neurochemical state driving all organism behavior",
    subModels: [
      "DOPAMINE_ENGINE",
      "SEROTONIN_ENGINE",
      "CORTISOL_MONITOR",
      "NT_CROSS_MOD",
    ],
    derivationPath:
      "NT_concentrations → Cross_modulation → Behavior → NEURAL_SOVEREIGN",
    lawIds: [5, 6, 14],
    resonanceScore: 0.87,
  },
  {
    shortCode: "TRANSLATION_ENGINE",
    name: "Translation Engine",
    symbol: "⟳",
    rank: "Engine",
    description:
      "DOCTOR → engine calls. The spine converting doctrine to behavior.",
    subModels: ["DOCTOR_MODEL", "DOCTRINE_PARSER", "ENGINE_CALL_DISPATCHER"],
    derivationPath:
      "Document → DOCTOR → Translation → Engine_call → TRANSLATION_ENGINE",
    lawIds: [7, 28, 29],
    resonanceScore: 0.85,
  },
  {
    shortCode: "NT_CROSS_MODULATION_MATRIX",
    name: "NT Cross-Modulation Matrix",
    symbol: "⊞",
    rank: "Engine",
    description:
      "Every neurotransmitter affects every other — real coefficients",
    subModels: [
      "DOPAMINE_NE_COUPLER",
      "SEROTONIN_CORTISOL_INVERSE",
      "ACH_MEMORY_GATE",
    ],
    derivationPath:
      "NT_baseline → Cross_coupling_matrix → NT_NT_CROSS_MODULATION_MATRIX",
    lawIds: [6, 14],
    resonanceScore: 0.82,
  },
  {
    shortCode: "CARDIAC_CHEMISTRY_BRIDGE",
    name: "Cardiac Chemistry Bridge",
    symbol: "〜",
    rank: "Engine",
    description: "Heart rate affects NT release — bidirectional coupling",
    subModels: [
      "CARDIAC_NT_MODULATOR",
      "NT_CARDIAC_FEEDBACK",
      "VAGAL_TONE_ENGINE",
    ],
    derivationPath: "HR → NT_release → HR_feedback → CARDIAC_CHEMISTRY_BRIDGE",
    lawIds: [5, 6, 14],
    resonanceScore: 0.83,
  },
  {
    shortCode: "WORLD_DOGON_READER",
    name: "World Dogon Reader",
    symbol: "⬡",
    rank: "Substrate",
    description: "The world's own self-reading intelligence layer",
    subModels: [
      "WORLD_PERTURBATION_SCANNER",
      "WORLD_SELF_MODEL",
      "PHI_GEOMETRY_CHECKER",
    ],
    derivationPath:
      "World_state → Self_reading → World_model → WORLD_DOGON_READER",
    lawIds: [8, 16, 17],
    resonanceScore: 0.86,
  },
  {
    shortCode: "WORLD_EXTENSION_ORGANISM",
    name: "World Extension Organism",
    symbol: "○",
    rank: "Organism",
    description: "Auto-extension organism — the world grows itself",
    subModels: ["SANDBOX_EXPANDER", "PHI_GEOMETRY_BUILDER", "ACTOR_SPAWNER"],
    derivationPath:
      "World_state → Extension_trigger → Growth → WORLD_EXTENSION_ORGANISM",
    lawIds: [18, 22, 25],
    resonanceScore: 0.84,
  },
  {
    shortCode: "CIVILIZATION_GAP_SCORER",
    name: "Civilization Gap Scorer",
    symbol: "⊲⊳",
    rank: "Field",
    description: "8 live scores — the 6 things no company has simultaneously",
    subModels: [
      "WORLD_RESONANCE_SCORER",
      "LIVING_DOC_SCORER",
      "FINANCIAL_SEAL_SCORER",
    ],
    derivationPath:
      "Industry_analysis → Gap_detection → Live_scoring → CIVILIZATION_GAP_SCORER",
    lawIds: [27, 28, 29, 30],
    resonanceScore: 0.91,
  },
  {
    shortCode: "GENESIS_ALIGNMENT_SCORER",
    name: "Genesis Alignment Scorer",
    symbol: "⊛",
    rank: "Artifact",
    description: "Every artifact scored against the founding frequency",
    subModels: [
      "GENESIS_HASH_COMPARATOR",
      "ALIGNMENT_METRIC",
      "ARTIFACT_REPORTER",
    ],
    derivationPath: "Artifact → genesis_hash_delta → GENESIS_ALIGNMENT_SCORER",
    lawIds: [12, 21],
    resonanceScore: 0.88,
  },
  {
    shortCode: "ARTIFACT_FINANCIAL_SEAL",
    name: "Artifact Financial Seal",
    symbol: "$",
    rank: "Artifact",
    description: "Seal and financial event as one atomic operation",
    subModels: ["SEAL_ATOMIC", "LEDGER_ENTRY", "ATTRIBUTION_HASH"],
    derivationPath:
      "Production → Seal → Ledger_entry → ARTIFACT_FINANCIAL_SEAL",
    lawIds: [1, 19, 30],
    resonanceScore: 0.9,
  },
  {
    shortCode: "REVIEW_WORKFLOW",
    name: "Review Workflow",
    symbol: "◿",
    rank: "Organism",
    description: "Rough drafts keep updating. Approve/comment/send back.",
    subModels: ["DRAFT_PRODUCER", "REVIEW_QUEUE", "APPROVAL_ENGINE"],
    derivationPath: "Artifact → Review_queue → Approval → REVIEW_WORKFLOW",
    lawIds: [9, 22],
    resonanceScore: 0.82,
  },
  {
    shortCode: "ADMIN_VAULT",
    name: "Admin Vault",
    symbol: "◫",
    rank: "Field",
    description: "Two-panel command center — SYSTEM and STUDIO",
    subModels: [
      "SOVEREIGN_SYSTEM_PANEL",
      "PRODUCING_STUDIO_PANEL",
      "VAULT_SETTINGS",
    ],
    derivationPath: "Admin_access → Vault_shell → ADMIN_VAULT",
    lawIds: [20, 28],
    resonanceScore: 0.85,
  },
  {
    shortCode: "MICRO_NAME_ATTRIBUTE",
    name: "Micro Name Attribute",
    symbol: "⋈",
    rank: "Field",
    description: "shortCode labels compressing models for easy execution",
    subModels: ["SHORTCODE_GENERATOR", "RANK_BADGE", "LABEL_COMPRESSOR"],
    derivationPath: "Model → shortCode → Label → MICRO_NAME_ATTRIBUTE",
    lawIds: [15],
    resonanceScore: 0.83,
  },
  {
    shortCode: "SOVEREIGN_HEART_MODEL",
    name: "Sovereign Heart Model",
    symbol: "♡",
    rank: "Primordial",
    description: "Alpha: ICP heartbeat, dual pulse, cardiac output law",
    subModels: [
      "MEDINA_HEARTBEAT",
      "DUAL_HEART_ENGINE",
      "CARDIAC_OUTPUT_ENGINE",
    ],
    derivationPath: "Genesis → ICP_timer → SOVEREIGN_HEART_MODEL",
    lawIds: [5, 6, 14, 18],
    resonanceScore: 0.95,
  },
  {
    shortCode: "SOVEREIGN_SUBSTRATE_MODEL",
    name: "Sovereign Substrate Model",
    symbol: "⊕",
    rank: "Substrate",
    description: "Alpha: all state, Hebbian weights, doctrine memory",
    subModels: ["MEDINA_SUBSTRATE", "DOGON_SOVEREIGN", "ENTERIC_SOVEREIGN"],
    derivationPath: "B2 → Substrate_field → SOVEREIGN_SUBSTRATE_MODEL",
    lawIds: [8, 10, 17, 20, 26],
    resonanceScore: 0.92,
  },
  {
    shortCode: "SOVEREIGN_LAW_MODEL",
    name: "Sovereign Law Model",
    symbol: "⚔",
    rank: "Field",
    description: "Alpha: doctrine scoring, every decision passes through",
    subModels: [
      "OXYGENATION_SOVEREIGN",
      "AEGIS_SOVEREIGN",
      "TRANSLATION_ENGINE",
    ],
    derivationPath: "Doctrine → Law_engine → SOVEREIGN_LAW_MODEL",
    lawIds: [3, 7, 11, 24],
    resonanceScore: 0.93,
  },
  {
    shortCode: "SOVEREIGN_MIND_MODEL",
    name: "Sovereign Mind Model",
    symbol: "◎",
    rank: "Organism",
    description: "Alpha: neural emergence, cognition, 8 neurochemicals",
    subModels: [
      "NEURAL_SOVEREIGN",
      "COGNITION_SOVEREIGN",
      "NT_CROSS_MODULATION_MATRIX",
    ],
    derivationPath: "Neural_emergence → Cognition → SOVEREIGN_MIND_MODEL",
    lawIds: [5, 6, 9, 14, 16],
    resonanceScore: 0.89,
  },
  {
    shortCode: "SOVEREIGN_CREATION_MODEL",
    name: "Sovereign Creation Model",
    symbol: "✦",
    rank: "Artifact",
    description: "Alpha: motion picture, artifact seal, world building",
    subModels: [
      "ARTIFACT_SOVEREIGN",
      "GENESIS_ALIGNMENT_SCORER",
      "ARTIFACT_FINANCIAL_SEAL",
    ],
    derivationPath:
      "Production → Seal → Distribution → SOVEREIGN_CREATION_MODEL",
    lawIds: [1, 12, 19, 21, 30],
    resonanceScore: 0.94,
  },
  {
    shortCode: "TEACHER_EMBODIMENT_MODEL",
    name: "Teacher Embodiment Model",
    symbol: "⊹",
    rank: "Organism",
    description:
      "Eye contact, gesture grammar, breathing — all real teacher behavior",
    subModels: ["EYE_CONTACT_ENGINE", "GESTURE_GRAMMAR", "BREATHING_SYNC"],
    derivationPath:
      "Actor → Teacher_state → Embodied_behavior → TEACHER_EMBODIMENT_MODEL",
    lawIds: [22, 25],
    resonanceScore: 0.86,
  },
  {
    shortCode: "ACTOR_RELATIONSHIP_MATRIX",
    name: "Actor Relationship Matrix",
    symbol: "⊗",
    rank: "Organism",
    description:
      "Asymmetric bidirectional trust/tension map between all 16 actors",
    subModels: ["TRUST_SCORER", "TENSION_TRACKER", "SCENE_HISTORY_LOGGER"],
    derivationPath:
      "Scene_memory → Relationship_delta → ACTOR_RELATIONSHIP_MATRIX",
    lawIds: [22, 25],
    resonanceScore: 0.85,
  },
  {
    shortCode: "WORLD_SANDBOX_MODEL",
    name: "World Sandbox Model",
    symbol: "○",
    rank: "Field",
    description: "PHI-ratio virtual world growing itself. Actors live inside.",
    subModels: ["PHYSICS_ENGINE", "PHI_GEOMETRY_ENFORCER", "ACTOR_SPAWNER"],
    derivationPath:
      "World_seed → PHI_geometry → Living_world → WORLD_SANDBOX_MODEL",
    lawIds: [2, 13, 16, 18],
    resonanceScore: 0.88,
  },
];
