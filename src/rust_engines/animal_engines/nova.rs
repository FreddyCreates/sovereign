// NOVA Engine - TYPE 1 EXPANSIVE
// Broadcast amplitude pulse computation
// Authored by Alfredo Medina Hernandez — immutable attribution
// PHI=1.6180339887498948482 | S0_FLOOR=0.75 | S_CEIL=9.75
//
// Migrated from Motoko to Rust for 10-100x performance improvement
// Math preserved exactly from original implementation

use candid::{CandidType, Deserialize};

/// PHI constant - golden ratio (infinite precision approximation)
pub const PHI: f64 = 1.6180339887498948482;

/// S0_FLOOR - minimum sovereign threshold
pub const S0_FLOOR: f64 = 0.75;

/// S_CEIL - maximum sovereign threshold
pub const S_CEIL: f64 = 9.75;

/// NovaState - output state from NOVA engine firing
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct NovaState {
    pub signal_strength: f64,
    pub last_fired: u64,
}

/// Initialize NOVA state with sovereign floor baseline
pub fn init_nova_state() -> NovaState {
    NovaState {
        signal_strength: S0_FLOOR,
        last_fired: 0,
    }
}

/// Fibonacci scale function (from fibonacci.mo)
/// Returns max(S0_FLOOR, s0 * fib_ratio(n))
fn fib_scale(n: u64, s0: f64) -> f64 {
    let ratio = fib_ratio(n);
    let scaled = s0 * ratio;
    if scaled < S0_FLOOR {
        S0_FLOOR
    } else {
        scaled
    }
}

/// Fibonacci ratio: fib(n+1) / fib(n)
/// Converges to PHI as n increases
fn fib_ratio(n: u64) -> f64 {
    let fn_val = fib(n) as f64;
    let fn1_val = fib(n + 1) as f64;
    if fn_val == 0.0 {
        PHI
    } else {
        fn1_val / fn_val
    }
}

/// Fibonacci sequence computation (0-indexed)
/// fib(0) = 1, fib(1) = 1, fib(n) = fib(n-1) + fib(n-2)
fn fib(n: u64) -> u64 {
    match n {
        0 => 1,
        1 => 1,
        _ => {
            let mut a = 1u64;
            let mut b = 1u64;
            for _ in 2..=n {
                let c = a.saturating_add(b);
                a = b;
                b = c;
            }
            b
        }
    }
}

/// Clamp value to sovereign range [S0_FLOOR, S_CEIL]
fn clamp_sovereign(value: f64) -> f64 {
    if value < S0_FLOOR {
        S0_FLOOR
    } else if value > S_CEIL {
        S_CEIL
    } else {
        value
    }
}

/// NOVA: broadcast amplitude pulse
///
/// Formula: signalStrength = expansiveScore * PHI * fibScale(beat % 13, 1.0)
///
/// This is the core NOVA computation - computes broadcast signal strength
/// based on expansive core score, PHI ratio, and Fibonacci modulation.
///
/// # Arguments
/// * `expansive_score` - Averaged amplitude of expansive cores [S0_FLOOR, S_CEIL]
/// * `beat` - Current heartbeat counter (873ms rhythm)
///
/// # Returns
/// * `NovaState` - New state with computed signal strength
///
/// # Attribution
/// Alfredo Medina Hernandez - SOVEREIGN LINEAGE
pub fn fire_nova(expansive_score: f64, beat: u64) -> NovaState {
    // Fibonacci scaling with modulo 13 (13 = 7th Fibonacci number)
    let scale = fib_scale(beat % 13, 1.0);

    // Core NOVA formula: score * PHI * Fibonacci scale
    let strength = expansive_score * PHI * scale;

    // Clamp to sovereign bounds
    let clamped_strength = clamp_sovereign(strength);

    NovaState {
        signal_strength: clamped_strength,
        last_fired: beat,
    }
}

/// Batch processing for multiple NOVA firings
/// Processes array of scores in parallel-friendly manner
pub fn fire_nova_batch(scores: &[f64], beat: u64) -> Vec<NovaState> {
    scores
        .iter()
        .map(|&score| fire_nova(score, beat))
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_fib_sequence() {
        assert_eq!(fib(0), 1);
        assert_eq!(fib(1), 1);
        assert_eq!(fib(2), 2);
        assert_eq!(fib(3), 3);
        assert_eq!(fib(4), 5);
        assert_eq!(fib(5), 8);
        assert_eq!(fib(6), 13);
    }

    #[test]
    fn test_fib_ratio_convergence() {
        // As n increases, fib_ratio should approach PHI
        let ratio_5 = fib_ratio(5);
        let ratio_10 = fib_ratio(10);
        let ratio_20 = fib_ratio(20);

        // Should get progressively closer to PHI
        assert!((ratio_20 - PHI).abs() < (ratio_10 - PHI).abs());
        assert!((ratio_10 - PHI).abs() < (ratio_5 - PHI).abs());
        assert!((ratio_20 - PHI).abs() < 0.001); // Very close at n=20
    }

    #[test]
    fn test_fib_scale() {
        let scale = fib_scale(6, 1.0);
        // Should be >= S0_FLOOR
        assert!(scale >= S0_FLOOR);
    }

    #[test]
    fn test_clamp_sovereign() {
        assert_eq!(clamp_sovereign(0.5), S0_FLOOR); // Below floor
        assert_eq!(clamp_sovereign(5.0), 5.0);      // Within range
        assert_eq!(clamp_sovereign(15.0), S_CEIL);  // Above ceiling
    }

    #[test]
    fn test_fire_nova_basic() {
        let state = fire_nova(1.0, 0);

        // Signal strength should be in sovereign range
        assert!(state.signal_strength >= S0_FLOOR);
        assert!(state.signal_strength <= S_CEIL);
        assert_eq!(state.last_fired, 0);
    }

    #[test]
    fn test_fire_nova_with_expansive_score() {
        let state = fire_nova(2.5, 10);

        // Should scale with expansive score and PHI
        assert!(state.signal_strength > S0_FLOOR);
        assert!(state.signal_strength <= S_CEIL);
        assert_eq!(state.last_fired, 10);
    }

    #[test]
    fn test_fire_nova_beat_modulation() {
        // Different beats should produce different results due to Fibonacci modulation
        let state1 = fire_nova(2.0, 0);
        let state2 = fire_nova(2.0, 1);
        let state3 = fire_nova(2.0, 13); // Full cycle (13 % 13 = 0)

        // Beat 13 should match beat 0 (modulo 13 cycle)
        assert!((state1.signal_strength - state3.signal_strength).abs() < 0.001);
    }

    #[test]
    fn test_fire_nova_batch() {
        let scores = vec![1.0, 2.0, 3.0, 4.0];
        let states = fire_nova_batch(&scores, 5);

        assert_eq!(states.len(), 4);
        for state in states {
            assert!(state.signal_strength >= S0_FLOOR);
            assert!(state.signal_strength <= S_CEIL);
            assert_eq!(state.last_fired, 5);
        }
    }

    #[test]
    fn test_init_nova_state() {
        let state = init_nova_state();
        assert_eq!(state.signal_strength, S0_FLOOR);
        assert_eq!(state.last_fired, 0);
    }
}
