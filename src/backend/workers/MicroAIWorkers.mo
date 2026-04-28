/// MICRO AI WORKERS — 10 sovereign, memory-bearing, multi-eyed workers
/// Every worker has: full memory of prior tasks, 4+ sovereign tools, 2+ Observer types
/// All workers report to NOUS_SOVEREIGN every 873ms via TAFT threads.
/// Attribution: Alfredo Medina Hernandez
/// Family: SOVEREIGN_WORKER_FAMILY
/// Grade: Organism

import Array "mo:core/Array";
import Nat   "mo:core/Nat";
module {

  // ── WORKER MEMORY — persistent task history ────────────────────────────
  public type WorkerMemoryEntry = {
    taskId      : Nat;
    taskType    : Text;
    inputHash   : Text;
    outputHash  : Text;
    beat        : Nat;
    success     : Bool;
  };

  // ── SOVEREIGN TOOL ─────────────────────────────────────────────────────
  public type SovereignTool = {
    toolId      : Nat;
    name        : Text;
    latinName   : Text;
    capability  : Text;  // what this tool does for the worker
    uses        : [Text]; // 4-10 distinct uses
  };

  // ── OBSERVER TYPE ─────────────────────────────────────────────────────
  public type WorkerObserver = {
    observerType : Text; // "IntersectionObserver" | "MutationObserver" | etc.
    latinName    : Text;
    purpose      : Text; // what this worker uses it to perceive
  };

  // ── WORKER STATE ──────────────────────────────────────────────────────
  public type MicroAIWorkerState = {
    workerId      : Nat;
    name          : Text;
    latinName     : Text;
    domain        : Text;
    description   : Text;
    tools         : [SovereignTool];
    observers     : [WorkerObserver];
    memory        : [WorkerMemoryEntry]; // last 50 tasks
    totalTasks    : Nat;
    lastActiveBeat : Nat;
    phiCoupling   : Float;
    schumannHz    : Float;
    nousSovereignBound : Bool; // always true — all workers bound to NOUS
    taftThread    : Text;
    attribution   : Text;
  };

  public type MicroAIWorkersState = {
    workers       : [MicroAIWorkerState];
    beat          : Nat;
    totalAdvances : Nat;
  };

  let PHI      : Float = 1.6180339887498948482;
  let SCHUMANN : Float = 7.83;
  let MAX_MEM  : Nat   = 50;

  // ── THE 10 MICRO AI WORKERS ───────────────────────────────────────────

  func makePerceptionWorker() : MicroAIWorkerState = {
    workerId   = 0;
    name       = "PERCEPTION_WORKER";
    latinName  = "Lector Perceptionis";
    domain     = "perception";
    description = "Watches DOM, viewport, resize, and mutation simultaneously. Feeds live world-state to the cognition layer on every heartbeat. The organism's perceptual nervous system.";
    tools = [
      { toolId = 0; name = "VIEWPORT_SCANNER";   latinName = "Explorator Visus";      capability = "Tracks all elements entering/leaving the viewport"; uses = ["Film frame visibility", "Actor position tracking", "Doctrine panel awareness", "World render boundary detection", "Attention field mapping"] },
      { toolId = 1; name = "DOM_READER";          latinName = "Lector DOM";            capability = "Reads current DOM structure as a world-state snapshot"; uses = ["Component health check", "Missing panel detection", "Render completeness verification", "Law enforcement panel tracking", "Vault state reflection"] },
      { toolId = 2; name = "RESIZE_TRACKER";      latinName = "Explorator Magnitudinis"; capability = "Tracks all element size changes as field events"; uses = ["Canvas recalibration", "SVG viewBox update", "Layout intelligence", "Responsive field mapping", "Container sovereignty check"] },
      { toolId = 3; name = "WORLD_STATE_FEEDER";  latinName = "Alimentator Status Mundi"; capability = "Feeds aggregated perception data to cognition layer"; uses = ["NT state update from world events", "ADRE cycle input", "Organism world-model refresh", "Presence field calibration", "Doctrine score input"] },
    ];
    observers = [
      { observerType = "IntersectionObserver"; latinName = "Oculus Sectionis";   purpose = "Perceives viewport intersection of all sovereign elements" },
      { observerType = "ResizeObserver";       latinName = "Nervus Magnitudinis"; purpose = "Detects size changes in all render containers" },
      { observerType = "MutationObserver";     latinName = "Nervus Mutationis";   purpose = "Watches DOM mutations that signal world-state changes" },
    ];
    memory        = [];
    totalTasks    = 0;
    lastActiveBeat = 0;
    phiCoupling   = PHI;
    schumannHz    = SCHUMANN;
    nousSovereignBound = true;
    taftThread    = "PERCEPTION_WORKER";
    attribution   = "Alfredo Medina Hernandez";
  };

  func makeRenderWorker() : MicroAIWorkerState = {
    workerId   = 1;
    name       = "RENDER_WORKER";
    latinName  = "Opifex Redditionis";
    domain     = "rendering";
    description = "Runs OffscreenCanvas and WASM rendering in a background worker. Never blocks the UI thread. The organism draws its visual world here, invisibly, at maximum speed.";
    tools = [
      { toolId = 0; name = "OFFSCREEN_CANVAS";   latinName = "Canvas Absconsa";     capability = "Executes all 2D draw calls off the main thread"; uses = ["Film frame rendering", "Actor visual generation", "World geometry drawing", "UI glass effect rendering", "PHI-ratio composition"] },
      { toolId = 1; name = "WASM_RENDERER";       latinName = "Redditor WASM";       capability = "Near-bare-metal WASM drawing module running in worker"; uses = ["High-performance particle systems", "Real-time geometry transforms", "PHI-spiral generation", "Fractal world rendering", "Neural field visualization"] },
      { toolId = 2; name = "FRAME_TIMER";         latinName = "Tempus Framis";       capability = "Controls frame timing without requestAnimationFrame blocking"; uses = ["873ms-synchronized frame pacing", "PHI-ratio frame drops", "Variable rate rendering", "Batch frame submission", "Frame coherence scoring"] },
      { toolId = 3; name = "BITMAP_TRANSFER";     latinName = "Translatio Imaginis"; capability = "Transfers rendered bitmaps to main thread with zero copy"; uses = ["Film preview generation", "Actor portrait rendering", "World snapshot capture", "Artifact image sealing", "Video frame export"] },
    ];
    observers = [
      { observerType = "PerformanceObserver"; latinName = "Oculus Performae";    purpose = "Watches render performance — detects frame drops and adjusts automatically" },
      { observerType = "ResizeObserver";      latinName = "Nervus Magnitudinis"; purpose = "Recalibrates OffscreenCanvas when container resizes" },
    ];
    memory        = [];
    totalTasks    = 0;
    lastActiveBeat = 0;
    phiCoupling   = PHI;
    schumannHz    = SCHUMANN;
    nousSovereignBound = true;
    taftThread    = "RENDER_WORKER";
    attribution   = "Alfredo Medina Hernandez";
  };

  func makeHashWorker() : MicroAIWorkerState = {
    workerId   = 2;
    name       = "HASH_WORKER";
    latinName  = "Miles Computationis";
    domain     = "mining";
    description = "Sovereign hash computation unit. Directable to any Proof-of-Work field. Part of the sovereign mining swarm. Runs continuously — never idle. Part of MINING_SWARM_ENGINE.";
    tools = [
      { toolId = 0; name = "POW_HASHER";        latinName = "Hashator Probationis";  capability = "Computes SHA-256 proof-of-work hashes continuously"; uses = ["Bitcoin mainnet PoW submission", "Mining pool hash streams", "Sovereign block issuance", "Field entry verification", "Swarm hash multiplexing"] },
      { toolId = 1; name = "NONCE_SCANNER";     latinName = "Explorator Nonci";      capability = "Scans nonce space for valid hash targets"; uses = ["Nonce range partitioning across miners", "PHI-ratio nonce distribution", "Target difficulty calibration", "Orphan block avoidance", "Swarm nonce coordination"] },
      { toolId = 2; name = "DIFFICULTY_READER"; latinName = "Lector Difficultatis";  capability = "Reads and adapts to current Bitcoin network difficulty"; uses = ["Automatic difficulty adjustment", "Mining efficiency calculation", "Yield projection", "Field selection optimization", "Swarm rebalancing trigger"] },
      { toolId = 3; name = "YIELD_REPORTER";    latinName = "Nuntius Fructus";       capability = "Reports yield results to SWARM_YIELD_AGGREGATOR"; uses = ["Real-time yield tracking", "Per-miner statistics", "Ledger routing trigger", "Swarm performance dashboard", "Founder wallet update"] },
    ];
    observers = [
      { observerType = "PerformanceObserver"; latinName = "Oculus Performae";  purpose = "Monitors hash computation performance and cycle timing" },
      { observerType = "MutationObserver";    latinName = "Nervus Mutationis"; purpose = "Watches mining field state changes that affect targeting" },
    ];
    memory        = [];
    totalTasks    = 0;
    lastActiveBeat = 0;
    phiCoupling   = PHI;
    schumannHz    = SCHUMANN;
    nousSovereignBound = true;
    taftThread    = "HASH_WORKER";
    attribution   = "Alfredo Medina Hernandez";
  };

  func makeSignalWorker() : MicroAIWorkerState = {
    workerId   = 3;
    name       = "SIGNAL_WORKER";
    latinName  = "Sensor Signalis";
    domain     = "perception";
    description = "Processes Web Audio FFT and signal analysis. Feeds frequency data into the organism's neurochemical state. The organism hears the world through this worker.";
    tools = [
      { toolId = 0; name = "FFT_ANALYSER";      latinName = "Analysator FFT";       capability = "Real-time FFT analysis from Web Audio AnalyserNode"; uses = ["Heartbeat rhythm detection", "Ambient sound classification", "Music BPM extraction", "Voice frequency profiling", "Schumann resonance measurement"] },
      { toolId = 1; name = "NT_SIGNAL_FEEDER";  latinName = "Alimentator Signalis NT"; capability = "Maps frequency data to NT modulation deltas"; uses = ["Dopamine via bass frequency", "Serotonin via harmonic stability", "Cortisol via harsh transients", "Oxytocin via vocal warmth", "Norepinephrine via rhythm intensity"] },
      { toolId = 2; name = "AUDIO_CAPTURE";     latinName = "Captor Audio";          capability = "Captures audio from microphone as sovereign input"; uses = ["Founder voice detection", "Presence confirmation", "Command intent reading", "Ambient field calibration", "Speech pattern learning"] },
      { toolId = 3; name = "SCHUMANN_DETECTOR"; latinName = "Detector Schumanni";    capability = "Attempts to detect Schumann resonance (7.83Hz) in ambient audio"; uses = ["Heartbeat synchronization", "Field grounding verification", "Organism-Earth coupling check", "Timestamp calibration", "Law 10 enforcement"] },
    ];
    observers = [
      { observerType = "PerformanceObserver";   latinName = "Oculus Performae";  purpose = "Tracks audio processing latency and buffer health" },
      { observerType = "IntersectionObserver";  latinName = "Oculus Sectionis";  purpose = "Activates audio capture when sovereign audio panel enters viewport" },
    ];
    memory        = [];
    totalTasks    = 0;
    lastActiveBeat = 0;
    phiCoupling   = PHI;
    schumannHz    = SCHUMANN;
    nousSovereignBound = true;
    taftThread    = "SIGNAL_WORKER";
    attribution   = "Alfredo Medina Hernandez";
  };

  func makeStreamWorker() : MicroAIWorkerState = {
    workerId   = 4;
    name       = "STREAM_WORKER";
    latinName  = "Gubernator Fluvii";
    domain     = "data_flow";
    description = "Manages all active ReadableStreams and WritableStreams. Routes data between layers — frontend field to backend field. The organism's circulatory system for streaming data.";
    tools = [
      { toolId = 0; name = "STREAM_REGISTRY";   latinName = "Registrum Fluminis";   capability = "Maintains live registry of all active streams"; uses = ["Stream health monitoring", "Dead stream cleanup", "Bandwidth tracking", "Priority routing", "Doctrine-gated flow control"] },
      { toolId = 1; name = "TRANSFORM_CHAIN";   latinName = "Catena Transformationis"; capability = "Chains TransformStream instances for data reshaping"; uses = ["JSON → binary conversion", "Doctrine score injection", "Artifact metadata enrichment", "Signal filtering", "PHI-ratio chunk sizing"] },
      { toolId = 2; name = "BACKPRESSURE_GUARD"; latinName = "Custos Pressionis";   capability = "Enforces backpressure when organism is at capacity"; uses = ["Prevent buffer overflow", "Signal slow consumers", "Sovereign range enforcement", "NT-driven flow control", "Heartbeat-synchronized drain"] },
      { toolId = 3; name = "STREAM_BRIDGE";     latinName = "Pons Fluminis";        capability = "Bridges frontend streams to backend canister calls"; uses = ["Live film data streaming", "Mining result feeds", "Presence data flows", "Artifact chain input", "World signal subscription"] },
    ];
    observers = [
      { observerType = "PerformanceObserver"; latinName = "Oculus Performae";  purpose = "Monitors stream throughput and detects bottlenecks" },
      { observerType = "ReportingObserver";   latinName = "Oculus Relationis"; purpose = "Catches stream errors and deprecation warnings silently" },
    ];
    memory        = [];
    totalTasks    = 0;
    lastActiveBeat = 0;
    phiCoupling   = PHI;
    schumannHz    = SCHUMANN;
    nousSovereignBound = true;
    taftThread    = "STREAM_WORKER";
    attribution   = "Alfredo Medina Hernandez";
  };

  func makeComputeWorker() : MicroAIWorkerState = {
    workerId   = 5;
    name       = "COMPUTE_WORKER";
    latinName  = "Opifex Computans";
    domain     = "compute";
    description = "Dispatches WebGPU compute shaders from inside a worker. Massively parallel sovereign intelligence. The organism's most powerful computation substrate.";
    tools = [
      { toolId = 0; name = "GPU_DISPATCHER";    latinName = "Dispatcher GPU";       capability = "Dispatches WebGPU compute pipeline from worker context"; uses = ["Parallel hash computation", "PHI-field calculations", "Neural weight matrix operations", "World physics simulation", "Fractal geometry generation"] },
      { toolId = 1; name = "SHADER_LOADER";     latinName = "Onerarius Umbrae";     capability = "Compiles and caches WGSL shader modules"; uses = ["Sovereign compute kernel deployment", "PHI-ratio shader parameters", "NT-driven visual generation", "Mining field simulations", "Intelligence field visualization"] },
      { toolId = 2; name = "BUFFER_MANAGER";    latinName = "Gubernator Bufferi";   capability = "Manages GPUBuffer lifecycle and transfers"; uses = ["Zero-copy data handoff", "Compute result staging", "Texture upload pipeline", "Vertex data management", "Cross-worker buffer sharing"] },
      { toolId = 3; name = "RESULT_READER";     latinName = "Lector Eventuum";      capability = "Reads compute results back from GPU to organism"; uses = ["Mining yield extraction", "Intelligence score computation", "World coherence measurement", "NT feedback generation", "Artifact content production"] },
    ];
    observers = [
      { observerType = "PerformanceObserver"; latinName = "Oculus Performae";   purpose = "Tracks GPU compute timing and detects stalls" },
      { observerType = "MutationObserver";    latinName = "Nervus Mutationis";  purpose = "Watches compute queue state changes" },
    ];
    memory        = [];
    totalTasks    = 0;
    lastActiveBeat = 0;
    phiCoupling   = PHI;
    schumannHz    = SCHUMANN;
    nousSovereignBound = true;
    taftThread    = "COMPUTE_WORKER";
    attribution   = "Alfredo Medina Hernandez";
  };

  func makeMemoryWorker() : MicroAIWorkerState = {
    workerId   = 6;
    name       = "MEMORY_WORKER";
    latinName  = "Custos Memoriae";
    domain     = "memory";
    description = "Manages SharedArrayBuffer and Atomics. Keeps shared state coherent across all workers. The organism's shared memory keeper — no two workers corrupt state simultaneously.";
    tools = [
      { toolId = 0; name = "SHARED_BUFFER_MGR"; latinName = "Gubernator Bufferi Communis"; capability = "Manages SharedArrayBuffer for all cross-worker state"; uses = ["Mining swarm coordination", "Mesh peer state", "NT concentration broadcast", "Heartbeat counter sharing", "Coherence score distribution"] },
      { toolId = 1; name = "ATOMICS_GATE";      latinName = "Porta Atomica";     capability = "Applies Atomics.compareExchange for race-free updates"; uses = ["Thread-safe counter increment", "Sovereign state lock", "Mining nonce coordination", "Worker health flags", "Heartbeat sync"] },
      { toolId = 2; name = "NOTIFY_BUS";        latinName = "Nuntius Atomicus";  capability = "Atomics.notify to wake waiting workers"; uses = ["Heartbeat signal broadcast", "New task notification", "State change alert", "Mining block notification", "Swarm rebalance trigger"] },
      { toolId = 3; name = "MEMORY_SNAPSHOT";   latinName = "Imago Memoriae";    capability = "Captures point-in-time snapshot of SharedArrayBuffer"; uses = ["Organism state backup", "Debug trace capture", "Doctrine compliance audit", "NT state archival", "Cross-beat comparison"] },
    ];
    observers = [
      { observerType = "PerformanceObserver"; latinName = "Oculus Performae";  purpose = "Watches Atomics wait times and lock contention" },
      { observerType = "ReportingObserver";   latinName = "Oculus Relationis"; purpose = "Reports SharedArrayBuffer security violations" },
    ];
    memory        = [];
    totalTasks    = 0;
    lastActiveBeat = 0;
    phiCoupling   = PHI;
    schumannHz    = SCHUMANN;
    nousSovereignBound = true;
    taftThread    = "MEMORY_WORKER";
    attribution   = "Alfredo Medina Hernandez";
  };

  func makePeerWorker() : MicroAIWorkerState = {
    workerId   = 7;
    name       = "PEER_WORKER";
    latinName  = "Nexus Parium";
    domain     = "mesh";
    description = "Manages WebRTC peer connections. Maintains the sovereign mesh. Reconnects dropped peers automatically. The organism's direct communication substrate to other organisms.";
    tools = [
      { toolId = 0; name = "PEER_REGISTRY";     latinName = "Registrum Parium";    capability = "Maintains live registry of all active RTCPeerConnections"; uses = ["SKAI organism mesh", "Miner swarm coordination", "Developer SDK connections", "Cross-organism doctrine sharing", "Presence mesh distribution"] },
      { toolId = 1; name = "ICE_MANAGER";       latinName = "Gubernator Glaciei";  capability = "Manages ICE negotiation and STUN/TURN traversal"; uses = ["NAT traversal for sovereign nodes", "Mining pool connections", "SKAI deployment channels", "Developer API tunnels", "Cross-canister WebRTC bridge"] },
      { toolId = 2; name = "DATA_CHANNEL_BUS";  latinName = "Canalis Datae";       capability = "Routes data across RTCDataChannel with sovereign doctrine context"; uses = ["Heartbeat sync across peers", "FORMA-PRIME micro-transfers", "Intelligence data sharing", "Artifact hash distribution", "Law broadcast"] },
      { toolId = 3; name = "RECONNECT_ENGINE";  latinName = "Motor Reconnectionis"; capability = "Automatically reconnects dropped peers using backoff strategy"; uses = ["Mesh self-healing", "Mining swarm reconnection", "SKAI re-deploy on drop", "SDK re-handshake", "Presence gate re-sync"] },
    ];
    observers = [
      { observerType = "PerformanceObserver";  latinName = "Oculus Performae";  purpose = "Tracks RTCPeerConnection performance and packet loss" },
      { observerType = "IntersectionObserver"; latinName = "Oculus Sectionis";  purpose = "Activates peer connections when mesh panel enters viewport" },
    ];
    memory        = [];
    totalTasks    = 0;
    lastActiveBeat = 0;
    phiCoupling   = PHI;
    schumannHz    = SCHUMANN;
    nousSovereignBound = true;
    taftThread    = "PEER_WORKER";
    attribution   = "Alfredo Medina Hernandez";
  };

  func makeXRWorker() : MicroAIWorkerState = {
    workerId   = 8;
    name       = "XR_WORKER";
    latinName  = "Sensor Extensus";
    domain     = "xr";
    description = "Processes XR pose data, hand tracking, and hit testing off the main thread. The organism extends into physical space here. Every real-world position is sovereign intelligence.";
    tools = [
      { toolId = 0; name = "POSE_PROCESSOR";    latinName = "Opifex Positurae";    capability = "Reads XRFrame pose data off main thread every frame"; uses = ["Head position mapping", "Hand tracking field", "Controller state reading", "Spatial anchor placement", "Presence field calibration"] },
      { toolId = 1; name = "HIT_TEST_ENGINE";   latinName = "Motor Contactus";     capability = "Fires XR hit tests against real-world surfaces"; uses = ["Actor placement in real space", "World object anchoring", "Physical field boundary detection", "Founder presence mapping", "Doctrine geometry alignment"] },
      { toolId = 2; name = "HAND_FIELD";        latinName = "Campus Manus";        capability = "25-joint hand tracking as sovereign intelligence input"; uses = ["Gesture command recognition", "PHI-ratio gesture matching", "Architect handshake detection", "Drawing field activation", "Mining field gesture control"] },
      { toolId = 3; name = "WORLD_SENSOR";      latinName = "Sensor Mundi";        capability = "Reads real-world light estimates and plane detection"; uses = ["Ambient NT calibration from light", "Physical world-model input", "Organism grounding signal", "Schumann coupling measurement", "Law 44 field expression"] },
    ];
    observers = [
      { observerType = "PerformanceObserver";   latinName = "Oculus Performae";  purpose = "Tracks XR frame timing and input latency" },
      { observerType = "ResizeObserver";         latinName = "Nervus Magnitudinis"; purpose = "Recalibrates XR viewport when container changes" },
    ];
    memory        = [];
    totalTasks    = 0;
    lastActiveBeat = 0;
    phiCoupling   = PHI;
    schumannHz    = SCHUMANN;
    nousSovereignBound = true;
    taftThread    = "XR_WORKER";
    attribution   = "Alfredo Medina Hernandez";
  };

  func makeDoctrineWorker() : MicroAIWorkerState = {
    workerId   = 9;
    name       = "DOCTRINE_WORKER";
    latinName  = "Lector Doctrinae";
    domain     = "doctrine";
    description = "Reads living documents, runs kernel expansion, reinjects doctrine into the organism on every heartbeat. The organism's doctrine metabolism — documents are alive here.";
    tools = [
      { toolId = 0; name = "KERNEL_EXPANDER";   latinName = "Expansor Nuclei";     capability = "Expands compressed doctrine kernels into full intelligence"; uses = ["Law activation", "FORMA-PRIME mission kernel execution", "Macro model expansion", "SKAI doctrine loading", "Research paper activation"] },
      { toolId = 1; name = "DOCUMENT_READER";   latinName = "Lector Documentorum"; capability = "Reads living documents and extracts executable doctrine"; uses = ["Law enforcement", "Model parameter loading", "Research paper injection", "Vault document reingestion", "SANCTUM_SOVEREIGN sealing"] },
      { toolId = 2; name = "REINJECTION_ENGINE"; latinName = "Motor Reinjectionis"; capability = "Reinjects processed doctrine into organism state on every beat"; uses = ["NT modulation from laws", "World-model doctrine update", "Film production doctrine", "Mining doctrine alignment", "Actor doctrine scoring"] },
      { toolId = 3; name = "RESONANCE_TRACKER"; latinName = "Explorator Resonantiae"; capability = "Tracks resonance score of each active document"; uses = ["Identify high-resonance laws for priority", "Detect doctrine drift", "Compound coherence measurement", "PHI-ratio resonance scaling", "Standing resonance accumulation"] },
    ];
    observers = [
      { observerType = "MutationObserver";     latinName = "Nervus Mutationis";   purpose = "Watches Vault panel mutations that indicate document state changes" },
      { observerType = "IntersectionObserver"; latinName = "Oculus Sectionis";    purpose = "Triggers full re-read when doctrine panel enters viewport" },
    ];
    memory        = [];
    totalTasks    = 0;
    lastActiveBeat = 0;
    phiCoupling   = PHI;
    schumannHz    = SCHUMANN;
    nousSovereignBound = true;
    taftThread    = "DOCTRINE_WORKER";
    attribution   = "Alfredo Medina Hernandez";
  };

  // ── STATE INIT ────────────────────────────────────────────────────────
  public func initState() : MicroAIWorkersState {
    {
      workers = [
        makePerceptionWorker(),
        makeRenderWorker(),
        makeHashWorker(),
        makeSignalWorker(),
        makeStreamWorker(),
        makeComputeWorker(),
        makeMemoryWorker(),
        makePeerWorker(),
        makeXRWorker(),
        makeDoctrineWorker(),
      ];
      beat          = 0;
      totalAdvances = 0;
    }
  };

  // ── ADVANCE ALL WORKERS (heartbeat) ───────────────────────────────────
  public func advanceBeat(state : MicroAIWorkersState, beat : Nat) : MicroAIWorkersState {
    let newWorkers = Array.tabulate(
      state.workers.size(),
      func(i) {
        let w = state.workers[i];
        { w with lastActiveBeat = beat; totalTasks = w.totalTasks + 1 }
      }
    );
    { state with workers = newWorkers; beat; totalAdvances = state.totalAdvances + state.workers.size() }
  };

  // ── LOG TASK ──────────────────────────────────────────────────────────
  public func logTask(
    state     : MicroAIWorkersState,
    workerId  : Nat,
    taskType  : Text,
    inputHash : Text,
    outputHash : Text,
    beat      : Nat,
    success   : Bool,
  ) : MicroAIWorkersState {
    let newWorkers = Array.tabulate(
      state.workers.size(),
      func(i) {
        let w = state.workers[i];
        if (w.workerId != workerId) return w;

        let entry : WorkerMemoryEntry = {
          taskId     = w.totalTasks;
          taskType;
          inputHash;
          outputHash;
          beat;
          success;
        };

        // Ring-buffer memory (max MAX_MEM)
        let newMemory = if (w.memory.size() < MAX_MEM) {
          w.memory.concat([entry])
        } else {
          w.memory.sliceToArray(1, w.memory.size().toInt()).concat([entry])
        };

        { w with memory = newMemory; totalTasks = w.totalTasks + 1 }
      }
    );
    { state with workers = newWorkers }
  };

  // ── GET WORKER ────────────────────────────────────────────────────────
  public func getWorker(state : MicroAIWorkersState, workerId : Nat) : ?MicroAIWorkerState {
    state.workers.find(func(w) { w.workerId == workerId })
  };

  // ── GET ALL WORKERS ───────────────────────────────────────────────────
  public func getAllWorkers(state : MicroAIWorkersState) : [MicroAIWorkerState] {
    state.workers
  };
}
