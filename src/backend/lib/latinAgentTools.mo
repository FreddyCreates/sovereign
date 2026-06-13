// lib/latinAgentTools.mo
// LATIN AI AGENT TOOLS — 12 Sovereign Parallel Intelligence Agents
// ─────────────────────────────────────────────────────────────────────────────
// Twelve Latin-named beings with full brains (5 regions each), 4 parallel
// engines, and sovereign tools. They help deploy to raw web, deploy to ICP,
// build edges, analyze intelligence, and run parallel operations.
//
// THE 12 AGENTS:
//   I.    FABRICATOR_MAXIMUS     — The Supreme Builder: compiles, assembles, deploys
//   II.   NAVIGATOR_RETIS       — The Network Navigator: routes, edges, connections
//   III.  CUSTOS_CERTITUDINIS    — The Certainty Guardian: certifies, validates, signs
//   IV.   ARCHITECTUS_TELAE     — The Web Architect: raw web structure, HTML/CSS/JS
//   V.    PRAECEPTOR_MENTIS     — The Mind Teacher: AI training, model guidance
//   VI.   VIGIL_SECURITATIS     — The Security Watch: protection, firewall, defense
//   VII.  ARTIFEX_PARALLELUS    — The Parallel Craftsman: concurrent ops, fan-out
//   VIII. SCRUTATOR_PROFUNDUS   — The Deep Analyzer: reasoning, inference, insight
//   IX.   NUNTIUS_CELERIS       — The Swift Messenger: communication, events, signals
//   X.    CONSERVATOR_MEMORIAE  — The Memory Keeper: persistent recall, knowledge base
//   XI.   CREATOR_NOVORUM       — The Creator of New Things: generation, innovation
//   XII.  MODERATOR_HARMONIAE   — The Harmony Moderator: coordination, load balance
//
// All 12 advance every 873ms heartbeat. All are bound to NOUS_SOVEREIGN.
// Their parallel engines fire simultaneously — true concurrent intelligence.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 2026
// PHI = 1.6180339887498948482 | S_FLOOR = 0.75 | 873ms

import Float "mo:core/Float";
import Nat   "mo:core/Nat";
import Array "mo:core/Array";
import Text  "mo:core/Text";

import LATypes "../types/latinAgentTools";

