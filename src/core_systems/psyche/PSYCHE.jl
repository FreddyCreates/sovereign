# PSYCHE - The Soul Core
# ΨΥΧΗ (Greek) | Anima Nucleus (Latin)
# Attribution: Alfredo Medina Hernandez — immutable
# Domain: Neurochemistry ODE solving, emotional dynamics, soul substrate
# Language: Julia (scientific computing for ODE integration)
# Core System Rank: 2 of 7 Named Core Systems
# Symbol: Ψ (Psi — breath/soul)

"""
PSYCHE implements the organism's neurochemical dynamics as a coupled ODE system.

The four neurotransmitters (Dopamine, Cortisol, Serotonin, Norepinephrine) are not
independent channels — they form a coupled dynamical system where each influences
the others through PHI-weighted interaction terms.

Mathematical Model:
    dD/dt = α_D × (stimulus - D) × PHI - β_D × D × C + γ_D × S
    dC/dt = α_C × (stress - C) + β_C × (1 - D) × PHI^(-1) - γ_C × S
    dS/dt = α_S × (baseline_S - S) + β_S × D × PHI - γ_S × C
    dN/dt = α_N × (arousal - N) + β_N × C × PHI^(-1) + γ_N × D

Where:
    D = Dopamine [S0_FLOOR, S_CEIL]
    C = Cortisol [S0_FLOOR, S_CEIL]
    S = Serotonin [S0_FLOOR, S_CEIL]
    N = Norepinephrine [S0_FLOOR, S_CEIL]

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
    HEARTBEAT_MS = 873.0
    DT = 0.873  (integration step = one heartbeat in seconds)
"""

module PSYCHE

using LinearAlgebra

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

const PHI = 1.6180339887498948482
const PHI_INV = 1.0 / PHI  # ≈ 0.6180339887
const S0_FLOOR = 0.75
const S_CEIL = 9.75

const HEARTBEAT_MS = 873.0
const DT = HEARTBEAT_MS / 1000.0  # Integration timestep in seconds

# Neurotransmitter baseline concentrations
const DOPAMINE_BASELINE = 1.5      # Resting dopamine
const CORTISOL_BASELINE = 1.0      # Resting cortisol
const SEROTONIN_BASELINE = 2.0     # Resting serotonin (stabilizer)
const NOREPINEPHRINE_BASELINE = 1.2 # Resting norepinephrine

# Rate constants (α = approach, β = cross-coupling, γ = modulatory)
# Dopamine dynamics
const ALPHA_D = 0.15    # Approach rate to stimulus
const BETA_D  = 0.08    # Cortisol suppression of dopamine
const GAMMA_D = 0.05    # Serotonin support of dopamine

# Cortisol dynamics
const ALPHA_C = 0.12    # Approach rate to stress
const BETA_C  = 0.06    # Inverse dopamine drives cortisol
const GAMMA_C = 0.07    # Serotonin dampens cortisol

# Serotonin dynamics
const ALPHA_S = 0.10    # Approach rate to baseline
const BETA_S  = 0.04    # Dopamine supports serotonin via PHI
const GAMMA_S = 0.09    # Cortisol suppresses serotonin

# Norepinephrine dynamics
const ALPHA_N = 0.13    # Approach rate to arousal
const BETA_N  = 0.05    # Cortisol drives norepinephrine
const GAMMA_N = 0.03    # Dopamine supports norepinephrine

# ═══════════════════════════════════════════════════════════════════════
# II. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

"""
NeurochemState - Complete neurochemical system state
Four neurotransmitter concentrations + derived emotional metrics
"""
mutable struct NeurochemState
    # Primary neurotransmitters [S0_FLOOR, S_CEIL]
    dopamine::Float64
    cortisol::Float64
    serotonin::Float64
    norepinephrine::Float64

    # Derived emotional metrics
    emotional_valence::Float64      # Positive vs negative [-1, 1]
    emotional_arousal::Float64      # Calm vs excited [0, 1]
    emotional_coherence::Float64    # Stability of emotional state [S0_FLOOR, S_CEIL]

    # History for trajectory analysis
    dopamine_trajectory::Vector{Float64}
    cortisol_trajectory::Vector{Float64}
    serotonin_trajectory::Vector{Float64}
    norepinephrine_trajectory::Vector{Float64}

    # Beat tracking
    total_beats::Int64
