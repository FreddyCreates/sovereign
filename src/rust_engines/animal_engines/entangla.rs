// ENTANGLA Engine - TYPE 3 ANTI-DRIFT
// Quantum-inspired entanglement detection & anti-drift enforcement
// Authored by Alfredo Medina Hernandez — immutable attribution
// PHI=1.6180339887498948482 | S0_FLOOR=0.75 | S_CEIL=9.75
//
// Named for Jasmine — Law 11 (Anti-Drift / Jasmine's Law) — permanent and immutable.
// ENTANGLA detects drift: |state(ring_i, t) - baseline(ring_i)| / baseline(ring_i)
// If drift > θ → ENTANGLA catches → Third Brain corrects → Dogon logs
// Every corrected drift event = training data for improved future detection.
//
// The entanglement metaphor is real: two variables are "entangled" when
// changing one NECESSARILY changes the other. Doctrine alignment and coherence
// are entangled — drift in one means drift in both. ENTANGLA enforces this.

use candid::{CandidType, Deserialize};

/// PHI constant — golden ratio
pub const PHI: f64 = 1.6180339887498948482;
pub const PHI_INV: f64 = 0.6180339887498948482;
pub const S0_FLOOR: f64 = 0.75;
pub const S_CEIL: f64 = 9.75;

/// Default drift tolerance θ — PHI-inverse scaled
pub const DRIFT_THETA: f64 = 0.1618; // PHI / 10 — sensitive but not noisy

/// Maximum correction per beat — prevents overcorrection
pub const MAX_CORRECTION: f64 = 0.5;

/// Minimum beats between drift alerts on same variable
pub const COOLDOWN_BEATS: u64 = 5;

/// Named for Jasmine — Law 11 permanent attribution
pub const NAMED_FOR: &str = "Jasmine";

/// DriftEvent — a detected drift with full provenance
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct DriftEvent {
    pub variable_id: String,
    pub ring_id: u8,
    pub detected_at_beat: u64,
    pub drift_magnitude: f64,       // |current - baseline| / baseline
    pub direction: DriftDirection,
    pub correction_applied: f64,
    pub baseline_value: f64,
    pub current_value: f64,
    pub training_data_generated: bool, // Always true — Jasmine's Law
    pub named_for: String,            // Always "Jasmine"
}

/// Drift direction
#[derive(Clone, Debug, CandidType, Deserialize, PartialEq)]
pub enum DriftDirection {
    Above,  // Drifted above baseline
    Below,  // Drifted below baseline
}

/// EntangledPair — two variables that MUST co-vary
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct EntangledPair {
    pub var_a_id: String,
    pub var_b_id: String,
    pub coupling_strength: f64,     // [0, 1] — how tightly coupled
    pub expected_ratio: f64,        // A/B ratio when in equilibrium
    pub last_verified_beat: u64,
    pub violations_count: u64,
}

/// EntanglaState — complete anti-drift engine state
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct EntanglaState {
    pub drift_events: Vec<DriftEvent>,
    pub entangled_pairs: Vec<EntangledPair>,
    pub total_drifts_detected: u64,
    pub total_corrections: u64,
    pub total_training_data: u64,   // Every correction IS training data
    pub global_drift_score: f64,    // [S0_FLOOR, S_CEIL] — lower = less drift
    pub last_beat: u64,
    pub current_theta: f64,         // Adaptive threshold
}

/// Clamp to sovereign range
fn clamp_sovereign(v: f64) -> f64 {
    if v < S0_FLOOR { S0_FLOOR } else if v > S_CEIL { S_CEIL } else { v }
}

