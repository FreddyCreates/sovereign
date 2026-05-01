// Rust Engine Library Root
// Exports all animal engines for FFI integration with Motoko
// Attribution: Alfredo Medina Hernandez

pub mod animal_engines {
    pub mod nova;
    pub mod brain;
    pub mod mneme;

    // Re-export NOVA for convenient access
    pub use nova::{
        NovaState,
        fire_nova,
        fire_nova_batch,
        init_nova_state,
        PHI,
        S0_FLOOR,
        S_CEIL,
    };

    // Re-export BRAIN — Hebbian weight computation
    pub use brain::{
        BrainState,
        HebbianWeight,
        ActorActivation,
        fire_brain,
        fire_brain_batch,
        init_brain_state,
        get_edge_weight,
        get_top_connections,
        compute_actor_centrality,
    };

    // Re-export MNEME — Memory substrate engine
    pub use mneme::{
        MnemeState,
        MemoryEntry,
        MemorySpace,
        MemoryQueryResult,
        init_mneme_state,
        store_memory,
        reingest_memory,
        apply_decay,
        query_by_space,
        get_top_memories,
    };
}

// Export constants at crate level
pub use animal_engines::{PHI, S0_FLOOR, S_CEIL};

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_constants() {
        assert_eq!(PHI, 1.6180339887498948482);
        assert_eq!(S0_FLOOR, 0.75);
        assert_eq!(S_CEIL, 9.75);
    }

    #[test]
    fn test_brain_accessible() {
        let state = animal_engines::init_brain_state();
        assert_eq!(state.weights.len(), 240);
    }

    #[test]
    fn test_mneme_accessible() {
        let state = animal_engines::init_mneme_state();
        assert_eq!(state.entries.len(), 0);
    }
}