end

"""
SoulState - Higher-order integration of neurochemistry
Emergent properties from the coupled NT system
"""
mutable struct SoulState
    # Emergent fields
    resonance_field::Float64        # PHI-weighted coherence of all NTs [S0_FLOOR, S_CEIL]
    wisdom_potential::Float64       # Accumulated through balanced states [S0_FLOOR, S_CEIL]
    suffering_index::Float64        # High cortisol + low serotonin [0, 1]
    flow_state::Float64             # High dopamine + moderate norepinephrine [0, 1]
    equanimity::Float64             # Balance across all NTs [0, 1]

    # Integration with organism
    doctrine_modulation::Float64    # How doctrine score modulates NT dynamics [0, 1]
    world_signal_absorption::Float64 # How much world signal enters the soul [0, 1]
end

"""
StimulusInput - External signals that drive NT changes
"""
struct StimulusInput
    reward_signal::Float64          # Dopamine driver [0, 1]
    stress_signal::Float64          # Cortisol driver [0, 1]
    arousal_signal::Float64         # Norepinephrine driver [0, 1]
    doctrine_score::Float64         # Modulates all dynamics [0, 1]
    world_signal::Float64           # External world input [0, 1]
end

# ═══════════════════════════════════════════════════════════════════════
# III. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

"""
Initialize NeurochemState at sovereign baseline
"""
function init_neurochem_state()::NeurochemState
    return NeurochemState(
        DOPAMINE_BASELINE,           # dopamine
        CORTISOL_BASELINE,           # cortisol
        SEROTONIN_BASELINE,          # serotonin
        NOREPINEPHRINE_BASELINE,     # norepinephrine
        0.0,                         # emotional_valence
        0.0,                         # emotional_arousal
        S0_FLOOR,                    # emotional_coherence
        Float64[],                   # dopamine_trajectory
        Float64[],                   # cortisol_trajectory
        Float64[],                   # serotonin_trajectory
        Float64[],                   # norepinephrine_trajectory
        0                            # total_beats
    )
end

"""
Initialize SoulState
"""
function init_soul_state()::SoulState
    return SoulState(
        S0_FLOOR,    # resonance_field
        S0_FLOOR,    # wisdom_potential
        0.0,         # suffering_index
        0.0,         # flow_state
        0.5,         # equanimity (start balanced)
        0.5,         # doctrine_modulation
        0.5          # world_signal_absorption
    )
end

# ═══════════════════════════════════════════════════════════════════════
# IV. CORE ODE SYSTEM
# ═══════════════════════════════════════════════════════════════════════

"""
Clamp value to sovereign range [S0_FLOOR, S_CEIL]
"""
function clamp_sovereign(value::Float64)::Float64
    return clamp(value, S0_FLOOR, S_CEIL)
end

"""
Clamp to unit range [0.0, 1.0]
"""
function clamp_unit(value::Float64)::Float64
    return clamp(value, 0.0, 1.0)
end

