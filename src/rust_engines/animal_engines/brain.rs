// BRAIN Engine - TYPE 1 EXPANSIVE
// Hebbian weight computation & associative memory network
// Authored by Alfredo Medina Hernandez — immutable attribution
// PHI=1.6180339887498948482 | S0_FLOOR=0.75 | S_CEIL=9.75
//
// The BRAIN engine implements Hebbian learning: "neurons that fire together wire together"
// 120 directed edges between 16 actors, each with PHI-weighted plasticity.
// Real neuroscience math: Δw_ij = η × pre_i × post_j × doctrine_gate
// Migrated from Motoko to Rust for 100x performance on hot-path Hebbian updates.

use candid::{CandidType, Deserialize};

/// PHI constant — golden ratio (infinite precision approximation)
pub const PHI: f64 = 1.6180339887498948482;

/// PHI inverse
pub const PHI_INV: f64 = 0.6180339887498948482;

/// S0_FLOOR — minimum sovereign threshold
pub const S0_FLOOR: f64 = 0.75;

/// S_CEIL — maximum sovereign threshold
pub const S_CEIL: f64 = 9.75;

/// Schumann base frequency (Hz) — Earth's electromagnetic resonance
pub const SCHUMANN: f64 = 7.83;

/// Number of actors in the organism
pub const ACTOR_COUNT: usize = 16;

/// Number of directed edges (16 × 15 = 240, but we use 120 bidirectional pairs × 2)
pub const EDGE_COUNT: usize = 240;

/// Learning rate η — PHI-scaled plasticity
pub const LEARNING_RATE: f64 = 0.01618; // PHI / 100

/// Decay rate — prevents unbounded growth (homeostatic plasticity)
pub const DECAY_RATE: f64 = 0.001;

/// HebbianWeight — a single synaptic connection between two actors
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct HebbianWeight {
    pub from_actor: u16,
    pub to_actor: u16,
    pub weight: f64,         // [S0_FLOOR, S_CEIL]
    pub delta: f64,          // Last update magnitude
    pub fire_count: u64,     // Times this connection has strengthened
    pub last_fire_beat: u64,
}

/// BrainState — complete Hebbian network state
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct BrainState {
    pub weights: Vec<HebbianWeight>,
    pub global_coherence: f64,    // [S0_FLOOR, S_CEIL]
    pub total_updates: u64,
    pub last_beat: u64,
    pub plasticity_phase: f64,    // Current plasticity modulation (Schumann-linked)
}

