/**
 * ════════════════════════════════════════════════════════════════
 * AUDIO_SOVEREIGN — Alpha-Class Sovereign Models
 * Family: AUDIO_SOVEREIGN
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * LAD Principle: Sound is not audio — it is PRESSURE FIELD MODULATION.
 *                Web Audio is a sovereign signal intelligence graph.
 * ════════════════════════════════════════════════════════════════
 */

import type { SovereignAlphaModel } from "../rendering/RenderingSovereignMatrix";

// ─── ALPHA 11 — AUDIO_CONTEXT_SOVEREIGN ──────────────────────────────────────

export const AUDIO_CONTEXT_SOVEREIGN: SovereignAlphaModel = {
  id: "AU-01",
  family: "AUDIO_SOVEREIGN",
  latinName: "Contextus Sonicus Supremus",
  displayName: "AUDIO CONTEXT SOVEREIGN",
  lad: "The sovereign sound field substrate — a directed acyclic graph of signal intelligence processors, each transforming the pressure field through mathematical operations before it reaches the physical speaker membrane.",
  description:
    "AudioContext dissolved: not 'an audio API' but a sovereign signal intelligence routing system. Every AudioNode is an intelligence transformer. The AudioGraph is a live signal field topology. The destination is not a speaker — it is the pressure field terminus.",
  grade: "Substrate",
  engines: [
    {
      name: "SIGNAL_GRAPH_SOVEREIGN",
      latinName: "Graphus Signalis",
      description:
        "The directed graph topology that routes audio intelligence between processing nodes.",
      subModels: [
        {
          name: "NODE_FIELD_CONNECTOR",
          description: "Connects nodes as field processors in series/parallel.",
        },
        {
          name: "ROUTING_TOPOLOGY_MODEL",
          description: "Manages signal routing as a live field topology.",
        },
      ],
    },
    {
      name: "SAMPLE_RATE_FIELD",
      latinName: "Campus Frequentiae",
      description:
        "The temporal sampling field — how many intelligence samples per second.",
      subModels: [
        {
          name: "NYQUIST_FIELD_LIMIT",
          description: "Enforces Nyquist limit as field sampling law.",
        },
        {
          name: "LATENCY_FIELD_OPTIMIZER",
          description:
            "Minimizes signal field latency for real-time intelligence.",
        },
      ],
    },
    {
      name: "CHANNEL_FIELD_MATRIX",
      latinName: "Matrix Canalis",
      description:
        "Multi-channel audio as spatial field distribution (stereo, 5.1, ambisonic).",
      subModels: [
        {
          name: "SPATIAL_FIELD_SPREADER",
          description: "Distributes signal across spatial field coordinates.",
        },
        {
          name: "CHANNEL_MERGE_FIELD",
          description: "Merges multi-channel field signals.",
        },
      ],
    },
  ],
  backendConnection:
    "PRODUCTION_SOVEREIGN — film audio pipeline, organism voice synthesis output",
  heartbeatSync: true,
  color: "oklch(0.68 0.20 340)",
};

// ─── ALPHA 12 — ANALYSER_SOVEREIGN ───────────────────────────────────────────

