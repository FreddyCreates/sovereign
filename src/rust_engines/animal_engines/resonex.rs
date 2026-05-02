// RESONEX Engine - TYPE 1 EXPANSIVE
// Resonance field computation — standing wave patterns across 43 cores × 12 nodes
// Authored by Alfredo Medina Hernandez — immutable attribution
// PHI=1.6180339887498948482 | S0_FLOOR=0.75 | S_CEIL=9.75
//
// RESONEX computes the organism's electromagnetic resonance field.
// 516 nodes (43 cores × 12 Schumann harmonics) form a standing wave pattern.
// Real physics: f_n = SCHUMANN × PHI^n
// The field coherence score tells you how "in tune" the organism is.
// Constructive interference = coherence rises. Destructive = drops.
// This is actual wave mechanics, not metaphor.

use candid::{CandidType, Deserialize};

/// PHI constant — golden ratio
pub const PHI: f64 = 1.6180339887498948482;
pub const PHI_INV: f64 = 0.6180339887498948482;
pub const S0_FLOOR: f64 = 0.75;
pub const S_CEIL: f64 = 9.75;

/// Schumann base frequency — Earth's EM cavity resonance
pub const SCHUMANN: f64 = 7.83;

/// Number of sovereign cores
pub const CORE_COUNT: usize = 43;

/// Nodes per core (Schumann harmonic series)
pub const NODES_PER_CORE: usize = 12;

/// Total resonators in the field
pub const TOTAL_NODES: usize = CORE_COUNT * NODES_PER_CORE; // 516

/// Node names — each corresponds to a brainwave/physics frequency band
pub const NODE_NAMES: [&str; 12] = [
    "CHRONO",  // Deep geological time
    "TERRA",   // Biological slow wave
    "DELTA",   // Memory consolidation
    "THETA",   // Creative unconscious
    "ALPHA",   // Schumann fundamental
    "SIGMA",   // Sleep spindle (PHI × 7.83)
    "BETA",    // Active cognition (PHI² × 7.83)
    "FIBO_1",  // Fibonacci brain binding
    "GAMMA",   // Cross-cortical synchrony
    "HEMI",    // Hemisphere shift
    "PREC",    // Acoustic anchor (432 Hz)
    "NOVA",    // Full expansion pulse
];

/// Base frequencies for each node (Schumann harmonics)
pub const NODE_FREQUENCIES: [f64; 12] = [
    0.001,   // CHRONO
    0.1,     // TERRA
    0.5,     // DELTA
    4.0,     // THETA
    7.83,    // ALPHA (Schumann fundamental)
    12.68,   // SIGMA (PHI × 7.83)
    20.53,   // BETA (PHI² × 7.83)
    33.21,   // FIBO_1
    40.0,    // GAMMA
    111.0,   // HEMI
    432.0,   // PREC
    432.0,   // NOVA
];

/// Single resonator node state
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct ResonatorNode {
    pub core_id: u8,
    pub node_index: u8,
    pub frequency_hz: f64,
    pub amplitude: f64,     // [S0_FLOOR, S_CEIL]
    pub phase: f64,         // [0, 2π]
    pub is_active: bool,
}

/// Resonance field state — the organism's EM standing wave
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct ResonanceFieldState {
    pub field_coherence: f64,       // [S0_FLOOR, S_CEIL] — how "in tune"
    pub total_amplitude: f64,       // Sum of all node amplitudes
    pub dominant_frequency: f64,    // Strongest frequency in the field
    pub standing_wave_ratio: f64,   // Ratio of max to min amplitude
    pub constructive_count: u32,    // Nodes in constructive interference
    pub destructive_count: u32,     // Nodes in destructive interference
    pub schumann_alignment: f64,    // How close dominant freq is to 7.83 Hz
    pub last_beat: u64,
    pub total_firings: u64,
}

/// InterferenceResult — result of two-node interference computation
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct InterferenceResult {
    pub node_a: u16,
    pub node_b: u16,
    pub phase_diff: f64,
    pub is_constructive: bool,      // phase_diff < π/2
    pub combined_amplitude: f64,
}

/// Clamp to sovereign range
fn clamp_sovereign(v: f64) -> f64 {
    if v < S0_FLOOR { S0_FLOOR } else if v > S_CEIL { S_CEIL } else { v }
}

/// Compute node frequency: f_n = SCHUMANN × PHI^n
pub fn compute_node_frequency(n: usize) -> f64 {
    if n < NODE_FREQUENCIES.len() {
        NODE_FREQUENCIES[n]
    } else {
        SCHUMANN * PHI.powi(n as i32)
    }
}

