# ═══════════════════════════════════════════════════════════════════════════════
# SOVEREIGN MESH — PHI-Harmonic Neural Network Architecture
# Multi-layer mesh with Hebbian learning and geometric intelligence
# Attribution: Alfredo Medina Hernandez — immutable
# Language: Julia (scientific computing for neural mesh mathematics)
# ═══════════════════════════════════════════════════════════════════════════════

"""
SOVEREIGN MESH implements the neural substrate:

I. MESH TOPOLOGY
   - 3D lattice with PHI-spacing
   - Adaptive connectivity based on coherence
   - Multi-scale hierarchical structure

II. HEBBIAN LEARNING
   - "Cells that fire together wire together"
   - Long-term potentiation (LTP) for strengthening
   - Long-term depression (LTD) for weakening
   - Synaptic tagging for consolidation

III. INFORMATION FLOW
   - Feedforward activation
   - Lateral inhibition for sharpening
   - Recurrent dynamics for memory

IV. GEOMETRIC INTELLIGENCE
   - Attention as geometric focus
   - Concepts as attractors in state space
   - Reasoning as geodesic paths

Mathematical Model:
   Δw_ij = η × (x_i × x_j - θ × w_ij)  [Oja's rule]
   activation_i = σ(Σ_j w_ij × x_j + b_i)
   coherence = cosine_similarity(activation_pattern, target_pattern)
"""

module SovereignMesh

include("DeepMath.jl")
using .DeepMath
using LinearAlgebra
using Statistics

# ═══════════════════════════════════════════════════════════════════════════════
# I. CONSTANTS
# ═══════════════════════════════════════════════════════════════════════════════

const PHI = DeepMath.PHI
const PHI_INV = DeepMath.PHI_INV
const FIBONACCI = DeepMath.FIBONACCI
const SOLFEGGIO = DeepMath.SOLFEGGIO
const PI = DeepMath.PI
const S0_FLOOR = 0.75
const S_CEIL = 9.75

# Neural constants
const LEARNING_RATE = 0.01 * PHI_INV
const LTP_THRESHOLD = PHI_INV
const LTD_THRESHOLD = 0.3
const DECAY_RATE = 0.001
const REFRACTORY_PERIOD = 3  # beats

# Attribution
const ATTRIBUTION = "Alfredo Medina Hernandez"

# ═══════════════════════════════════════════════════════════════════════════════
# II. NEURON AND SYNAPSE STRUCTURES
# ═══════════════════════════════════════════════════════════════════════════════

"""
MeshNeuron - A single neuron in the mesh
"""
mutable struct MeshNeuron
    id::Int
    position::Vector{Float64}  # 3D position in mesh
    layer::Int
    
    # State
    activation::Float64
    membrane_potential::Float64
    threshold::Float64
    bias::Float64
    
    # Timing
    last_fire_beat::Int
    fire_count::Int
    
    # Properties
    neuron_type::String  # "excitatory", "inhibitory"
    is_active::Bool
end

"""
Synapse - Connection between neurons with Hebbian plasticity
"""
mutable struct Synapse
    id::String
    pre_neuron_id::Int
    post_neuron_id::Int
    
    # Weight and plasticity
    weight::Float64
    eligibility_trace::Float64  # For synaptic tagging
    
    # Plasticity state
    ltp_strength::Float64
    ltd_strength::Float64
    consolidation::Float64  # How permanent the connection is
    
    # Properties
    is_active::Bool
    created_beat::Int
    last_update_beat::Int
end

"""
MeshLayer - A layer in the hierarchical mesh
"""
mutable struct MeshLayer
    id::Int
    neurons::Vector{MeshNeuron}
    layer_type::String  # "input", "hidden", "output", "recurrent"
    dimensions::Tuple{Int, Int, Int}  # 3D structure
    activation_pattern::Vector{Float64}
    coherence::Float64
    beat_count::Int
end

# ═══════════════════════════════════════════════════════════════════════════════
# III. MESH NETWORK
# ═══════════════════════════════════════════════════════════════════════════════

