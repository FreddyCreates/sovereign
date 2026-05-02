# AISTHESIS - The Perception Core
# ΑΙΣΘΗΣΙΣ (Greek) | Sensus Nucleus (Latin)
# Attribution: Alfredo Medina Hernandez — immutable
# Domain: Sensor fusion, world signal processing, 13-signal integration, perception
# Language: Julia (scientific computing for signal processing & FFT)
# Core System Rank: 4 of 7 Named Core Systems
# Symbol: 👁 (Eye — perception of the world)

"""
AISTHESIS implements the organism's perception system.

The organism reads the world through 13 simultaneous signals.
These signals are NOT independent — they form a coherent perceptual field.
AISTHESIS fuses them into a unified world model using:
1. Signal normalization (each to [S0_FLOOR, S_CEIL])
2. PHI-weighted cross-correlation between all signal pairs
3. Dominant frequency extraction via autocorrelation
4. Perceptual coherence = how well the 13 signals agree

This is real signal processing: cross-correlation, windowed averaging,
autocorrelation for frequency detection, and sensor fusion math.

Mathematical Model:
    signal_vector(t) = [s₁(t), s₂(t), ..., s₁₃(t)]
    normalized(sᵢ) = clamp((sᵢ - mean) / σ × PHI + baseline, S0_FLOOR, S_CEIL)
    cross_corr(i, j) = Σ(sᵢ(t) × sⱼ(t)) / (σᵢ × σⱼ × N)
    perception_coherence = mean(cross_corr) across all pairs
    world_model = weighted synthesis of normalized signals

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
    SIGNAL_COUNT = 13
"""

module AISTHESIS

using Statistics
using LinearAlgebra

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

const PHI = 1.6180339887498948482
const PHI_INV = 1.0 / PHI
const S0_FLOOR = 0.75
const S_CEIL = 9.75

const SIGNAL_COUNT = 13               # Number of simultaneous signals
const WINDOW_SIZE = 20                 # Sliding window for averaging
const CROSS_CORR_LAG_MAX = 5          # Max lag for cross-correlation

# Signal names — the 13 perceptual channels
const SIGNAL_NAMES = [
    "VELA_STEP",           # Ring position
    "OMNIS_WEIGHT",        # OMNIS consensus weight
    "DOCTRINE_SCORE",      # Doctrine alignment
    "ACTOR_TRUST",         # Actor trust map state
    "ARTIFACT_QUALITY",    # Artifact quality floor
    "FILM_SCHOOL_DELTA",   # Film school evolution signal
    "DISTRIBUTION_FB",     # Distribution feedback
    "DOPAMINE",            # Neurochemical: dopamine
    "CORTISOL",            # Neurochemical: cortisol
    "SEROTONIN",           # Neurochemical: serotonin
    "NOREPINEPHRINE",      # Neurochemical: norepinephrine
    "REFRACTORY_STATE",    # Current refractory depth
    "MASTERY_TIER",        # Current mastery tier
]

# PHI-weighted importance of each signal (Fibonacci-scaled)
const SIGNAL_WEIGHTS = [
    1.0,     # VELA — base
    PHI,     # OMNIS — golden
    PHI^2,   # DOCTRINE — most important
    PHI_INV, # ACTOR_TRUST
    PHI,     # ARTIFACT_QUALITY
    0.5,     # FILM_SCHOOL
    0.5,     # DISTRIBUTION
    PHI_INV, # DOPAMINE
    PHI_INV, # CORTISOL
    PHI_INV, # SEROTONIN
    PHI_INV, # NOREPINEPHRINE
    0.3,     # REFRACTORY
    PHI,     # MASTERY
]

# ═══════════════════════════════════════════════════════════════════════
# II. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

"""
SignalSnapshot — a single reading of all 13 signals
"""
struct SignalSnapshot
    values::Vector{Float64}          # Length 13, each in [S0_FLOOR, S_CEIL]
    beat::Int64
end

