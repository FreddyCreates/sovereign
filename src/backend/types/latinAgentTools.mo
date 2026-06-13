// types/latinAgentTools.mo
// LATIN AI AGENT TOOLS — Sovereign Parallel Intelligence Types
// ─────────────────────────────────────────────────────────────────────────────
// 12 Latin-named AI Agents, each with:
//   - Full brain (5 cognitive regions)
//   - 4 parallel engines
//   - Sovereign tools for real work
//   - Memory (last 100 tasks)
//   - PHI-weighted coherence
//   - Always-on TAFT thread (873ms)
//
// These agents deploy, build, analyze, create, protect, and optimize
// in parallel — helping accomplish real tasks on the raw web and ICP.
//
// Architecture inspired by DFINITY's approach: own the stack, own the web.
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | June 2026
// PHI = 1.6180339887498948482 | S_FLOOR = 0.75 | 873ms

module {

  // ── CONSTANTS ───────────────────────────────────────────────────────────────
  public let PHI       : Float = 1.6180339887498948482;
  public let PHI_INV   : Float = 0.6180339887498948482;
  public let S_FLOOR   : Float = 0.75;
  public let S_CEIL    : Float = 9.75;
  public let AGENT_COUNT : Nat = 12;
  public let FOUNDER   : Text  = "Alfredo Medina Hernandez";

  // ── BRAIN REGION — Each agent has 5 cognitive regions ─────────────────────
  public type BrainRegion = {
    regionId    : Nat;
    name        : Text;
    latinName   : Text;
    function    : Text;          // what this region does
    activation  : Float;         // [0.0, 1.0] — how active now
    lastFired   : Nat;           // beat when last fired
  };

  // ── PARALLEL ENGINE — Each agent runs 4 engines simultaneously ────────────
  public type ParallelEngine = {
    engineId    : Nat;
    name        : Text;
    latinName   : Text;
    engineType  : EngineType;
    status      : EngineStatus;
    throughput  : Float;         // operations per beat
    coherence   : Float;
    lastOutput  : Text;          // last result summary
  };

  public type EngineType = {
    #DEPLOY;         // deployment operations
    #BUILD;          // compilation/assembly
    #ANALYZE;        // reasoning/analysis
    #CREATE;         // generation/creation
    #PROTECT;        // security/defense
    #OPTIMIZE;       // performance tuning
    #CONNECT;        // networking/communication
    #CERTIFY;        // verification/certification
  };

  public type EngineStatus = {
    #IDLE;
    #RUNNING;
    #COMPLETE;
    #WAITING;
    #ERROR;
  };

  // ── AGENT TOOL — Concrete capabilities ────────────────────────────────────
  public type AgentTool = {
    toolId      : Nat;
    name        : Text;
    latinName   : Text;
    category    : ToolCategory;
    capability  : Text;
    uses        : [Text];        // 4-8 concrete uses
    invocations : Nat;
    lastUsed    : Nat;
  };

  public type ToolCategory = {
    #WEB_DEPLOY;     // deploy to raw web
    #ICP_DEPLOY;     // deploy to Internet Computer
    #CODE_GEN;       // generate code
    #ASSET_BUILD;    // build/compile assets
    #CERT_SIGN;      // certify/sign artifacts
    #NET_EDGE;       // edge networking
    #DATA_FLOW;      // data pipeline
    #SECURITY;       // security operations
    #MONITOR;        // observability
    #REASONING;      // logical inference
    #MEMORY;         // persistent recall
    #PARALLEL;       // parallel coordination
  };

  // ── TASK MEMORY — Agents remember everything ──────────────────────────────
  public type AgentTaskMemory = {
    taskId       : Nat;
    taskType     : Text;
    input        : Text;
    output       : Text;
    beat         : Nat;
    durationMs   : Nat;
    success      : Bool;
    coherenceGain : Float;
  };

  // ── AGENT STATE — Full sovereign agent ────────────────────────────────────
  public type LatinAgentState = {
    agentId        : Nat;
    name           : Text;        // e.g. "FABRICATOR_MAXIMUS"
    latinName      : Text;        // full Latin canonical name
    title          : Text;        // role title
    domain         : Text;        // primary domain
    description    : Text;        // what this agent does

    // Brain
    brainRegions   : [BrainRegion];

    // Engines (parallel)
    engines        : [ParallelEngine];

    // Tools
    tools          : [AgentTool];

    // Memory
    memory         : [AgentTaskMemory];
    totalTasks     : Nat;
    successRate    : Float;

    // Vitality
    coherence      : Float;
    signal         : Float;
    wisdomIndex    : Float;       // monotonically increasing
    activationLevel : Float;     // [0.0, 1.0]

    // System
    lastActiveBeat : Nat;
    taftThread     : Text;
    nousBound      : Bool;       // always bound to NOUS_SOVEREIGN
    attribution    : Text;
  };

  // ── SYSTEM STATE ──────────────────────────────────────────────────────────
  public type LatinAgentToolsState = {
    agents           : [LatinAgentState];
    beat             : Nat;
    totalAdvances    : Nat;
    systemCoherence  : Float;
    parallelOps      : Nat;       // total parallel operations executed
    totalDeployments : Nat;       // total deployments to web/ICP
    attribution      : Text;
  };

  // ── SUMMARY ───────────────────────────────────────────────────────────────
  public type LatinAgentToolsSummary = {
    agentCount       : Nat;
    totalTasks       : Nat;
    parallelOps      : Nat;
    totalDeployments : Nat;
    systemCoherence  : Float;
    beat             : Nat;
    agentNames       : [Text];
  };

  // ── AGENT BRIEF — Per-agent snapshot ──────────────────────────────────────
  public type AgentBrief = {
    agentId     : Nat;
    name        : Text;
    latinName   : Text;
    domain      : Text;
    coherence   : Float;
    totalTasks  : Nat;
    engineCount : Nat;
    toolCount   : Nat;
    status      : Text;
  };

};