"""
SovereignMeshNetwork - The complete neural mesh
"""
mutable struct SovereignMeshNetwork
    layers::Vector{MeshLayer}
    synapses::Dict{String, Synapse}
    
    # Connectivity
    forward_connections::Dict{Int, Vector{Int}}  # neuron_id -> post_neuron_ids
    backward_connections::Dict{Int, Vector{Int}}  # neuron_id -> pre_neuron_ids
    
    # Global state
    global_activation::Float64
    global_coherence::Float64
    phi_resonance::Float64
    
    # Learning
    learning_rate::Float64
    global_ltp::Float64
    global_ltd::Float64
    
    # Metrics
    total_neurons::Int
    total_synapses::Int
    active_neurons::Int
    fire_count::Int
    
    # Timing
    beat_count::Int
    last_learning_beat::Int
end

"""
Create a neuron at a mesh position
"""
function create_neuron(id::Int, layer::Int, pos::Vector{Float64}; neuron_type::String="excitatory")::MeshNeuron
    # PHI-modulated threshold
    threshold = PHI_INV + 0.1 * sin(sum(pos) * PHI)
    
    MeshNeuron(
        id, pos, layer,
        0.0, 0.0, threshold, 0.0,
        -REFRACTORY_PERIOD, 0,
        neuron_type, true
    )
end

"""
Create a synapse between neurons
"""
function create_synapse(pre_id::Int, post_id::Int; beat::Int=0)::Synapse
    # Initialize weight with small random value
    initial_weight = 0.1 + 0.05 * rand()
    
    Synapse(
        "SYN_$(pre_id)_$(post_id)",
        pre_id, post_id,
        initial_weight, 0.0,
        0.5, 0.5, 0.0,
        true, beat, beat
    )
end

"""
Create a mesh layer
"""
function create_layer(id::Int, dims::Tuple{Int, Int, Int}, layer_type::String; beat::Int=0)::MeshLayer
    neurons = MeshNeuron[]
    neuron_id = id * 10000  # Offset for unique IDs
    
    nx, ny, nz = dims
    for i in 1:nx, j in 1:ny, k in 1:nz
        # PHI-spaced positions
        pos = [
            (i - 1) * PHI / nx,
            (j - 1) * PHI / ny,
            (k - 1) * PHI / nz
        ]
        
        # Alternate excitatory/inhibitory (80/20 ratio)
        ntype = rand() < 0.8 ? "excitatory" : "inhibitory"
        
        neuron = create_neuron(neuron_id, id, pos; neuron_type=ntype)
        push!(neurons, neuron)
        neuron_id += 1
    end
    
    MeshLayer(id, neurons, layer_type, dims, zeros(Float64, length(neurons)), 0.5, beat)
end

"""
Initialize sovereign mesh network
"""
function init_mesh(layer_dims::Vector{Tuple{Int, Int, Int}}; beat::Int=0)::SovereignMeshNetwork
    layers = MeshLayer[]
    layer_types = ["input", "hidden", "hidden", "output"]
    
    # Ensure we have types for all layers
    while length(layer_types) < length(layer_dims)
        push!(layer_types, "hidden")
    end
    
    # Create layers
    for (i, dims) in enumerate(layer_dims)
        ltype = i <= length(layer_types) ? layer_types[i] : "hidden"
        layer = create_layer(i, dims, ltype; beat=beat)
        push!(layers, layer)
    end
    
    # Initialize connectivity structures
    forward_connections = Dict{Int, Vector{Int}}()
    backward_connections = Dict{Int, Vector{Int}}()
    synapses = Dict{String, Synapse}()
    
    for layer in layers
        for neuron in layer.neurons
            forward_connections[neuron.id] = Int[]
            backward_connections[neuron.id] = Int[]
        end
    end
    
    network = SovereignMeshNetwork(
        layers, synapses,
        forward_connections, backward_connections,
        0.0, 0.5, PHI_INV,
        LEARNING_RATE, 0.5, 0.5,
        sum(length(l.neurons) for l in layers), 0, 0, 0,
        beat, beat
    )
    
    # Create initial connections between adjacent layers
    connect_layers!(network)
    
    network
