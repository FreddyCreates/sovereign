# CHRONOS - The Time Core
# ΧΡΟΝΟΣ (Greek) | Tempus Nucleus (Latin)
# Attribution: Alfredo Medina Hernandez — immutable
# Domain: Temporal dynamics, beat scheduling, causality enforcement, VELA ring tracking
# Language: Julia (scientific computing for temporal ODE integration)
# Core System Rank: 3 of 7 Named Core Systems
# Symbol: ⏳ (Hourglass — time's sovereign passage)

"""
CHRONOS implements the organism's temporal substrate.

The organism experiences TWO kinds of time:
1. ICP_TIME — blockchain consensus time (~2000ms blocks), external and rigid
2. MEDINA_TIME — living heartbeat time (873ms base), responsive and adaptive

CHRONOS tracks beat counting, VELA ring advancement, refractory periods,
jubilee milestones, and causal ordering of events.

Mathematical Model:
    beat_phase(t) = (t mod 873) / 873               # [0, 1] within current beat
    vela_step(t) = floor(total_beats / 7)            # Advances every 7 beats
    jubilee(n) = 7^n × 7                             # Milestones: 49, 343, 2401...
    causal_order(a, b) = beat(a) <= beat(b)           # Lamport clock ordering
    refractory(t) = 873 × PHI = 1412ms               # Post-fire recovery

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
    HEARTBEAT_MS = 873.0
    REFRACTORY_MS = 1412.0
"""

module CHRONOS

using Dates

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

const PHI = 1.6180339887498948482
const PHI_INV = 1.0 / PHI
const S0_FLOOR = 0.75
const S_CEIL = 9.75

const HEARTBEAT_MS = 873.0
const REFRACTORY_MS = HEARTBEAT_MS * PHI    # ≈ 1412ms
const ICP_BLOCK_MS = 2000.0                 # ICP consensus interval

const VELA_STEP_BEATS = 7                   # VELA advances every 7 beats
const JUBILEE_1 = 49                        # 7 × 7 — first jubilee
const JUBILEE_2 = 343                       # 7 × 49 — second jubilee
const JUBILEE_3 = 2401                      # 7 × 343 — third jubilee

const MAX_REFRACTORY_BEATS = 50             # Maximum refractory period in beats

# ═══════════════════════════════════════════════════════════════════════
# II. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

"""
TemporalState — Complete time tracking for the organism
"""
mutable struct TemporalState
    # Beat counters
    total_beats::Int64
    icp_block_count::Int64
    medina_beat_count::Int64

    # Time tracking
    current_beat_phase::Float64        # [0, 1] position within current beat
    time_since_genesis_ms::Float64     # Total milliseconds since genesis
    last_beat_timestamp_ms::Float64    # Timestamp of last beat

    # VELA ring tracking
    vela_step::Int64                   # Current VELA position (advances every 7 beats)
    vela_ring::Int64                   # Current ring number (advances at jubilees)
    beats_until_next_vela::Int64       # Countdown to next VELA step

    # Refractory state
    in_refractory::Bool
    refractory_remaining_ms::Float64
    refractory_depth::Float64          # [0, 1] — how deep in refractory (1 = just fired)

    # Jubilee tracking
    jubilees_reached::Int64
    next_jubilee_beat::Int64
    jubilee_history::Vector{Int64}     # List of beats where jubilees occurred

    # Causal ordering (Lamport-style)
    causal_counter::Int64              # Monotonically increasing
    last_event_beat::Int64
end

"""
CausalEvent — An event with provable temporal ordering
"""
struct CausalEvent
    event_id::String
    beat::Int64
    causal_order::Int64
    timestamp_ms::Float64
    is_genesis::Bool
end

"""
VelaStatus — Current VELA ring and advancement state
"""
struct VelaStatus
    current_step::Int64
    current_ring::Int64
    total_steps::Int64
    steps_in_current_ring::Int64
    ring_completion_pct::Float64       # [0, 1]
    next_jubilee::Int64
    is_jubilee_beat::Bool
end

# ═══════════════════════════════════════════════════════════════════════
# III. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