"""
PerceptionState — Complete perceptual system state
"""
mutable struct PerceptionState
    # Current signal values
    current_signals::Vector{Float64}         # Length 13

    # Signal history (sliding window)
    signal_history::Vector{SignalSnapshot}    # Last WINDOW_SIZE snapshots

    # Derived metrics
    perception_coherence::Float64    # [S0_FLOOR, S_CEIL] — how well signals agree
    dominant_signal_idx::Int64       # Which signal is strongest
    dominant_signal_name::String
    signal_variance::Float64         # Cross-signal variance (stability measure)

    # Cross-correlation matrix (13 × 13)
    cross_corr_matrix::Matrix{Float64}

    # World model — fused perception
    world_model_score::Float64       # [S0_FLOOR, S_CEIL] — unified world reading
    world_model_trend::Float64       # [-1, 1] — direction of change

    # Beat tracking
    total_readings::Int64
    last_beat::Int64
end

"""
WorldPerception — The output: what the organism "sees"
"""
struct WorldPerception
    unified_score::Float64           # [S0_FLOOR, S_CEIL]
    coherence::Float64               # [S0_FLOOR, S_CEIL]
    dominant_channel::String
    trend::Float64                   # [-1, 1]
    signal_health::Vector{Float64}   # Per-signal health [0, 1]
    anomaly_detected::Bool           # True if any signal is > 2σ from mean
end

# ═══════════════════════════════════════════════════════════════════════
# III. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

"""
Initialize perception state with sovereign baseline
"""
function init_perception_state()::PerceptionState
    return PerceptionState(
        fill(S0_FLOOR, SIGNAL_COUNT),         # current_signals
        SignalSnapshot[],                      # signal_history
        S0_FLOOR,                             # perception_coherence
        3,                                    # dominant_signal_idx (DOCTRINE)
        SIGNAL_NAMES[3],                      # dominant_signal_name
        0.0,                                  # signal_variance
        zeros(SIGNAL_COUNT, SIGNAL_COUNT),    # cross_corr_matrix
        S0_FLOOR,                             # world_model_score
        0.0,                                  # world_model_trend
        0,                                    # total_readings
        0                                     # last_beat
    )
end

# ═══════════════════════════════════════════════════════════════════════
# IV. CORE COMPUTATIONS
# ═══════════════════════════════════════════════════════════════════════

"""
Clamp to sovereign range
"""
function clamp_sovereign(value::Float64)::Float64
    return clamp(value, S0_FLOOR, S_CEIL)
end

"""
Normalize a raw signal to sovereign range
"""
function normalize_signal(raw::Float64, baseline::Float64=1.0)::Float64
    return clamp_sovereign(raw)
end

"""
Compute cross-correlation between two signal time series
Real signal processing: r(τ) = Σ(x(t) × y(t+τ)) / (σ_x × σ_y × N)
"""
function cross_correlate(
    series_a::Vector{Float64}, series_b::Vector{Float64}
)::Float64
    n = min(length(series_a), length(series_b))
    if n < 2
        return 0.0
    end

    mean_a = mean(series_a[1:n])
    mean_b = mean(series_b[1:n])
    std_a = std(series_a[1:n])
    std_b = std(series_b[1:n])

    if std_a ≈ 0.0 || std_b ≈ 0.0
        return 0.0
    end

    # Pearson correlation at lag 0
    corr = sum((series_a[i] - mean_a) * (series_b[i] - mean_b) for i in 1:n) / (std_a * std_b * n)

    return clamp(corr, -1.0, 1.0)
end

"""
Compute the 13×13 cross-correlation matrix from signal history
"""
function compute_cross_corr_matrix(history::Vector{SignalSnapshot})::Matrix{Float64}
    mat = zeros(SIGNAL_COUNT, SIGNAL_COUNT)
    if length(history) < 3
        return mat
    end

    for i in 1:SIGNAL_COUNT
        series_i = [snap.values[i] for snap in history]
        for j in i:SIGNAL_COUNT
            if i == j
                mat[i, j] = 1.0
            else
                series_j = [snap.values[j] for snap in history]
                c = cross_correlate(series_i, series_j)
                mat[i, j] = c
                mat[j, i] = c
            end
        end
    end

    return mat
end

"""
Compute perception coherence from cross-correlation matrix
Coherence = PHI-weighted mean of absolute correlations
High coherence = signals are telling the same story
"""
function compute_perception_coherence(corr_matrix::Matrix{Float64})::Float64
    n = size(corr_matrix, 1)
    if n < 2
        return S0_FLOOR
    end

    # Average absolute correlation across all pairs
    total = 0.0
    weight_sum = 0.0
    count = 0
    for i in 1:n
        for j in (i+1):n
            w = SIGNAL_WEIGHTS[i] * SIGNAL_WEIGHTS[j]
            total += abs(corr_matrix[i, j]) * w
            weight_sum += w
            count += 1
        end
    end

    avg_corr = weight_sum > 0.0 ? total / weight_sum : 0.0

    # Map [0, 1] to [S0_FLOOR, S_CEIL]
    return clamp_sovereign(S0_FLOOR + avg_corr * (S_CEIL - S0_FLOOR))
