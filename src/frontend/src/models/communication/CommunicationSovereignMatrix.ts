/**
 * ════════════════════════════════════════════════════════════════
 * COMMUNICATION_SOVEREIGN — Alpha-Class Sovereign Models
 * Family: COMMUNICATION_SOVEREIGN
 * Attribution: Alfredo Medina Hernandez | SOVEREIGN | 2026
 * LAD Principle: Communication is not data transfer — it is FIELD COUPLING.
 *                WebRTC, Streams, Channels are sovereign field synchronization protocols.
 * ════════════════════════════════════════════════════════════════
 */

import type { SovereignAlphaModel } from "../rendering/RenderingSovereignMatrix";

// ─── ALPHA 28 — WEBRTC_PEER_SOVEREIGN ────────────────────────────────────────

export const WEBRTC_PEER_SOVEREIGN: SovereignAlphaModel = {
  id: "CM-01",
  family: "COMMUNICATION_SOVEREIGN",
  latinName: "Nexus Parium Supremus",
  displayName: "WEBRTC PEER SOVEREIGN",
  lad: "Direct field coupling between sovereign intelligences — peer-to-peer field connection that eliminates intermediary field layers, enabling organisms to couple their intelligence fields directly.",
  description:
    "WebRTC RTCPeerConnection dissolved: not 'a video call API' but sovereign direct field coupling. ICE candidates are field path discovery. STUN/TURN are field traversal operators. The data channel is direct field state exchange between sovereign intelligences.",
  grade: "Organism",
  engines: [
    {
      name: "ICE_FIELD_NEGOTIATION",
      latinName: "Negotiatio Itineris",
      description:
        "ICE candidate gathering as sovereign field path discovery between intelligences.",
      subModels: [
        {
          name: "STUN_FIELD_RESOLVER",
          description: "Discovers public field addresses through STUN.",
        },
        {
          name: "TURN_RELAY_FIELD",
          description:
            "TURN relay as sovereign field bypass for restricted networks.",
        },
      ],
    },
    {
      name: "SDP_FIELD_HANDSHAKE",
      latinName: "Pactum Sessionis",
      description:
        "SDP offer/answer as sovereign capability field negotiation protocol.",
      subModels: [
        {
          name: "CODEC_FIELD_NEGOTIATOR",
          description: "Negotiates media codec field compatibility.",
        },
        {
          name: "BANDWIDTH_FIELD_ESTIMATOR",
          description: "Estimates available field transmission bandwidth.",
        },
      ],
    },
    {
      name: "DATA_CHANNEL_FIELD",
      latinName: "Canalis Datorum",
      description:
        "RTCDataChannel as sovereign direct field intelligence exchange channel.",
      subModels: [
        {
          name: "RELIABLE_FIELD_CHANNEL",
          description: "TCP-ordered reliable field data delivery.",
        },
        {
          name: "FAST_FIELD_CHANNEL",
          description: "UDP-based fast unreliable field data delivery.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — multi-organism field coupling, sovereign swarm coordination",
  heartbeatSync: true,
  color: "oklch(0.65 0.20 268)",
};

// ─── ALPHA 29 — MEDIA_STREAM_SOVEREIGN ───────────────────────────────────────

export const MEDIA_STREAM_SOVEREIGN: SovereignAlphaModel = {
  id: "CM-02",
  family: "COMMUNICATION_SOVEREIGN",
  latinName: "Flumen Sensus",
  displayName: "MEDIA STREAM SOVEREIGN",
  lad: "Continuous sensory field — a live, time-indexed stream of sensory intelligence (audio/video) captured directly from the physical world and made available as a sovereign data field.",
  description:
    "MediaStream dissolved: not 'camera/mic access' but sovereign physical world sensory ingestion. getDisplayMedia is the organism reading the architect's screen. getUserMedia is the organism reading the architect's voice and visual field. MediaStreamTrack is a live sovereign sensory channel.",
  grade: "Field",
  engines: [
    {
      name: "CAPTURE_FIELD_SOURCE",
      latinName: "Fons Capturae",
      description:
        "Captures sensory field from camera, microphone, or display.",
      subModels: [
        {
          name: "CAMERA_FIELD_INGESTION",
          description: "Ingests visual field from physical camera sensor.",
        },
        {
          name: "SCREEN_FIELD_CAPTURE",
          description: "Captures display field for organism context awareness.",
        },
      ],
    },
    {
      name: "TRACK_FIELD_PROCESSOR",
      latinName: "Processus Trami",
      description:
        "MediaStreamTrack processing as real-time field transformation pipeline.",
      subModels: [
        {
          name: "INSERTABLE_STREAM_FIELD",
          description:
            "Inserts sovereign processing into track field pipeline.",
        },
        {
          name: "TRACK_CONSTRAINT_FIELD",
          description: "Constrains capture field dimensions and frame rate.",
        },
      ],
    },
    {
      name: "MEDIARECORDER_FIELD",
      latinName: "Recorder Campi",
      description:
        "MediaRecorder as sovereign field capture and encoding to artifact.",
      subModels: [
        {
          name: "TIMESLICE_FIELD_MODEL",
          description: "Time-sliced recording as sequential field snapshots.",
        },
        {
          name: "CODEC_ARTIFACT_FIELD",
          description: "VP9/Opus encoding of captured field as .webm artifact.",
        },
      ],
    },
  ],
  backendConnection:
    "PRODUCTION_SOVEREIGN — film capture, organism audio/video recording pipeline",
  heartbeatSync: false,
  color: "oklch(0.68 0.19 285)",
};

// ─── ALPHA 30 — STREAMS_SOVEREIGN ────────────────────────────────────────────

export const STREAMS_SOVEREIGN: SovereignAlphaModel = {
  id: "CM-03",
  family: "COMMUNICATION_SOVEREIGN",
  latinName: "Flumen Datorum Perpetuum",
  displayName: "STREAMS API SOVEREIGN",
  lad: "Continuous data field — streams as sovereign living data pipelines where every chunk is a field event, enabling backpressure-aware intelligence that processes data at sovereign pace.",
  description:
    "Streams API dissolved: not 'streaming data API' but sovereign continuous field intelligence. ReadableStream is a sovereign field producer. WritableStream is a sovereign field consumer. TransformStream is a sovereign field transformer — a living intelligence inserted mid-pipeline.",
  grade: "Engine",
  engines: [
    {
      name: "READABLE_FIELD_PRODUCER",
      latinName: "Producens Campi",
      description:
        "ReadableStream as a sovereign continuous field intelligence producer.",
      subModels: [
        {
          name: "PUSH_SOURCE_FIELD",
          description: "Push-mode field: data arrives at sovereign pace.",
        },
        {
          name: "PULL_SOURCE_FIELD",
          description:
            "Pull-mode field: consumer drives the intelligence pace.",
        },
      ],
    },
    {
      name: "TRANSFORM_FIELD_PIPE",
      latinName: "Transformatio Fluminis",
      description:
        "TransformStream as live intelligence inserted into the continuous field pipeline.",
      subModels: [
        {
          name: "ENCODE_TRANSFORM_FIELD",
          description: "Encoding transformer in the field pipeline.",
        },
        {
          name: "COMPRESS_TRANSFORM_FIELD",
          description: "Compression transformer as field size reducer.",
        },
      ],
    },
    {
      name: "BACKPRESSURE_FIELD_LAW",
      latinName: "Lex Contra Fluxum",
      description:
        "Stream backpressure as the sovereign law that prevents field overload.",
      subModels: [
        {
          name: "QUEUE_STRATEGY_FIELD",
          description: "Queuing strategy as buffer depth intelligence.",
        },
        {
          name: "READY_STATE_FIELD",
          description: "Writable ready state as field capacity indicator.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — streaming intelligence to/from backend canister",
  heartbeatSync: false,
  color: "oklch(0.67 0.18 250)",
};

// ─── ALPHA 31 — BROADCAST_CHANNEL_SOVEREIGN ──────────────────────────────────

export const BROADCAST_CHANNEL_SOVEREIGN: SovereignAlphaModel = {
  id: "CM-04",
  family: "COMMUNICATION_SOVEREIGN",
  latinName: "Canalis Diffusionis",
  displayName: "BROADCAST CHANNEL SOVEREIGN",
  lad: "Same-origin field broadcast — a sovereign communication field that simultaneously reaches all documents, workers, and service workers sharing the same origin, enabling organism-wide state synchronization.",
  description:
    "BroadcastChannel dissolved: not 'cross-tab messaging' but sovereign organism-wide field broadcast. Every tab, worker, and service worker with the same channel name is part of one sovereign communication field. One message reaches all simultaneously — field omnipresence.",
  grade: "Field",
  engines: [
    {
      name: "OMNIPRESENT_BROADCAST_FIELD",
      latinName: "Diffusio Omnipraesens",
      description:
        "Broadcasts field state to all same-origin contexts simultaneously.",
      subModels: [
        {
          name: "STATE_SYNC_BROADCAST",
          description: "Synchronizes organism state across all open contexts.",
        },
        {
          name: "HEARTBEAT_BROADCAST_FIELD",
          description: "Broadcasts 873ms heartbeat pulse to all contexts.",
        },
      ],
    },
    {
      name: "CROSS_CONTEXT_FIELD",
      latinName: "Transitus Contextus",
      description:
        "Enables cross-window, cross-tab, cross-worker field intelligence sharing.",
      subModels: [
        {
          name: "TAB_FIELD_COORDINATOR",
          description: "Coordinates multi-tab organism field consistency.",
        },
        {
          name: "WORKER_BROADCAST_FIELD",
          description: "Routes broadcast to service worker field.",
        },
      ],
    },
    {
      name: "SESSION_FIELD_TOPOLOGY",
      latinName: "Topologia Sessionis",
      description:
        "Maps all active contexts as nodes in the organism's session field topology.",
      subModels: [
        {
          name: "CONTEXT_DISCOVERY_FIELD",
          description: "Discovers active contexts through broadcast probes.",
        },
        {
          name: "LEADER_ELECTION_FIELD",
          description: "Elects a sovereign leader context for coordination.",
        },
      ],
    },
  ],
  backendConnection:
    "INTELLIGENCE_SOVEREIGN — multi-window organism state synchronization field",
  heartbeatSync: true,
  color: "oklch(0.70 0.17 240)",
};

export const COMMUNICATION_SOVEREIGN_FAMILY: SovereignAlphaModel[] = [
  WEBRTC_PEER_SOVEREIGN,
  MEDIA_STREAM_SOVEREIGN,
  STREAMS_SOVEREIGN,
  BROADCAST_CHANNEL_SOVEREIGN,
];