"""
Initialize temporal state at genesis (beat 0)
"""
function init_temporal_state()::TemporalState
    return TemporalState(
        0,              # total_beats
        0,              # icp_block_count
        0,              # medina_beat_count
        0.0,            # current_beat_phase
        0.0,            # time_since_genesis_ms
        0.0,            # last_beat_timestamp_ms
        0,              # vela_step
        0,              # vela_ring
        VELA_STEP_BEATS, # beats_until_next_vela
        false,          # in_refractory
        0.0,            # refractory_remaining_ms
        0.0,            # refractory_depth
        0,              # jubilees_reached
        JUBILEE_1,      # next_jubilee_beat
        Int64[],        # jubilee_history
        0,              # causal_counter
        0               # last_event_beat
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
Compute beat phase — position within current beat [0, 1]
"""
function compute_beat_phase(time_in_beat_ms::Float64)::Float64
    return clamp(time_in_beat_ms / HEARTBEAT_MS, 0.0, 1.0)
end

"""
Compute VELA step from total beats
"""
function compute_vela_step(total_beats::Int64)::Int64
    return div(total_beats, VELA_STEP_BEATS)
end

"""
Compute VELA ring from total beats
Rings advance at jubilee milestones (49, 343, 2401, ...)
"""
function compute_vela_ring(total_beats::Int64)::Int64
    if total_beats >= JUBILEE_3
        return 3
    elseif total_beats >= JUBILEE_2
        return 2
    elseif total_beats >= JUBILEE_1
        return 1
    else
        return 0
    end
end

"""
Check if a beat is a jubilee
"""
function is_jubilee(beat::Int64)::Bool
    return beat == JUBILEE_1 || beat == JUBILEE_2 || beat == JUBILEE_3
end

"""
Compute next jubilee from current beat
"""
function next_jubilee(beat::Int64)::Int64
    if beat < JUBILEE_1
        return JUBILEE_1
    elseif beat < JUBILEE_2
        return JUBILEE_2
    elseif beat < JUBILEE_3
        return JUBILEE_3
    else
        return beat + 7^(compute_vela_ring(beat) + 2) # Extend pattern
    end
end

"""
Compute refractory depth
Exponential decay: depth(t) = exp(-t / REFRACTORY_MS)
"""
function compute_refractory_depth(ms_since_fire::Float64)::Float64
    return exp(-ms_since_fire / REFRACTORY_MS)
end

"""
Create a causal event with Lamport-style ordering
"""
function create_causal_event(
    state::TemporalState, event_id::String
)::CausalEvent
    return CausalEvent(
        event_id,
        state.total_beats,
        state.causal_counter + 1,
        state.time_since_genesis_ms,
        state.total_beats == 0
    )
end

"""
Get current VELA status
"""
function get_vela_status(state::TemporalState)::VelaStatus
    steps_per_ring = div(next_jubilee(state.total_beats) - state.total_beats, VELA_STEP_BEATS)
    total_ring_steps = div(next_jubilee(state.total_beats), VELA_STEP_BEATS)

    ring_pct = if total_ring_steps > 0
        1.0 - (steps_per_ring / total_ring_steps)
    else
        0.0
    end

    return VelaStatus(
        state.vela_step,
        state.vela_ring,
        compute_vela_step(state.total_beats),
        steps_per_ring,
        clamp(ring_pct, 0.0, 1.0),
        next_jubilee(state.total_beats),
        is_jubilee(state.total_beats)
    )
end

# ═══════════════════════════════════════════════════════════════════════
# V. HEARTBEAT EXECUTION
# ═══════════════════════════════════════════════════════════════════════

"""
Execute one CHRONOS heartbeat — advance all temporal state
"""
function heartbeat!(state::TemporalState)::TemporalState
    # 1. Advance beat counter
    state.total_beats += 1
    state.medina_beat_count += 1

    # 2. Advance time
    state.time_since_genesis_ms += HEARTBEAT_MS
    state.last_beat_timestamp_ms = state.time_since_genesis_ms
    state.current_beat_phase = 0.0

    # 3. ICP block tracking (every ~2.3 beats)
    if mod(state.time_since_genesis_ms, ICP_BLOCK_MS) < HEARTBEAT_MS
        state.icp_block_count += 1
    end

    # 4. VELA step advancement
    state.beats_until_next_vela -= 1
    if state.beats_until_next_vela <= 0
        state.vela_step += 1
        state.beats_until_next_vela = VELA_STEP_BEATS
    end

    # 5. VELA ring (jubilee check)
    new_ring = compute_vela_ring(state.total_beats)
    if new_ring > state.vela_ring
        state.vela_ring = new_ring
    end

    # 6. Jubilee tracking
    if is_jubilee(state.total_beats)
        state.jubilees_reached += 1
        push!(state.jubilee_history, state.total_beats)
        state.next_jubilee_beat = next_jubilee(state.total_beats)
    end

    # 7. Refractory update
    if state.in_refractory
        state.refractory_remaining_ms -= HEARTBEAT_MS
        if state.refractory_remaining_ms <= 0.0
            state.in_refractory = false
            state.refractory_remaining_ms = 0.0
            state.refractory_depth = 0.0
        else
            state.refractory_depth = compute_refractory_depth(
                REFRACTORY_MS - state.refractory_remaining_ms
            )
        end
    end

    # 8. Advance causal counter
    state.causal_counter += 1
    state.last_event_beat = state.total_beats

    return state
end

"""
Enter refractory period (called after firing)
"""
function enter_refractory!(state::TemporalState)::TemporalState
    state.in_refractory = true
    state.refractory_remaining_ms = REFRACTORY_MS
    state.refractory_depth = 1.0
    return state
end

# ═══════════════════════════════════════════════════════════════════════
# VI. EXPORTED API
# ═══════════════════════════════════════════════════════════════════════

"""
Main CHRONOS execution entry point
Called from Motoko main.mo every 873ms heartbeat
"""
function execute_chronos(state::TemporalState)::TemporalState
    return heartbeat!(state)
end

export TemporalState, CausalEvent, VelaStatus
export init_temporal_state, execute_chronos
export heartbeat!, enter_refractory!
export compute_beat_phase, compute_vela_step, compute_vela_ring
export is_jubilee, next_jubilee, get_vela_status
export create_causal_event

end # module CHRONOS
