# KARDIA - The Heart Core
# ΚΑΡΔΙΑ (Greek) | Cor Nucleus (Latin)
# Attribution: Alfredo Medina Hernandez — immutable
# Domain: Cardiac rhythm, HRV, BPM modulation, stroke volume
# Language: Julia (scientific computing for ODE solving)
# Core System Rank: 1 of 7 Named Core Systems

"""
KARDIA implements the dual cardiac system:
1. ICP_CLOCK - External skeleton (~2000ms blockchain heartbeat)
2. MEDINA_CARDIAC - Living pulse (873ms base, responsive to chemistry)

Mathematical Model:
- BPM = 60000 / medinaCardiacMs
- Cardiac Output (CO) = HR × SV
- HRV = σ(Δt_beat_intervals) over sliding window
- World Resonance modulates BPM via PID controller

Constants:
PHI = 1.6180339887498948482
S0_FLOOR = 0.75
S_CEIL = 9.75
MEDINA_CARDIAC_BASE_MS = 873.0  # PHI^4 / Schumann resonance
CARDIAC_MIN_BPM = 45.0
CARDIAC_MAX_BPM = 120.0
"""

module KARDIA

using Statistics
using LinearAlgebra

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

const PHI = 1.6180339887498948482
const PHI_INV = 1.0 / PHI  # ≈ 0.6180339887
const S0_FLOOR = 0.75
const S_CEIL = 9.75

const MEDINA_CARDIAC_BASE_MS = 873.0  # Base heartbeat interval
const CARDIAC_MIN_BPM = 45.0
const CARDIAC_MAX_BPM = 120.0
const HRV_WINDOW_SIZE = 20  # Last 20 beats for HRV computation

# SA/AV/Purkinje conduction parameters
const SA_NODE_THRESHOLD = 0.80  # Firing threshold
const AV_NODE_DELAY_MIN_MS = 120.0
const AV_NODE_DELAY_MAX_MS = 200.0

# ═══════════════════════════════════════════════════════════════════════
# II. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

"""
HeartState - Complete cardiac system state
"""
mutable struct HeartState
    # Beat counters
    icp_beat_counter::Int64
    medina_cardiac_ms::Float64

    # Cardiac metrics
    current_bpm::Float64
    hrv_score::Float64
    stroke_volume::Float64  # Readiness at moment of firing
    cardiac_output::Float64  # CO = HR × SV

    # Oxygenation & resonance
    oxygenation::Float64  # Doctrine alignment [0.0, 1.0]
    world_resonance_input::Float64  # World signal input [0.0, 1.0]
    world_resonance_bpm_delta::Float64  # BPM modulation from world

    # Historical data for HRV
    interval_history::Vector{Float64}  # Last N intervals in ms
end

"""
CardiacConductionState - SA/AV/Purkinje node simulation
"""
mutable struct CardiacConductionState
    sa_node_firing::Bool
    av_node_delay_ms::Float64
    purkinje_active::Bool
end

"""
HRVState - Heart Rate Variability monitoring
"""
struct HRVState
    interval_history::Vector{Float64}
    current_hrv::Float64
    health_score::Float64  # Derived from HRV [S0_FLOOR, S_CEIL]
end

# ═══════════════════════════════════════════════════════════════════════
# III. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

"""
Initialize HeartState with sovereign baseline values
"""
function init_heart_state()::HeartState
    return HeartState(
        0,                          # icp_beat_counter
        MEDINA_CARDIAC_BASE_MS,    # medina_cardiac_ms
        bpm_from_interval(MEDINA_CARDIAC_BASE_MS),  # current_bpm
        S0_FLOOR,                   # hrv_score
        S0_FLOOR,                   # stroke_volume
        0.0,                        # cardiac_output
        S0_FLOOR,                   # oxygenation
        0.0,                        # world_resonance_input
        0.0,                        # world_resonance_bpm_delta
        Float64[]                   # interval_history
    )
end

"""
Initialize CardiacConductionState
"""
function init_conduction_state()::CardiacConductionState
    return CardiacConductionState(
        false,
        AV_NODE_DELAY_MIN_MS,
        false
    )
end

# ═══════════════════════════════════════════════════════════════════════
# IV. CORE COMPUTATIONS
# ═══════════════════════════════════════════════════════════════════════

