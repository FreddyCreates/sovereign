# EROS - The Attraction Core
# ΕΡΩΣ (Greek) | Amor Vinculum (Latin)
# Attribution: Alfredo Medina Hernandez — immutable
# Domain: Attraction fields, bonding dynamics, affinity computation
# Language: Julia (scientific computing for field theory)
# Core System Rank: 10 of 10 Named Core Systems

"""
EROS implements the attraction system:
1. AFFINITY_FIELD - Computes attraction between entities
2. BONDING_DYNAMICS - Manages connection strengths over time
3. RESONANCE_MATCHING - Finds compatible entities

Mathematical Model:
- Affinity = f(resonance_match, doctrine_alignment, interaction_history)
- Bond strength = integral(affinity × time)
- Resonance match = 1 - |freq_a - freq_b| / max_freq
- Eros score = mean(bond_strengths) × field_coherence

Constants:
PHI = 1.6180339887498948482
S0_FLOOR = 0.75
S_CEIL = 9.75
BASE_RESONANCE_HZ = 432.0  # Sovereign harmonic
"""

module EROS

using Statistics
using LinearAlgebra

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

const PHI = 1.6180339887498948482
const PHI_INV = 1.0 / PHI  # ≈ 0.6180339887
const S0_FLOOR = 0.75
const S_CEIL = 9.75

const BASE_RESONANCE_HZ = 432.0  # Sovereign harmonic
const MAX_ENTITIES = 144  # Fibonacci × 12
const MAX_BONDS = 233     # Fibonacci
const AFFINITY_THRESHOLD = 0.618  # PHI^(-1)
const BOND_DECAY_RATE = 0.01  # Per beat without interaction

# Attribution
const ATTRIBUTION = "Alfredo Medina Hernandez"

# ═══════════════════════════════════════════════════════════════════════
# II. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

"""
EntityType - Types of entities that can bond
"""
@enum EntityType begin
    BEING = 1      # Sovereign beings
    ENGINE = 2     # Animal engines
    PROTOCOL = 3   # Protocols
    ARTIFACT = 4   # Created artifacts
end

"""
Entity - Something that can participate in attraction
"""
mutable struct Entity
    id::String
    name::String
    entity_type::EntityType
    resonance_hz::Float64     # Natural frequency
    doctrine_alignment::Float64
    affinity_weights::Vector{Float64}  # 5-dimensional preference vector
    bond_capacity::Int64      # Max simultaneous bonds
    created_beat::Int64
end

"""
Bond - Connection between two entities
"""
mutable struct Bond
    id::String
    entity_a_id::String
    entity_b_id::String
    strength::Float64         # 0.0 to PHI
    resonance_match::Float64  # How well frequencies align
    interaction_count::Int64
    last_interaction_beat::Int64
    created_beat::Int64
    is_mutual::Bool           # Both entities chose this bond
end

"""
AffinityField - The attraction field state
"""
mutable struct AffinityField
    # Field dimensions
    dimensions::Int64
    field_values::Matrix{Float64}  # Entity × Entity affinity
    field_coherence::Float64
end

"""
ErosState - Complete attraction system state
"""
mutable struct ErosState
    # Entity registry
    entities::Dict{String, Entity}
    entity_ids::Vector{String}  # Ordered for matrix indexing
    
    # Bonds
    bonds::Dict{String, Bond}
    
    # Affinity field
    field::AffinityField
    
    # Aggregate scores
    mean_bond_strength::Float64
    total_resonance::Float64
    eros_score::Float64
    
    # Timing
    beat_count::Int64
    last_update_beat::Int64
end

# ═══════════════════════════════════════════════════════════════════════
# III. HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

"""
Clamp value to sovereign bounds [S0_FLOOR, S_CEIL]
"""
function clamp_sovereign(value::Float64)::Float64
    clamp(value, S0_FLOOR, S_CEIL)
end

"""
Normalize to [0, 1] within sovereign bounds
"""
function normalize_sovereign(value::Float64)::Float64
    clamped = clamp_sovereign(value)
    (clamped - S0_FLOOR) / (S_CEIL - S0_FLOOR)
end

