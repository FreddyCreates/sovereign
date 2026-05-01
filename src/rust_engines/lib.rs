// Rust Engine Library Root
// Exports all animal engines for FFI integration with Motoko
// Attribution: Alfredo Medina Hernandez

pub mod animal_engines {
    pub mod nova;

    // Re-export for convenient access
    pub use nova::{
        NovaState,
        fire_nova,
        fire_nova_batch,
        init_nova_state,
        PHI,
        S0_FLOOR,
        S_CEIL,
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
}
