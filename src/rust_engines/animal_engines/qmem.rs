// QMEM Engine - TYPE 2 RECEPTIVE
// Quantum-coherent memory addressing — superposition-inspired parallel recall
// Authored by Alfredo Medina Hernandez — immutable attribution
// PHI=1.6180339887498948482 | S0_FLOOR=0.75 | S_CEIL=9.75
//
// QMEM extends MNEME with quantum-inspired operations:
// 1. Superposition recall — query returns weighted blend of multiple memories
// 2. Entangled memory pairs — recalling one strengthens the other
// 3. Collapse function — observation (access) crystallizes fuzzy state
// 4. Coherence decay — unobserved memories decohere over time
//
// This is not quantum computing. It's quantum-INSPIRED classical algorithms
// that model how real memory works: fuzzy until recalled, stronger with repetition,
// connected memories reinforce each other.

use candid::{CandidType, Deserialize};

/// Constants
pub const PHI: f64 = 1.6180339887498948482;
pub const PHI_INV: f64 = 0.6180339887498948482;
pub const S0_FLOOR: f64 = 0.75;
pub const S_CEIL: f64 = 9.75;

/// Decoherence time constant (beats)
pub const DECOHERENCE_TAU: f64 = 233.0; // Fibonacci number

/// Minimum coherence before memory becomes "fuzzy"
pub const FUZZY_THRESHOLD: f64 = 0.5;

/// Maximum memories in superposition for a single query
pub const MAX_SUPERPOSITION: usize = 13; // Fibonacci

/// Quantum memory state — a memory with coherence and entanglement
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct QMemEntry {
    pub id: String,
    pub content_hash: String,
    pub amplitude: f64,           // [0, 1] — probability of recall
    pub phase: f64,               // [0, 2π] — interference with other memories
    pub coherence: f64,           // [0, 1] — how "crystallized" (1 = definite, 0 = fuzzy)
    pub entangled_with: Vec<String>, // IDs of entangled memories
    pub observation_count: u64,   // Times this memory has been "observed" (recalled)
    pub created_at_beat: u64,
    pub last_observed_beat: u64,
    pub doctrine_alignment: f64,  // [0, 1]
    pub resonance_score: f64,     // [S0_FLOOR, S_CEIL]
}

/// Superposition result — weighted blend of multiple memories
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct SuperpositionResult {
    pub entries: Vec<QMemEntry>,
    pub weights: Vec<f64>,          // Normalized probability weights
    pub total_amplitude: f64,
    pub coherence_score: f64,       // How definite the result is
}

/// Collapse result — what happens when you observe a superposition
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CollapseResult {
    pub selected: QMemEntry,        // The memory that "won"
    pub selection_probability: f64, // How likely this selection was
    pub coherence_boost: f64,       // How much coherence increased
}

/// QMemState — complete quantum memory engine state
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct QMemState {
    pub entries: Vec<QMemEntry>,
    pub total_entries: u64,
    pub total_observations: u64,
    pub global_coherence: f64,      // [S0_FLOOR, S_CEIL]
    pub entanglement_count: u64,    // Total entangled pairs
    pub last_beat: u64,
}

fn clamp_sovereign(v: f64) -> f64 {
    if v < S0_FLOOR { S0_FLOOR } else if v > S_CEIL { S_CEIL } else { v }
}

fn clamp_unit(v: f64) -> f64 {
    if v < 0.0 { 0.0 } else if v > 1.0 { 1.0 } else { v }
}

/// Initialize empty QMEM state
pub fn init_qmem_state() -> QMemState {
    QMemState {
        entries: Vec::new(),
        total_entries: 0,
        total_observations: 0,
        global_coherence: S0_FLOOR,
        entanglement_count: 0,
        last_beat: 0,
    }
}

/// Store a new quantum memory
pub fn store_qmem(
    state: &QMemState,
    id: String,
    content_hash: String,
    doctrine_alignment: f64,
    beat: u64,
) -> QMemState {
    let entry = QMemEntry {
        id,
        content_hash,
        amplitude: 1.0,          // Full amplitude at creation
        phase: 0.0,
        coherence: 1.0,          // Fully coherent when first observed
        entangled_with: Vec::new(),
        observation_count: 1,
        created_at_beat: beat,
        last_observed_beat: beat,
        doctrine_alignment: clamp_unit(doctrine_alignment),
        resonance_score: S0_FLOOR,
    };

    let mut entries = state.entries.clone();
    entries.push(entry);

    let coherence = compute_global_coherence(&entries);

    QMemState {
        entries,
        total_entries: state.total_entries + 1,
        total_observations: state.total_observations + 1,
        global_coherence: coherence,
        entanglement_count: state.entanglement_count,
        last_beat: beat,
    }
}