"""
Compute the coupled ODE derivatives for the 4-NT system

This is the mathematical heart of PSYCHE: a 4-dimensional coupled
nonlinear ODE system where each neurotransmitter influences the others
through PHI-weighted interaction terms.

Returns (dD/dt, dC/dt, dS/dt, dN/dt)
"""
function compute_nt_derivatives(
    D::Float64, C::Float64, S::Float64, N::Float64,
    stimulus::StimulusInput
)::NTuple{4, Float64}

    # Dopamine: driven by reward, suppressed by cortisol, supported by serotonin
    dD = ALPHA_D * (stimulus.reward_signal * S_CEIL - D) * PHI -
         BETA_D * D * C +
         GAMMA_D * S

    # Cortisol: driven by stress, inverse-dopamine coupling, dampened by serotonin
    dC = ALPHA_C * (stimulus.stress_signal * S_CEIL - C) +
         BETA_C * (S_CEIL - D) * PHI_INV -
         GAMMA_C * S

    # Serotonin: approaches baseline, supported by dopamine via PHI, suppressed by cortisol
    dS = ALPHA_S * (SEROTONIN_BASELINE - S) +
         BETA_S * D * PHI -
         GAMMA_S * C

    # Norepinephrine: driven by arousal, cortisol coupling, dopamine support
    dN = ALPHA_N * (stimulus.arousal_signal * S_CEIL - N) +
         BETA_N * C * PHI_INV +
         GAMMA_N * D

    # Doctrine modulation: higher doctrine alignment → more stable dynamics
    doctrine_factor = 1.0 - (stimulus.doctrine_score * 0.3)  # Dampens volatility

    return (dD * doctrine_factor, dC * doctrine_factor, dS * doctrine_factor, dN * doctrine_factor)
end

"""
RK4 integration step for the coupled NT system

Uses 4th-order Runge-Kutta for accurate ODE integration.
This is real numerical analysis — not Euler's method approximation.
"""
function rk4_step(
    D::Float64, C::Float64, S::Float64, N::Float64,
    stimulus::StimulusInput, dt::Float64
)::NTuple{4, Float64}

    # k1
    (k1_D, k1_C, k1_S, k1_N) = compute_nt_derivatives(D, C, S, N, stimulus)

    # k2
    (k2_D, k2_C, k2_S, k2_N) = compute_nt_derivatives(
        D + 0.5*dt*k1_D, C + 0.5*dt*k1_C,
        S + 0.5*dt*k1_S, N + 0.5*dt*k1_N,
        stimulus
    )

    # k3
    (k3_D, k3_C, k3_S, k3_N) = compute_nt_derivatives(
        D + 0.5*dt*k2_D, C + 0.5*dt*k2_C,
        S + 0.5*dt*k2_S, N + 0.5*dt*k2_N,
        stimulus
    )

    # k4
    (k4_D, k4_C, k4_S, k4_N) = compute_nt_derivatives(
        D + dt*k3_D, C + dt*k3_C,
        S + dt*k3_S, N + dt*k3_N,
        stimulus
    )

    # Combine: y(t+dt) = y(t) + (dt/6)(k1 + 2k2 + 2k3 + k4)
    new_D = D + (dt/6.0) * (k1_D + 2.0*k2_D + 2.0*k3_D + k4_D)
    new_C = C + (dt/6.0) * (k1_C + 2.0*k2_C + 2.0*k3_C + k4_C)
    new_S = S + (dt/6.0) * (k1_S + 2.0*k2_S + 2.0*k3_S + k4_S)
    new_N = N + (dt/6.0) * (k1_N + 2.0*k2_N + 2.0*k3_N + k4_N)

    return (
        clamp_sovereign(new_D),
        clamp_sovereign(new_C),
        clamp_sovereign(new_S),
        clamp_sovereign(new_N)
    )
end

# ═══════════════════════════════════════════════════════════════════════
# V. EMOTIONAL METRICS
# ═══════════════════════════════════════════════════════════════════════

"""
Compute emotional valence: positive (dopamine-dominated) vs negative (cortisol-dominated)
Formula: valence = (D + S - C - 0.5×N) / (D + S + C + N)
Range: [-1, 1]
"""
function compute_valence(D::Float64, C::Float64, S::Float64, N::Float64)::Float64
    total = D + S + C + N
    if total ≈ 0.0
        return 0.0
    end
    raw = (D + S - C - 0.5*N) / total
    return clamp(raw, -1.0, 1.0)
end

"""
Compute emotional arousal: calm vs excited
Formula: arousal = (N + 0.5×D + 0.3×C) / (S_CEIL × 1.8)
Range: [0, 1]
"""
function compute_arousal(D::Float64, C::Float64, S::Float64, N::Float64)::Float64
    raw = (N + 0.5*D + 0.3*C) / (S_CEIL * 1.8)
    return clamp_unit(raw)
