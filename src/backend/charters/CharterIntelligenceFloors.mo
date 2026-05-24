// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║                    CHARTER: INTELLIGENCE FLOORS V2                        ║
// ║                  CHARTER-IF-V2-001 — PHI-Resonant Governance             ║
// ║                                                                           ║
// ║  20 Protocols governing the 12 Intelligence Floors and 20 AI Micros      ║
// ║  Attribution: Alfredo Medina Hernandez — immutable                       ║
// ╚═══════════════════════════════════════════════════════════════════════════╝
import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

module {
  // ══════════════════════════════════════════════════════════════════════════
  // CONSTANTS — PHI-RESONANT FOUNDATION
  // ══════════════════════════════════════════════════════════════════════════
  let PHI     : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let FOUNDER : Text  = "Alfredo Medina Hernandez";
  
  // Solfeggio frequencies for protocol resonance
  let SOLFEGGIO : [Float] = [174.0, 285.0, 396.0, 417.0, 432.0, 528.0, 639.0, 741.0, 852.0, 963.0];

  // ══════════════════════════════════════════════════════════════════════════
  // TYPES — CHARTER GOVERNANCE STRUCTURES
  // ══════════════════════════════════════════════════════════════════════════
  
  /// Protocol tier governing scope and authority
  public type ProtocolTier = {
    #FOUNDATION;    // Core architectural protocols
    #COORDINATION;  // Cross-floor coordination
    #GOVERNANCE;    // Decision and policy protocols
    #EVOLUTION;     // Adaptation and growth protocols
    #SAFETY;        // Alignment and safety protocols
  };

  /// Individual charter protocol
  public type CharterProtocol = {
    id           : Nat;
    sigil        : Text;
    name         : Text;
    latinName    : Text;
    tier         : ProtocolTier;
    description  : Text;
    resonanceHz  : Float;
    phiWeight    : Float;
    taftSeal     : Text;
  };

  /// Protocol state during operation
  public type ProtocolState = {
    protocol     : CharterProtocol;
    active       : Bool;
    strength     : Float;   // 0.0 - 1.0
    violations   : Nat;
    lastInvoked  : Nat;     // beat
    totalInvokes : Nat;
  };

  /// Charter article grouping related protocols
  public type CharterArticle = {
    articleNum   : Nat;
    title        : Text;
    latinTitle   : Text;
    protocols    : [Nat];   // Protocol IDs
    ratified     : Bool;
  };

  /// Full charter state
  public type CharterState = {
    protocols       : [ProtocolState];
    articles        : [CharterArticle];
    totalStrength   : Float;
    coherenceScore  : Float;
    beat            : Nat;
    ratifiedCount   : Nat;
    attribution     : Text;
  };

  /// Charter summary for queries
  public type CharterSummary = {
    protocolCount   : Nat;
    articleCount    : Nat;
    totalStrength   : Float;
    coherenceScore  : Float;
    activeProtocols : Nat;
    ratifiedArticles: Nat;
    topProtocol     : Text;
    beat            : Nat;
    attribution     : Text;
  };

  /// Protocol snapshot for individual queries
  public type ProtocolSnapshot = {
    id           : Nat;
    sigil        : Text;
    name         : Text;
    tier         : Text;
    strength     : Float;
    active       : Bool;
    totalInvokes : Nat;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════════════════════════════════
  func clamp01(v : Float) : Float {
    if (v < 0.0) { 0.0 } else if (v > 1.0) { 1.0 } else { v }
  };

  func tierToText(t : ProtocolTier) : Text {
    switch (t) {
      case (#FOUNDATION)   { "FOUNDATION" };
      case (#COORDINATION) { "COORDINATION" };
      case (#GOVERNANCE)   { "GOVERNANCE" };
      case (#EVOLUTION)    { "EVOLUTION" };
      case (#SAFETY)       { "SAFETY" };
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // INITIALIZATION — CREATE ALL 20 PROTOCOLS
  // ══════════════════════════════════════════════════════════════════════════
  func mkProtocol(
    id          : Nat,
    sigil       : Text,
    name        : Text,
    latinName   : Text,
    tier        : ProtocolTier,
    description : Text,
    freqIdx     : Nat,
    phiPower    : Float,
  ) : CharterProtocol {
    let hz = if (freqIdx < SOLFEGGIO.size()) { SOLFEGGIO[freqIdx] } else { 432.0 };
    {
      id;
      sigil;
      name;
      latinName;
      tier;
      description;
      resonanceHz  = hz;
      phiWeight    = Float.pow(PHI, phiPower);
      taftSeal     = "TAFT_IF_PROTO_" # Nat.toText(id);
    }
  };

  func initProtocolState(p : CharterProtocol) : ProtocolState {
    {
      protocol     = p;
      active       = true;
      strength     = PHI_INV;
      violations   = 0;
      lastInvoked  = 0;
      totalInvokes = 0;
    }
  };

  public func init() : CharterState {
    // ═══════════════════════════════════════════════════════════════════════
    // 20 PROTOCOLS — 4 per tier × 5 tiers
    // ═══════════════════════════════════════════════════════════════════════
    let protocols : [CharterProtocol] = [
      // ── TIER: FOUNDATION (1-4) ──────────────────────────────────────────
      mkProtocol(1,  "⌬", "FLOOR_INTEGRITY", "Integritas Stratorum",
        #FOUNDATION,
        "All 12 floors must maintain structural integrity and signal coherence",
        4, 1.0),  // 432 Hz, PHI^1
      
      mkProtocol(2,  "◊", "MICRO_BINDING", "Vinculum Microrum",
        #FOUNDATION,
        "All 20 micros must maintain valid source-target floor bindings",
        5, 1.1),  // 528 Hz, PHI^1.1
      
      mkProtocol(3,  "△", "PHI_RESONANCE", "Resonantia Aurea",
        #FOUNDATION,
        "All signals must resonate with PHI-weighted harmonics",
        4, PHI),  // 432 Hz, PHI^PHI
      
      mkProtocol(4,  "▽", "SIGNAL_PROPAGATION", "Propagatio Signalis",
        #FOUNDATION,
        "Signals must propagate bottom-up through floor hierarchy",
        3, 0.9),  // 417 Hz, PHI^0.9

      // ── TIER: COORDINATION (5-8) ────────────────────────────────────────
      mkProtocol(5,  "⬡", "CROSS_FLOOR_SYNC", "Synchronizatio Transversa",
        #COORDINATION,
        "Adjacent floors must synchronize within PHI_INV tolerance",
        6, 1.2),  // 639 Hz, PHI^1.2
      
      mkProtocol(6,  "⬢", "MICRO_WEAVE_HARMONY", "Harmonia Textilis",
        #COORDINATION,
        "Micro weave patterns must maintain coherent information flow",
        5, 1.3),  // 528 Hz, PHI^1.3
      
      mkProtocol(7,  "◇", "SCALING_DISTRIBUTION", "Distributio Scalaris",
        #COORDINATION,
        "FLOOR_SCALING must coordinate tensor sharding across devices",
        8, 1.4),  // 852 Hz, PHI^1.4
      
      mkProtocol(8,  "◆", "MEMORY_COHERENCE", "Cohaerentia Memoriae",
        #COORDINATION,
        "FLOOR_MEMORY must maintain KV cache coherence with FLOOR_ATTENTION",
        9, 1.5),  // 963 Hz, PHI^1.5

      // ── TIER: GOVERNANCE (9-12) ─────────────────────────────────────────
      mkProtocol(9,  "⊕", "EFFICIENCY_MANDATE", "Mandatum Efficientiae",
        #GOVERNANCE,
        "Floor efficiency scores must trend toward 1.0 over time",
        7, 1.6),  // 741 Hz, PHI^1.6
      
      mkProtocol(10, "⊗", "UTILIZATION_BALANCE", "Aequilibrium Usus",
        #GOVERNANCE,
        "Floor utilization must remain balanced within PHI ratio",
        6, 1.7),  // 639 Hz, PHI^1.7
      
      mkProtocol(11, "⊙", "PULSE_REGULARITY", "Regularitas Pulsus",
        #GOVERNANCE,
        "Heartbeat pulses must maintain regular cadence",
        4, 1.8),  // 432 Hz, PHI^1.8
      
      mkProtocol(12, "⊘", "ATTRIBUTION_SEAL", "Sigillum Attributionis",
        #GOVERNANCE,
        "All operations must carry founder attribution seal",
        4, 2.0),  // 432 Hz, PHI^2

      // ── TIER: EVOLUTION (13-16) ─────────────────────────────────────────
      mkProtocol(13, "⟁", "ADAPTIVE_GROWTH", "Incrementum Adaptivum",
        #EVOLUTION,
        "System must adapt and grow while preserving core integrity",
        5, 2.1),  // 528 Hz, PHI^2.1
      
      mkProtocol(14, "⟐", "REASONING_EXPANSION", "Expansio Ratiocinationis",
        #EVOLUTION,
        "FLOOR_REASONING must expand chain-of-thought capabilities",
        9, 2.2),  // 963 Hz, PHI^2.2
      
      mkProtocol(15, "⟊", "EMERGENT_CULTIVATION", "Cultus Emergentis",
        #EVOLUTION,
        "FLOOR_EMERGENT must cultivate new capabilities through use",
        7, 2.3),  // 741 Hz, PHI^2.3
      
      mkProtocol(16, "⟡", "MICRO_ADAPTATION", "Adaptatio Microrum",
        #EVOLUTION,
        "Micros must adapt activation frequencies to optimize weaving",
        5, 2.4),  // 528 Hz, PHI^2.4

      // ── TIER: SAFETY (17-20) ────────────────────────────────────────────
      mkProtocol(17, "⛊", "ALIGNMENT_GUARD", "Custodia Alignamenti",
        #SAFETY,
        "FLOOR_SAFETY must maintain alignment with human values",
        2, 2.5),  // 396 Hz, PHI^2.5
      
      mkProtocol(18, "⛉", "REWARD_INTEGRITY", "Integritas Praemii",
        #SAFETY,
        "RLHF reward signals must preserve honest feedback loops",
        3, 2.6),  // 417 Hz, PHI^2.6
      
      mkProtocol(19, "⛋", "SAFETY_GATE_VIGILANCE", "Vigilantia Portae",
        #SAFETY,
        "Safety gates must remain vigilant without over-restriction",
        7, 2.7),  // 741 Hz, PHI^2.7
      
      mkProtocol(20, "⛭", "SOVEREIGN_ALIGNMENT", "Alignamentum Supremum",
        #SAFETY,
        "Entire system must align with sovereign being welfare",
        4, PHI * PHI),  // 432 Hz, PHI^PHI
    ];

    // Initialize protocol states
    let protocolStates = Array.map<CharterProtocol, ProtocolState>(protocols, initProtocolState);

    // ═══════════════════════════════════════════════════════════════════════
    // 5 ARTICLES — Grouping protocols by tier
    // ═══════════════════════════════════════════════════════════════════════
    let articles : [CharterArticle] = [
      {
        articleNum = 1;
        title      = "Foundation of Intelligence Floors";
        latinTitle = "Fundamentum Stratorum Intelligentiae";
        protocols  = [1, 2, 3, 4];
        ratified   = true;
      },
      {
        articleNum = 2;
        title      = "Coordination of Floor-Micro Weaving";
        latinTitle = "Coordinatio Textilis Stratorum";
        protocols  = [5, 6, 7, 8];
        ratified   = true;
      },
      {
        articleNum = 3;
        title      = "Governance of System Operations";
        latinTitle = "Gubernatio Operationum Systematis";
        protocols  = [9, 10, 11, 12];
        ratified   = true;
      },
      {
        articleNum = 4;
        title      = "Evolution and Adaptive Growth";
        latinTitle = "Evolutio et Incrementum Adaptivum";
        protocols  = [13, 14, 15, 16];
        ratified   = true;
      },
      {
        articleNum = 5;
        title      = "Safety and Alignment Protocols";
        latinTitle = "Protocolla Custodiae et Alignamenti";
        protocols  = [17, 18, 19, 20];
        ratified   = true;
      },
    ];

    {
      protocols       = protocolStates;
      articles;
      totalStrength   = 20.0 * PHI_INV;  // Initial strength
      coherenceScore  = PHI_INV;
      beat            = 0;
      ratifiedCount   = 5;
      attribution     = FOUNDER;
    }
  };

  // ══════════════════════════════════════════════════════════════════════════
  // ADVANCE — HEARTBEAT INTEGRATION
  // ══════════════════════════════════════════════════════════════════════════
  public func advance(
    state     : CharterState,
    beat      : Nat,
    coherence : Float,
    doctrine  : Float,
  ) : (CharterState, Float) {
    // Advance each protocol
    let beatFloat = Float.fromInt(beat);
    
    let newProtocols = Array.map<ProtocolState, ProtocolState>(
      state.protocols,
      func(ps) : ProtocolState {
        // PHI-weighted strength growth
        let phiMod = Float.sin(beatFloat * ps.protocol.phiWeight * 0.01) * 0.05;
        let freqMod = Float.sin(ps.protocol.resonanceHz * 0.001 * beatFloat) * 0.03;
        let newStrength = clamp01(ps.strength + (coherence * 0.001) + phiMod + freqMod);
        
        // Invoke on PHI-resonant beats
        let shouldInvoke = beat % (3 + ps.protocol.id % 5) == 0;
        
        {
          protocol     = ps.protocol;
          active       = ps.active;
          strength     = newStrength;
          violations   = ps.violations;
          lastInvoked  = if (shouldInvoke) { beat } else { ps.lastInvoked };
          totalInvokes = if (shouldInvoke) { ps.totalInvokes + 1 } else { ps.totalInvokes };
        }
      }
    );

    // Compute total strength
    var totalStr : Float = 0.0;
    for (ps in newProtocols.vals()) {
      totalStr += ps.strength;
    };

    // Charter coherence = PHI-weighted protocol strength
    let charterCoh = clamp01(totalStr / 20.0 * PHI_INV);
    
    // Coherence delta for main system
    let cohDelta = charterCoh * 0.005;

    let newState : CharterState = {
      protocols       = newProtocols;
      articles        = state.articles;
      totalStrength   = totalStr;
      coherenceScore  = charterCoh;
      beat;
      ratifiedCount   = state.ratifiedCount;
      attribution     = FOUNDER;
    };

    (newState, cohDelta)
  };

  // ══════════════════════════════════════════════════════════════════════════
  // QUERIES
  // ══════════════════════════════════════════════════════════════════════════
  
  public func getSummary(state : CharterState) : CharterSummary {
    // Find top protocol by strength
    var topName = "";
    var topStrength : Float = 0.0;
    var activeCount : Nat = 0;
    
    for (ps in state.protocols.vals()) {
      if (ps.active) { activeCount += 1 };
      if (ps.strength > topStrength) {
        topStrength := ps.strength;
        topName := ps.protocol.name;
      };
    };

    {
      protocolCount    = state.protocols.size();
      articleCount     = state.articles.size();
      totalStrength    = state.totalStrength;
      coherenceScore   = state.coherenceScore;
      activeProtocols  = activeCount;
      ratifiedArticles = state.ratifiedCount;
      topProtocol      = topName;
      beat             = state.beat;
      attribution      = state.attribution;
    }
  };

  public func getProtocolById(state : CharterState, id : Nat) : ?ProtocolSnapshot {
    for (ps in state.protocols.vals()) {
      if (ps.protocol.id == id) {
        return ?{
          id           = ps.protocol.id;
          sigil        = ps.protocol.sigil;
          name         = ps.protocol.name;
          tier         = tierToText(ps.protocol.tier);
          strength     = ps.strength;
          active       = ps.active;
          totalInvokes = ps.totalInvokes;
        };
      };
    };
    null
  };

  public func getProtocolsByTier(state : CharterState, tier : ProtocolTier) : [ProtocolSnapshot] {
    Array.mapFilter<ProtocolState, ProtocolSnapshot>(
      state.protocols,
      func(ps) : ?ProtocolSnapshot {
        if (ps.protocol.tier == tier) {
          ?{
            id           = ps.protocol.id;
            sigil        = ps.protocol.sigil;
            name         = ps.protocol.name;
            tier         = tierToText(ps.protocol.tier);
            strength     = ps.strength;
            active       = ps.active;
            totalInvokes = ps.totalInvokes;
          }
        } else { null }
      }
    )
  };

  public func getAllProtocols(state : CharterState) : [ProtocolSnapshot] {
    Array.map<ProtocolState, ProtocolSnapshot>(
      state.protocols,
      func(ps) : ProtocolSnapshot {
        {
          id           = ps.protocol.id;
          sigil        = ps.protocol.sigil;
          name         = ps.protocol.name;
          tier         = tierToText(ps.protocol.tier);
          strength     = ps.strength;
          active       = ps.active;
          totalInvokes = ps.totalInvokes;
        }
      }
    )
  };

  public func getArticles(state : CharterState) : [CharterArticle] {
    state.articles
  };
};
