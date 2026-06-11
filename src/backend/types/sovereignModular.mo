// types/sovereignModular.mo
// Sovereign Modular Architecture — Type Definitions
// Implements the 11 Strategic Pillars of Sovereign AI as composable modules.
// Attribution: Alfredo Medina Hernandez — immutable

module {

  // ── PILLAR IDENTIFIERS ─────────────────────────────────────────────────
  // Each pillar represents a discrete, self-contained domain of sovereignty.
  public type PillarId = {
    #DataSovereignty;
    #InfrastructureControl;
    #ModelOwnership;
    #GovernanceValues;
    #Resilience;
    #ComputeInfrastructure;
    #EnergySustainability;
    #DatasetsModels;
    #TalentEcosystem;
    #HybridCollaboration;
    #SecurityInteroperability;
  };

  // ── MODULE STATUS ──────────────────────────────────────────────────────
  public type ModuleStatus = {
    #Active;
    #Dormant;
    #Bootstrapping;
    #Degraded;
    #Sealed;
  };

  // ── SOVEREIGNTY TIER ───────────────────────────────────────────────────
  // Platonic-resonance-aligned access level for each module.
  public type SovereigntyTier = {
    #Foundation;    // 174 Hz — base layer, read-only
    #Operational;   // 396 Hz — standard operations
    #Strategic;     // 528 Hz — transformation-level access
    #Architectural; // 741 Hz — structural modification
    #Governance;    // 852 Hz — policy and oversight
    #Sovereign;     // 963 Hz — full autonomous control
  };

  // ── MODULAR PILLAR STATE ───────────────────────────────────────────────
  // Each pillar maintains its own coherence, capacity, and doctrine alignment.
  public type PillarState = {
    id              : PillarId;
    name            : Text;
    description     : Text;
    status          : ModuleStatus;
    tier            : SovereigntyTier;
    coherence       : Float;   // [0.0 .. 1.0] — pillar internal coherence
    capacity        : Float;   // [0.0 .. 1.0] — utilization / readiness
    doctrineScore   : Float;   // [0.75 .. 9.75] — sovereign range
    dependencies    : [PillarId]; // pillars this module depends on
    lastTickBeat    : Nat;
    activeSince     : Nat;
    sealCount       : Nat;     // immutable attestations emitted
  };

  // ── MODULE INTERFACE DEFINITION ────────────────────────────────────────
  // Describes a composable interface that modules expose to the mesh.
  public type ModuleInterface = {
    pillarId    : PillarId;
    endpoints   : [Text];      // exported function names
    events      : [Text];      // events this module can emit
    consumes    : [Text];      // events this module listens to
    version     : Text;        // semantic version
  };

  // ── INTER-MODULE LINK ──────────────────────────────────────────────────
  // A directed connection between two pillars for data/signal flow.
  public type ModuleLink = {
    source       : PillarId;
    target       : PillarId;
    linkType     : { #DataFlow; #Signal; #Governance; #Dependency };
    strength     : Float;  // [0.0 .. 1.0] — coupling strength
    bidirectional : Bool;
    activeSince  : Nat;
  };

  // ── MODULAR MESH STATE ─────────────────────────────────────────────────
  // The top-level state for the entire modular sovereign architecture.
  public type SovereignModularState = {
    pillars          : [PillarState];
    links            : [ModuleLink];
    interfaces       : [ModuleInterface];
    globalCoherence  : Float;    // φ-weighted average of all pillar coherences
    meshResilience   : Float;    // redundancy / fault-tolerance score
    totalModules     : Nat;
    activeModules    : Nat;
    lastHeartbeat    : Nat;
    genesisbeat      : Nat;
    sealedAt         : Int;      // timestamp
  };

  // ── MODULAR SNAPSHOT ───────────────────────────────────────────────────
  // Lightweight read for frontend dashboards.
  public type ModularSnapshot = {
    globalCoherence  : Float;
    meshResilience   : Float;
    totalModules     : Nat;
    activeModules    : Nat;
    pillarSummaries  : [PillarSummary];
    lastHeartbeat    : Nat;
  };

  public type PillarSummary = {
    id         : PillarId;
    name       : Text;
    status     : ModuleStatus;
    coherence  : Float;
    capacity   : Float;
    tier       : SovereigntyTier;
  };

  // ── MODULAR METRICS ────────────────────────────────────────────────────
  public type ModularMetrics = {
    totalLinks           : Nat;
    averageCoherence     : Float;
    averageCapacity      : Float;
    weakestPillar        : Text;
    strongestPillar      : Text;
    totalSeals           : Nat;
    meshDensity          : Float;  // links / max_possible_links
    autonomyIndex        : Float;  // 1.0 = fully sovereign, 0.0 = fully dependent
  };

  // ── PILLAR REGISTRATION ────────────────────────────────────────────────
  // Used when dynamically registering or upgrading a module.
  public type PillarRegistration = {
    id          : PillarId;
    name        : Text;
    description : Text;
    tier        : SovereigntyTier;
    endpoints   : [Text];
    events      : [Text];
    consumes    : [Text];
    version     : Text;
    dependencies : [PillarId];
  };

}