export const ANALYSER_FFT_SOVEREIGN: SovereignAlphaModel = {
  id: "AU-02",
  family: "AUDIO_SOVEREIGN",
  latinName: "Analytica Frequentiae",
  displayName: "ANALYSER FFT SOVEREIGN",
  lad: "The frequency decomposition field — Fast Fourier Transform as a sovereign intelligence operation that reveals the hidden spectral structure beneath any complex waveform.",
  description:
    "AnalyserNode + FFT dissolved: not 'a frequency visualizer' but sovereign spectral intelligence. FFT is the mathematical dissolution of time-domain signals into their constituent field frequencies. The spectrum IS the field's frequency fingerprint.",
  grade: "Engine",
  engines: [
    {
      name: "FFT_FIELD_TRANSFORMER",
      latinName: "Transformatio Fourier",
      description:
        "Converts time-domain signal field to frequency-domain intelligence map.",
      subModels: [
        {
          name: "FREQUENCY_BIN_FIELD",
          description:
            "Each FFT bin is a sovereign frequency field coordinate.",
        },
        {
          name: "PHASE_FIELD_RESOLVER",
          description: "Resolves phase information from complex FFT output.",
        },
      ],
    },
    {
      name: "WAVEFORM_FIELD_READER",
      latinName: "Forma Undae",
      description:
        "Time-domain waveform as a continuous field pressure sample array.",
      subModels: [
        {
          name: "AMPLITUDE_FIELD_MONITOR",
          description: "Monitors instantaneous amplitude field values.",
        },
        {
          name: "ENVELOPE_FIELD_DETECTOR",
          description: "Detects attack/decay/sustain/release field envelope.",
        },
      ],
    },
    {
      name: "SCHUMANN_RESONANCE_ANALYZER",
      latinName: "Resonantia Schumanni",
      description:
        "Detects 7.83Hz Schumann resonance frequency presence in any audio field.",
      subModels: [
        {
          name: "EARTH_FREQUENCY_FILTER",
          description: "Narrow-band filter tuned to 7.83Hz field.",
        },
        {
          name: "COHERENCE_SPECTRUM_MODEL",
          description: "Maps spectral coherence to organism heartbeat phase.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — organism voice frequency analysis, Schumann field monitoring",
  heartbeatSync: true,
  color: "oklch(0.65 0.20 355)",
};

// ─── ALPHA 13 — AUDIO_WORKLET_SOVEREIGN ──────────────────────────────────────

export const AUDIO_WORKLET_SOVEREIGN: SovereignAlphaModel = {
  id: "AU-03",
  family: "AUDIO_SOVEREIGN",
  latinName: "Opus Sonicum",
  displayName: "AUDIO WORKLET SOVEREIGN",
  lad: "Custom signal intelligence processor running directly in the audio render thread — sovereign field computation at the lowest possible audio latency, immune to main thread interference.",
  description:
    "AudioWorklet dissolved: not 'custom audio processing' but sovereign sub-audio-thread intelligence. The audio render thread is the organism's most time-sensitive field. AudioWorkletProcessor runs with guaranteed 128-sample precision at the field's temporal floor.",
  grade: "Substrate",
  engines: [
    {
      name: "PROCESS_FIELD_SOVEREIGN",
      latinName: "Processus Campi",
      description:
        "The process() method as sovereign field computation — called every 128 samples.",
      subModels: [
        {
          name: "SAMPLE_BLOCK_PROCESSOR",
          description:
            "Processes 128-sample blocks as field intelligence units.",
        },
        {
          name: "PARAMETER_AUTOMATION_FIELD",
          description: "Per-sample parameter automation as field modulation.",
        },
      ],
    },
    {
      name: "CUSTOM_SYNTHESIS_ENGINE",
      latinName: "Synthesis Propria",
      description:
        "Custom oscillator/synthesis algorithms as sovereign field generation models.",
      subModels: [
        {
          name: "PHI_OSCILLATOR_MODEL",
          description: "PHI-ratio harmonic series oscillator.",
        },
        {
          name: "SCHUMANN_GENERATOR_FIELD",
          description: "Generates 7.83Hz resonance carrier signal.",
        },
      ],
    },
    {
      name: "AUDIO_INTELLIGENCE_BRIDGE",
      latinName: "Pons Intelligentiae Sonicae",
      description:
        "MessagePort bridge between audio thread and main intelligence thread.",
      subModels: [
        {
          name: "RING_BUFFER_FIELD",
          description: "Lock-free ring buffer for audio↔intelligence data.",
        },
        {
          name: "ATOMIC_FIELD_EXCHANGE",
          description:
            "SharedArrayBuffer atomic operations for zero-latency sync.",
        },
      ],
    },
  ],
  backendConnection:
    "PRODUCTION_SOVEREIGN — real-time audio synthesis for organism voice and film scoring",
  heartbeatSync: true,
  color: "oklch(0.70 0.22 320)",
};

// ─── ALPHA 14 — CONVOLVER_REVERB_SOVEREIGN ───────────────────────────────────

export const CONVOLVER_REVERB_SOVEREIGN: SovereignAlphaModel = {
  id: "AU-04",
  family: "AUDIO_SOVEREIGN",
  latinName: "Convolutio Spatii",
  displayName: "CONVOLVER REVERB SOVEREIGN",
  lad: "Acoustic field encoding — convolution as the mathematical operation that imprints the acoustic fingerprint of any physical or virtual space onto any signal.",
  description:
    "ConvolverNode dissolved: not 'a reverb effect' but sovereign space encoding. Impulse response is the acoustic field signature of a space. Convolution is the mathematical operation of imprinting that space's field onto any signal. The organism can inhabit any acoustic space.",
  grade: "Engine",
  engines: [
    {
      name: "IMPULSE_FIELD_ENCODER",
      latinName: "Campus Impulsus",
      description:
        "Encodes acoustic space field signatures as impulse response buffers.",
      subModels: [
        {
          name: "SPACE_FINGERPRINT_MODEL",
          description: "Captures the acoustic field fingerprint of any space.",
        },
        {
          name: "ROOM_GEOMETRY_ENCODER",
          description: "Encodes physical room geometry as acoustic field data.",
        },
      ],
    },
    {
      name: "CONVOLUTION_INTELLIGENCE",
      latinName: "Intelligentia Convolutionis",
      description:
        "The mathematical field operation that applies space signatures to signals.",
      subModels: [
        {
          name: "OVERLAP_ADD_FIELD",
          description: "Efficient overlap-add convolution field computation.",
        },
        {
          name: "FREQUENCY_DOMAIN_CONV",
          description: "FFT-domain convolution for long impulse responses.",
        },
      ],
    },
    {
      name: "ACOUSTIC_WORLD_FIELD",
      latinName: "Campus Mundi Sonici",
      description:
        "Creates the acoustic field of the organism's virtual world.",
      subModels: [
        {
          name: "DYNAMIC_SPACE_MODEL",
          description: "Changes acoustic field based on world location.",
        },
        {
          name: "DISTANCE_FIELD_ATTENUATOR",
          description: "PHI-ratio distance attenuation model.",
        },
      ],
    },
  ],
  backendConnection:
    "WORLD_SOVEREIGN — film acoustic space creation, organism world audio field",
  heartbeatSync: false,
  color: "oklch(0.62 0.18 310)",
};

export const AUDIO_SOVEREIGN_FAMILY: SovereignAlphaModel[] = [
  AUDIO_CONTEXT_SOVEREIGN,
  ANALYSER_FFT_SOVEREIGN,
  AUDIO_WORKLET_SOVEREIGN,
  CONVOLVER_REVERB_SOVEREIGN,
];