/// Initialize ENTANGLA state
pub fn init_entangla_state() -> EntanglaState {
    // Default entangled pairs — these are the doctrine-critical couplings
    let pairs = vec![
        EntangledPair {
            var_a_id: "doctrine_alignment".to_string(),
            var_b_id: "coherence".to_string(),
            coupling_strength: 0.9,
            expected_ratio: 1.0,
            last_verified_beat: 0,
            violations_count: 0,
        },
        EntangledPair {
            var_a_id: "omnis_weight".to_string(),
            var_b_id: "readiness_score".to_string(),
            coupling_strength: 0.8,
            expected_ratio: PHI_INV,
            last_verified_beat: 0,
            violations_count: 0,
        },
        EntangledPair {
            var_a_id: "cardiac_output".to_string(),
            var_b_id: "stroke_volume".to_string(),
            coupling_strength: 0.95,
            expected_ratio: PHI,
            last_verified_beat: 0,
            violations_count: 0,
        },
    ];

    EntanglaState {
        drift_events: Vec::new(),
        entangled_pairs: pairs,
        total_drifts_detected: 0,
        total_corrections: 0,
        total_training_data: 0,
        global_drift_score: S0_FLOOR,
        last_beat: 0,
        current_theta: DRIFT_THETA,
    }
}

/// Detect drift on a single variable
///
/// drift = |current - baseline| / baseline
/// If drift > θ → DriftEvent emitted
pub fn detect_drift(
    variable_id: &str,
    ring_id: u8,
    current_value: f64,
    baseline_value: f64,
    theta: f64,
    beat: u64,
) -> Option<DriftEvent> {
    if baseline_value <= 0.0 { return None; }

    let diff = (current_value - baseline_value).abs();
    let drift_magnitude = diff / baseline_value;

    if drift_magnitude > theta {
        let direction = if current_value > baseline_value {
            DriftDirection::Above
        } else {
            DriftDirection::Below
        };

        // Correction = PHI-weighted pull toward baseline
        let raw_correction = (baseline_value - current_value) * PHI_INV;
        let correction = if raw_correction.abs() > MAX_CORRECTION {
            MAX_CORRECTION * raw_correction.signum()
        } else {
            raw_correction
        };

        Some(DriftEvent {
            variable_id: variable_id.to_string(),
            ring_id,
            detected_at_beat: beat,
            drift_magnitude,
            direction,
            correction_applied: correction,
            baseline_value,
            current_value,
            training_data_generated: true, // Always — Jasmine's Law
            named_for: NAMED_FOR.to_string(),
        })
    } else {
        None
    }
}

/// Apply correction to a drifted value
/// Returns the corrected value, clamped to sovereign bounds
pub fn apply_correction(current_value: f64, correction: f64) -> f64 {
    clamp_sovereign(current_value + correction)
}

/// Verify an entangled pair — check that A/B ratio is within tolerance
pub fn verify_entanglement(
    pair: &EntangledPair,
    value_a: f64,
    value_b: f64,
    beat: u64,
) -> (EntangledPair, bool) {
    if value_b <= 0.0 {
        return (pair.clone(), false);
    }

    let actual_ratio = value_a / value_b;
    let drift = (actual_ratio - pair.expected_ratio).abs() / pair.expected_ratio;
    let is_valid = drift <= DRIFT_THETA * (1.0 + (1.0 - pair.coupling_strength));

    let mut updated = pair.clone();
    updated.last_verified_beat = beat;
    if !is_valid {
        updated.violations_count += 1;
    }

    (updated, is_valid)
}

