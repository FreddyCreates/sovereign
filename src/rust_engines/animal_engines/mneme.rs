// MNEME Engine - TYPE 2 RECEPTIVE
// Memory substrate engine — content-addressable memory with PHI-decay
// Authored by Alfredo Medina Hernandez — immutable attribution
// PHI=1.6180339887498948482 | S0_FLOOR=0.75 | S_CEIL=9.75
//
// ΜΝΗΜΗ (Greek: Memory) — Named after the Titaness of Memory, mother of the Muses.
// Implements a sovereign memory palace with three spaces:
//   1. FOUNDER_PALACE — human-readable doctrine-forward memories
//   2. AI_BUILDER_WORKSPACE — architecture patterns and ring status
//   3. ORGANISM_CONSCIOUSNESS_RESIDENCE — organism self-memories
//
// Memory decay follows inverse-PHI curve: relevance(t) = base × PHI^(-age/τ)
// Re-ingestion (Law 09) resets decay timer and compounds resonance score.
// Nothing is ever deleted — memories decay but never reach zero (sovereign floor).

use candid::{CandidType, Deserialize};

/// PHI constant — golden ratio
pub const PHI: f64 = 1.6180339887498948482;
pub const PHI_INV: f64 = 0.6180339887498948482;
pub const S0_FLOOR: f64 = 0.75;
pub const S_CEIL: f64 = 9.75;

/// Decay time constant τ — beats until memory decays to PHI_INV of original
pub const DECAY_TAU: f64 = 343.0; // First Jubilee (7 × 49)

/// Ring milestones — PHI^n thresholds
pub const RING_1: f64 = 1.6180339887498948482;       // PHI^1
pub const RING_2: f64 = 2.6180339887498948482;       // PHI^2
pub const RING_3: f64 = 4.2360679774997896964;       // PHI^3
pub const RING_4: f64 = 6.8541019662496845446;       // PHI^4

/// Memory space classification
#[derive(Clone, Debug, CandidType, Deserialize, PartialEq)]
pub enum MemorySpace {
    FounderPalace,
    AIBuilderWorkspace,
    OrganismConsciousnessResidence,
}

/// A single memory entry in the palace
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct MemoryEntry {
    pub id: String,
    pub space: MemorySpace,
    pub content_hash: String,        // SHA3 of content — content-addressable
    pub resonance_score: f64,        // [S0_FLOOR, S_CEIL] — compounds on re-ingestion
    pub doctrine_alignment: f64,     // [0.0, 1.0]
    pub ring_count: u32,             // PHI^n milestones crossed
    pub ingestion_count: u64,        // Times re-ingested (Law 09)
    pub created_at_beat: u64,
    pub last_accessed_beat: u64,
    pub relevance: f64,              // Current relevance after decay [S0_FLOOR, S_CEIL]
}

/// MnemeState — complete memory engine state
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct MnemeState {
    pub entries: Vec<MemoryEntry>,
    pub total_memories: u64,
    pub total_ingestions: u64,
    pub global_resonance: f64,       // Average resonance across all memories
    pub last_beat: u64,
    pub palace_coherence: f64,       // [S0_FLOOR, S_CEIL]
}

/// Query result for memory retrieval
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct MemoryQueryResult {
    pub found: bool,
    pub entries: Vec<MemoryEntry>,
    pub relevance_sum: f64,
}

/// Clamp to sovereign range
fn clamp_sovereign(value: f64) -> f64 {
    if value < S0_FLOOR {
        S0_FLOOR
    } else if value > S_CEIL {
        S_CEIL
    } else {
        value
    }
}

/// Initialize empty memory engine
pub fn init_mneme_state() -> MnemeState {
    MnemeState {
        entries: Vec::new(),
        total_memories: 0,
        total_ingestions: 0,
        global_resonance: S0_FLOOR,
        last_beat: 0,
        palace_coherence: S0_FLOOR,
    }
}

/// Compute memory decay based on age
///
/// Formula: relevance(age) = base_resonance × PHI^(-age / τ)
///
/// This models biological memory decay — exponential with PHI base.
/// Memories never fully decay below S0_FLOOR (sovereign floor).
/// Re-ingestion resets the age counter, making the memory "fresh" again.
fn compute_decay(base_resonance: f64, age_beats: u64) -> f64 {
    if age_beats == 0 {
        return base_resonance;
    }
    let exponent = -(age_beats as f64) / DECAY_TAU;
    let decay_factor = PHI.powf(exponent);
    clamp_sovereign(base_resonance * decay_factor)
}