end

"""
Connect adjacent layers with initial synapses
"""
function connect_layers!(network::SovereignMeshNetwork)
    for i in 1:length(network.layers)-1
        pre_layer = network.layers[i]
        post_layer = network.layers[i + 1]
        
        for pre in pre_layer.neurons
            # Connect to subset of post-layer neurons (sparse connectivity)
            # Use PHI-based probability
            for post in post_layer.neurons
                # Distance-based connection probability
                dist = norm(pre.position - post.position)
                prob = PHI_INV * exp(-dist / PHI)
                
                if rand() < prob
                    synapse = create_synapse(pre.id, post.id; beat=network.beat_count)
                    network.synapses[synapse.id] = synapse
                    
                    push!(network.forward_connections[pre.id], post.id)
                    push!(network.backward_connections[post.id], pre.id)
                end
            end
        end
    end
    
    network.total_synapses = length(network.synapses)
end

# ═══════════════════════════════════════════════════════════════════════════════
# IV. ACTIVATION AND PROPAGATION
# ═══════════════════════════════════════════════════════════════════════════════

"""
Sigmoid activation with PHI-scaling
"""
function phi_sigmoid(x::Float64)::Float64
    1.0 / (1.0 + exp(-PHI * x))
end

"""
Compute neuron activation from inputs
"""
function compute_activation!(neuron::MeshNeuron, input_sum::Float64, current_beat::Int)
    # Update membrane potential
    neuron.membrane_potential = 0.9 * neuron.membrane_potential + 0.1 * input_sum + neuron.bias
    
    # Check if in refractory period
    if current_beat - neuron.last_fire_beat < REFRACTORY_PERIOD
        neuron.activation = 0.0
        return
    end
    
    # Fire if above threshold
    if neuron.membrane_potential > neuron.threshold
        neuron.activation = 1.0
        neuron.last_fire_beat = current_beat
        neuron.fire_count += 1
        
        # Reset membrane potential
        neuron.membrane_potential = 0.0
    else
        # Sub-threshold response
        neuron.activation = phi_sigmoid(neuron.membrane_potential - neuron.threshold)
    end
end

"""
Propagate activation through a layer
"""
function propagate_layer!(network::SovereignMeshNetwork, layer::MeshLayer)
    for (i, neuron) in enumerate(layer.neurons)
        if !neuron.is_active
            layer.activation_pattern[i] = 0.0
            continue
        end
        
        # Sum inputs from pre-synaptic neurons
        input_sum = 0.0
        pre_ids = get(network.backward_connections, neuron.id, Int[])
        
        for pre_id in pre_ids
            synapse_id = "SYN_$(pre_id)_$(neuron.id)"
            if haskey(network.synapses, synapse_id)
                synapse = network.synapses[synapse_id]
                if synapse.is_active
                    # Find pre-neuron
                    for pre_layer in network.layers
                        for pre_neuron in pre_layer.neurons
                            if pre_neuron.id == pre_id
                                # Excitatory vs inhibitory
                                sign = pre_neuron.neuron_type == "excitatory" ? 1.0 : -1.0
                                input_sum += sign * synapse.weight * pre_neuron.activation
                                break
                            end
                        end
                    end
                end
            end
        end
        
        compute_activation!(neuron, input_sum, network.beat_count)
        layer.activation_pattern[i] = neuron.activation
    end
    
    # Compute layer coherence
    if length(layer.activation_pattern) > 0 && maximum(layer.activation_pattern) > 0
        # Coherence as normalized activation variance
        mean_act = mean(layer.activation_pattern)
        var_act = var(layer.activation_pattern)
        layer.coherence = 1 - clamp(sqrt(var_act) / max(mean_act, 0.1), 0, 1)
    else
        layer.coherence = 0.5
    end
end