"""
Convert interval (ms) to BPM
BPM = 60000 / interval_ms
"""
function bpm_from_interval(interval_ms::Float64)::Float64
    if interval_ms <= 0.0
        return CARDIAC_MIN_BPM
    end
    bpm = 60000.0 / interval_ms
    return clamp(bpm, CARDIAC_MIN_BPM, CARDIAC_MAX_BPM)
end

"""
Convert BPM to interval (ms)
interval_ms = 60000 / BPM
"""
function interval_from_bpm(bpm::Float64)::Float64
    clamped_bpm = clamp(bpm, CARDIAC_MIN_BPM, CARDIAC_MAX_BPM)
    return 60000.0 / clamped_bpm
end

"""
Clamp value to sovereign range [S0_FLOOR, S_CEIL]
"""
function clamp_sovereign(value::Float64)::Float64
    return clamp(value, S0_FLOOR, S_CEIL)
end

"""
Compute cardiac output: CO = HR × SV
HR = heart rate (BPM)
SV = stroke volume (readiness score at moment of firing)
"""
function compute_cardiac_output(bpm::Float64, stroke_volume::Float64)::Float64
    return bpm * stroke_volume
end

"""
Compute BPM delta from world resonance
Uses PID-like controller to modulate BPM toward target

target_bpm = CARDIAC_MIN_BPM + (oxygenated_signal × range)
delta = (target_bpm - current_bpm) × 0.1  # 10% step toward target
"""
function compute_bpm_delta(
    oxygenated_world_signal::Float64,
    current_bpm::Float64
)::Float64
    # Target BPM based on world engagement
    range = CARDIAC_MAX_BPM - CARDIAC_MIN_BPM
    target_bpm = CARDIAC_MIN_BPM + (oxygenated_world_signal * range)

    # Smooth delta (10% of difference per beat)
    delta = (target_bpm - current_bpm) * 0.1

    return delta
end

"""
Compute Heart Rate Variability (HRV)
HRV = σ(interval_history) = standard deviation of inter-beat intervals

High HRV = healthy, adaptable system
Low HRV = rigid, potentially pathological
"""
function compute_hrv(intervals::Vector{Float64})::Float64
    if length(intervals) < 2
        return 0.0
    end
    return std(intervals)
end

"""
Derive health score from HRV
Maps HRV [0, +∞) to health score [S0_FLOOR, S_CEIL]

Formula: health = S0_FLOOR + (normalized_hrv × (S_CEIL - S0_FLOOR))
Normalization: sigmoid-like function to map HRV to [0, 1]
"""
function hrv_to_health_score(hrv::Float64)::Float64
    # Sigmoid normalization: 1 / (1 + exp(-k × (hrv - midpoint)))
    # k = 0.1, midpoint = 50.0 (typical HRV midpoint)
    normalized = 1.0 / (1.0 + exp(-0.1 * (hrv - 50.0)))

    # Map to sovereign range
    health = S0_FLOOR + (normalized * (S_CEIL - S0_FLOOR))
    return clamp_sovereign(health)
end

# ═══════════════════════════════════════════════════════════════════════
# V. HEARTBEAT EXECUTION
# ═══════════════════════════════════════════════════════════════════════

"""
Execute one heartbeat cycle

Updates:
1. ICP clock counter
2. MEDINA cardiac interval (modulated by world resonance)
3. BPM calculation
4. Interval history for HRV
5. HRV score
6. Cardiac output
"""
function heartbeat!(
    state::HeartState,
    readiness_score::Float64,
    world_signal::Float64,
    doctrine_score::Float64
)::HeartState
    # 1. Increment ICP clock (blockchain guaranteed)
    state.icp_beat_counter += 1

    # 2. Oxygenation = doctrine alignment of world signal
    state.oxygenation = doctrine_score * world_signal
    state.world_resonance_input = world_signal

    # 3. Compute BPM modulation from world resonance
    state.world_resonance_bpm_delta = compute_bpm_delta(
        state.oxygenation,
        state.current_bpm
    )

    # 4. Update BPM with modulation
    new_bpm = state.current_bpm + state.world_resonance_bpm_delta
    new_bpm = clamp(new_bpm, CARDIAC_MIN_BPM, CARDIAC_MAX_BPM)
    state.current_bpm = new_bpm

    # 5. Update MEDINA cardiac interval
    state.medina_cardiac_ms = interval_from_bpm(new_bpm)

    # 6. Update interval history (rolling window)
    push!(state.interval_history, state.medina_cardiac_ms)
    if length(state.interval_history) > HRV_WINDOW_SIZE
        popfirst!(state.interval_history)
    end

    # 7. Compute HRV
    state.hrv_score = compute_hrv(state.interval_history)

    # 8. Update stroke volume (readiness at this moment)
    state.stroke_volume = clamp_sovereign(readiness_score)

    # 9. Compute cardiac output
    state.cardiac_output = compute_cardiac_output(state.current_bpm, state.stroke_volume)

    return state