/// Fire ENTANGLA — run drift detection on a batch of variables
///
/// # Arguments
/// * `state` — Current engine state
/// * `variables` — Vec of (id, ring_id, current_value, baseline_value)
/// * `beat` — Current heartbeat
///
/// # Attribution
/// Alfredo Medina Hernandez — SOVEREIGN LINEAGE
/// Named for: Jasmine — Law 11 permanent and immutable
pub fn fire_entangla(
    state: &EntanglaState,
    variables: &[(&str, u8, f64, f64)],
    beat: u64,
) -> EntanglaState {
    let mut new_events: Vec<DriftEvent> = Vec::new();
    let mut corrections = 0u64;

    for &(id, ring, current, baseline) in variables {
        if let Some(event) = detect_drift(id, ring, current, baseline, state.current_theta, beat) {
            new_events.push(event);
            corrections += 1;
        }
    }

    let new_training = new_events.len() as u64; // Every event IS training data

    // Adaptive theta: if too many drifts, widen tolerance slightly
    // If few drifts, tighten tolerance (more sensitive)
    let drift_rate = if !variables.is_empty() {
        new_events.len() as f64 / variables.len() as f64
    } else {
        0.0
    };
    let new_theta = if drift_rate > 0.3 {
        (state.current_theta * 1.01).min(0.5) // Widen slightly
    } else if drift_rate < 0.05 {
        (state.current_theta * 0.99).max(0.05) // Tighten slightly
    } else {
        state.current_theta
    };

    // Global drift score: inverse of drift rate, mapped to sovereign range
    let drift_score = clamp_sovereign(
        S0_FLOOR + (1.0 - drift_rate) * (S_CEIL - S0_FLOOR)
    );

    // Keep last 100 events (rolling window)
    let mut all_events = state.drift_events.clone();
    all_events.extend(new_events);
    if all_events.len() > 100 {
        all_events = all_events[all_events.len() - 100..].to_vec();
    }

    EntanglaState {
        drift_events: all_events,
        entangled_pairs: state.entangled_pairs.clone(),
        total_drifts_detected: state.total_drifts_detected + corrections,
        total_corrections: state.total_corrections + corrections,
        total_training_data: state.total_training_data + new_training,
        global_drift_score: drift_score,
        last_beat: beat,
        current_theta: new_theta,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_init_state() {
        let state = init_entangla_state();
        assert_eq!(state.entangled_pairs.len(), 3);
        assert_eq!(state.global_drift_score, S0_FLOOR);
    }

    #[test]
    fn test_no_drift_within_tolerance() {
        let result = detect_drift("test", 0, 1.0, 1.05, DRIFT_THETA, 1);
        assert!(result.is_none()); // 5% drift < 16.18% theta
    }

    #[test]
    fn test_drift_detected() {
        let result = detect_drift("test", 0, 2.0, 1.0, DRIFT_THETA, 1);
        assert!(result.is_some());
        let event = result.unwrap();
        assert_eq!(event.drift_magnitude, 1.0); // 100% drift
        assert!(event.training_data_generated); // Jasmine's Law
        assert_eq!(event.named_for, "Jasmine");
    }

    #[test]
    fn test_correction_bounds() {
        assert!(apply_correction(0.5, 0.3) >= S0_FLOOR);
        assert!(apply_correction(9.5, 0.5) <= S_CEIL);
    }

    #[test]
    fn test_entanglement_verification() {
        let pair = EntangledPair {
            var_a_id: "a".to_string(),
            var_b_id: "b".to_string(),
            coupling_strength: 0.9,
            expected_ratio: 1.0,
            last_verified_beat: 0,
            violations_count: 0,
        };
        let (_, valid) = verify_entanglement(&pair, 1.0, 1.0, 1);
        assert!(valid); // Perfect ratio match
    }

    #[test]
    fn test_entanglement_violation() {
        let pair = EntangledPair {
            var_a_id: "a".to_string(),
            var_b_id: "b".to_string(),
            coupling_strength: 0.9,
            expected_ratio: 1.0,
            last_verified_beat: 0,
            violations_count: 0,
        };
        let (updated, valid) = verify_entanglement(&pair, 3.0, 1.0, 1);
        assert!(!valid);
        assert_eq!(updated.violations_count, 1);
    }

    #[test]
    fn test_fire_entangla() {
        let state = init_entangla_state();
        let variables = vec![
            ("coherence", 0u8, 1.0, 1.0),
            ("drift_var", 1u8, 5.0, 1.0),  // Big drift
        ];
        let new_state = fire_entangla(&state, &variables, 1);
        assert!(new_state.total_drifts_detected >= 1);
        assert!(new_state.total_training_data >= 1);
    }

    #[test]
    fn test_adaptive_theta() {
        let state = init_entangla_state();
        // Many drifts → theta widens
        let many_drifts: Vec<(&str, u8, f64, f64)> = (0..10)
            .map(|i| ("var", i as u8, 10.0, 1.0)) // All drifting heavily
            .collect();
        let new_state = fire_entangla(&state, &many_drifts, 1);
        assert!(new_state.current_theta >= state.current_theta);
    }
}