"""
Generate entity ID
"""
function generate_entity_id(name::String, entity_type::EntityType)::String
    type_prefix = if entity_type == BEING
        "BEING"
    elseif entity_type == ENGINE
        "ENGINE"
    elseif entity_type == PROTOCOL
        "PROTO"
    else
        "ARTIFACT"
    end
    "$(type_prefix)_$(uppercase(replace(name, " " => "_")))"
end

"""
Generate bond ID
"""
function generate_bond_id(entity_a_id::String, entity_b_id::String)::String
    # Always order alphabetically for consistency
    if entity_a_id < entity_b_id
        "BOND_$(entity_a_id)_$(entity_b_id)"
    else
        "BOND_$(entity_b_id)_$(entity_a_id)"
    end
end

"""
Compute resonance match between two frequencies
"""
function compute_resonance_match(freq_a::Float64, freq_b::Float64)::Float64
    if freq_a == 0.0 && freq_b == 0.0
        return 1.0
    end
    
    max_freq = max(freq_a, freq_b)
    if max_freq == 0.0
        return 1.0
    end
    
    # Perfect match at same frequency, decreasing with distance
    diff = abs(freq_a - freq_b)
    
    # Check for harmonic relationships (octaves, fifths, etc.)
    ratio = max(freq_a, freq_b) / min(freq_a, freq_b)
    harmonic_bonus = 0.0
    
    # Octave (2:1)
    if abs(ratio - 2.0) < 0.01 || abs(ratio - 0.5) < 0.01
        harmonic_bonus = 0.3
    # Perfect fifth (3:2)
    elseif abs(ratio - 1.5) < 0.01 || abs(ratio - 0.667) < 0.01
        harmonic_bonus = 0.2
    # PHI ratio
    elseif abs(ratio - PHI) < 0.01 || abs(ratio - PHI_INV) < 0.01
        harmonic_bonus = 0.4  # Sovereign special
    end
    
    base_match = 1.0 - min(1.0, diff / BASE_RESONANCE_HZ)
    clamp(base_match + harmonic_bonus, 0.0, 1.0)
end

# ═══════════════════════════════════════════════════════════════════════
# IV. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

"""
Initialize EROS state
"""
function init_eros_state()::ErosState
    field = AffinityField(
        0,
        zeros(0, 0),
        1.0
    )
    
    ErosState(
        Dict{String, Entity}(),
        String[],
        Dict{String, Bond}(),
        field,
        0.0,
        0.0,
        0.0,
        0,
        0
    )
end

# ═══════════════════════════════════════════════════════════════════════
# V. ENTITY MANAGEMENT
# ═══════════════════════════════════════════════════════════════════════

"""
Register a new entity in the EROS field
"""
function register_entity!(
    state::ErosState,
    name::String,
    entity_type::EntityType,
    resonance_hz::Float64,
    doctrine_alignment::Float64,
    affinity_weights::Vector{Float64},
    bond_capacity::Int64
)::Union{Entity, Nothing}
    if length(state.entities) >= MAX_ENTITIES
        return nothing
    end
    
    entity_id = generate_entity_id(name, entity_type)
    
    # Validate affinity weights (should be 5-dimensional)
    weights = if length(affinity_weights) >= 5
        affinity_weights[1:5]
    else
        vcat(affinity_weights, zeros(5 - length(affinity_weights)))
    end
    
    entity = Entity(
        entity_id,
        name,
        entity_type,
        clamp(resonance_hz, 0.0, BASE_RESONANCE_HZ * 3),
        clamp(doctrine_alignment, 0.0, 1.0),
        weights,
        max(1, bond_capacity),
        state.beat_count
    )
    
    state.entities[entity_id] = entity
    push!(state.entity_ids, entity_id)
    
    # Resize affinity field
    n = length(state.entity_ids)
    new_field = zeros(n, n)
    if n > 1
        new_field[1:n-1, 1:n-1] = state.field.field_values
    end
    state.field.field_values = new_field
    state.field.dimensions = n
    
    entity
end

