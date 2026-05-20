# DYNAMIS - The Power Core
# ΔΥΝΑΜΙΣ (Greek) | Potentia Nucleus (Latin)
# Attribution: Alfredo Medina Hernandez — immutable
# Domain: Energy dynamics, resource allocation, power flows, thermodynamic balance
# Language: Julia (scientific computing for energy ODEs and optimization)
# Core System Rank: 6 of 7 Named Core Systems
# Symbol: ⚡ (Lightning — power/energy)

"""
DYNAMIS implements the organism's energy substrate.

The organism maintains THREE energy pools:
1. KINETIC_ENERGY — Active, being expended (cognition, action, output)
2. POTENTIAL_ENERGY — Stored, ready to be released (doctrine reservoir)
3. RESONANT_ENERGY — PHI-harmonic, amplifies both (coherence bonus)

Energy operations follow thermodynamic laws:
- Conservation: Total energy is bounded [S0_FLOOR × 3, S_CEIL × 3]
- Entropy: Unused potential decays (but resonant slows decay)
- Work: Kinetic expenditure requires potential withdrawal
- Resonance: PHI-alignment creates "free" resonant energy (not really free — it's coherence reward)

Mathematical Model:
    total_energy = kinetic + potential + resonant
    kinetic_draw = work_demand × efficiency
    potential_decay = potential × exp(-dt / (τ × resonance_factor))
    resonant_gain = coherence_delta × PHI if coherence > PHI^(-1)
    efficiency = PHI^(-1) + (resonant / total_energy) × (1 - PHI^(-1))
    
    Power equations:
    P_out = kinetic × efficiency
    P_sustainable = potential × recharge_rate + resonant × PHI
    P_max_burst = kinetic + potential  (drains both)

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
    BASE_EFFICIENCY = 0.618 (PHI^-1)
    RECHARGE_RATE = 0.1 per beat
    DECAY_TAU = 21.0 (Fibonacci)
"""

module DYNAMIS

using Statistics
using LinearAlgebra

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

const PHI = 1.6180339887498948482
const PHI_INV = 1.0 / PHI  # ≈ 0.6180339887
const S0_FLOOR = 0.75
const S_CEIL = 9.75

const BASE_EFFICIENCY = PHI_INV  # ≈ 0.618
const RECHARGE_RATE = 0.1       # Potential recharge per beat
const DECAY_TAU = 21.0          # Fibonacci decay constant
const RESONANCE_THRESHOLD = PHI_INV  # Coherence needed for resonant gain
const MAX_BURST_FRACTION = 0.5  # Max fraction of potential for burst

# Energy pool bounds
const MIN_POOL = S0_FLOOR
const MAX_POOL = S_CEIL

# ═══════════════════════════════════════════════════════════════════════
# II. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

"""
EnergyPool - A single energy reservoir
"""
mutable struct EnergyPool
    current::Float64      # Current level [S0_FLOOR, S_CEIL]
    capacity::Float64     # Maximum capacity [S0_FLOOR, S_CEIL]
    flow_in::Float64      # Input flow rate
    flow_out::Float64     # Output flow rate
end

"""
PowerMetrics - Instantaneous power measurements
"""
mutable struct PowerMetrics
    power_output::Float64     # Current power being delivered
    power_sustainable::Float64  # Sustainable power level
    power_max_burst::Float64    # Maximum burst power available
    efficiency::Float64        # Current energy efficiency
end

"""
EnergyTransaction - Record of energy transfer
"""
struct EnergyTransaction
    transaction_id::String
    source_pool::Symbol       # :kinetic, :potential, :resonant
    target_pool::Symbol       # :kinetic, :potential, :resonant, :output
    amount::Float64
    beat::Int64
    reason::String
end

