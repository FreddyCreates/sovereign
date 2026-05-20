# Substrate Julia Module
# Exports all substrate components for unified organism AI

module Substrate

# Include all substrate modules
include("DeepMath.jl")
include("UnifiedFieldBridge.jl")
include("SovereignMesh.jl")
include("QuantumGeometry.jl")
include("OrganismBus.jl")

# Re-export from DeepMath
using .DeepMath
export PHI, PHI_INV, PHI_SQ, EULER, PI, FIBONACCI, SOLFEGGIO
export SovereignTensor, sovereign_tensor, phi_contract, phi_decompose, phi_norm
export RiemannianManifold, phi_manifold, compute_christoffel!, compute_ricci!
export geodesic_acceleration, parallel_transport
export EigenField, phi_eigenfield, project_onto_eigenfield, reconstruct_from_eigenfield
export spectral_filter, operator_resolvent
export Simplex, SimplicialComplex, simplicial_complex, add_vertex!, add_simplex!
export boundary_matrix, compute_betti!
export DeepMathState, init_deep_math

# Re-export from UnifiedFieldBridge
using .UnifiedFieldBridge
export PhaseOscillator, KuramotoNetwork, kuramoto_network
export advance_kuramoto!, compute_order_parameter!, is_synchronized
export FieldState, field_state, laplacian, diffuse!, wave_propagate!, nonlinear_advance!
export BridgeMessage, MessageQueue, message_queue, create_message, enqueue!, dequeue!, verify_coherence
export ResonanceChannel, resonance_channel, ChannelMixer, channel_mixer, modulate!, mix!
export UnifiedBridgeState, init_bridge, send_message!, receive_message!

# Re-export from SovereignMesh
using .SovereignMesh
export MeshNeuron, Synapse, MeshLayer, SovereignMeshNetwork
export create_neuron, create_synapse, create_layer, init_mesh, connect_layers!
export phi_sigmoid, compute_activation!, propagate_layer!, forward_propagate!
export update_eligibility!, hebbian_update!, apply_learning!
export lateral_inhibition!, compute_global_metrics!

# Re-export from QuantumGeometry
using .QuantumGeometry
export Dimension8State, QuantumState, init_quantum_state, kuramoto_sync!, advance_dimensions!
export HebbianMemory, init_hebbian_memory, update_trace!
export SovereignHash, hash_round, dimension_hash, sovereign_hash
export ADREState, MiniBrain, MiniHeart, init_mini_brain, init_mini_heart, adre_pass!, process!, pulse!
export QuantumGeometryEngine, init_engine

# Re-export from OrganismBus
using .OrganismBus
export MessageType, HEARTBEAT, STATE_UPDATE, COHERENCE_CHECK, SYNC_REQUEST, SYNC_RESPONSE, DATA_TRANSFER, COMMAND, ALERT
export SubsystemState, wrap_subsystem, extract_coherence, extract_phi_resonance
export advance_subsystem!, get_subsystem_summary
export OrganismBusState, init_organism_bus, send!, broadcast!
export process_messages!, handle_message!, apply_message!
export compute_organism_coherence!, transfer!
export get_organism_summary, serialize_for_bridge

# Common advance function (uses OrganismBus.advance!)
const advance! = OrganismBus.advance!
const get_summary = OrganismBus.get_organism_summary

# Attribution constant
const ATTRIBUTION = "Alfredo Medina Hernandez"

end  # module Substrate