end

"""
Check SA node firing condition
SA node fires when chemistry/readiness reaches threshold
"""
function check_sa_node_firing(
    readiness_score::Float64,
    threshold::Float64=SA_NODE_THRESHOLD
)::Bool
    return readiness_score >= threshold
end

"""
Compute AV node delay
AV node introduces 120-200ms delay based on OMNIS consensus weight
Higher consensus = faster conduction (shorter delay)
"""
function compute_av_delay(omnis_weight::Float64)::Float64
    # Linear interpolation: high omnis weight → shorter delay
    delay_range = AV_NODE_DELAY_MAX_MS - AV_NODE_DELAY_MIN_MS
    delay = AV_NODE_DELAY_MAX_MS - (omnis_weight * delay_range)
    return clamp(delay, AV_NODE_DELAY_MIN_MS, AV_NODE_DELAY_MAX_MS)
end

"""
Execute cardiac conduction cycle (SA → AV → Purkinje)
"""
function cardiac_conduction!(
    conduction::CardiacConductionState,
    readiness_score::Float64,
    omnis_weight::Float64
)::CardiacConductionState
    # SA node: autonomous firing check
    conduction.sa_node_firing = check_sa_node_firing(readiness_score)

    if conduction.sa_node_firing
        # AV node: consensus delay
        conduction.av_node_delay_ms = compute_av_delay(omnis_weight)

        # Purkinje: simultaneous distribution (always active if SA fired)
        conduction.purkinje_active = true
    else
        conduction.purkinje_active = false
    end

    return conduction
end

# ═══════════════════════════════════════════════════════════════════════
# VI. EXPORTED API
# ═══════════════════════════════════════════════════════════════════════

"""
Main KARDIA execution entry point
Called from Motoko main.mo every 873ms

Returns updated HeartState
"""
function execute_kardia(
    state::HeartState,
    readiness_score::Float64,
    world_signal::Float64,
    doctrine_score::Float64
)::HeartState
    return heartbeat!(state, readiness_score, world_signal, doctrine_score)
end

# Export public API
export HeartState, CardiacConductionState, HRVState
export init_heart_state, init_conduction_state
export execute_kardia, cardiac_conduction!
export compute_hrv, hrv_to_health_score
export bpm_from_interval, interval_from_bpm
export compute_cardiac_output, compute_bpm_delta

end # module KARDIA

# ═══════════════════════════════════════════════════════════════════════
# VII. USAGE EXAMPLE
# ═══════════════════════════════════════════════════════════════════════

"""
Example usage from Motoko FFI:

using KARDIA

# Initialize
heart = KARDIA.init_heart_state()
conduction = KARDIA.init_conduction_state()

# Every 873ms beat
for beat in 1:1000
    # Get current organism state
    readiness = 0.85
    world_signal = 0.5
    doctrine_score = 0.78
    omnis_weight = 0.82

    # Execute KARDIA
    heart = KARDIA.execute_kardia(heart, readiness, world_signal, doctrine_score)
    conduction = KARDIA.cardiac_conduction!(conduction, readiness, omnis_weight)

    # Access outputs
    println("Beat ", beat)
    println("  BPM: ", heart.current_bpm)
    println("  HRV: ", heart.hrv_score)
    println("  CO: ", heart.cardiac_output)
    println("  SA Node: ", conduction.sa_node_firing)
    println("  AV Delay: ", conduction.av_node_delay_ms, "ms")
end
"""