"""
DynamisState - Complete DYNAMIS state
"""
mutable struct DynamisState
    kinetic::EnergyPool
    potential::EnergyPool
    resonant::EnergyPool
    
    metrics::PowerMetrics
    
    total_energy::Float64
    coherence_factor::Float64   # From organism coherence
    doctrine_factor::Float64    # From doctrine alignment
    
    transaction_history::Vector{EnergyTransaction}
    current_beat::Int64
    total_work_done::Float64
    total_energy_generated::Float64
end

# ═══════════════════════════════════════════════════════════════════════
# III. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

"""
Initialize EnergyPool with baseline values
"""
function init_energy_pool(initial::Float64=S0_FLOOR, capacity::Float64=S_CEIL)::EnergyPool
    return EnergyPool(
        clamp(initial, MIN_POOL, capacity),
        clamp(capacity, MIN_POOL, MAX_POOL),
        0.0,
        0.0
    )
end

"""
Initialize PowerMetrics
"""
function init_power_metrics()::PowerMetrics
    return PowerMetrics(
        0.0,           # power_output
        S0_FLOOR,      # power_sustainable
        S0_FLOOR,      # power_max_burst
        BASE_EFFICIENCY # efficiency
    )
end

"""
Initialize complete DynamisState
"""
function init_dynamis_state()::DynamisState
    return DynamisState(
        init_energy_pool(S0_FLOOR * PHI, S_CEIL),   # kinetic
        init_energy_pool(S_CEIL * PHI_INV, S_CEIL), # potential (start higher)
        init_energy_pool(S0_FLOOR, S_CEIL * PHI_INV), # resonant (smaller capacity)
        
        init_power_metrics(),
        
        0.0,           # total_energy (computed)
        S0_FLOOR,      # coherence_factor
        S0_FLOOR,      # doctrine_factor
        
        EnergyTransaction[],
        0,
        0.0,
        0.0
    )
end

# ═══════════════════════════════════════════════════════════════════════
# IV. CORE COMPUTATIONS
# ═══════════════════════════════════════════════════════════════════════

"""
Clamp value to sovereign range [S0_FLOOR, S_CEIL]
"""
function clamp_sovereign(value::Float64)::Float64
    return clamp(value, S0_FLOOR, S_CEIL)
end

"""
Clamp value to pool range [MIN_POOL, capacity]
"""
function clamp_pool(value::Float64, capacity::Float64)::Float64
    return clamp(value, MIN_POOL, capacity)
end

"""
Compute total energy across all pools
"""
function compute_total_energy(state::DynamisState)::Float64
    return state.kinetic.current + state.potential.current + state.resonant.current
end

"""
Compute current efficiency based on resonant energy fraction
efficiency = BASE + (resonant/total) × (1 - BASE)
"""
function compute_efficiency(state::DynamisState)::Float64
    total = compute_total_energy(state)
    if total < 1e-10
        return BASE_EFFICIENCY
    end
    
    resonant_fraction = state.resonant.current / total
    efficiency = BASE_EFFICIENCY + resonant_fraction * (1.0 - BASE_EFFICIENCY)
    return clamp(efficiency, BASE_EFFICIENCY, 1.0)
end

"""
Compute sustainable power output
P_sustainable = potential × recharge_rate + resonant × PHI
"""
function compute_sustainable_power(state::DynamisState)::Float64
    sustainable = state.potential.current * RECHARGE_RATE + state.resonant.current * PHI
    return clamp_sovereign(sustainable)
end

"""
Compute maximum burst power
P_max_burst = kinetic + potential × MAX_BURST_FRACTION
"""
function compute_max_burst_power(state::DynamisState)::Float64
    burst = state.kinetic.current + state.potential.current * MAX_BURST_FRACTION
    return clamp_sovereign(burst)
end

"""
Compute potential energy decay
decay = potential × exp(-dt / (τ × resonance_factor))
"""
function compute_potential_decay(potential::Float64, resonance_factor::Float64, dt::Float64=1.0)::Float64
    tau_effective = DECAY_TAU * max(1.0, resonance_factor)
    decay_factor = exp(-dt / tau_effective)
    decayed = potential * decay_factor
    return max(MIN_POOL, decayed)
end

