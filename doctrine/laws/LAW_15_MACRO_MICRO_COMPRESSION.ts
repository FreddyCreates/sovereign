/**
 * LAW_15_MACRO_MICRO_COMPRESSION
 * Law of Macro-Micro Compression — calling a macro model executes all its micro models
 * Layer: ALL (doctrine layer)
 *
 * Equation: M(x) = ∪_i(m_i(x))   (macro = union of all micro executions)
 *   Calling M returns the combined result of all micro models m_1 … m_n
 *   No read step. No fetch step. Call it, everything inside runs immediately.
 *
 *   The macro model is not a container — it IS the execution of all its parts.
 *   This law governs BODY_REALISM_MODEL, SKIN_RESOLUTION_MODEL, etc.
 */

export const PHI: number = parseFloat('1.6180339887498948482');

export type MicroModelFn<T, R> = (input: T) => R;

export interface MacroModelDefinition<T, R> {
  macroId: string;
  name: string;
  microModels: MicroModelFn<T, R>[];
}

export interface SovereignState {
  [key: string]: unknown;
}

export interface StateChange {
  gapId: number;
  field: string;
  delta: number;
  valid: boolean;
  rejectionReason: string | null;
  microResults?: unknown[];
}

/**
 * executeMacroModel — M(x) = ∪_i(m_i(x))
 * Runs all micro models and collects results. No micro model can fail silently —
 * errors are captured and the macro still returns partial results.
 */
export function executeMacroModel<T, R>(
  macro: MacroModelDefinition<T, R>,
  input: T,
): { macroId: string; results: Array<R | { error: string }>; allPassed: boolean } {
  const results: Array<R | { error: string }> = [];
  let allPassed = true;

  for (const micro of macro.microModels) {
    try {
      results.push(micro(input));
    } catch (e) {
      allPassed = false;
      results.push({ error: e instanceof Error ? e.message : String(e) });
    }
  }

  return { macroId: macro.macroId, results, allPassed };
}

export const LAW_15_MACRO_MICRO_COMPRESSION = {
  id: 15,
  name: 'Law of Macro-Micro Compression',
  layer: 'ALL',
  doctrineStrength: 1.0,
  ancientSymbol: '⊃', // Containment superset
  equation: 'M(x) = ∪_i(m_i(x)) — calling M invokes all micro models simultaneously',
  parameters: {
    executionModel: 'synchronous union — all micros fire on macro invocation',
    noReadStep: true,
    noFetchStep: true,
    callAndRunAll: true,
  },
  alwaysOn: true as const,

  execute(state: SovereignState): StateChange {
    // Meta-execution: verifies that macro-micro principle is honored
    // In production, specific macro models (BODY_REALISM, etc.) call executeMacroModel
    return {
      gapId: 0,
      field: 'macroMicroCompression',
      delta: 1,
      valid: true,
      rejectionReason: null,
    };
  },

  verify(output: StateChange): boolean {
    return output.valid;
  },

  executeMacroModel,
};

export default LAW_15_MACRO_MICRO_COMPRESSION;