/// Compute ring count from resonance score
/// Rings are milestones at PHI^1, PHI^2, PHI^3, PHI^4
fn compute_ring_count(resonance: f64) -> u32 {
    if resonance >= RING_4 {
        4
    } else if resonance >= RING_3 {
        3
    } else if resonance >= RING_2 {
        2
    } else if resonance >= RING_1 {
        1
    } else {
        0
    }
}

/// Store a new memory in the palace
///
/// # Arguments
/// * `state` — Current memory engine state
/// * `id` — Unique memory identifier
/// * `space` — Which palace space to store in
/// * `content_hash` — SHA3 hash of the content
/// * `doctrine_score` — Doctrine alignment of this memory
/// * `beat` — Current heartbeat counter
///
/// # Attribution
/// Alfredo Medina Hernandez — SOVEREIGN LINEAGE
pub fn store_memory(
    state: &MnemeState,
    id: String,
    space: MemorySpace,
    content_hash: String,
    doctrine_score: f64,
    beat: u64,
) -> MnemeState {
    let entry = MemoryEntry {
        id,
        space,
        content_hash,
        resonance_score: S0_FLOOR,
        doctrine_alignment: doctrine_score,
        ring_count: 0,
        ingestion_count: 1,
        created_at_beat: beat,
        last_accessed_beat: beat,
        relevance: S0_FLOOR,
    };

    let mut new_entries = state.entries.clone();
    new_entries.push(entry);

    let coherence = compute_palace_coherence(&new_entries);

    MnemeState {
        entries: new_entries,
        total_memories: state.total_memories + 1,
        total_ingestions: state.total_ingestions + 1,
        global_resonance: coherence,
        last_beat: beat,
        palace_coherence: coherence,
    }
}

/// Re-ingest a memory (Law 09: every artifact is food)
///
/// Compounds the resonance score: new_resonance = old × (1 + doctrine × PHI × 0.01)
/// Resets the decay timer (last_accessed_beat = current beat)
/// Checks for ring milestone crossings
pub fn reingest_memory(
    state: &MnemeState,
    memory_id: &str,
    doctrine_score: f64,
    beat: u64,
) -> MnemeState {
    let new_entries: Vec<MemoryEntry> = state
        .entries
        .iter()
        .map(|entry| {
            if entry.id == memory_id {
                // Compound resonance (Law 23: never resets)
                let new_resonance =
                    clamp_sovereign(entry.resonance_score + (doctrine_score * PHI * 0.01));
                let new_ring = compute_ring_count(new_resonance);

                MemoryEntry {
                    id: entry.id.clone(),
                    space: entry.space.clone(),
                    content_hash: entry.content_hash.clone(),
                    resonance_score: new_resonance,
                    doctrine_alignment: doctrine_score,
                    ring_count: new_ring,
                    ingestion_count: entry.ingestion_count + 1,
                    created_at_beat: entry.created_at_beat,
                    last_accessed_beat: beat,
                    relevance: new_resonance, // Reset decay on re-ingestion
                }
            } else {
                entry.clone()
            }
        })
        .collect();

    let coherence = compute_palace_coherence(&new_entries);

    MnemeState {
        entries: new_entries,
        total_memories: state.total_memories,
        total_ingestions: state.total_ingestions + 1,
        global_resonance: coherence,
        last_beat: beat,
        palace_coherence: coherence,
    }
}

/// Apply decay to all memories (called every heartbeat)
pub fn apply_decay(state: &MnemeState, beat: u64) -> MnemeState {
    let new_entries: Vec<MemoryEntry> = state
        .entries
        .iter()
        .map(|entry| {
            let age = beat.saturating_sub(entry.last_accessed_beat);
            let relevance = compute_decay(entry.resonance_score, age);
            MemoryEntry {
                relevance,
                ..entry.clone()
            }
        })
        .collect();

    let coherence = compute_palace_coherence(&new_entries);

    MnemeState {
        entries: new_entries,
        total_memories: state.total_memories,
        total_ingestions: state.total_ingestions,
        global_resonance: coherence,
        last_beat: beat,
        palace_coherence: coherence,
    }
}