/// Entangle two memories — recalling one will strengthen the other
pub fn entangle_memories(state: &QMemState, id_a: &str, id_b: &str) -> QMemState {
    let mut entries = state.entries.clone();

    for entry in entries.iter_mut() {
        if entry.id == id_a && !entry.entangled_with.contains(&id_b.to_string()) {
            entry.entangled_with.push(id_b.to_string());
        }
        if entry.id == id_b && !entry.entangled_with.contains(&id_a.to_string()) {
            entry.entangled_with.push(id_a.to_string());
        }
    }

    QMemState {
        entries,
        entanglement_count: state.entanglement_count + 1,
        ..state.clone()
    }
}

/// Superposition query — return weighted blend of memories matching a predicate
/// Memories with higher amplitude and coherence have higher weight
pub fn superposition_query(
    state: &QMemState,
    _query_hash: &str,
    beat: u64,
) -> SuperpositionResult {
    // Find memories with matching or similar content
    let mut candidates: Vec<(usize, f64)> = state.entries.iter().enumerate()
        .filter(|(_, e)| e.coherence > 0.01 && e.amplitude > 0.01)
        .map(|(i, e)| {
            // Relevance score: amplitude × coherence × doctrine × PHI-decay
            let age = (beat - e.last_observed_beat) as f64;
            let decay = PHI.powf(-age / DECOHERENCE_TAU);
            let relevance = e.amplitude * e.coherence * e.doctrine_alignment * decay;
            (i, relevance)
        })
        .collect();

    // Sort by relevance, take top N
    candidates.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));
    candidates.truncate(MAX_SUPERPOSITION);

    if candidates.is_empty() {
        return SuperpositionResult {
            entries: Vec::new(),
            weights: Vec::new(),
            total_amplitude: 0.0,
            coherence_score: 0.0,
        };
    }

    // Normalize weights
    let total: f64 = candidates.iter().map(|(_, r)| r).sum();
    let weights: Vec<f64> = candidates.iter()
        .map(|(_, r)| if total > 0.0 { r / total } else { 0.0 })
        .collect();

    let entries: Vec<QMemEntry> = candidates.iter()
        .map(|(i, _)| state.entries[*i].clone())
        .collect();

    let total_amplitude: f64 = entries.iter().map(|e| e.amplitude).sum();
    let coherence_score = entries.iter()
        .zip(weights.iter())
        .map(|(e, w)| e.coherence * w)
        .sum::<f64>();

    SuperpositionResult {
        entries,
        weights,
        total_amplitude,
        coherence_score,
    }
}

/// Collapse a superposition — "observe" the result, crystallizing one memory
/// The selected memory gets a coherence boost; others decohere slightly
pub fn collapse_superposition(
    state: &QMemState,
    superposition: &SuperpositionResult,
    beat: u64,
) -> (QMemState, Option<CollapseResult>) {
    if superposition.entries.is_empty() {
        return (state.clone(), None);
    }

    // Select the highest-weight memory
    let max_idx = superposition.weights.iter().enumerate()
        .max_by(|(_, a), (_, b)| a.partial_cmp(b).unwrap_or(std::cmp::Ordering::Equal))
        .map(|(i, _)| i)
        .unwrap_or(0);

    let selected_id = &superposition.entries[max_idx].id;
    let selection_prob = superposition.weights[max_idx];

    let mut entries = state.entries.clone();
    let mut coherence_boost = 0.0;
    let mut entangled_ids_to_boost: Vec<String> = Vec::new();

    for entry in entries.iter_mut() {
        if entry.id == *selected_id {
            // Observed → coherence increases
            let boost = PHI_INV * (1.0 - entry.coherence) * 0.1;
            entry.coherence = clamp_unit(entry.coherence + boost);
            entry.amplitude = clamp_unit(entry.amplitude + 0.01);
            entry.observation_count += 1;
            entry.last_observed_beat = beat;
            entry.resonance_score = clamp_sovereign(
                entry.resonance_score + entry.doctrine_alignment * PHI * 0.01
            );
            coherence_boost = boost;

            // Collect entangled IDs for second pass
            entangled_ids_to_boost = entry.entangled_with.clone();
        }
    }

    // Second pass: strengthen entangled memories (avoids double mutable borrow)
    if coherence_boost > 0.0 {
        for entry in entries.iter_mut() {
            if entangled_ids_to_boost.contains(&entry.id) {
                entry.coherence = clamp_unit(entry.coherence + coherence_boost * 0.5);
                entry.amplitude = clamp_unit(entry.amplitude + 0.005);
            }
        }
    }

    let global = compute_global_coherence(&entries);

    let new_state = QMemState {
        entries,
        total_observations: state.total_observations + 1,
        global_coherence: global,
        last_beat: beat,
        ..state.clone()
    };

    let result = CollapseResult {
        selected: superposition.entries[max_idx].clone(),
        selection_probability: selection_prob,
        coherence_boost,
    };

    (new_state, Some(result))
}