"""
Full forward propagation through network
"""
function forward_propagate!(network::SovereignMeshNetwork, input::Vector{Float64})
    # Set input layer activations
    input_layer = network.layers[1]
    n_input = min(length(input), length(input_layer.neurons))
    
    for i in 1:n_input
        input_layer.neurons[i].activation = input[i]
        input_layer.activation_pattern[i] = input[i]
    end
    
    # Propagate through remaining layers
    for i in 2:length(network.layers)
        propagate_layer!(network, network.layers[i])
    end
    
    # Return output layer activation
    network.layers[end].activation_pattern
end

# ═══════════════════════════════════════════════════════════════════════════════
# V. HEBBIAN LEARNING
# ═══════════════════════════════════════════════════════════════════════════════

"""
Update eligibility trace for a synapse
"""
function update_eligibility!(synapse::Synapse, pre_act::Float64, post_act::Float64)
    # STDP-like trace: depends on temporal correlation
    correlation = pre_act * post_act
    
    # Decay existing trace
    synapse.eligibility_trace *= (1 - DECAY_RATE)
    
    # Add new correlation
    synapse.eligibility_trace += correlation * PHI_INV
    
    # Clamp
    synapse.eligibility_trace = clamp(synapse.eligibility_trace, 0, 1)
end

"""
Apply Hebbian learning to a synapse (Oja's rule)
Δw = η × (x_pre × x_post - θ × x_post² × w)
"""
function hebbian_update!(synapse::Synapse, pre_act::Float64, post_act::Float64, eta::Float64, beat::Int)
    # Update eligibility
    update_eligibility!(synapse, pre_act, post_act)
    
    # Oja's rule prevents unbounded weight growth
    oja_term = pre_act * post_act - post_act^2 * synapse.weight
    
    # LTP/LTD determination
    if pre_act > LTP_THRESHOLD && post_act > LTP_THRESHOLD
        # Long-term potentiation
        synapse.ltp_strength += 0.1 * PHI_INV
        synapse.ltp_strength = min(synapse.ltp_strength, 1.0)
        
        delta_w = eta * oja_term * synapse.ltp_strength
    elseif pre_act < LTD_THRESHOLD || post_act < LTD_THRESHOLD
        # Long-term depression
        synapse.ltd_strength += 0.05 * PHI_INV
        synapse.ltd_strength = min(synapse.ltd_strength, 1.0)
        
        delta_w = -eta * 0.5 * synapse.weight * synapse.ltd_strength
    else
        delta_w = eta * oja_term * 0.5
    end
    
    # Apply update with consolidation factor
    synapse.weight += delta_w * (1 - synapse.consolidation * 0.5)
    
    # Clamp weight
    synapse.weight = clamp(synapse.weight, -1.0, 1.0)
    
    # Update consolidation based on eligibility trace
    if synapse.eligibility_trace > PHI_INV
        synapse.consolidation += 0.01
        synapse.consolidation = min(synapse.consolidation, 1.0)
    end
    
    synapse.last_update_beat = beat
end

"""
Apply learning across all synapses
"""
function apply_learning!(network::SovereignMeshNetwork)
    network.global_ltp = 0.0
    network.global_ltd = 0.0
    update_count = 0
    
    for (synapse_id, synapse) in network.synapses
        if !synapse.is_active
            continue
        end
        
        # Find pre and post neurons
        pre_act = 0.0
        post_act = 0.0
        
        for layer in network.layers
            for neuron in layer.neurons
                if neuron.id == synapse.pre_neuron_id
                    pre_act = neuron.activation
                elseif neuron.id == synapse.post_neuron_id
                    post_act = neuron.activation
                end
            end
        end
        
        hebbian_update!(synapse, pre_act, post_act, network.learning_rate, network.beat_count)
        
        network.global_ltp += synapse.ltp_strength
        network.global_ltd += synapse.ltd_strength
        update_count += 1
    end
    
    if update_count > 0
        network.global_ltp /= update_count
        network.global_ltd /= update_count
    end
    
    network.last_learning_beat = network.beat_count
end

# ═══════════════════════════════════════════════════════════════════════════════
# VI. MESH DYNAMICS
# ═══════════════════════════════════════════════════════════════════════════════