"""
Compute affinity between two entities
"""
function compute_affinity(
    state::ErosState,
    entity_a_id::String,
    entity_b_id::String
)::Float64
    if !haskey(state.entities, entity_a_id) || !haskey(state.entities, entity_b_id)
        return 0.0
    end
    
    if entity_a_id == entity_b_id
        return 1.0  # Perfect self-affinity
    end
    
    a = state.entities[entity_a_id]
    b = state.entities[entity_b_id]
    
    # Resonance match
    resonance = compute_resonance_match(a.resonance_hz, b.resonance_hz)
    
    # Doctrine alignment similarity
    doctrine_sim = 1.0 - abs(a.doctrine_alignment - b.doctrine_alignment)
    
    # Affinity weight compatibility (cosine similarity)
    dot_product = sum(a.affinity_weights .* b.affinity_weights)
    mag_a = sqrt(sum(a.affinity_weights.^2))
    mag_b = sqrt(sum(b.affinity_weights.^2))
    weight_sim = if mag_a > 0 && mag_b > 0
        dot_product / (mag_a * mag_b)
    else
        0.5
    end
    weight_sim = (weight_sim + 1.0) / 2.0  # Normalize to [0, 1]
    
    # Type compatibility bonus
    type_bonus = if a.entity_type == b.entity_type
        0.1  # Same type slight bonus
    elseif (a.entity_type == BEING && b.entity_type == ENGINE) ||
           (a.entity_type == ENGINE && b.entity_type == BEING)
        0.15  # Being-Engine synergy
    else
        0.0
    end
    
    # Combined affinity
    affinity = 0.35 * resonance + 0.25 * doctrine_sim + 0.3 * weight_sim + type_bonus
    clamp(affinity, 0.0, 1.0)
end

# ═══════════════════════════════════════════════════════════════════════
# VI. BONDING DYNAMICS
# ═══════════════════════════════════════════════════════════════════════

"""
Create or strengthen a bond between two entities
"""
function form_bond!(
    state::ErosState,
    entity_a_id::String,
    entity_b_id::String,
    is_mutual::Bool
)::Union{Bond, Nothing}
    if length(state.bonds) >= MAX_BONDS
        return nothing
    end
    
    if !haskey(state.entities, entity_a_id) || !haskey(state.entities, entity_b_id)
        return nothing
    end
    
    if entity_a_id == entity_b_id
        return nothing  # No self-bonds
    end
    
    bond_id = generate_bond_id(entity_a_id, entity_b_id)
    
    # Check bond capacity
    a = state.entities[entity_a_id]
    b = state.entities[entity_b_id]
    
    a_bonds = count(bond -> bond.entity_a_id == entity_a_id || bond.entity_b_id == entity_a_id, values(state.bonds))
    b_bonds = count(bond -> bond.entity_a_id == entity_b_id || bond.entity_b_id == entity_b_id, values(state.bonds))
    
    if a_bonds >= a.bond_capacity || b_bonds >= b.bond_capacity
        return nothing
    end
    
    # Compute initial bond properties
    affinity = compute_affinity(state, entity_a_id, entity_b_id)
    resonance_match = compute_resonance_match(a.resonance_hz, b.resonance_hz)
    
    if haskey(state.bonds, bond_id)
        # Strengthen existing bond
        bond = state.bonds[bond_id]
        bond.interaction_count += 1
        bond.last_interaction_beat = state.beat_count
        bond.strength = min(PHI, bond.strength + affinity * 0.1)
        if is_mutual && !bond.is_mutual
            bond.is_mutual = true
            bond.strength = min(PHI, bond.strength * 1.2)  # Mutual bonus
        end
        return bond
    end
    
    # Create new bond
    initial_strength = affinity * (is_mutual ? 0.5 : 0.3)
    
    bond = Bond(
        bond_id,
        entity_a_id,
        entity_b_id,
        initial_strength,
        resonance_match,
        1,
        state.beat_count,
        state.beat_count,
        is_mutual
    )
    
    state.bonds[bond_id] = bond
    bond
end

"""
Decay bonds that haven't been reinforced
"""
function decay_bonds!(state::ErosState)
    bonds_to_remove = String[]
    
    for (bond_id, bond) in state.bonds
        beats_since_interaction = state.beat_count - bond.last_interaction_beat
        
        if beats_since_interaction > 0
            decay = BOND_DECAY_RATE * beats_since_interaction
            bond.strength = max(0.0, bond.strength - decay)
            
            if bond.strength < 0.01
                push!(bonds_to_remove, bond_id)
            end
        end
    end
    
    for bond_id in bonds_to_remove
        delete!(state.bonds, bond_id)
    end