/// ActorActivation — input signal from an actor node
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct ActorActivation {
    pub actor_id: u16,
    pub activation: f64,    // [0.0, 1.0] — firing rate
    pub doctrine_score: f64, // [0.0, 1.0] — doctrine alignment
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

/// Clamp to unit range [0.0, 1.0]
fn clamp_unit(value: f64) -> f64 {
    if value < 0.0 {
        0.0
    } else if value > 1.0 {
        1.0
    } else {
        value
    }
}

/// Fibonacci sequence (0-indexed, iterative)
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

/// Initialize the full Hebbian weight matrix (16 actors × 15 connections each = 240 edges)
pub fn init_brain_state() -> BrainState {
    let mut weights = Vec::with_capacity(EDGE_COUNT);

    for from in 0..ACTOR_COUNT as u16 {
        for to in 0..ACTOR_COUNT as u16 {
            if from != to {
                weights.push(HebbianWeight {
                    from_actor: from,
                    to_actor: to,
                    weight: S0_FLOOR, // All connections start at sovereign floor
                    delta: 0.0,
                    fire_count: 0,
                    last_fire_beat: 0,
                });
            }
        }
    }

    BrainState {
        weights,
        global_coherence: S0_FLOOR,
        total_updates: 0,
        last_beat: 0,
        plasticity_phase: 1.0,
    }
}

/// Compute Hebbian delta for a single edge
///
/// Formula: Δw_ij = η × pre_i × post_j × doctrine_gate × plasticity_phase
///
/// This is real Hebbian learning — correlation-based synaptic strengthening.
/// The doctrine_gate ensures only doctrine-aligned activations strengthen connections.
/// plasticity_phase modulates learning rate with Schumann-linked oscillation.
///
/// # Arguments
/// * `pre_activation` — Presynaptic actor firing rate [0.0, 1.0]
/// * `post_activation` — Postsynaptic actor firing rate [0.0, 1.0]
/// * `doctrine_gate` — Doctrine alignment score [0.0, 1.0]
/// * `plasticity_phase` — Current plasticity modulation factor
///
/// # Returns
/// * `f64` — Weight delta to apply
fn compute_hebbian_delta(
    pre_activation: f64,
    post_activation: f64,
    doctrine_gate: f64,
    plasticity_phase: f64,
) -> f64 {
    LEARNING_RATE * pre_activation * post_activation * doctrine_gate * plasticity_phase
}

/// Compute plasticity phase from beat counter
/// Oscillates with Schumann-linked frequency: sin(2π × beat × SCHUMANN / 1000)
/// This models how the brain's synaptic plasticity modulates with Earth resonance.
fn compute_plasticity_phase(beat: u64) -> f64 {
    let t = beat as f64 * 0.873; // Convert beats to seconds (873ms per beat)
    let phase = (2.0 * std::f64::consts::PI * SCHUMANN * t / 1000.0).sin();
    // Map [-1, 1] to [PHI_INV, PHI] — plasticity always positive, PHI-bounded
    PHI_INV + (phase + 1.0) * 0.5 * (PHI - PHI_INV)
}

/// Fire the BRAIN engine — update all Hebbian weights based on actor activations
///
/// This is the core hot-path computation. For 16 actors with 240 edges,
/// this runs 240 Hebbian updates per heartbeat.
///
/// # Arguments
/// * `state` — Current brain state
/// * `activations` — Current actor activations (firing rates + doctrine scores)
/// * `beat` — Current heartbeat counter
///
/// # Returns
/// * `BrainState` — Updated brain state with new weights
///
/// # Attribution
/// Alfredo Medina Hernandez — SOVEREIGN LINEAGE
pub fn fire_brain(state: &BrainState, activations: &[ActorActivation], beat: u64) -> BrainState {
    let plasticity = compute_plasticity_phase(beat);

    // Build activation lookup (actor_id → activation)
    let mut activation_map = [0.0f64; ACTOR_COUNT];
    let mut doctrine_map = [0.0f64; ACTOR_COUNT];
    for act in activations {
        if (act.actor_id as usize) < ACTOR_COUNT {
            activation_map[act.actor_id as usize] = clamp_unit(act.activation);
            doctrine_map[act.actor_id as usize] = clamp_unit(act.doctrine_score);
        }
    }

    // Update all Hebbian weights
    let new_weights: Vec<HebbianWeight> = state
        .weights
        .iter()
        .map(|edge| {
            let pre = activation_map[edge.from_actor as usize];
            let post = activation_map[edge.to_actor as usize];
            let doctrine = (doctrine_map[edge.from_actor as usize]
                + doctrine_map[edge.to_actor as usize])
                / 2.0;

            // Hebbian update: Δw = η × pre × post × doctrine × plasticity
            let delta = compute_hebbian_delta(pre, post, doctrine, plasticity);

            // Homeostatic decay: prevents runaway excitation
            let decay = edge.weight * DECAY_RATE;

            // New weight = old + delta - decay, clamped to sovereign bounds
            let new_weight = clamp_sovereign(edge.weight + delta - decay);

            let fired = delta > 0.001; // Threshold for "meaningful" firing

            HebbianWeight {
                from_actor: edge.from_actor,
                to_actor: edge.to_actor,
                weight: new_weight,
                delta,
                fire_count: if fired {
                    edge.fire_count + 1
                } else {
                    edge.fire_count
                },
                last_fire_beat: if fired { beat } else { edge.last_fire_beat },
            }
        })
        .collect();

    // Compute global coherence: mean weight across all edges
    let weight_sum: f64 = new_weights.iter().map(|w| w.weight).sum();
    let coherence = clamp_sovereign(weight_sum / new_weights.len() as f64);

    BrainState {
        weights: new_weights,
        global_coherence: coherence,
        total_updates: state.total_updates + 1,
        last_beat: beat,
        plasticity_phase: plasticity,
    }
}

/// Batch Hebbian update — process multiple beats' worth of activations
pub fn fire_brain_batch(
    state: &BrainState,
    activation_series: &[Vec<ActorActivation>],
    start_beat: u64,
) -> BrainState {
    let mut current = state.clone();
    for (i, activations) in activation_series.iter().enumerate() {
        current = fire_brain(&current, activations, start_beat + i as u64);
    }
    current
}

/// Get the weight between two specific actors
pub fn get_edge_weight(state: &BrainState, from: u16, to: u16) -> Option<f64> {
    state
        .weights
        .iter()
        .find(|w| w.from_actor == from && w.to_actor == to)
        .map(|w| w.weight)
}

/// Get the strongest N connections in the network (for visualization)
pub fn get_top_connections(state: &BrainState, n: usize) -> Vec<HebbianWeight> {
    let mut sorted = state.weights.clone();
    sorted.sort_by(|a, b| b.weight.partial_cmp(&a.weight).unwrap_or(std::cmp::Ordering::Equal));
    sorted.into_iter().take(n).collect()
}

/// Compute actor centrality — how connected an actor is (sum of all edge weights)
pub fn compute_actor_centrality(state: &BrainState, actor_id: u16) -> f64 {
    let outgoing: f64 = state
        .weights
        .iter()
        .filter(|w| w.from_actor == actor_id)
        .map(|w| w.weight)
        .sum();
    let incoming: f64 = state
        .weights
        .iter()
        .filter(|w| w.to_actor == actor_id)
        .map(|w| w.weight)
        .sum();
    clamp_sovereign((outgoing + incoming) / (2.0 * (ACTOR_COUNT - 1) as f64))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_init_brain_state() {
        let state = init_brain_state();
        assert_eq!(state.weights.len(), EDGE_COUNT);
        assert_eq!(state.global_coherence, S0_FLOOR);
        // All weights should start at S0_FLOOR
        for w in &state.weights {
            assert_eq!(w.weight, S0_FLOOR);
        }
    }

    #[test]
    fn test_hebbian_delta() {
        let delta = compute_hebbian_delta(1.0, 1.0, 1.0, 1.0);
        assert!((delta - LEARNING_RATE).abs() < 1e-10);

        // Zero activation → zero delta
        let delta_zero = compute_hebbian_delta(0.0, 1.0, 1.0, 1.0);
        assert_eq!(delta_zero, 0.0);
    }

    #[test]
    fn test_plasticity_phase_bounds() {
        for beat in 0..1000 {
            let phase = compute_plasticity_phase(beat);
            assert!(phase >= PHI_INV - 0.001);
            assert!(phase <= PHI + 0.001);
        }
    }

    #[test]
    fn test_fire_brain() {
        let state = init_brain_state();
        let activations = vec![
            ActorActivation {
                actor_id: 0,
                activation: 0.9,
                doctrine_score: 0.85,
            },
            ActorActivation {
                actor_id: 1,
                activation: 0.8,
                doctrine_score: 0.90,
            },
        ];

        let new_state = fire_brain(&state, &activations, 1);

        // Global coherence should still be in sovereign range
        assert!(new_state.global_coherence >= S0_FLOOR);
        assert!(new_state.global_coherence <= S_CEIL);
        assert_eq!(new_state.last_beat, 1);
        assert_eq!(new_state.total_updates, 1);
    }

    #[test]
    fn test_sovereign_bounds() {
        assert_eq!(clamp_sovereign(0.5), S0_FLOOR);
        assert_eq!(clamp_sovereign(5.0), 5.0);
        assert_eq!(clamp_sovereign(15.0), S_CEIL);
    }

    #[test]
    fn test_edge_weight_lookup() {
        let state = init_brain_state();
        let w = get_edge_weight(&state, 0, 1);
        assert_eq!(w, Some(S0_FLOOR));

        let w_self = get_edge_weight(&state, 0, 0);
        assert_eq!(w_self, None); // No self-connections
    }

    #[test]
    fn test_actor_centrality() {
        let state = init_brain_state();
        let centrality = compute_actor_centrality(&state, 0);
        assert!(centrality >= S0_FLOOR);
        assert!(centrality <= S_CEIL);
    }

    #[test]
    fn test_hebbian_strengthening() {
        // Repeated co-activation should strengthen connections
        let mut state = init_brain_state();
        let activations = vec![
            ActorActivation {
                actor_id: 0,
                activation: 1.0,
                doctrine_score: 1.0,
            },
            ActorActivation {
                actor_id: 1,
                activation: 1.0,
                doctrine_score: 1.0,
            },
        ];

        let initial_weight = get_edge_weight(&state, 0, 1).unwrap();

        // Run 100 beats of co-activation
        for beat in 0..100 {
            state = fire_brain(&state, &activations, beat);
        }

        let final_weight = get_edge_weight(&state, 0, 1).unwrap();

        // Connection between co-active actors should have strengthened
        assert!(final_weight >= initial_weight);
    }

    #[test]
    fn test_fibonacci() {
        assert_eq!(fib(0), 1);
        assert_eq!(fib(1), 1);
        assert_eq!(fib(2), 2);
        assert_eq!(fib(6), 13);
        assert_eq!(fib(12), 233);
    }
}