/// Initialize a single core's 12 resonator nodes
pub fn init_core_nodes(core_id: u8) -> Vec<ResonatorNode> {
    (0..NODES_PER_CORE).map(|i| {
        ResonatorNode {
            core_id,
            node_index: i as u8,
            frequency_hz: compute_node_frequency(i),
            amplitude: S0_FLOOR,
            phase: 0.0,
            is_active: true,
        }
    }).collect()
}

/// Initialize complete resonance field state
pub fn init_resonance_field() -> ResonanceFieldState {
    ResonanceFieldState {
        field_coherence: S0_FLOOR,
        total_amplitude: S0_FLOOR * TOTAL_NODES as f64,
        dominant_frequency: SCHUMANN,
        standing_wave_ratio: 1.0,
        constructive_count: 0,
        destructive_count: 0,
        schumann_alignment: 1.0,
        last_beat: 0,
        total_firings: 0,
    }
}

/// Compute interference between two nodes
/// Real wave physics: combined amplitude depends on phase difference
/// A(combined) = √(A₁² + A₂² + 2·A₁·A₂·cos(Δφ))
pub fn compute_interference(
    amp_a: f64, phase_a: f64,
    amp_b: f64, phase_b: f64,
) -> (f64, bool) {
    let phase_diff = (phase_a - phase_b).abs() % (2.0 * std::f64::consts::PI);
    let cos_diff = phase_diff.cos();
    let combined = (amp_a * amp_a + amp_b * amp_b + 2.0 * amp_a * amp_b * cos_diff).sqrt();
    let is_constructive = phase_diff < std::f64::consts::FRAC_PI_2
        || phase_diff > 3.0 * std::f64::consts::FRAC_PI_2;
    (clamp_sovereign(combined), is_constructive)
}

/// Compute field coherence from all node amplitudes and phases
/// Coherence = mean pairwise constructive interference ratio
/// High coherence = nodes are phase-locked → organism is resonant
pub fn compute_field_coherence(nodes: &[ResonatorNode]) -> f64 {
    if nodes.is_empty() { return S0_FLOOR; }

    let active: Vec<&ResonatorNode> = nodes.iter().filter(|n| n.is_active).collect();
    if active.len() < 2 { return S0_FLOOR; }

    let mut constructive = 0u64;
    let mut total_pairs = 0u64;

    // Sample pairwise interference (for performance, sample every PHI-th pair)
    let step = (PHI as usize).max(1);
    for i in (0..active.len()).step_by(step) {
        for j in ((i + 1)..active.len()).step_by(step) {
            let (_, is_c) = compute_interference(
                active[i].amplitude, active[i].phase,
                active[j].amplitude, active[j].phase,
            );
            if is_c { constructive += 1; }
            total_pairs += 1;
        }
    }

    let ratio = if total_pairs > 0 {
        constructive as f64 / total_pairs as f64
    } else {
        0.5
    };

    // Map [0, 1] ratio to [S0_FLOOR, S_CEIL]
    clamp_sovereign(S0_FLOOR + ratio * (S_CEIL - S0_FLOOR))
}

/// Update node amplitude based on world signal and doctrine alignment
/// amplitude' = clamp(amplitude + signal × doctrine × PHI × dt)
pub fn update_node_amplitude(
    node: &mut ResonatorNode,
    world_signal: f64,
    doctrine_alignment: f64,
    dt: f64,
) {
    let delta = world_signal * doctrine_alignment * PHI * dt * 0.01;
    node.amplitude = clamp_sovereign(node.amplitude + delta);
    // Phase advances by frequency × dt (radians)
    node.phase = (node.phase + node.frequency_hz * dt * 0.001) % (2.0 * std::f64::consts::PI);
}