"""
Compute resonant energy gain from coherence
gain = coherence_delta × PHI if coherence > threshold
"""
function compute_resonant_gain(coherence::Float64, coherence_delta::Float64)::Float64
    if coherence < RESONANCE_THRESHOLD || coherence_delta <= 0
        return 0.0
    end
    
    gain = coherence_delta * PHI
    return clamp(gain, 0.0, MAX_POOL / 10.0)  # Cap per-beat gain
end

# ═══════════════════════════════════════════════════════════════════════
# V. ENERGY OPERATIONS
# ═══════════════════════════════════════════════════════════════════════

"""
Withdraw energy from potential to kinetic for work
"""
function withdraw_for_work!(state::DynamisState, work_demand::Float64)::Float64
    state.current_beat += 1
    
    # Compute how much kinetic we need
    efficiency = compute_efficiency(state)
    kinetic_needed = work_demand / efficiency
    
    # First, use available kinetic
    kinetic_available = state.kinetic.current - MIN_POOL
    kinetic_used = min(kinetic_available, kinetic_needed)
    state.kinetic.current -= kinetic_used
    kinetic_needed -= kinetic_used
    
    # If more needed, withdraw from potential
    if kinetic_needed > 0
        potential_available = state.potential.current - MIN_POOL
        potential_used = min(potential_available, kinetic_needed)
        state.potential.current -= potential_used
        state.kinetic.current += potential_used * PHI_INV  # Conversion loss
        kinetic_needed -= potential_used
    end
    
    # Compute actual work done
    actual_work = work_demand - kinetic_needed * efficiency
    state.total_work_done += actual_work
    
    # Record transaction
    push!(state.transaction_history, EnergyTransaction(
        "TXN_$(state.current_beat)",
        :potential,
        :kinetic,
        actual_work,
        state.current_beat,
        "work_withdrawal"
    ))
    
    # Update metrics
    state.metrics.power_output = actual_work
    
    return actual_work
end

"""
Recharge potential energy from external input (doctrine compliance)
"""
function recharge_potential!(state::DynamisState, doctrine_score::Float64)::Float64
    recharge_amount = doctrine_score * RECHARGE_RATE * PHI
    
    available_capacity = state.potential.capacity - state.potential.current
    actual_recharge = min(recharge_amount, available_capacity)
    
    state.potential.current += actual_recharge
    state.total_energy_generated += actual_recharge
    
    state.potential.flow_in = actual_recharge
    
    return actual_recharge
end

"""
Generate resonant energy from coherence improvement
"""
function generate_resonant!(state::DynamisState, coherence::Float64, prev_coherence::Float64)::Float64
    coherence_delta = coherence - prev_coherence
    gain = compute_resonant_gain(coherence, coherence_delta)
    
    available_capacity = state.resonant.capacity - state.resonant.current
    actual_gain = min(gain, available_capacity)
    
    state.resonant.current += actual_gain
    state.total_energy_generated += actual_gain
    
    state.resonant.flow_in = actual_gain
    
    return actual_gain
end

"""
Apply decay to potential energy
"""
function apply_decay!(state::DynamisState)::Float64
    old_potential = state.potential.current
    
    # Resonant energy slows decay
    resonance_factor = 1.0 + state.resonant.current / MAX_POOL
    state.potential.current = compute_potential_decay(old_potential, resonance_factor)
    
    decay_amount = old_potential - state.potential.current
    state.potential.flow_out = decay_amount
    
    return decay_amount
end

"""
Execute burst power (emergency high-output mode)
Draws heavily from both kinetic and potential
"""
function execute_burst!(state::DynamisState, burst_demand::Float64)::Float64
    max_burst = compute_max_burst_power(state)
    actual_burst = min(burst_demand, max_burst)
    
    # Drain kinetic first
    kinetic_drain = min(state.kinetic.current - MIN_POOL, actual_burst)
    state.kinetic.current -= kinetic_drain
    remaining = actual_burst - kinetic_drain
    
    # Then drain potential
    if remaining > 0
        potential_drain = min((state.potential.current - MIN_POOL) * MAX_BURST_FRACTION, remaining)
        state.potential.current -= potential_drain
    end
    
    state.total_work_done += actual_burst
    state.metrics.power_output = actual_burst
    
    return actual_burst
