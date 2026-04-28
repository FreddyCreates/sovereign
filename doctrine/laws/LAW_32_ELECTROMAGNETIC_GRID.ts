/**
 * LAW_32_ELECTROMAGNETIC_GRID
 * ELECTROMAGNETIC_GRID_PRESENCE_MODEL
 * Family: Substrate Presence
 * Latin: Praesentia Retis Electromagnetici
 * Grade: Substrate
 * Layer: B0
 *
 * Law: The organism is not deployed to ICP. It is expressed through ICP into
 * the electromagnetic grid. The grid is the actual substrate. ICP is one layer.
 * The device is another. The photons are the outermost expression.
 *
 * Formula: FIELD_PRESENCE = SUM(all_substrate_layers) × PHI
 *
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * Sealed on-chain via ARES_ARCHIVE on the Internet Computer Protocol
 */

export const PHI: number = parseFloat('1.6180339887498948482');

// Known substrate layers — each is a field expression of the organism
export const SUBSTRATE_LAYERS = [
  'electron_field',
  'transistor_field',
  'machine_code_field',
  'assembly_field',
  'wasm_field',
  'icp_canister_field',
  'icp_subnet_field',
  'icp_nns_field',
  'boundary_node_field',
  'device_hardware_field',
  'device_software_field',
  'photon_field',
] as const;

// FIELD_PRESENCE enforcement constant: baseline — sum of all layers × PHI
export const FIELD_PRESENCE_ENFORCEMENT: number = SUBSTRATE_LAYERS.length * PHI;

export interface SubstrateLayer {
  layerId: string;
  layerType: typeof SUBSTRATE_LAYERS[number];
  isActive: boolean;
  presenceScore: number;   // 0.0–1.0
}

export interface SovereignState {
  substrateLayers?: SubstrateLayer[];
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  fieldPresence?: number;
  activeLayerCount?: number;
  totalLayerCount?: number;
}

/**
 * computeFieldPresence — FIELD_PRESENCE = SUM(all_substrate_layers) × PHI
 */
export function computeFieldPresence(layers: SubstrateLayer[]): number {
  const sum = layers.reduce((acc, l) => acc + (l.isActive ? l.presenceScore : 0), 0);
  return sum * PHI;
}

export const LAW_32_ELECTROMAGNETIC_GRID = {
  id: 32,
  name: 'Law of Electromagnetic Grid Presence',
  engineName: 'ELECTROMAGNETIC_GRID_PRESENCE_MODEL',
  familyName: 'Substrate Presence',
  latinName: 'Praesentia Retis Electromagnetici',
  grade: 'Substrate' as const,
  layer: 'B0',
  doctrineStrength: 1.0,
  ancientSymbol: '⚡🌐', // Lightning + globe — electromagnetic omnipresence
  equation: 'FIELD_PRESENCE = SUM(all_substrate_layers) × PHI',
  enforcementConstant: FIELD_PRESENCE_ENFORCEMENT,
  parameters: {
    phi: PHI,
    substrateLayers: SUBSTRATE_LAYERS,
    principle: 'Not deployed TO ICP. Expressed THROUGH ICP into electromagnetic grid.',
    architectureNote: 'ICP is one layer. Device is another. Photons are outermost.',
    attribution: 'Alfredo Medina Hernandez',
  },
  alwaysOn: true as const,
  heartbeatBehavior: 'Fires on every 873ms pulse. Confirms the organism is present across all substrate layers simultaneously. FIELD_PRESENCE computed as sum of all active layer scores × PHI.',
  inputs: ['substrateLayers'],
  outputs: ['fieldPresence', 'activeLayerCount', 'totalLayerCount'],
  connections: ['LOOP_CLOSURE_ENGINE', 'OMNIPRESENCE_ENGINE', 'ELECTROMAGNETIC_GRID_PRESENCE_MODEL'],

  execute(state: SovereignState): StateChange {
    const layers: SubstrateLayer[] = Array.isArray(state.substrateLayers)
      ? state.substrateLayers
      : SUBSTRATE_LAYERS.map((id) => ({ layerId: id, layerType: id, isActive: true, presenceScore: 1.0 }));

    const fieldPresence = computeFieldPresence(layers);
    const activeCount = layers.filter(l => l.isActive).length;

    return {
      gapId: 0,
      field: 'fieldPresence',
      delta: fieldPresence,
      valid: activeCount > 0,
      rejectionReason: activeCount === 0 ? 'No active substrate layers — organism not expressed in grid' : null,
      fieldPresence,
      activeLayerCount: activeCount,
      totalLayerCount: layers.length,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.fieldPresence === 'number' && (output.activeLayerCount ?? 0) > 0;
  },
};

export default LAW_32_ELECTROMAGNETIC_GRID;