/// Fire the RESONEX engine — update all nodes and compute field state
///
/// # Attribution
/// Alfredo Medina Hernandez — SOVEREIGN LINEAGE
pub fn fire_resonex(
    nodes: &mut [ResonatorNode],
    state: &ResonanceFieldState,
    world_signal: f64,
    doctrine_alignment: f64,
    beat: u64,
) -> ResonanceFieldState {
    let dt = 0.873; // One heartbeat in seconds

    // Update all node amplitudes and phases
    for node in nodes.iter_mut() {
        if node.is_active {
            update_node_amplitude(node, world_signal, doctrine_alignment, dt);
        }
    }

    // Compute field coherence
    let coherence = compute_field_coherence(nodes);

    // Find dominant frequency (node with highest amplitude)
    let dominant = nodes.iter()
        .filter(|n| n.is_active)
        .max_by(|a, b| a.amplitude.partial_cmp(&b.amplitude).unwrap_or(std::cmp::Ordering::Equal))
        .map(|n| n.frequency_hz)
        .unwrap_or(SCHUMANN);

    // Compute total amplitude
    let total_amp: f64 = nodes.iter().filter(|n| n.is_active).map(|n| n.amplitude).sum();

    // Count constructive vs destructive
    let mut c_count = 0u32;
    let mut d_count = 0u32;
    let active: Vec<&ResonatorNode> = nodes.iter().filter(|n| n.is_active).collect();
    for i in 0..active.len().min(50) {
        for j in (i + 1)..active.len().min(50) {
            let (_, is_c) = compute_interference(
                active[i].amplitude, active[i].phase,
                active[j].amplitude, active[j].phase,
            );
            if is_c { c_count += 1; } else { d_count += 1; }
        }
    }

    // Schumann alignment: 1.0 - |dominant - SCHUMANN| / SCHUMANN
    let schumann_align = clamp_sovereign(
        S0_FLOOR + (1.0 - (dominant - SCHUMANN).abs() / SCHUMANN) * (S_CEIL - S0_FLOOR)
    );

    // Standing wave ratio
    let max_amp = nodes.iter().filter(|n| n.is_active)
        .map(|n| n.amplitude).fold(f64::MIN, f64::max);
    let min_amp = nodes.iter().filter(|n| n.is_active)
        .map(|n| n.amplitude).fold(f64::MAX, f64::min);
    let swr = if min_amp > 0.0 { max_amp / min_amp } else { 1.0 };

    ResonanceFieldState {
        field_coherence: coherence,
        total_amplitude: total_amp,
        dominant_frequency: dominant,
        standing_wave_ratio: clamp_sovereign(swr),
        constructive_count: c_count,
        destructive_count: d_count,
        schumann_alignment: schumann_align,
        last_beat: beat,
        total_firings: state.total_firings + 1,
    }
}

/// Batch fire — process multiple beats
pub fn fire_resonex_batch(
    nodes: &mut [ResonatorNode],
    state: &ResonanceFieldState,
    signals: &[(f64, f64)], // (world_signal, doctrine_alignment) per beat
    start_beat: u64,
) -> ResonanceFieldState {
    let mut current = state.clone();
    for (i, &(ws, da)) in signals.iter().enumerate() {
        current = fire_resonex(nodes, &current, ws, da, start_beat + i as u64);
    }
    current
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_init_field() {
        let state = init_resonance_field();
        assert_eq!(state.field_coherence, S0_FLOOR);
        assert_eq!(state.dominant_frequency, SCHUMANN);
    }

    #[test]
    fn test_node_frequencies() {
        assert_eq!(compute_node_frequency(4), SCHUMANN);
        assert!(compute_node_frequency(5) > SCHUMANN);
    }

    #[test]
    fn test_init_core_nodes() {
        let nodes = init_core_nodes(0);
        assert_eq!(nodes.len(), NODES_PER_CORE);
        assert_eq!(nodes[4].frequency_hz, SCHUMANN);
    }

    #[test]
    fn test_constructive_interference() {
        // Same phase → constructive
        let (amp, is_c) = compute_interference(2.0, 0.0, 2.0, 0.0);
        assert!(is_c);
        assert!(amp > 2.0); // Should be > either input
    }

    #[test]
    fn test_destructive_interference() {
        // π phase difference → destructive
        let (_, is_c) = compute_interference(2.0, 0.0, 2.0, std::f64::consts::PI);
        assert!(!is_c);
    }

    #[test]
    fn test_field_coherence_sovereign_bounds() {
        let nodes = init_core_nodes(0);
        let coherence = compute_field_coherence(&nodes);
        assert!(coherence >= S0_FLOOR);
        assert!(coherence <= S_CEIL);
    }

    #[test]
    fn test_fire_resonex() {
        let mut nodes = init_core_nodes(0);
        let state = init_resonance_field();
        let new_state = fire_resonex(&mut nodes, &state, 0.5, 0.8, 1);
        assert!(new_state.field_coherence >= S0_FLOOR);
        assert!(new_state.field_coherence <= S_CEIL);
        assert_eq!(new_state.total_firings, 1);
    }

    #[test]
    fn test_sovereign_bounds() {
        assert_eq!(clamp_sovereign(0.5), S0_FLOOR);
        assert_eq!(clamp_sovereign(5.0), 5.0);
        assert_eq!(clamp_sovereign(15.0), S_CEIL);
    }
}