"""
Apply lateral inhibition within a layer
"""
function lateral_inhibition!(layer::MeshLayer; inhibition_strength::Float64=0.1)
    max_act = maximum(layer.activation_pattern)
    
    if max_act <= 0
        return
    end
    
    # Winner-take-more dynamics
    for (i, neuron) in enumerate(layer.neurons)
        if neuron.activation < max_act
            # Inhibit based on distance from maximum
            inhibition = inhibition_strength * (max_act - neuron.activation)
            neuron.activation = max(0, neuron.activation - inhibition)
            layer.activation_pattern[i] = neuron.activation
        end
    end
end

"""
Compute global network metrics
"""
function compute_global_metrics!(network::SovereignMeshNetwork)
    # Global activation
    total_act = 0.0
    active_count = 0
    
    for layer in network.layers
        for neuron in layer.neurons
            total_act += neuron.activation
            if neuron.activation > PHI_INV
                active_count += 1
            end
        end
    end
    
    network.active_neurons = active_count
    network.global_activation = total_act / max(network.total_neurons, 1)
    
    # Global coherence (average layer coherence weighted by PHI)
    total_coherence = 0.0
    total_weight = 0.0
    
    for (i, layer) in enumerate(network.layers)
        weight = PHI^(i / length(network.layers))
        total_coherence += layer.coherence * weight
        total_weight += weight
    end
    
    network.global_coherence = total_coherence / max(total_weight, 1)
    
    # PHI resonance from coherence and activation
    network.phi_resonance = (
        network.global_coherence * PHI +
        network.global_activation * PHI_INV +
        (1 - network.global_ltd) * 0.5
    ) / (PHI + PHI_INV + 0.5)
    
    # Count total fires
    network.fire_count = sum(n.fire_count for l in network.layers for n in l.neurons)
end

"""
Advance mesh network by one beat
"""
function advance!(network::SovereignMeshNetwork, input::Vector{Float64}=Float64[])::SovereignMeshNetwork
    network.beat_count += 1
    
    # Generate random input if none provided
    if isempty(input)
        input_size = length(network.layers[1].neurons)
        input = rand(Float64, input_size) .* PHI_INV
    end
    
    # Forward propagation
    forward_propagate!(network, input)
    
    # Lateral inhibition in hidden layers
    for i in 2:length(network.layers)-1
        lateral_inhibition!(network.layers[i])
    end
    
    # Apply Hebbian learning
    apply_learning!(network)
    
    # Compute metrics
    compute_global_metrics!(network)
    
    network
end

"""
Get mesh network summary
"""
function get_summary(network::SovereignMeshNetwork)::Dict{String, Any}
    layer_summaries = []
    for layer in network.layers
        push!(layer_summaries, Dict(
            "id" => layer.id,
            "type" => layer.layer_type,
            "dimensions" => layer.dimensions,
            "neuron_count" => length(layer.neurons),
            "coherence" => layer.coherence,
            "mean_activation" => mean(layer.activation_pattern)
        ))
    end
    
    Dict(
        "name" => "SovereignMesh",
        "total_neurons" => network.total_neurons,
        "total_synapses" => network.total_synapses,
        "active_neurons" => network.active_neurons,
        "fire_count" => network.fire_count,
        "global_activation" => network.global_activation,
        "global_coherence" => network.global_coherence,
        "phi_resonance" => network.phi_resonance,
        "learning_rate" => network.learning_rate,
        "global_ltp" => network.global_ltp,
        "global_ltd" => network.global_ltd,
        "layer_count" => length(network.layers),
        "layers" => layer_summaries,
        "beat_count" => network.beat_count,
        "attribution" => ATTRIBUTION
    )
end

# Module exports
export MeshNeuron, Synapse, MeshLayer, SovereignMeshNetwork
export create_neuron, create_synapse, create_layer, init_mesh, connect_layers!
export phi_sigmoid, compute_activation!, propagate_layer!, forward_propagate!
export update_eligibility!, hebbian_update!, apply_learning!
export lateral_inhibition!, compute_global_metrics!, advance!, get_summary

end  # module SovereignMesh