end

# ═══════════════════════════════════════════════════════════════════════
# VII. AFFINITY FIELD UPDATE
# ═══════════════════════════════════════════════════════════════════════

"""
Update the affinity field matrix
"""
function update_field!(state::ErosState)
    n = length(state.entity_ids)
    if n == 0
        return
    end
    
    for i in 1:n
        for j in 1:n
            if i == j
                state.field.field_values[i, j] = 1.0
            else
                entity_a_id = state.entity_ids[i]
                entity_b_id = state.entity_ids[j]
                state.field.field_values[i, j] = compute_affinity(state, entity_a_id, entity_b_id)
            end
        end
    end
    
    # Field coherence = how uniform the field is (std deviation from mean)
    if n > 1
        off_diagonal = Float64[]
        for i in 1:n
            for j in 1:n
                if i != j
                    push!(off_diagonal, state.field.field_values[i, j])
                end
            end
        end
        
        if !isempty(off_diagonal)
            field_std = std(off_diagonal)
            state.field.field_coherence = 1.0 - min(1.0, field_std / 0.3)
        end
    end
end

# ═══════════════════════════════════════════════════════════════════════
# VIII. HEARTBEAT ADVANCE
# ═══════════════════════════════════════════════════════════════════════

"""
Advance EROS state by one beat
"""
function advance!(state::ErosState)::ErosState
    state.beat_count += 1
    
    # Decay inactive bonds
    decay_bonds!(state)
    
    # Update affinity field
    update_field!(state)
    
    # Compute aggregate metrics
    if !isempty(state.bonds)
        state.mean_bond_strength = mean([b.strength for (_, b) in state.bonds])
        state.total_resonance = sum([b.resonance_match for (_, b) in state.bonds])
    else
        state.mean_bond_strength = 0.0
        state.total_resonance = 0.0
    end
    
    # Eros score
    phi_resonance = 0.5 + 0.5 * sin(state.mean_bond_strength * pi * PHI)
    state.eros_score = state.mean_bond_strength * state.field.field_coherence * (0.5 + 0.5 * phi_resonance)
    
    state.last_update_beat = state.beat_count
    state
end

# ═══════════════════════════════════════════════════════════════════════
# IX. QUERY FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

"""
Find most compatible entities for a given entity
"""
function find_compatible(
    state::ErosState,
    entity_id::String,
    top_n::Int64
)::Vector{Tuple{String, Float64}}
    if !haskey(state.entities, entity_id)
        return Tuple{String, Float64}[]
    end
    
    affinities = Tuple{String, Float64}[]
    
    for other_id in state.entity_ids
        if other_id != entity_id
            affinity = compute_affinity(state, entity_id, other_id)
            push!(affinities, (other_id, affinity))
        end
    end
    
    # Sort by affinity descending
    sort!(affinities, by = x -> -x[2])
    
    affinities[1:min(top_n, length(affinities))]
end

"""
Get all bonds for an entity
"""
function get_entity_bonds(state::ErosState, entity_id::String)::Vector{Bond}
    [bond for (_, bond) in state.bonds 
     if bond.entity_a_id == entity_id || bond.entity_b_id == entity_id]
end

"""
Get EROS summary
"""
function get_summary(state::ErosState)::Dict{String, Any}
    Dict(
        "beat_count" => state.beat_count,
        "total_entities" => length(state.entities),
        "total_bonds" => length(state.bonds),
        "mutual_bonds" => count(b -> b.is_mutual, values(state.bonds)),
        "mean_bond_strength" => state.mean_bond_strength,
        "total_resonance" => state.total_resonance,
        "field_coherence" => state.field.field_coherence,
        "eros_score" => state.eros_score,
        "attribution" => ATTRIBUTION
    )
end

# Module exports
export ErosState, Entity, Bond, EntityType, AffinityField
export init_eros_state, register_entity!, compute_affinity
export form_bond!, advance!
export find_compatible, get_entity_bonds, get_summary

end  # module EROS