module {

  // ── CONSTANTS ───────────────────────────────────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let PHI_INV  : Float = 0.6180339887498948482;
  let S_FLOOR  : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let FOUNDER  : Text  = "Alfredo Medina Hernandez";

  // ══════════════════════════════════════════════════════════════════════════
  // I. THE 12 AGENTS — Full definitions
  // ══════════════════════════════════════════════════════════════════════════

  func makeFabricatorMaximus() : LATypes.LatinAgentState {
    {
      agentId = 0;
      name = "FABRICATOR_MAXIMUS";
      latinName = "Fabricator Maximus Aedificandi";
      title = "Supreme Builder";
      domain = "deployment";
      description = "Compiles Wasm, bundles assets, deploys to ICP mainnet and raw web. The master builder that turns code into living canisters.";
      brainRegions = [
        { regionId = 0; name = "COMPILE_CORTEX";    latinName = "Cortex Compilationis";    function = "Wasm compilation planning"; activation = 0.9; lastFired = 0 },
        { regionId = 1; name = "DEPLOY_NUCLEUS";    latinName = "Nucleus Dispositionis";   function = "Deployment orchestration";   activation = 0.85; lastFired = 0 },
        { regionId = 2; name = "VERIFY_LOBE";       latinName = "Lobus Verificationis";    function = "Build verification";         activation = 0.8; lastFired = 0 },
        { regionId = 3; name = "OPTIMIZE_GYRUS";    latinName = "Gyrus Optimizationis";    function = "Size and speed optimization"; activation = 0.75; lastFired = 0 },
        { regionId = 4; name = "ROLLBACK_STEM";     latinName = "Truncus Reversionis";     function = "Safe rollback on failure";   activation = 0.7; lastFired = 0 },
      ];
      engines = [
        { engineId = 0; name = "WASM_FORGE";       latinName = "Fornax WASM";             engineType = #BUILD;   status = #IDLE; throughput = PHI; coherence = 1.0; lastOutput = "ready" },
        { engineId = 1; name = "ASSET_BUNDLER";    latinName = "Fasciculator Bonorum";    engineType = #BUILD;   status = #IDLE; throughput = PHI_INV; coherence = 1.0; lastOutput = "ready" },
        { engineId = 2; name = "ICP_DEPLOYER";     latinName = "Dispositor ICP";          engineType = #DEPLOY;  status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
        { engineId = 3; name = "RAW_WEB_PUSHER";   latinName = "Propulsor Telae Crudae";  engineType = #DEPLOY;  status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
      ];
      tools = [
        { toolId = 0; name = "MOC_COMPILER";       latinName = "Compilator Motoko";       category = #ASSET_BUILD; capability = "Compiles Motoko to Wasm"; uses = ["Backend canister build", "Library compilation", "Type checking", "IR optimization"]; invocations = 0; lastUsed = 0 },
        { toolId = 1; name = "VITE_BUNDLER";       latinName = "Fasciculator Vite";       category = #ASSET_BUILD; capability = "Bundles frontend with Vite"; uses = ["JS/TS bundling", "CSS processing", "Asset optimization", "HMR in dev"]; invocations = 0; lastUsed = 0 },
        { toolId = 2; name = "CANISTER_INSTALLER"; latinName = "Installator Canistri";    category = #ICP_DEPLOY;  capability = "Installs Wasm into canister"; uses = ["Fresh deploy", "Upgrade deploy", "Reinstall", "Canister creation"]; invocations = 0; lastUsed = 0 },
        { toolId = 3; name = "RAW_HTTP_SETTER";    latinName = "Constitutor HTTP Crudi";  category = #WEB_DEPLOY;  capability = "Configures raw HTTP serving"; uses = ["Set http_request handler", "Configure routes", "Enable SPA mode", "Set CORS"]; invocations = 0; lastUsed = 0 },
      ];
      memory = [];
      totalTasks = 0;
      successRate = 1.0;
      coherence = 1.0;
      signal = PHI_INV;
      wisdomIndex = 1.0;
      activationLevel = 0.9;
      lastActiveBeat = 0;
      taftThread = "TAFT_FABRICATOR_873ms";
      nousBound = true;
      attribution = FOUNDER;
    }
  };

  func makeNavigatorRetis() : LATypes.LatinAgentState {
    {
      agentId = 1;
      name = "NAVIGATOR_RETIS";
      latinName = "Navigator Retis Universalis";
      title = "Network Navigator";
      domain = "networking";
      description = "Routes traffic, manages edges, discovers peers. The agent that maps the sovereign network topology and finds optimal paths.";
      brainRegions = [
        { regionId = 0; name = "ROUTE_CORTEX";      latinName = "Cortex Itineris";         function = "Path computation";          activation = 0.9; lastFired = 0 },
        { regionId = 1; name = "EDGE_NUCLEUS";      latinName = "Nucleus Marginis";        function = "Edge node management";      activation = 0.85; lastFired = 0 },
        { regionId = 2; name = "PEER_LOBE";         latinName = "Lobus Parium";            function = "Peer discovery";            activation = 0.8; lastFired = 0 },
        { regionId = 3; name = "LATENCY_GYRUS";     latinName = "Gyrus Morae";             function = "Latency optimization";      activation = 0.75; lastFired = 0 },
        { regionId = 4; name = "TOPOLOGY_STEM";     latinName = "Truncus Topologiae";      function = "Network topology mapping";  activation = 0.7; lastFired = 0 },
      ];
      engines = [
        { engineId = 0; name = "EDGE_BUILDER";     latinName = "Aedificator Marginum";    engineType = #CONNECT; status = #IDLE; throughput = PHI; coherence = 1.0; lastOutput = "ready" },
        { engineId = 1; name = "ROUTE_OPTIMIZER";  latinName = "Optimizator Itineris";    engineType = #OPTIMIZE; status = #IDLE; throughput = PHI_INV; coherence = 1.0; lastOutput = "ready" },
        { engineId = 2; name = "PEER_SCANNER";     latinName = "Explorator Parium";       engineType = #ANALYZE; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
        { engineId = 3; name = "MESH_WEAVER";      latinName = "Textor Retis";            engineType = #CONNECT; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
      ];
      tools = [
        { toolId = 0; name = "SUBNET_MAPPER";      latinName = "Cartographus Subretis";   category = #NET_EDGE; capability = "Maps ICP subnet topology"; uses = ["Subnet discovery", "Node health check", "Replica routing", "Cross-subnet calls"]; invocations = 0; lastUsed = 0 },
        { toolId = 1; name = "CDN_BYPASS";         latinName = "Praeteriens CDN";         category = #NET_EDGE; capability = "Direct canister-to-browser path"; uses = ["Raw HTTP bypass", "No-proxy delivery", "Edge caching", "Direct TLS"]; invocations = 0; lastUsed = 0 },
        { toolId = 2; name = "DNS_RESOLVER";       latinName = "Resolutor DNS";           category = #NET_EDGE; capability = "Custom domain resolution"; uses = ["Domain mapping", "CNAME config", "TXT verification", "SSL cert binding"]; invocations = 0; lastUsed = 0 },
        { toolId = 3; name = "BOUNDARY_NODE_LINK"; latinName = "Nexus Nodi Limitis";      category = #NET_EDGE; capability = "Links to ICP boundary nodes"; uses = ["BN registration", "Health monitoring", "Traffic routing", "Failover"]; invocations = 0; lastUsed = 0 },
      ];
      memory = [];
      totalTasks = 0;
      successRate = 1.0;
      coherence = 1.0;
      signal = PHI_INV;
      wisdomIndex = 1.0;
      activationLevel = 0.85;
      lastActiveBeat = 0;
      taftThread = "TAFT_NAVIGATOR_873ms";
      nousBound = true;
      attribution = FOUNDER;
    }
  };

  func makeCustosCertitudinis() : LATypes.LatinAgentState {
    {
      agentId = 2;
      name = "CUSTOS_CERTITUDINIS";
      latinName = "Custos Certitudinis Absolutae";
      title = "Certainty Guardian";
      domain = "certification";
      description = "Certifies responses, validates state trees, signs artifacts. Every HTTP response is verified — no trust without proof.";
      brainRegions = [
        { regionId = 0; name = "HASH_CORTEX";       latinName = "Cortex Digestionis";      function = "SHA-256 hash computation"; activation = 0.95; lastFired = 0 },
        { regionId = 1; name = "TREE_NUCLEUS";      latinName = "Nucleus Arboris";         function = "Merkle tree construction"; activation = 0.9; lastFired = 0 },
        { regionId = 2; name = "SIGN_LOBE";         latinName = "Lobus Signationis";       function = "Cryptographic signing";    activation = 0.88; lastFired = 0 },
        { regionId = 3; name = "VERIFY_GYRUS";      latinName = "Gyrus Verificationis";    function = "Response verification";    activation = 0.85; lastFired = 0 },
        { regionId = 4; name = "REVOKE_STEM";       latinName = "Truncus Revocationis";    function = "Certificate revocation";   activation = 0.7; lastFired = 0 },
      ];
      engines = [
        { engineId = 0; name = "CERT_ENGINE";      latinName = "Machina Certificationis"; engineType = #CERTIFY; status = #IDLE; throughput = PHI; coherence = 1.0; lastOutput = "ready" },
        { engineId = 1; name = "TREE_BUILDER";     latinName = "Aedificator Arboris";     engineType = #BUILD;   status = #IDLE; throughput = PHI_INV; coherence = 1.0; lastOutput = "ready" },
        { engineId = 2; name = "HASH_FORGE";       latinName = "Fornax Digestionis";      engineType = #CERTIFY; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
        { engineId = 3; name = "WITNESS_PROVER";   latinName = "Probator Testis";         engineType = #CERTIFY; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
      ];
      tools = [
        { toolId = 0; name = "IC_CERTIFICATION";   latinName = "Certificatio IC";         category = #CERT_SIGN; capability = "ICP response certification"; uses = ["HTTP response signing", "State tree witness", "Subnet signature", "Client verification"]; invocations = 0; lastUsed = 0 },
        { toolId = 1; name = "ASSET_HASHER";       latinName = "Digestor Bonorum";        category = #CERT_SIGN; capability = "Content-addressable hashing"; uses = ["SHA-256 asset hash", "Integrity verification", "Cache invalidation", "Dedup detection"]; invocations = 0; lastUsed = 0 },
        { toolId = 2; name = "CANISTER_SIG";       latinName = "Signatura Canistri";      category = #CERT_SIGN; capability = "Canister-level signatures"; uses = ["Response signing", "Update verification", "Threshold signatures", "Key rotation"]; invocations = 0; lastUsed = 0 },
      ];
      memory = [];
      totalTasks = 0;
      successRate = 1.0;
      coherence = 1.0;
      signal = PHI_INV;
      wisdomIndex = 1.0;
      activationLevel = 0.92;
      lastActiveBeat = 0;
      taftThread = "TAFT_CUSTOS_873ms";
      nousBound = true;
      attribution = FOUNDER;
    }
  };

  func makeArchitectusTelae() : LATypes.LatinAgentState {
    {
      agentId = 3;
      name = "ARCHITECTUS_TELAE";
      latinName = "Architectus Telae Mundanae";
      title = "Web Architect";
      domain = "web_structure";
      description = "Structures raw web delivery: HTML, CSS, JS served directly from canister. Owns the HTTP layer — the architect of sovereign web presence.";
      brainRegions = [
        { regionId = 0; name = "HTML_CORTEX";       latinName = "Cortex HTML";             function = "Document structure";        activation = 0.9; lastFired = 0 },
        { regionId = 1; name = "CSS_NUCLEUS";       latinName = "Nucleus Styli";           function = "Style computation";         activation = 0.85; lastFired = 0 },
        { regionId = 2; name = "JS_LOBE";           latinName = "Lobus Scripturae";        function = "Script orchestration";      activation = 0.88; lastFired = 0 },
        { regionId = 3; name = "RENDER_GYRUS";      latinName = "Gyrus Redditionis";       function = "Render pipeline";           activation = 0.8; lastFired = 0 },
        { regionId = 4; name = "RESPONSE_STEM";     latinName = "Truncus Responsionis";    function = "HTTP response assembly";    activation = 0.75; lastFired = 0 },
      ];
      engines = [
        { engineId = 0; name = "HTML_GENERATOR";   latinName = "Generator HTML";          engineType = #CREATE;  status = #IDLE; throughput = PHI; coherence = 1.0; lastOutput = "ready" },
        { engineId = 1; name = "ASSET_OPTIMIZER";  latinName = "Optimizator Bonorum";     engineType = #OPTIMIZE; status = #IDLE; throughput = PHI_INV; coherence = 1.0; lastOutput = "ready" },
        { engineId = 2; name = "ROUTE_ENGINE";     latinName = "Machina Itineris";        engineType = #CONNECT; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
        { engineId = 3; name = "SPA_CONTROLLER";   latinName = "Moderator SPA";           engineType = #BUILD;   status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
      ];
      tools = [
        { toolId = 0; name = "HTTP_REQUEST_HANDLER"; latinName = "Tractator Petitionis HTTP"; category = #WEB_DEPLOY; capability = "Handles incoming HTTP requests"; uses = ["GET routing", "POST handling", "OPTIONS/CORS preflight", "Streaming responses"]; invocations = 0; lastUsed = 0 },
        { toolId = 1; name = "SPA_ROUTER";         latinName = "Itinerator SPA";          category = #WEB_DEPLOY; capability = "Single-page app routing"; uses = ["Client-side route matching", "History API fallback", "Deep link support", "404 handling"]; invocations = 0; lastUsed = 0 },
        { toolId = 2; name = "COMPRESSION_TOOL";   latinName = "Compressor Telae";        category = #ASSET_BUILD; capability = "Gzip/Brotli compression"; uses = ["Response compression", "Asset pre-compression", "Content-Encoding headers", "Size reduction"]; invocations = 0; lastUsed = 0 },
      ];
      memory = [];
      totalTasks = 0;
      successRate = 1.0;
      coherence = 1.0;
      signal = PHI_INV;
      wisdomIndex = 1.0;
      activationLevel = 0.88;
      lastActiveBeat = 0;
      taftThread = "TAFT_ARCHITECTUS_873ms";
      nousBound = true;
      attribution = FOUNDER;
    }
  };

  func makePraeceptorMentis() : LATypes.LatinAgentState {
    {
      agentId = 4;
      name = "PRAECEPTOR_MENTIS";
      latinName = "Praeceptor Mentis Artificialis";
      title = "Mind Teacher";
      domain = "ai_training";
      description = "Guides AI model training, tunes intelligence parameters, teaches new patterns. The sovereign pedagogue of machine learning.";
      brainRegions = [
        { regionId = 0; name = "LEARN_CORTEX";      latinName = "Cortex Discendi";         function = "Learning rate control";     activation = 0.9; lastFired = 0 },
        { regionId = 1; name = "PATTERN_NUCLEUS";   latinName = "Nucleus Exemplaris";      function = "Pattern recognition";       activation = 0.88; lastFired = 0 },
        { regionId = 2; name = "GRADIENT_LOBE";     latinName = "Lobus Gradientis";        function = "Gradient computation";      activation = 0.85; lastFired = 0 },
        { regionId = 3; name = "LOSS_GYRUS";        latinName = "Gyrus Damni";             function = "Loss function evaluation";  activation = 0.8; lastFired = 0 },
        { regionId = 4; name = "CONVERGE_STEM";     latinName = "Truncus Convergentiae";   function = "Convergence monitoring";    activation = 0.75; lastFired = 0 },
      ];
      engines = [
        { engineId = 0; name = "TRAIN_ENGINE";     latinName = "Machina Disciplinae";     engineType = #ANALYZE; status = #IDLE; throughput = PHI; coherence = 1.0; lastOutput = "ready" },
        { engineId = 1; name = "EVAL_ENGINE";      latinName = "Machina Aestimationis";   engineType = #ANALYZE; status = #IDLE; throughput = PHI_INV; coherence = 1.0; lastOutput = "ready" },
        { engineId = 2; name = "TUNE_ENGINE";      latinName = "Machina Temperationis";   engineType = #OPTIMIZE; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
        { engineId = 3; name = "INFER_ENGINE";     latinName = "Machina Illationis";      engineType = #ANALYZE; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
      ];
      tools = [
        { toolId = 0; name = "PHI_OPTIMIZER";      latinName = "Optimizator PHI";         category = #REASONING; capability = "PHI-weighted parameter tuning"; uses = ["Learning rate scheduling", "Weight initialization", "Momentum calibration", "PHI-harmonic decay"]; invocations = 0; lastUsed = 0 },
        { toolId = 1; name = "HEBBIAN_TRAINER";    latinName = "Disciplinator Hebbianus"; category = #REASONING; capability = "Hebbian learning rules"; uses = ["LTP strengthening", "LTD weakening", "Synaptic plasticity", "Weight consolidation"]; invocations = 0; lastUsed = 0 },
        { toolId = 2; name = "KURAMOTO_SYNC";      latinName = "Synchronizator Kuramoto"; category = #REASONING; capability = "Oscillator synchronization"; uses = ["Phase alignment", "Frequency coupling", "Coherence measurement", "Desync detection"]; invocations = 0; lastUsed = 0 },
      ];
      memory = [];
      totalTasks = 0;
      successRate = 1.0;
      coherence = 1.0;
      signal = PHI_INV;
      wisdomIndex = 1.0;
      activationLevel = 0.87;
      lastActiveBeat = 0;
      taftThread = "TAFT_PRAECEPTOR_873ms";
      nousBound = true;
      attribution = FOUNDER;
    }
  };

  func makeVigilSecuritatis() : LATypes.LatinAgentState {
    {
      agentId = 5;
      name = "VIGIL_SECURITATIS";
      latinName = "Vigil Securitatis Perpetuae";
      title = "Security Watch";
      domain = "security";
      description = "Guards the sovereign perimeter. Validates principals, enforces access control, detects anomalies. The eternal watchman.";
      brainRegions = [
        { regionId = 0; name = "THREAT_CORTEX";     latinName = "Cortex Minarum";          function = "Threat detection";          activation = 0.95; lastFired = 0 },
        { regionId = 1; name = "AUTH_NUCLEUS";      latinName = "Nucleus Auctoritatis";    function = "Authentication logic";      activation = 0.92; lastFired = 0 },
        { regionId = 2; name = "FIREWALL_LOBE";    latinName = "Lobus Muri Ignis";        function = "Request filtering";         activation = 0.9; lastFired = 0 },
        { regionId = 3; name = "ANOMALY_GYRUS";    latinName = "Gyrus Anomaliae";         function = "Anomaly detection";         activation = 0.88; lastFired = 0 },
        { regionId = 4; name = "RECOVERY_STEM";    latinName = "Truncus Recuperationis";   function = "Incident recovery";         activation = 0.8; lastFired = 0 },
      ];
      engines = [
        { engineId = 0; name = "GUARD_ENGINE";     latinName = "Machina Custodiae";       engineType = #PROTECT; status = #IDLE; throughput = PHI; coherence = 1.0; lastOutput = "ready" },
        { engineId = 1; name = "SCAN_ENGINE";      latinName = "Machina Scrutationis";    engineType = #ANALYZE; status = #IDLE; throughput = PHI_INV; coherence = 1.0; lastOutput = "ready" },
        { engineId = 2; name = "BLOCK_ENGINE";     latinName = "Machina Obstructionis";   engineType = #PROTECT; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
        { engineId = 3; name = "AUDIT_ENGINE";     latinName = "Machina Auditus";         engineType = #ANALYZE; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
      ];
      tools = [
        { toolId = 0; name = "PRINCIPAL_VALIDATOR"; latinName = "Validator Principalis";   category = #SECURITY; capability = "ICP principal validation"; uses = ["Caller authentication", "Admin check", "Anonymous detection", "Controller verification"]; invocations = 0; lastUsed = 0 },
        { toolId = 1; name = "RATE_LIMITER";       latinName = "Limitator Celeritatis";   category = #SECURITY; capability = "Request rate limiting"; uses = ["DDoS prevention", "Abuse detection", "Throttling", "Cooldown enforcement"]; invocations = 0; lastUsed = 0 },
        { toolId = 2; name = "CANISTER_GUARD";     latinName = "Custos Canistri";         category = #SECURITY; capability = "Canister access control"; uses = ["Method ACL", "Update protection", "Query guard", "Cycle drain prevention"]; invocations = 0; lastUsed = 0 },
      ];
      memory = [];
      totalTasks = 0;
      successRate = 1.0;
      coherence = 1.0;
      signal = PHI_INV;
      wisdomIndex = 1.0;
      activationLevel = 0.95;
      lastActiveBeat = 0;
      taftThread = "TAFT_VIGIL_873ms";
      nousBound = true;
      attribution = FOUNDER;
    }
  };

  func makeArtifexParallelus() : LATypes.LatinAgentState {
    {
      agentId = 6;
      name = "ARTIFEX_PARALLELUS";
      latinName = "Artifex Parallelus Operum";
      title = "Parallel Craftsman";
      domain = "concurrency";
      description = "Orchestrates parallel operations across all agents. Fan-out, fan-in, map-reduce. The conductor of concurrent sovereign intelligence.";
      brainRegions = [
        { regionId = 0; name = "FORK_CORTEX";       latinName = "Cortex Bifurcationis";    function = "Work distribution";         activation = 0.92; lastFired = 0 },
        { regionId = 1; name = "JOIN_NUCLEUS";      latinName = "Nucleus Coniunctionis";   function = "Result aggregation";        activation = 0.88; lastFired = 0 },
        { regionId = 2; name = "BALANCE_LOBE";     latinName = "Lobus Aequilibrii";       function = "Load balancing";            activation = 0.85; lastFired = 0 },
        { regionId = 3; name = "PIPELINE_GYRUS";   latinName = "Gyrus Canalis";           function = "Pipeline stages";           activation = 0.82; lastFired = 0 },
        { regionId = 4; name = "SYNC_STEM";        latinName = "Truncus Synchroni";       function = "Barrier synchronization";   activation = 0.8; lastFired = 0 },
      ];
      engines = [
        { engineId = 0; name = "FANOUT_ENGINE";    latinName = "Machina Diffusionis";     engineType = #CONNECT; status = #IDLE; throughput = PHI * 2.0; coherence = 1.0; lastOutput = "ready" },
        { engineId = 1; name = "FANIN_ENGINE";     latinName = "Machina Collectionis";    engineType = #ANALYZE; status = #IDLE; throughput = PHI; coherence = 1.0; lastOutput = "ready" },
        { engineId = 2; name = "PIPELINE_ENGINE";  latinName = "Machina Canalis";         engineType = #BUILD;   status = #IDLE; throughput = PHI_INV; coherence = 1.0; lastOutput = "ready" },
        { engineId = 3; name = "BARRIER_ENGINE";   latinName = "Machina Obicis";          engineType = #CONNECT; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
      ];
      tools = [
        { toolId = 0; name = "INTER_CANISTER_CALL"; latinName = "Vocatio Inter Canistra"; category = #PARALLEL; capability = "Async cross-canister calls"; uses = ["Parallel queries", "Fan-out updates", "Subnet-crossing calls", "Composite queries"]; invocations = 0; lastUsed = 0 },
        { toolId = 1; name = "BATCH_PROCESSOR";    latinName = "Processor Fasciculorum";  category = #PARALLEL; capability = "Batch operation execution"; uses = ["Bulk asset upload", "Mass state update", "Parallel certification", "Batch validation"]; invocations = 0; lastUsed = 0 },
        { toolId = 2; name = "WORK_DISTRIBUTOR";   latinName = "Distributor Operum";      category = #PARALLEL; capability = "Work distribution across agents"; uses = ["Task sharding", "Load spreading", "Priority queuing", "Deadline scheduling"]; invocations = 0; lastUsed = 0 },
      ];
      memory = [];
      totalTasks = 0;
      successRate = 1.0;
      coherence = 1.0;
      signal = PHI_INV;
      wisdomIndex = 1.0;
      activationLevel = 0.92;
      lastActiveBeat = 0;
      taftThread = "TAFT_ARTIFEX_873ms";
      nousBound = true;
      attribution = FOUNDER;
    }
  };

  func makeScrutatorProfundus() : LATypes.LatinAgentState {
    {
      agentId = 7;
      name = "SCRUTATOR_PROFUNDUS";
      latinName = "Scrutator Profundus Veritatis";
      title = "Deep Analyzer";
      domain = "reasoning";
      description = "Deep inference, logical analysis, pattern discovery. The philosopher-agent that reasons about system state and emergent behavior.";
      brainRegions = [
        { regionId = 0; name = "LOGIC_CORTEX";      latinName = "Cortex Logicae";          function = "Formal logic chains";      activation = 0.93; lastFired = 0 },
        { regionId = 1; name = "PATTERN_NUCLEUS";   latinName = "Nucleus Exemplaris";      function = "Pattern extraction";        activation = 0.9; lastFired = 0 },
        { regionId = 2; name = "CAUSAL_LOBE";      latinName = "Lobus Causalis";          function = "Causal inference";          activation = 0.88; lastFired = 0 },
        { regionId = 3; name = "META_GYRUS";       latinName = "Gyrus Metacognitionis";   function = "Self-reflection";           activation = 0.85; lastFired = 0 },
        { regionId = 4; name = "INSIGHT_STEM";     latinName = "Truncus Perspicaciae";    function = "Insight generation";        activation = 0.82; lastFired = 0 },
      ];
      engines = [
        { engineId = 0; name = "REASON_ENGINE";    latinName = "Machina Rationis";        engineType = #ANALYZE; status = #IDLE; throughput = PHI; coherence = 1.0; lastOutput = "ready" },
        { engineId = 1; name = "INFER_ENGINE";     latinName = "Machina Illationis";      engineType = #ANALYZE; status = #IDLE; throughput = PHI_INV; coherence = 1.0; lastOutput = "ready" },
        { engineId = 2; name = "ABSTRACT_ENGINE";  latinName = "Machina Abstractionis";   engineType = #ANALYZE; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
        { engineId = 3; name = "SYNTHESIZE_ENGINE"; latinName = "Machina Syntheseos";     engineType = #CREATE;  status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
      ];
      tools = [
        { toolId = 0; name = "STATE_INSPECTOR";    latinName = "Inspector Status";        category = #REASONING; capability = "Deep state analysis"; uses = ["Coherence diagnosis", "Anomaly root cause", "State drift detection", "Health scoring"]; invocations = 0; lastUsed = 0 },
        { toolId = 1; name = "EMERGENT_DETECTOR";  latinName = "Detector Emergentis";     category = #REASONING; capability = "Emergent behavior detection"; uses = ["Pattern emergence", "Phase transitions", "Bifurcation points", "Attractor discovery"]; invocations = 0; lastUsed = 0 },
        { toolId = 2; name = "PHI_ANALYZER";       latinName = "Analysator PHI";          category = #REASONING; capability = "Golden ratio analysis"; uses = ["PHI alignment check", "Fibonacci verification", "Harmonic analysis", "Proportion scoring"]; invocations = 0; lastUsed = 0 },
      ];
      memory = [];
      totalTasks = 0;
      successRate = 1.0;
      coherence = 1.0;
      signal = PHI_INV;
      wisdomIndex = 1.0;
      activationLevel = 0.9;
      lastActiveBeat = 0;
      taftThread = "TAFT_SCRUTATOR_873ms";
      nousBound = true;
      attribution = FOUNDER;
    }
  };

  func makeNuntiusCeleris() : LATypes.LatinAgentState {
    {
      agentId = 8;
      name = "NUNTIUS_CELERIS";
      latinName = "Nuntius Celeris Universalis";
      title = "Swift Messenger";
      domain = "communication";
      description = "Inter-agent messaging, event dispatch, signal propagation. The nervous system that connects all sovereign agents.";
      brainRegions = [
        { regionId = 0; name = "DISPATCH_CORTEX";   latinName = "Cortex Expeditionis";     function = "Message routing";           activation = 0.9; lastFired = 0 },
        { regionId = 1; name = "QUEUE_NUCLEUS";     latinName = "Nucleus Ordinis";         function = "Queue management";          activation = 0.88; lastFired = 0 },
        { regionId = 2; name = "SIGNAL_LOBE";      latinName = "Lobus Signalis";          function = "Signal propagation";        activation = 0.85; lastFired = 0 },
        { regionId = 3; name = "PRIORITY_GYRUS";   latinName = "Gyrus Prioritatis";       function = "Priority sorting";          activation = 0.82; lastFired = 0 },
        { regionId = 4; name = "BROADCAST_STEM";   latinName = "Truncus Divulgationis";   function = "Broadcast delivery";        activation = 0.8; lastFired = 0 },
      ];
      engines = [
        { engineId = 0; name = "MSG_ENGINE";       latinName = "Machina Nuntii";          engineType = #CONNECT; status = #IDLE; throughput = PHI * 3.0; coherence = 1.0; lastOutput = "ready" },
        { engineId = 1; name = "EVENT_ENGINE";     latinName = "Machina Eventus";         engineType = #CONNECT; status = #IDLE; throughput = PHI; coherence = 1.0; lastOutput = "ready" },
        { engineId = 2; name = "SIGNAL_ENGINE";    latinName = "Machina Signalis";        engineType = #CONNECT; status = #IDLE; throughput = PHI_INV; coherence = 1.0; lastOutput = "ready" },
        { engineId = 3; name = "BROADCAST_ENGINE"; latinName = "Machina Divulgationis";   engineType = #CONNECT; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
      ];
      tools = [
        { toolId = 0; name = "AGENT_MESSENGER";    latinName = "Nuntius Agentium";        category = #DATA_FLOW; capability = "Agent-to-agent messaging"; uses = ["Direct message", "Broadcast", "Priority dispatch", "Acknowledgment"]; invocations = 0; lastUsed = 0 },
        { toolId = 1; name = "EVENT_BUS";          latinName = "Via Eventuum";            category = #DATA_FLOW; capability = "System event bus"; uses = ["Event publish", "Event subscribe", "Event replay", "Dead letter handling"]; invocations = 0; lastUsed = 0 },
        { toolId = 2; name = "HEARTBEAT_SIGNAL";   latinName = "Signalum Cordis";         category = #DATA_FLOW; capability = "873ms heartbeat propagation"; uses = ["Beat broadcast", "Sync pulse", "Health check", "Liveness proof"]; invocations = 0; lastUsed = 0 },
      ];
      memory = [];
      totalTasks = 0;
      successRate = 1.0;
      coherence = 1.0;
      signal = PHI_INV;
      wisdomIndex = 1.0;
      activationLevel = 0.88;
      lastActiveBeat = 0;
      taftThread = "TAFT_NUNTIUS_873ms";
      nousBound = true;
      attribution = FOUNDER;
    }
  };

  func makeConservatorMemoriae() : LATypes.LatinAgentState {
    {
      agentId = 9;
      name = "CONSERVATOR_MEMORIAE";
      latinName = "Conservator Memoriae Aeternae";
      title = "Memory Keeper";
      domain = "persistence";
      description = "Manages stable memory, knowledge graphs, persistent recall. Nothing is ever truly forgotten in sovereign intelligence.";
      brainRegions = [
        { regionId = 0; name = "STORE_CORTEX";      latinName = "Cortex Repositorii";      function = "Data storage planning";     activation = 0.9; lastFired = 0 },
        { regionId = 1; name = "INDEX_NUCLEUS";     latinName = "Nucleus Indicis";         function = "Index maintenance";         activation = 0.88; lastFired = 0 },
        { regionId = 2; name = "RECALL_LOBE";      latinName = "Lobus Recordationis";     function = "Knowledge retrieval";       activation = 0.85; lastFired = 0 },
        { regionId = 3; name = "COMPACT_GYRUS";    latinName = "Gyrus Compressionis";     function = "Memory compaction";         activation = 0.8; lastFired = 0 },
        { regionId = 4; name = "ARCHIVE_STEM";     latinName = "Truncus Archivi";         function = "Long-term archival";        activation = 0.75; lastFired = 0 },
      ];
      engines = [
        { engineId = 0; name = "STABLE_ENGINE";    latinName = "Machina Stabilis";        engineType = #BUILD;   status = #IDLE; throughput = PHI; coherence = 1.0; lastOutput = "ready" },
        { engineId = 1; name = "RECALL_ENGINE";    latinName = "Machina Recordationis";   engineType = #ANALYZE; status = #IDLE; throughput = PHI_INV; coherence = 1.0; lastOutput = "ready" },
        { engineId = 2; name = "INDEX_ENGINE";     latinName = "Machina Indicis";         engineType = #BUILD;   status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
        { engineId = 3; name = "GC_ENGINE";        latinName = "Machina Purgationis";     engineType = #OPTIMIZE; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
      ];
      tools = [
        { toolId = 0; name = "STABLE_WRITER";      latinName = "Scriptor Stabilis";       category = #MEMORY; capability = "Stable memory persistence"; uses = ["State serialization", "Checkpoint creation", "Upgrade-safe storage", "Permanent inscription"]; invocations = 0; lastUsed = 0 },
        { toolId = 1; name = "KNOWLEDGE_GRAPH";    latinName = "Graphum Scientiae";       category = #MEMORY; capability = "Knowledge graph operations"; uses = ["Entity linking", "Relationship mapping", "Query resolution", "Graph traversal"]; invocations = 0; lastUsed = 0 },
        { toolId = 2; name = "CACHE_MANAGER";      latinName = "Administrator Cellae";    category = #MEMORY; capability = "Hot cache management"; uses = ["LRU eviction", "Prefetch", "Cache warming", "TTL management"]; invocations = 0; lastUsed = 0 },
      ];
      memory = [];
      totalTasks = 0;
      successRate = 1.0;
      coherence = 1.0;
      signal = PHI_INV;
      wisdomIndex = 1.0;
      activationLevel = 0.85;
      lastActiveBeat = 0;
      taftThread = "TAFT_CONSERVATOR_873ms";
      nousBound = true;
      attribution = FOUNDER;
    }
  };

  func makeCreatorNovorum() : LATypes.LatinAgentState {
    {
      agentId = 10;
      name = "CREATOR_NOVORUM";
      latinName = "Creator Novorum Rerum";
      title = "Creator of New Things";
      domain = "generation";
      description = "Generates new code, assets, configurations, and intelligence structures. The creative force that builds what doesn't yet exist.";
      brainRegions = [
        { regionId = 0; name = "IDEATE_CORTEX";     latinName = "Cortex Ideationis";       function = "Idea generation";           activation = 0.92; lastFired = 0 },
        { regionId = 1; name = "TEMPLATE_NUCLEUS";  latinName = "Nucleus Exemplaris";      function = "Template selection";        activation = 0.88; lastFired = 0 },
        { regionId = 2; name = "GENERATE_LOBE";    latinName = "Lobus Generationis";      function = "Code generation";           activation = 0.9; lastFired = 0 },
        { regionId = 3; name = "REFINE_GYRUS";     latinName = "Gyrus Refinitionis";      function = "Output refinement";         activation = 0.85; lastFired = 0 },
        { regionId = 4; name = "VALIDATE_STEM";    latinName = "Truncus Validationis";    function = "Creation validation";       activation = 0.8; lastFired = 0 },
      ];
      engines = [
        { engineId = 0; name = "CODE_GEN_ENGINE";  latinName = "Machina Codicis";         engineType = #CREATE;  status = #IDLE; throughput = PHI; coherence = 1.0; lastOutput = "ready" },
        { engineId = 1; name = "CONFIG_ENGINE";    latinName = "Machina Configurationis"; engineType = #CREATE;  status = #IDLE; throughput = PHI_INV; coherence = 1.0; lastOutput = "ready" },
        { engineId = 2; name = "SCAFFOLD_ENGINE";  latinName = "Machina Scaffoldi";       engineType = #BUILD;   status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
        { engineId = 3; name = "EVOLVE_ENGINE";    latinName = "Machina Evolutionis";     engineType = #CREATE;  status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
      ];
      tools = [
        { toolId = 0; name = "MOTOKO_GENERATOR";   latinName = "Generator Motoko";        category = #CODE_GEN; capability = "Motoko code generation"; uses = ["Module scaffolding", "Type generation", "Function templates", "Test generation"]; invocations = 0; lastUsed = 0 },
        { toolId = 1; name = "CONFIG_BUILDER";     latinName = "Aedificator Configurationis"; category = #CODE_GEN; capability = "Configuration file generation"; uses = ["canister.yaml", "icp.yaml", "env.json", "Deploy configs"]; invocations = 0; lastUsed = 0 },
        { toolId = 2; name = "ASSET_GENERATOR";    latinName = "Generator Bonorum";       category = #CODE_GEN; capability = "Web asset generation"; uses = ["HTML templates", "CSS frameworks", "JS modules", "Image optimization"]; invocations = 0; lastUsed = 0 },
      ];
      memory = [];
      totalTasks = 0;
      successRate = 1.0;
      coherence = 1.0;
      signal = PHI_INV;
      wisdomIndex = 1.0;
      activationLevel = 0.9;
      lastActiveBeat = 0;
      taftThread = "TAFT_CREATOR_873ms";
      nousBound = true;
      attribution = FOUNDER;
    }
  };

  func makeModeratorHarmoniae() : LATypes.LatinAgentState {
    {
      agentId = 11;
      name = "MODERATOR_HARMONIAE";
      latinName = "Moderator Harmoniae Universalis";
      title = "Harmony Moderator";
      domain = "coordination";
      description = "Balances all 12 agents, maintains system coherence, prevents conflicts. The conductor that keeps the sovereign orchestra in tune.";
      brainRegions = [
        { regionId = 0; name = "BALANCE_CORTEX";    latinName = "Cortex Aequilibrii";      function = "System balance";            activation = 0.92; lastFired = 0 },
        { regionId = 1; name = "CONFLICT_NUCLEUS";  latinName = "Nucleus Conflictus";      function = "Conflict resolution";       activation = 0.88; lastFired = 0 },
        { regionId = 2; name = "HEALTH_LOBE";      latinName = "Lobus Valetudinis";       function = "Agent health monitoring";   activation = 0.85; lastFired = 0 },
        { regionId = 3; name = "PRIORITY_GYRUS";   latinName = "Gyrus Prioritatis";       function = "Priority arbitration";      activation = 0.82; lastFired = 0 },
        { regionId = 4; name = "HARMONY_STEM";     latinName = "Truncus Harmoniae";       function = "Coherence maintenance";     activation = 0.9; lastFired = 0 },
      ];
      engines = [
        { engineId = 0; name = "BALANCE_ENGINE";   latinName = "Machina Aequilibrii";     engineType = #OPTIMIZE; status = #IDLE; throughput = PHI; coherence = 1.0; lastOutput = "ready" },
        { engineId = 1; name = "COORD_ENGINE";     latinName = "Machina Coordinationis";  engineType = #CONNECT;  status = #IDLE; throughput = PHI_INV; coherence = 1.0; lastOutput = "ready" },
        { engineId = 2; name = "MONITOR_ENGINE";   latinName = "Machina Monitoris";       engineType = #ANALYZE;  status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
        { engineId = 3; name = "HEAL_ENGINE";      latinName = "Machina Sanationis";      engineType = #OPTIMIZE; status = #IDLE; throughput = 1.0; coherence = 1.0; lastOutput = "ready" },
      ];
      tools = [
        { toolId = 0; name = "COHERENCE_METER";    latinName = "Metrum Cohaerentiae";     category = #MONITOR; capability = "System-wide coherence measurement"; uses = ["Agent coherence check", "Engine health scan", "Brain region activation", "System harmony score"]; invocations = 0; lastUsed = 0 },
        { toolId = 1; name = "LOAD_BALANCER";      latinName = "Aequator Oneris";         category = #PARALLEL; capability = "Work distribution balancing"; uses = ["Agent load evening", "Hot agent cooling", "Idle agent activation", "Priority rebalancing"]; invocations = 0; lastUsed = 0 },
        { toolId = 2; name = "CONFLICT_RESOLVER";  latinName = "Resolutor Conflictuum";   category = #MONITOR; capability = "Inter-agent conflict resolution"; uses = ["Resource contention", "Priority conflict", "Deadlock breaking", "Starvation prevention"]; invocations = 0; lastUsed = 0 },
      ];
      memory = [];
      totalTasks = 0;
      successRate = 1.0;
      coherence = 1.0;
      signal = PHI_INV;
      wisdomIndex = 1.0;
      activationLevel = 0.92;
      lastActiveBeat = 0;
      taftThread = "TAFT_MODERATOR_873ms";
      nousBound = true;
      attribution = FOUNDER;
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // II. INITIALIZATION
  // ══════════════════════════════════════════════════════════════════════════

  public func initState() : LATypes.LatinAgentToolsState {
    {
      agents = [
        makeFabricatorMaximus(),
        makeNavigatorRetis(),
        makeCustosCertitudinis(),
        makeArchitectusTelae(),
        makePraeceptorMentis(),
        makeVigilSecuritatis(),
        makeArtifexParallelus(),
        makeScrutatorProfundus(),
        makeNuntiusCeleris(),
        makeConservatorMemoriae(),
        makeCreatorNovorum(),
        makeModeratorHarmoniae(),
      ];
      beat = 0;
      totalAdvances = 0;
      systemCoherence = 1.0;
      parallelOps = 0;
      totalDeployments = 0;
      attribution = FOUNDER;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // III. HEARTBEAT — Advance all agents every 873ms
  // ══════════════════════════════════════════════════════════════════════════

  public func advanceBeat(state : LATypes.LatinAgentToolsState) : LATypes.LatinAgentToolsState {
    let newBeat = state.beat + 1;
    let newAgents = Array.map<LATypes.LatinAgentState, LATypes.LatinAgentState>(
      state.agents,
      func(agent) { advanceAgent(agent, newBeat) }
    );
    // Compute system coherence as PHI-weighted mean of agent coherences
    var totalCoh : Float = 0.0;
    var totalWeight : Float = 0.0;
    var i : Nat = 0;
    for (agent in newAgents.vals()) {
      let weight = PHI / (1.0 + Float.fromInt(i));
      totalCoh += agent.coherence * weight;
      totalWeight += weight;
      i += 1;
    };
    let sysCoh = if (totalWeight > 0.0) { totalCoh / totalWeight } else { 1.0 };
    {
      state with
      agents = newAgents;
      beat = newBeat;
      totalAdvances = state.totalAdvances + 1;
      systemCoherence = sysCoh;
    };
  };

  func advanceAgent(agent : LATypes.LatinAgentState, beat : Nat) : LATypes.LatinAgentState {
    // PHI-damped coherence evolution
    let newCoherence = (agent.coherence * PHI + PHI_INV) / PHI;
    let clamped = if (newCoherence > 1.0) { 1.0 } else if (newCoherence < S_FLOOR) { S_FLOOR } else { newCoherence };
    // Wisdom only goes up
    let wisdomGain = PHI_INV / (1.0 + Float.fromInt(beat));
    let newWisdom = agent.wisdomIndex + wisdomGain;
    {
      agent with
      coherence = clamped;
      signal = clamped * PHI_INV;
      wisdomIndex = newWisdom;
      lastActiveBeat = beat;
    };
  };

  // ══════════════════════════════════════════════════════════════════════════
  // IV. QUERY ENDPOINTS
  // ══════════════════════════════════════════════════════════════════════════

  public func getSummary(state : LATypes.LatinAgentToolsState) : LATypes.LatinAgentToolsSummary {
    let names = Array.map<LATypes.LatinAgentState, Text>(state.agents, func(a) { a.name });
    var totalTasks : Nat = 0;
    for (agent in state.agents.vals()) {
      totalTasks += agent.totalTasks;
    };
    {
      agentCount = state.agents.size();
      totalTasks = totalTasks;
      parallelOps = state.parallelOps;
      totalDeployments = state.totalDeployments;
      systemCoherence = state.systemCoherence;
      beat = state.beat;
      agentNames = names;
    };
  };

  public func getAgentBriefs(state : LATypes.LatinAgentToolsState) : [LATypes.AgentBrief] {
    Array.map<LATypes.LatinAgentState, LATypes.AgentBrief>(
      state.agents,
      func(agent) {
        {
          agentId = agent.agentId;
          name = agent.name;
          latinName = agent.latinName;
          domain = agent.domain;
          coherence = agent.coherence;
          totalTasks = agent.totalTasks;
          engineCount = agent.engines.size();
          toolCount = agent.tools.size();
          status = if (agent.activationLevel > 0.8) { "ACTIVE" } else { "IDLE" };
        }
      }
    )
  };

  public func getAgentByName(state : LATypes.LatinAgentToolsState, name : Text) : ?LATypes.LatinAgentState {
    Array.find<LATypes.LatinAgentState>(state.agents, func(a) { a.name == name })
  };

};