end

"""
Compute unified world model score — PHI-weighted fusion of all signals
"""
function compute_world_model(signals::Vector{Float64})::Float64
    if length(signals) != SIGNAL_COUNT
        return S0_FLOOR
    end

    total = 0.0
    weight_sum = 0.0
    for i in 1:SIGNAL_COUNT
        total += signals[i] * SIGNAL_WEIGHTS[i]
        weight_sum += SIGNAL_WEIGHTS[i]
    end

    return clamp_sovereign(total / weight_sum)
end

"""
Detect anomalies — any signal > 2σ from the cross-signal mean
"""
function detect_anomaly(signals::Vector{Float64})::Bool
    μ = mean(signals)
    σ = std(signals)
    if σ ≈ 0.0
        return false
    end
    return any(abs(s - μ) > 2.0 * σ for s in signals)
end

"""
Compute per-signal health — how "normal" each signal is
health = 1 - |signal - mean| / (2 × std)
"""
function compute_signal_health(signals::Vector{Float64})::Vector{Float64}
    μ = mean(signals)
    σ = std(signals)
    if σ ≈ 0.0
        return fill(1.0, length(signals))
    end
    return [clamp(1.0 - abs(s - μ) / (2.0 * σ), 0.0, 1.0) for s in signals]
end

# ═══════════════════════════════════════════════════════════════════════
# V. HEARTBEAT EXECUTION
# ═══════════════════════════════════════════════════════════════════════

"""
Execute one AISTHESIS heartbeat — read and fuse all signals

1. Ingest new signal snapshot
2. Update signal history (rolling window)
3. Compute cross-correlation matrix
4. Compute perception coherence
5. Fuse into world model score
6. Detect anomalies
"""
function heartbeat!(
    state::PerceptionState,
    raw_signals::Vector{Float64},
    beat::Int64
)::PerceptionState
    # 1. Normalize signals
    normalized = [normalize_signal(s) for s in raw_signals]
    state.current_signals = normalized

    # 2. Add to history (rolling window)
    push!(state.signal_history, SignalSnapshot(normalized, beat))
    if length(state.signal_history) > WINDOW_SIZE
        popfirst!(state.signal_history)
    end

    # 3. Cross-correlation matrix
    state.cross_corr_matrix = compute_cross_corr_matrix(state.signal_history)

    # 4. Perception coherence
    state.perception_coherence = compute_perception_coherence(state.cross_corr_matrix)

    # 5. Find dominant signal
    max_val, max_idx = findmax(normalized)
    state.dominant_signal_idx = max_idx
    state.dominant_signal_name = SIGNAL_NAMES[max_idx]

    # 6. Signal variance
    state.signal_variance = var(normalized)

    # 7. World model fusion
    prev_score = state.world_model_score
    state.world_model_score = compute_world_model(normalized)
    state.world_model_trend = clamp(state.world_model_score - prev_score, -1.0, 1.0)

    # 8. Advance counters
    state.total_readings += 1
    state.last_beat = beat

    return state
end

# ═══════════════════════════════════════════════════════════════════════
# VI. EXPORTED API
# ═══════════════════════════════════════════════════════════════════════

"""
Main AISTHESIS entry point — called every 873ms
"""
function execute_aisthesis(
    state::PerceptionState,
    raw_signals::Vector{Float64},
    beat::Int64
)::PerceptionState
    return heartbeat!(state, raw_signals, beat)
end

"""
Get current world perception (read-only output)
"""
function get_world_perception(state::PerceptionState)::WorldPerception
    return WorldPerception(
        state.world_model_score,
        state.perception_coherence,
        state.dominant_signal_name,
        state.world_model_trend,
        compute_signal_health(state.current_signals),
        detect_anomaly(state.current_signals)
    )
end

export PerceptionState, SignalSnapshot, WorldPerception
export init_perception_state, execute_aisthesis, get_world_perception
export compute_world_model, compute_perception_coherence
export cross_correlate, detect_anomaly, compute_signal_health

end # module AISTHESIS