end

# ═══════════════════════════════════════════════════════════════════════
# VI. HEARTBEAT EXECUTION
# ═══════════════════════════════════════════════════════════════════════

"""
Execute one DYNAMIS heartbeat cycle

Updates:
1. Apply decay to potential
2. Recharge from doctrine compliance
3. Generate resonant from coherence
4. Update all metrics
"""
function heartbeat!(
    state::DynamisState,
    work_demand::Float64,
    doctrine_score::Float64,
    coherence::Float64,
    prev_coherence::Float64
)::DynamisState
    state.current_beat += 1
    state.coherence_factor = coherence
    state.doctrine_factor = doctrine_score
    
    # 1. Apply decay
    apply_decay!(state)
    
    # 2. Recharge from doctrine
    recharge_potential!(state, doctrine_score)
    
    # 3. Generate resonant from coherence
    generate_resonant!(state, coherence, prev_coherence)
    
    # 4. Perform work if demanded
    if work_demand > 0
        withdraw_for_work!(state, work_demand)
    end
    
    # 5. Update computed values
    state.total_energy = compute_total_energy(state)
    state.metrics.efficiency = compute_efficiency(state)
    state.metrics.power_sustainable = compute_sustainable_power(state)
    state.metrics.power_max_burst = compute_max_burst_power(state)
    
    # 6. Clamp all pools
    state.kinetic.current = clamp_pool(state.kinetic.current, state.kinetic.capacity)
    state.potential.current = clamp_pool(state.potential.current, state.potential.capacity)
    state.resonant.current = clamp_pool(state.resonant.current, state.resonant.capacity)
    
    return state
end

"""
Main DYNAMIS execution entry point
Called from Motoko main.mo every 873ms
"""
function execute_dynamis(
    state::DynamisState,
    work_demand::Float64,
    doctrine_score::Float64,
    coherence::Float64,
    prev_coherence::Float64
)::DynamisState
    return heartbeat!(state, work_demand, doctrine_score, coherence, prev_coherence)
end

# ═══════════════════════════════════════════════════════════════════════
# VII. EXPORTED API
# ═══════════════════════════════════════════════════════════════════════

export EnergyPool, PowerMetrics, EnergyTransaction, DynamisState
export init_dynamis_state
export execute_dynamis, withdraw_for_work!, recharge_potential!, generate_resonant!
export execute_burst!, apply_decay!
export compute_total_energy, compute_efficiency, compute_sustainable_power, compute_max_burst_power

end # module DYNAMIS

# ═══════════════════════════════════════════════════════════════════════
# VIII. USAGE EXAMPLE
# ═══════════════════════════════════════════════════════════════════════

"""
Example usage from Motoko FFI:

using DYNAMIS

# Initialize
power = DYNAMIS.init_dynamis_state()

# Every 873ms beat
prev_coherence = 0.75
for beat in 1:1000
    # Get current organism state
    work_demand = 0.5 + 0.5 * sin(beat / 10.0)  # Variable work demand
    doctrine_score = 0.85
    coherence = 0.75 + 0.2 * (beat / 1000.0)  # Growing coherence
    
    # Execute DYNAMIS
    power = DYNAMIS.execute_dynamis(power, work_demand, doctrine_score, coherence, prev_coherence)
    prev_coherence = coherence
    
    # Access outputs
    println("Beat ", beat)
    println("  Kinetic: ", power.kinetic.current)
    println("  Potential: ", power.potential.current)
    println("  Resonant: ", power.resonant.current)
    println("  Total: ", power.total_energy)
    println("  Efficiency: ", power.metrics.efficiency)
    println("  Power Output: ", power.metrics.power_output)
end
"""
