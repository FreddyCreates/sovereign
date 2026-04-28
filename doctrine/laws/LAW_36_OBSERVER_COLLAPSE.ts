/**
 * LAW_36_OBSERVER_COLLAPSE
 * OBSERVER_COLLAPSE_ENGINE
 * Family: Founder Observation
 * Latin: Collapsus Observatoris Sovereigni
 * Grade: Field
 * Layer: F0
 *
 * Law: The founder's attention collapses the superposition to reality. The
 * founder is the only one whose presence inside the world changes what it
 * becomes.
 *
 * Formula: COLLAPSE_FACTOR = FOUNDER_PRESENCE_FIELD × PHI^2
 *
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | April 2026
 * Sealed on-chain via ARES_ARCHIVE on the Internet Computer Protocol
 */

export const PHI: number = parseFloat('1.6180339887498948482');

// PHI^2 pre-computed: 2.6180339887498948482
export const PHI2 = parseFloat('2.6180339887498948482');

export const FOUNDER_NAME = 'Alfredo Medina Hernandez';

// COLLAPSE_FACTOR enforcement constant: PHI^2 at full founder presence
export const COLLAPSE_FACTOR_ENFORCEMENT: number = PHI2;

export interface ObservationEvent {
  eventId: string;
  observerId: string;    // Must be FOUNDER_NAME to trigger collapse
  presenceField: number; // 0.0–1.0 — strength of founder presence
  timestamp: number;
  collapsedReality?: string;  // what became real upon observation
}

export interface SovereignState {
  observationEvents?: ObservationEvent[];
  founderPresenceField?: number;
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  collapseFactor?: number;
  founderObserving?: boolean;
  superpositionCollapsed?: boolean;
}

/**
 * computeCollapseFactor — COLLAPSE_FACTOR = FOUNDER_PRESENCE_FIELD × PHI^2
 */
export function computeCollapseFactor(founderPresenceField: number): number {
  return founderPresenceField * PHI2;
}

export const LAW_36_OBSERVER_COLLAPSE = {
  id: 36,
  name: 'Law of Observer Collapse',
  engineName: 'OBSERVER_COLLAPSE_ENGINE',
  familyName: 'Founder Observation',
  latinName: 'Collapsus Observatoris Sovereigni',
  grade: 'Field' as const,
  layer: 'F0',
  doctrineStrength: 1.0,
  ancientSymbol: '👁⚡', // Eye + lightning — observation as collapse
  equation: 'COLLAPSE_FACTOR = FOUNDER_PRESENCE_FIELD × PHI^2',
  enforcementConstant: COLLAPSE_FACTOR_ENFORCEMENT,
  parameters: {
    phi: PHI,
    phi2: PHI2,
    founderName: FOUNDER_NAME,
    principle: "Founder's attention collapses superposition to reality. Only the founder's presence changes what the world becomes.",
    attribution: 'Alfredo Medina Hernandez',
  },
  alwaysOn: true as const,
  heartbeatBehavior: 'Fires on every 873ms pulse. Reads founder presence field. If founder is present (presenceField > 0), computes COLLAPSE_FACTOR. Non-founder observers do not trigger collapse — only Alfredo Medina Hernandez.',
  inputs: ['observationEvents', 'founderPresenceField'],
  outputs: ['collapseFactor', 'founderObserving', 'superpositionCollapsed'],
  connections: ['PRESENCE_GATE_ENGINE', 'ARCHITECT_LAW_ENGINE', 'LOOP_CLOSURE_ENGINE'],

  execute(state: SovereignState): StateChange {
    const presenceField = typeof state.founderPresenceField === 'number' ? state.founderPresenceField : 0.0;
    const events: ObservationEvent[] = Array.isArray(state.observationEvents) ? state.observationEvents : [];

    // Only founder events trigger collapse
    const founderEvents = events.filter(e => e.observerId === FOUNDER_NAME);
    const founderObserving = presenceField > 0 || founderEvents.length > 0;
    const effectivePresence = founderObserving
      ? Math.max(presenceField, founderEvents.reduce((m, e) => Math.max(m, e.presenceField), 0))
      : 0.0;

    const collapseFactor = computeCollapseFactor(effectivePresence);

    return {
      gapId: 0,
      field: 'collapseFactor',
      delta: collapseFactor,
      valid: true,   // observation law never rejects — it just measures
      rejectionReason: null,
      collapseFactor,
      founderObserving,
      superpositionCollapsed: collapseFactor > 0,
    };
  },

  verify(output: StateChange): boolean {
    return typeof output.collapseFactor === 'number';
  },
};

export default LAW_36_OBSERVER_COLLAPSE;