/// Query memories by space — returns all memories in a given palace space
pub fn query_by_space(state: &MnemeState, space: &MemorySpace) -> MemoryQueryResult {
    let matches: Vec<MemoryEntry> = state
        .entries
        .iter()
        .filter(|e| &e.space == space)
        .cloned()
        .collect();
    let relevance_sum: f64 = matches.iter().map(|e| e.relevance).sum();
    MemoryQueryResult {
        found: !matches.is_empty(),
        entries: matches,
        relevance_sum,
    }
}

/// Get the most resonant memories (top N by relevance)
pub fn get_top_memories(state: &MnemeState, n: usize) -> Vec<MemoryEntry> {
    let mut sorted = state.entries.clone();
    sorted.sort_by(|a, b| {
        b.relevance
            .partial_cmp(&a.relevance)
            .unwrap_or(std::cmp::Ordering::Equal)
    });
    sorted.into_iter().take(n).collect()
}

/// Compute palace coherence — average resonance across all memories
fn compute_palace_coherence(entries: &[MemoryEntry]) -> f64 {
    if entries.is_empty() {
        return S0_FLOOR;
    }
    let sum: f64 = entries.iter().map(|e| e.resonance_score).sum();
    clamp_sovereign(sum / entries.len() as f64)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_init_state() {
        let state = init_mneme_state();
        assert_eq!(state.entries.len(), 0);
        assert_eq!(state.palace_coherence, S0_FLOOR);
    }

    #[test]
    fn test_store_memory() {
        let state = init_mneme_state();
        let state = store_memory(
            &state,
            "mem_001".to_string(),
            MemorySpace::FounderPalace,
            "hash_abc".to_string(),
            0.85,
            1,
        );
        assert_eq!(state.entries.len(), 1);
        assert_eq!(state.total_memories, 1);
        assert_eq!(state.entries[0].id, "mem_001");
    }

    #[test]
    fn test_reingest_compounds() {
        let state = init_mneme_state();
        let state = store_memory(
            &state,
            "mem_001".to_string(),
            MemorySpace::AIBuilderWorkspace,
            "hash_abc".to_string(),
            0.90,
            1,
        );

        let initial_resonance = state.entries[0].resonance_score;

        let state = reingest_memory(&state, "mem_001", 0.90, 2);
        let new_resonance = state.entries[0].resonance_score;

        // Resonance should have compounded
        assert!(new_resonance > initial_resonance);
        assert_eq!(state.entries[0].ingestion_count, 2);
    }

    #[test]
    fn test_decay() {
        let relevance = compute_decay(5.0, 0);
        assert_eq!(relevance, 5.0); // No decay at age 0

        let relevance_old = compute_decay(5.0, 1000);
        assert!(relevance_old < 5.0); // Should have decayed
        assert!(relevance_old >= S0_FLOOR); // But never below floor
    }

    #[test]
    fn test_ring_milestones() {
        assert_eq!(compute_ring_count(1.0), 0);
        assert_eq!(compute_ring_count(1.7), 1);
        assert_eq!(compute_ring_count(3.0), 2);
        assert_eq!(compute_ring_count(5.0), 3);
        assert_eq!(compute_ring_count(7.0), 4);
    }

    #[test]
    fn test_sovereign_bounds() {
        assert_eq!(clamp_sovereign(0.5), S0_FLOOR);
        assert_eq!(clamp_sovereign(5.0), 5.0);
        assert_eq!(clamp_sovereign(15.0), S_CEIL);
    }

    #[test]
    fn test_query_by_space() {
        let mut state = init_mneme_state();
        state = store_memory(
            &state,
            "mem_a".to_string(),
            MemorySpace::FounderPalace,
            "h1".to_string(),
            0.8,
            1,
        );
        state = store_memory(
            &state,
            "mem_b".to_string(),
            MemorySpace::AIBuilderWorkspace,
            "h2".to_string(),
            0.9,
            2,
        );
        state = store_memory(
            &state,
            "mem_c".to_string(),
            MemorySpace::FounderPalace,
            "h3".to_string(),
            0.7,
            3,
        );

        let result = query_by_space(&state, &MemorySpace::FounderPalace);
        assert!(result.found);
        assert_eq!(result.entries.len(), 2);
    }
}