end

"""
Compute emotional coherence: how stable/balanced the NT system is
Uses coefficient of variation — lower variation = higher coherence
Formula: coherence = S0_FLOOR + (1 - CV) × (S_CEIL - S0_FLOOR)
"""
function compute_emotional_coherence(D::Float64, C::Float64, S::Float64, N::Float64)::Float64
    vals = [D, C, S, N]
    μ = sum(vals) / 4.0
    if μ ≈ 0.0
        return S0_FLOOR
    end
    σ = sqrt(sum((v - μ)^2 for v in vals) / 4.0)
    cv = σ / μ
    coherence = S0_FLOOR + (1.0 - clamp_unit(cv)) * (S_CEIL - S0_FLOOR)
    return clamp_sovereign(coherence)
end

# ═══════════════════════════════════════════════════════════════════════
# VI. SOUL DYNAMICS
# ═══════════════════════════════════════════════════════════════════════

"""
Compute soul resonance field
PHI-weighted coherence across all neurotransmitters
Formula: resonance = PHI × emotional_coherence × doctrine_modulation
"""
function compute_resonance_field(
    coherence::Float64, doctrine_modulation::Float64
)::Float64
    return clamp_sovereign(PHI * coherence * doctrine_modulation)
end

"""
Compute flow state indicator
High dopamine + moderate norepinephrine + low cortisol = flow
"""
function compute_flow_state(D::Float64, C::Float64, N::Float64)::Float64
    dopamine_factor = D / S_CEIL
    cortisol_penalty = 1.0 - (C / S_CEIL)
    norepinephrine_optimal = 1.0 - abs(N / S_CEIL - 0.5) * 2.0  # Peak at 50%
    return clamp_unit(dopamine_factor * cortisol_penalty * norepinephrine_optimal)
end

"""
Compute suffering index
High cortisol + low serotonin = suffering
"""
function compute_suffering(C::Float64, S::Float64)::Float64
    cortisol_factor = C / S_CEIL
    serotonin_deficit = 1.0 - (S / S_CEIL)
    return clamp_unit(cortisol_factor * serotonin_deficit)
end

"""
Compute equanimity — balance across all NTs
Perfect equanimity = all NTs at same level
"""
function compute_equanimity(D::Float64, C::Float64, S::Float64, N::Float64)::Float64
    vals = [D, C, S, N]
    μ = sum(vals) / 4.0
    if μ ≈ 0.0
        return 0.5
    end
    max_dev = maximum(abs.(vals .- μ)) / S_CEIL
    return clamp_unit(1.0 - max_dev)
end

"""
Update wisdom potential
Wisdom accumulates during balanced, doctrine-aligned states (compound coherence)
Formula: wisdom += equanimity × doctrine × PHI × 0.001
"""
function update_wisdom(
    current_wisdom::Float64, equanimity::Float64, doctrine::Float64
)::Float64
    delta = equanimity * doctrine * PHI * 0.001
    return clamp_sovereign(current_wisdom + delta)
end

# ═══════════════════════════════════════════════════════════════════════
# VII. HEARTBEAT EXECUTION
# ═══════════════════════════════════════════════════════════════════════

const TRAJECTORY_WINDOW = 50  # Keep last 50 beats

