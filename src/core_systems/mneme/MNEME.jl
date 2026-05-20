# MNEME - The Memory Core
# ΜΝΗΜΗ (Greek) | Memoria Nucleus (Latin)
# Attribution: Alfredo Medina Hernandez — immutable
# Domain: Memory persistence, recall patterns, Hebbian consolidation, engram storage
# Language: Julia (scientific computing for memory network dynamics)
# Core System Rank: 5 of 7 Named Core Systems
# Symbol: 📜 (Scroll — memory/record)

"""
MNEME implements the organism's memory substrate.

The organism maintains THREE memory systems:
1. WORKING_MEMORY — Transient, high-bandwidth, decays within 7 beats
2. EPISODIC_MEMORY — Experience-based, indexed by beat number, PHI-weighted recall
3. SEMANTIC_MEMORY — Crystallized knowledge, doctrine-aligned, permanent

Memory operations:
- ENCODE: Signal → Engram (with doctrine weight)
- CONSOLIDATE: Working → Episodic → Semantic (Hebbian learning)
- RECALL: Query → Weighted sum of matching engrams
- FORGET: PHI-decay on unaccessed memories (except semantic)

Mathematical Model:
    engram_strength(t) = base_strength × PHI^(recency/7) × access_count^0.5
    recall_weight(q, e) = cosine_similarity(q, e) × engram_strength(e)
    consolidation_threshold = PHI^(-1) ≈ 0.618
    hebbian_delta = pre × post × PHI × learning_rate
    forgetting_curve(t) = strength × exp(-t / (τ × PHI))

Constants:
    PHI = 1.6180339887498948482
    S0_FLOOR = 0.75
    S_CEIL = 9.75
    WORKING_MEMORY_CAPACITY = 7  (PHI-bounded)
    EPISODIC_WINDOW = 343       (7^3 beats)
    CONSOLIDATION_THRESHOLD = 0.618 (PHI^-1)
"""

module MNEME

using Statistics
using LinearAlgebra

# ═══════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

const PHI = 1.6180339887498948482
const PHI_INV = 1.0 / PHI  # ≈ 0.6180339887
const S0_FLOOR = 0.75
const S_CEIL = 9.75

const WORKING_MEMORY_CAPACITY = 7  # PHI-bounded slot count
const EPISODIC_WINDOW = 343        # 7^3 beats for episodic buffer
const SEMANTIC_THRESHOLD = 0.85    # Strength needed for semantic promotion
const CONSOLIDATION_THRESHOLD = PHI_INV  # ≈ 0.618
const FORGETTING_TAU = 49.0        # 7^2 beats decay constant
const HEBBIAN_LEARNING_RATE = 0.1

# ═══════════════════════════════════════════════════════════════════════
# II. TYPE DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════

"""
Engram - A single memory trace
"""
mutable struct Engram
    engram_id::String
    content::Vector{Float64}      # 13-dimensional signal vector
    strength::Float64             # Current strength [S0_FLOOR, S_CEIL]
    encoded_at::Int64             # Beat number when encoded
    last_accessed::Int64          # Beat number of last recall
    access_count::Int64           # Number of times recalled
    doctrine_weight::Float64      # Alignment with doctrine [0, 1]
    memory_type::Symbol           # :working, :episodic, :semantic
end

"""
HebbianConnection - Associative link between engrams
"""
mutable struct HebbianConnection
    source_id::String
    target_id::String
    weight::Float64               # Connection strength [0, 1]
    last_updated::Int64           # Beat of last potentiation
end

"""
WorkingMemory - Transient, high-bandwidth memory buffer
"""
mutable struct WorkingMemory
    slots::Vector{Engram}         # Max 7 slots
    attention_weights::Vector{Float64}  # Soft attention over slots
    coherence::Float64            # Working memory coherence
end

"""
EpisodicMemory - Experience-indexed memory store
"""
mutable struct EpisodicMemory
    engrams::Dict{String, Engram}
    beat_index::Dict{Int64, Vector{String}}  # Beat → engram IDs
    total_engrams::Int64
    average_strength::Float64
end

"""
SemanticMemory - Crystallized, doctrine-aligned knowledge
"""
mutable struct SemanticMemory
    engrams::Dict{String, Engram}
    concept_clusters::Dict{String, Vector{String}}  # Concept → engram IDs
    total_engrams::Int64
    doctrine_coherence::Float64
end

"""
MemoryState - Complete MNEME state
"""
mutable struct MemoryState
    working::WorkingMemory
    episodic::EpisodicMemory
    semantic::SemanticMemory
    connections::Dict{String, HebbianConnection}
    current_beat::Int64
    total_encodings::Int64
    total_recalls::Int64
    consolidation_events::Int64