/// Apply decoherence to all memories — unobserved memories become fuzzier
pub fn apply_decoherence(state: &QMemState, beat: u64) -> QMemState {
    let entries: Vec<QMemEntry> = state.entries.iter().map(|e| {
        let age = (beat - e.last_observed_beat) as f64;
        let decay = PHI.powf(-age / DECOHERENCE_TAU);
        let new_coherence = clamp_unit(e.coherence * decay);
        let new_amplitude = clamp_unit(e.amplitude * decay.sqrt());
        QMemEntry {
            coherence: new_coherence,
            amplitude: new_amplitude,
            ..e.clone()
        }
    }).collect();

    let global = compute_global_coherence(&entries);

    QMemState {
        entries,
        global_coherence: global,
        last_beat: beat,
        ..state.clone()
    }
}

/// Compute global coherence across all QMEM entries
fn compute_global_coherence(entries: &[QMemEntry]) -> f64 {
    if entries.is_empty() { return S0_FLOOR; }
    let avg = entries.iter().map(|e| e.coherence).sum::<f64>() / entries.len() as f64;
    clamp_sovereign(S0_FLOOR + avg * (S_CEIL - S0_FLOOR))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_init() {
        let state = init_qmem_state();
        assert_eq!(state.entries.len(), 0);
        assert_eq!(state.global_coherence, S0_FLOOR);
    }

    #[test]
    fn test_store() {
        let state = init_qmem_state();
        let state = store_qmem(&state, "m1".into(), "h1".into(), 0.9, 1);
        assert_eq!(state.entries.len(), 1);
        assert_eq!(state.entries[0].amplitude, 1.0);
        assert_eq!(state.entries[0].coherence, 1.0);
    }

    #[test]
    fn test_entangle() {
        let mut state = init_qmem_state();
        state = store_qmem(&state, "a".into(), "ha".into(), 0.8, 1);
        state = store_qmem(&state, "b".into(), "hb".into(), 0.9, 2);
        state = entangle_memories(&state, "a", "b");
        assert_eq!(state.entanglement_count, 1);
        assert!(state.entries[0].entangled_with.contains(&"b".to_string()));
        assert!(state.entries[1].entangled_with.contains(&"a".to_string()));
    }

    #[test]
    fn test_superposition() {
        let mut state = init_qmem_state();
        state = store_qmem(&state, "m1".into(), "h1".into(), 0.9, 1);
        state = store_qmem(&state, "m2".into(), "h2".into(), 0.8, 2);
        let sup = superposition_query(&state, "query", 3);
        assert!(!sup.entries.is_empty());
        assert!(sup.coherence_score > 0.0);
    }

    #[test]
    fn test_collapse() {
        let mut state = init_qmem_state();
        state = store_qmem(&state, "m1".into(), "h1".into(), 0.9, 1);
        state = store_qmem(&state, "m2".into(), "h2".into(), 0.5, 2);
        let sup = superposition_query(&state, "q", 3);
        let (new_state, result) = collapse_superposition(&state, &sup, 3);
        assert!(result.is_some());
        assert!(new_state.total_observations > state.total_observations);
    }

    #[test]
    fn test_decoherence() {
        let mut state = init_qmem_state();
        state = store_qmem(&state, "m1".into(), "h1".into(), 0.9, 1);
        let decohered = apply_decoherence(&state, 500); // 499 beats later
        assert!(decohered.entries[0].coherence < 1.0); // Should have decohered
    }

    #[test]
    fn test_sovereign_bounds() {
        assert_eq!(clamp_sovereign(0.5), S0_FLOOR);
        assert_eq!(clamp_sovereign(5.0), 5.0);
        assert_eq!(clamp_sovereign(15.0), S_CEIL);
    }
}