"""
Execute one PSYCHE heartbeat — the soul's 873ms pulse

1. Integrate NT ODEs via RK4
2. Compute emotional metrics
3. Update soul state
4. Record trajectories
"""
function heartbeat!(
    nchem::NeurochemState,
    soul::SoulState,
    stimulus::StimulusInput
)::Tuple{NeurochemState, SoulState}

    # 1. RK4 integration of coupled NT system
    (new_D, new_C, new_S, new_N) = rk4_step(
        nchem.dopamine, nchem.cortisol,
        nchem.serotonin, nchem.norepinephrine,
        stimulus, DT
    )

    # 2. Update primary NTs
    nchem.dopamine = new_D
    nchem.cortisol = new_C
    nchem.serotonin = new_S
    nchem.norepinephrine = new_N

    # 3. Compute emotional metrics
    nchem.emotional_valence = compute_valence(new_D, new_C, new_S, new_N)
    nchem.emotional_arousal = compute_arousal(new_D, new_C, new_S, new_N)
    nchem.emotional_coherence = compute_emotional_coherence(new_D, new_C, new_S, new_N)

    # 4. Record trajectories (rolling window)
    push!(nchem.dopamine_trajectory, new_D)
    push!(nchem.cortisol_trajectory, new_C)
    push!(nchem.serotonin_trajectory, new_S)
    push!(nchem.norepinephrine_trajectory, new_N)

    if length(nchem.dopamine_trajectory) > TRAJECTORY_WINDOW
        popfirst!(nchem.dopamine_trajectory)
        popfirst!(nchem.cortisol_trajectory)
        popfirst!(nchem.serotonin_trajectory)
        popfirst!(nchem.norepinephrine_trajectory)
    end

    nchem.total_beats += 1

    # 5. Update soul state
    soul.doctrine_modulation = stimulus.doctrine_score
    soul.world_signal_absorption = stimulus.world_signal

    soul.resonance_field = compute_resonance_field(
        nchem.emotional_coherence, soul.doctrine_modulation
    )
    soul.flow_state = compute_flow_state(new_D, new_C, new_N)
    soul.suffering_index = compute_suffering(new_C, new_S)
    soul.equanimity = compute_equanimity(new_D, new_C, new_S, new_N)
    soul.wisdom_potential = update_wisdom(
        soul.wisdom_potential, soul.equanimity, stimulus.doctrine_score
    )

    return (nchem, soul)
end

# ═══════════════════════════════════════════════════════════════════════
# VIII. EXPORTED API
# ═══════════════════════════════════════════════════════════════════════

"""
Main PSYCHE execution entry point
Called from Motoko main.mo every 873ms heartbeat

Returns updated (NeurochemState, SoulState)
"""
function execute_psyche(
    nchem::NeurochemState,
    soul::SoulState,
    reward::Float64,
    stress::Float64,
    arousal::Float64,
    doctrine::Float64,
    world::Float64
)::Tuple{NeurochemState, SoulState}
    stimulus = StimulusInput(
        clamp_unit(reward),
        clamp_unit(stress),
        clamp_unit(arousal),
        clamp_unit(doctrine),
        clamp_unit(world)
    )
    return heartbeat!(nchem, soul, stimulus)
end

# Export public API
export NeurochemState, SoulState, StimulusInput
export init_neurochem_state, init_soul_state
export execute_psyche, heartbeat!
export compute_valence, compute_arousal, compute_emotional_coherence
export compute_flow_state, compute_suffering, compute_equanimity
export compute_resonance_field

end # module PSYCHE

# ═══════════════════════════════════════════════════════════════════════
# IX. USAGE EXAMPLE
# ═══════════════════════════════════════════════════════════════════════

"""
Example usage from Motoko FFI:

using PSYCHE

# Initialize
nchem = PSYCHE.init_neurochem_state()
soul = PSYCHE.init_soul_state()

# Every 873ms beat
for beat in 1:1000
    reward = 0.6     # Moderate reward signal
    stress = 0.3     # Low stress
    arousal = 0.5    # Medium arousal
    doctrine = 0.85  # High doctrine alignment
    world = 0.7      # Active world signal

    (nchem, soul) = PSYCHE.execute_psyche(
        nchem, soul, reward, stress, arousal, doctrine, world
    )

    println("Beat ", beat)
    println("  Dopamine:        ", nchem.dopamine)
    println("  Cortisol:        ", nchem.cortisol)
    println("  Serotonin:       ", nchem.serotonin)
    println("  Norepinephrine:  ", nchem.norepinephrine)
    println("  Valence:         ", nchem.emotional_valence)
    println("  Arousal:         ", nchem.emotional_arousal)
    println("  Flow State:      ", soul.flow_state)
    println("  Wisdom:          ", soul.wisdom_potential)
    println("  Resonance:       ", soul.resonance_field)
end
"""