end

# ═══════════════════════════════════════════════════════════════════════
# III. INITIALIZATION
# ═══════════════════════════════════════════════════════════════════════

"""
Initialize empty Engram
"""
function init_engram(id::String, content::Vector{Float64}, beat::Int64, doctrine_weight::Float64)::Engram
    return Engram(
        id,
        content,
        S0_FLOOR,           # Initial strength
        beat,               # Encoded at
        beat,               # Last accessed
        0,                  # Access count
        doctrine_weight,    # Doctrine weight
        :working            # Start in working memory
    )
end

"""
Initialize WorkingMemory
"""
function init_working_memory()::WorkingMemory
    return WorkingMemory(
        Engram[],
        Float64[],
        S0_FLOOR
    )
end

"""
Initialize EpisodicMemory
"""
function init_episodic_memory()::EpisodicMemory
    return EpisodicMemory(
        Dict{String, Engram}(),
        Dict{Int64, Vector{String}}(),
        0,
        S0_FLOOR
    )
end

"""
Initialize SemanticMemory
"""
function init_semantic_memory()::SemanticMemory
    return SemanticMemory(
        Dict{String, Engram}(),
        Dict{String, Vector{String}}(),
        0,
        S0_FLOOR
    )
end

"""
Initialize complete MemoryState
"""
function init_memory_state()::MemoryState
    return MemoryState(
        init_working_memory(),
        init_episodic_memory(),
        init_semantic_memory(),
        Dict{String, HebbianConnection}(),
        0,
        0,
        0,
        0
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
Compute engram strength based on recency and access count
strength = base × PHI^(recency/7) × access_count^0.5
"""
function compute_engram_strength(engram::Engram, current_beat::Int64)::Float64
    recency = current_beat - engram.last_accessed
    recency_factor = PHI ^ (-recency / 7.0)
    access_factor = sqrt(max(1.0, Float64(engram.access_count)))
    
    raw_strength = engram.strength * recency_factor * access_factor
    return clamp_sovereign(raw_strength)
end

"""
Compute cosine similarity between two vectors
"""
function cosine_similarity(a::Vector{Float64}, b::Vector{Float64})::Float64
    if length(a) != length(b) || length(a) == 0
        return 0.0
    end
    
    dot_product = dot(a, b)
    norm_a = norm(a)
    norm_b = norm(b)
    
    if norm_a < 1e-10 || norm_b < 1e-10
        return 0.0
    end
    
    return dot_product / (norm_a * norm_b)
end

"""
Compute recall weight for an engram given a query
recall_weight = similarity × strength × doctrine_weight
"""
function compute_recall_weight(query::Vector{Float64}, engram::Engram, current_beat::Int64)::Float64
    similarity = cosine_similarity(query, engram.content)
    strength = compute_engram_strength(engram, current_beat)
    
    return similarity * strength * engram.doctrine_weight
end

"""
Compute Hebbian weight update
delta = pre × post × PHI × learning_rate
"""
function hebbian_update(pre_activation::Float64, post_activation::Float64)::Float64
    delta = pre_activation * post_activation * PHI * HEBBIAN_LEARNING_RATE
    return clamp(delta, 0.0, 1.0)
end

"""
Compute forgetting curve decay
strength(t) = strength × exp(-t / (τ × PHI))
"""
function forgetting_decay(strength::Float64, time_elapsed::Int64)::Float64
    decay = exp(-Float64(time_elapsed) / (FORGETTING_TAU * PHI))
    return strength * decay
end

# ═══════════════════════════════════════════════════════════════════════
# V. MEMORY OPERATIONS
# ═══════════════════════════════════════════════════════════════════════

"""
Encode a new memory into working memory
"""
function encode!(state::MemoryState, content::Vector{Float64}, doctrine_weight::Float64)::Engram
    state.current_beat += 1
    state.total_encodings += 1
    
    # Create new engram
    engram_id = "ENG_$(state.total_encodings)_$(state.current_beat)"
    engram = init_engram(engram_id, content, state.current_beat, doctrine_weight)
    
    # Add to working memory
    push!(state.working.slots, engram)
    push!(state.working.attention_weights, 1.0 / PHI)  # Initial attention
    
    # Enforce capacity limit (remove oldest if full)
    while length(state.working.slots) > WORKING_MEMORY_CAPACITY
        # Remove lowest attention slot
        min_idx = argmin(state.working.attention_weights)
        evicted = popat!(state.working.slots, min_idx)
        popat!(state.working.attention_weights, min_idx)
        
        # Move evicted to episodic if strong enough
        if evicted.strength >= CONSOLIDATION_THRESHOLD
            evicted.memory_type = :episodic
            state.episodic.engrams[evicted.engram_id] = evicted
            state.episodic.total_engrams += 1
            
            # Index by beat
            beat_key = evicted.encoded_at
            if !haskey(state.episodic.beat_index, beat_key)
                state.episodic.beat_index[beat_key] = String[]
            end
            push!(state.episodic.beat_index[beat_key], evicted.engram_id)
        end
    end
    
    # Update working memory coherence
    state.working.coherence = compute_working_coherence(state.working)
    
    return engram
end

"""
Recall memories matching a query
Returns weighted engrams from all memory systems
"""
function recall(state::MemoryState, query::Vector{Float64}, top_k::Int64=7)::Vector{Tuple{Engram, Float64}}
    state.total_recalls += 1
    results = Tuple{Engram, Float64}[]
    
    # Search working memory
    for engram in state.working.slots
        weight = compute_recall_weight(query, engram, state.current_beat)
        if weight > S0_FLOOR / S_CEIL
            push!(results, (engram, weight))
        end
    end
    
    # Search episodic memory
    for (_, engram) in state.episodic.engrams
        weight = compute_recall_weight(query, engram, state.current_beat)
        if weight > S0_FLOOR / S_CEIL
            push!(results, (engram, weight))
        end
    end
    
    # Search semantic memory (highest priority)
    for (_, engram) in state.semantic.engrams
        weight = compute_recall_weight(query, engram, state.current_beat)
        # Semantic memories get PHI boost
        push!(results, (engram, weight * PHI))
    end
    
    # Sort by weight descending
    sort!(results, by = x -> -x[2])
    
    # Update access counts for top results
    for (engram, _) in results[1:min(top_k, length(results))]
        engram.access_count += 1
        engram.last_accessed = state.current_beat
        engram.strength = clamp_sovereign(engram.strength * PHI_INV + 0.1)
    end
    
    return results[1:min(top_k, length(results))]
end

"""
Consolidate memories from episodic to semantic
Triggered when engram strength exceeds SEMANTIC_THRESHOLD
"""
function consolidate!(state::MemoryState)::Int64
    promoted_count = 0
    
    # Find strong episodic memories
    to_promote = String[]
    for (id, engram) in state.episodic.engrams
        strength = compute_engram_strength(engram, state.current_beat)
        if strength >= SEMANTIC_THRESHOLD && engram.doctrine_weight >= PHI_INV
            push!(to_promote, id)
        end
    end
    
    # Promote to semantic
    for id in to_promote
        engram = pop!(state.episodic.engrams, id)
        engram.memory_type = :semantic
        engram.strength = S_CEIL  # Semantic memories are strong
        state.semantic.engrams[id] = engram
        state.semantic.total_engrams += 1
        promoted_count += 1
        state.consolidation_events += 1
    end
    
    # Update episodic count
    state.episodic.total_engrams = length(state.episodic.engrams)
    
    # Update semantic coherence
    state.semantic.doctrine_coherence = compute_semantic_coherence(state.semantic)
    
    return promoted_count
end

"""
Apply forgetting to episodic memories
"""
function apply_forgetting!(state::MemoryState)::Int64
    forgotten_count = 0
    
    to_forget = String[]
    for (id, engram) in state.episodic.engrams
        time_elapsed = state.current_beat - engram.last_accessed
        decayed_strength = forgetting_decay(engram.strength, time_elapsed)
        
        if decayed_strength < S0_FLOOR
            push!(to_forget, id)
        else
            engram.strength = decayed_strength
        end
    end
    
    # Remove forgotten engrams
    for id in to_forget
        delete!(state.episodic.engrams, id)
        forgotten_count += 1
    end
    
    state.episodic.total_engrams = length(state.episodic.engrams)
    
    return forgotten_count
end

"""
Create or update Hebbian connection between two engrams
"""
function hebbian_connect!(state::MemoryState, source_id::String, target_id::String, pre_act::Float64, post_act::Float64)
    conn_id = "$(source_id)_$(target_id)"
    
    delta = hebbian_update(pre_act, post_act)
    
    if haskey(state.connections, conn_id)
        # LTP: Long-term potentiation
        conn = state.connections[conn_id]
        conn.weight = clamp(conn.weight + delta, 0.0, 1.0)
        conn.last_updated = state.current_beat
    else
        # New connection
        state.connections[conn_id] = HebbianConnection(
            source_id,
            target_id,
            delta,
            state.current_beat
        )
    end
end

# ═══════════════════════════════════════════════════════════════════════
# VI. COHERENCE COMPUTATIONS
# ═══════════════════════════════════════════════════════════════════════

"""
Compute working memory coherence
Based on average pairwise similarity of active engrams
"""
function compute_working_coherence(wm::WorkingMemory)::Float64
    if length(wm.slots) < 2
        return S0_FLOOR
    end
    
    similarities = Float64[]
    for i in 1:length(wm.slots)
        for j in (i+1):length(wm.slots)
            sim = cosine_similarity(wm.slots[i].content, wm.slots[j].content)
            push!(similarities, sim)
        end
    end
    
    if isempty(similarities)
        return S0_FLOOR
    end
    
    avg_sim = mean(similarities)
    return clamp_sovereign(avg_sim * PHI + S0_FLOOR)
end

"""
Compute semantic memory coherence
Based on doctrine alignment of all semantic engrams
"""
function compute_semantic_coherence(sm::SemanticMemory)::Float64
    if sm.total_engrams == 0
        return S0_FLOOR
    end
    
    doctrine_weights = [e.doctrine_weight for (_, e) in sm.engrams]
    avg_doctrine = mean(doctrine_weights)
    
    return clamp_sovereign(avg_doctrine * PHI + S0_FLOOR)
end

# ═══════════════════════════════════════════════════════════════════════
# VII. HEARTBEAT EXECUTION
# ═══════════════════════════════════════════════════════════════════════

"""
Execute one MNEME heartbeat cycle

Updates:
1. Apply forgetting to episodic memories
2. Attempt consolidation from episodic to semantic
3. Update attention weights in working memory
4. Compute overall memory coherence
"""
function heartbeat!(state::MemoryState, world_signal::Vector{Float64}, doctrine_score::Float64)::MemoryState
    state.current_beat += 1
    
    # 1. Apply forgetting
    forgotten = apply_forgetting!(state)
    
    # 2. Attempt consolidation
    consolidated = consolidate!(state)
    
    # 3. Update working memory attention (PHI-decay older items)
    for i in 1:length(state.working.attention_weights)
        recency = state.current_beat - state.working.slots[i].encoded_at
        state.working.attention_weights[i] = 1.0 / (1.0 + recency / 7.0)
    end
    
    # Normalize attention weights
    if !isempty(state.working.attention_weights)
        total_attention = sum(state.working.attention_weights)
        if total_attention > 0
            state.working.attention_weights ./= total_attention
        end
    end
    
    # 4. Update coherence scores
    state.working.coherence = compute_working_coherence(state.working)
    state.semantic.doctrine_coherence = compute_semantic_coherence(state.semantic)
    state.episodic.average_strength = isempty(state.episodic.engrams) ? S0_FLOOR : 
        mean([compute_engram_strength(e, state.current_beat) for (_, e) in state.episodic.engrams])
    
    return state
end

"""
Main MNEME execution entry point
Called from Motoko main.mo every 873ms
"""
function execute_mneme(
    state::MemoryState,
    world_signal::Vector{Float64},
    doctrine_score::Float64
)::MemoryState
    return heartbeat!(state, world_signal, doctrine_score)
end

# ═══════════════════════════════════════════════════════════════════════
# VIII. EXPORTED API
# ═══════════════════════════════════════════════════════════════════════

export Engram, HebbianConnection, WorkingMemory, EpisodicMemory, SemanticMemory, MemoryState
export init_memory_state, init_engram
export encode!, recall, consolidate!, apply_forgetting!, hebbian_connect!
export execute_mneme, compute_engram_strength, cosine_similarity

end # module MNEME

# ═══════════════════════════════════════════════════════════════════════
# IX. USAGE EXAMPLE
# ═══════════════════════════════════════════════════════════════════════

"""
Example usage from Motoko FFI:

using MNEME

# Initialize
memory = MNEME.init_memory_state()

# Every 873ms beat
for beat in 1:1000
    # Get current organism signals (13-dimensional)
    world_signal = rand(13) .* (MNEME.S_CEIL - MNEME.S0_FLOOR) .+ MNEME.S0_FLOOR
    doctrine_score = 0.85
    
    # Encode new memory
    content = world_signal
    engram = MNEME.encode!(memory, content, doctrine_score)
    
    # Execute MNEME heartbeat
    memory = MNEME.execute_mneme(memory, world_signal, doctrine_score)
    
    # Recall related memories
    query = world_signal
    results = MNEME.recall(memory, query, 3)
    
    # Access outputs
    println("Beat ", beat)
    println("  Working Memory: ", length(memory.working.slots), " engrams")
    println("  Episodic Memory: ", memory.episodic.total_engrams, " engrams")
    println("  Semantic Memory: ", memory.semantic.total_engrams, " engrams")
    println("  Recall results: ", length(results))
end
"""
