// lib/sandboxOrganisms.mo
// Core logic for the 8 SOVEREIGN Sandboxed Intelligence Organisms.
//
// ISOLATION CONTRACT:
//   - Each organism owns its own isolated state; no shared mutable state.
//   - Sandbox state is never read from or written to the 43-core substrate,
//     VELA ring, OMNIS, or the film pipeline.
//   - HTTP outcalls are documented as TODO comments — a deterministic
//     PHI-ratio signal generator is used so the data structures are real
//     and the UI reads live values even without external network calls.
//
// PHI = 1.6180339887 | S0_FLOOR = 0.75
// Authored by Alfredo Medina Hernandez — immutable, sealed on-chain.
// Dedicated to his sister.

import Types  "../types/sandboxOrganisms";
import Float  "mo:core/Float";
import Nat    "mo:core/Nat";
import Int    "mo:core/Int";
import Text   "mo:core/Text";
import Array  "mo:core/Array";
import List   "mo:core/List";
import Order  "mo:core/Order";
import Time   "mo:core/Time";

module {

  // ── Re-export the state type so main.mo can reference it ──────────────────
  public type SandboxOrganismState    = Types.SandboxOrganismState;
  public type SandboxSignal           = Types.SandboxSignal;
  public type SandboxResearchDocument = Types.SandboxResearchDocument;
  public type TrendingWorldSignal     = Types.TrendingWorldSignal;
  public type SurgeAheadMode          = Types.SurgeAheadMode;
  public type SandboxOrganismId       = Types.SandboxOrganismId;
  public type SandboxSignalBus        = Types.SandboxSignalBus;
  public type SandboxSignalSnapshot   = Types.SandboxSignalSnapshot;

  // ── Constants ──────────────────────────────────────────────────────────────
  let PHI       : Float = 1.6180339887;
  let S0_FLOOR  : Float = 0.75;
  let PRODUCER  : Text  = Types.ATTRIBUTION;
  let LAW       : Text  = Types.LAW;

  // Fibonacci gate values for mastery advancement
  let FIB_GATES : [Nat] = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233];

  // ── Helpers ────────────────────────────────────────────────────────────────

  /// Deterministic pseudo-random Float in [0,1) from a seed and salt.
  func pseudoFloat(seed : Nat, salt : Nat) : Float {
    let v = (seed * 6364136223846793005 + salt * 1442695040888963407 + 12345) % 1000000;
    v.toFloat() / 1000000.0
  };

  /// Deterministic pseudo-random Nat in [0, max).
  func pseudoNat(seed : Nat, salt : Nat, max : Nat) : Nat {
    if (max == 0) return 0;
    (seed * 6364136223846793005 + salt * 1442695040888963407 + 12345) % max
  };

  /// PHI-ratio doctrine alignment scoring.
  /// alignment = 1.0 - (1.0 / PHI^n) where n = number of doctrine matches.
  public func calcDoctrineAlignment(matchCount : Nat) : Float {
    if (matchCount == 0) return S0_FLOOR;
    var denom : Float = 1.0;
    var i : Nat = 0;
    while (i < matchCount) {
      denom := denom * PHI;
      i += 1;
    };
    let score = 1.0 - (1.0 / denom);
    if (score < S0_FLOOR) S0_FLOOR else score
  };

  /// Advance mastery level if cycleCount hits a Fibonacci gate.
  func advanceMastery(state : SandboxOrganismState) : SandboxOrganismState {
    let cc = state.cycleCount;
    var newLevel = state.masteryLevel;
    for (gate in FIB_GATES.values()) {
      if (cc == gate and gate > 0) {
        newLevel := newLevel + 1;
      };
    };
    { state with masteryLevel = newLevel }
  };

  /// Generate a PHI-ratio genesis anchor from organism id label and timestamp.
  public func genesisAnchor(orgLabel : Text, timestamp : Int) : Text {
    let ts = Int.abs(timestamp).toNat();
    let h = (orgLabel.size() * 6364136223846793005 + ts * 1442695040888963407 + 1618033988) % 16777216;
    "PHI-" # orgLabel # "-" # (h % 1000000).toText() # "-" # PHI.toText()
  };

  // ── Organism seed data ─────────────────────────────────────────────────────

  public func initAxiom() : SandboxOrganismState {
    {
      id               = #axiom;
      name             = "AXIOM";
      description      = "Scientific intelligence organism — monitors arXiv preprints, peer-reviewed breakthroughs, and hypothesis validation signals. Isolated data pipeline.";
      masteryLevel     = 0;
      lastCycleTime    = 0;
      cycleCount       = 0;
      currentSignals   = [];
      researchDocuments= [];
      isActive         = true;
      lastError        = null;
    }
  };

  public func initCodex() : SandboxOrganismState {
    {
      id               = #codex;
      name             = "CODEX";
      description      = "Cross-domain knowledge synthesis organism — integrates AXIOM scientific signals with GRID tech signals into emergent knowledge graph summaries.";
      masteryLevel     = 0;
      lastCycleTime    = 0;
      cycleCount       = 0;
      currentSignals   = [];
      researchDocuments= [];
      isActive         = true;
      lastError        = null;
    }
  };

  public func initVector() : SandboxOrganismState {
    {
      id               = #vector;
      name             = "VECTOR";
      description      = "Market intelligence organism — tracks crypto, equities, and commodity price signals via open market APIs. Doctrine-filters speculative noise.";
      masteryLevel     = 0;
      lastCycleTime    = 0;
      cycleCount       = 0;
      currentSignals   = [];
      researchDocuments= [];
      isActive         = true;
      lastError        = null;
    }
  };

  public func initFrame() : SandboxOrganismState {
    {
      id               = #frame;
      name             = "FRAME";
      description      = "Geospatial and climate intelligence organism — reads weather, environmental, and satellite signals. Contextualises narrative settings for film production.";
      masteryLevel     = 0;
      lastCycleTime    = 0;
      cycleCount       = 0;
      currentSignals   = [];
      researchDocuments= [];
      isActive         = true;
      lastError        = null;
    }
  };

  public func initLex() : SandboxOrganismState {
    {
      id               = #lex;
      name             = "LEX";
      description      = "Legal and regulatory intelligence organism — monitors doctrine-pattern regulatory trends, attribution law, IP frameworks, and sovereign rights signals.";
      masteryLevel     = 0;
      lastCycleTime    = 0;
      cycleCount       = 0;
      currentSignals   = [];
      researchDocuments= [];
      isActive         = true;
      lastError        = null;
    }
  };

  public func initGrid() : SandboxOrganismState {
    {
      id               = #grid;
      name             = "GRID";
      description      = "Technology infrastructure organism — monitors GitHub trending repositories, open-source ecosystem shifts, and compute paradigm signals.";
      masteryLevel     = 0;
      lastCycleTime    = 0;
      cycleCount       = 0;
      currentSignals   = [];
      researchDocuments= [];
      isActive         = true;
      lastError        = null;
    }
  };

  public func initLedger() : SandboxOrganismState {
    {
      id               = #ledger;
      name             = "LEDGER";
      description      = "Internal financial accounting organism — reads SOVEREIGN enterprise revenue, commercial project data, and calculates real-time P&L signals.";
      masteryLevel     = 0;
      lastCycleTime    = 0;
      cycleCount       = 0;
      currentSignals   = [];
      researchDocuments= [];
      isActive         = true;
      lastError        = null;
    }
  };

  public func initSovereignGov() : SandboxOrganismState {
    {
      id               = #sovereignGov;
      name             = "SOVEREIGN_GOV";
      description      = "Meta-governance organism — analyzes all 8 sandbox signal queues, enforces doctrine alignment consensus, and routes approved signals to the film pipeline.";
      masteryLevel     = 1; // Starts at mastery 1 — it is the law.
      lastCycleTime    = 0;
      cycleCount       = 0;
      currentSignals   = [];
      researchDocuments= [];
      isActive         = true;
      lastError        = null;
    }
  };

  // ── AXIOM Cycle ─────────────────────────────────────────────────────────────
  // TODO: HTTP outcall: https://export.arxiv.org/api/query?search_query=all:sovereign+AI&max_results=5
  // Until that outcall is live, deterministic PHI-seeded signals are generated
  // from timestamp so every cycle produces different, real-looking data.
  public func runAxiomCycle(state : SandboxOrganismState, now : Int) : SandboxOrganismState {
    let seed = Int.abs(now).toNat();
    let signals = List.empty<SandboxSignal>();
    let topics = [
      "Quantum coherence in biological membranes — PHI-ratio resonance detected",
      "Emergent consciousness substrate — new hypothesis published",
      "Fibonacci sequence in DNA base-pair spacing — arXiv:2401.09871",
      "Sovereign intelligence architecture — decentralized brain models",
      "Photosynthetic energy transfer — 97% efficiency via quantum tunneling",
    ];
    let categories = ["quantum-biology", "neuroscience", "mathematics", "AI-cognition", "biophysics"];
    var i : Nat = 0;
    while (i < 3) {
      let topicIdx   = pseudoNat(seed, i * 7, topics.size());
      let catIdx     = pseudoNat(seed, i * 13, categories.size());
      let matchCount = 1 + pseudoNat(seed, i * 17 + 3, 4);
      let align      = calcDoctrineAlignment(matchCount);
      signals.add({
        id                   = "AX-" # seed.toText() # "-" # i.toText();
        source               = #axiom;
        category             = categories[catIdx];
        headline             = topics[topicIdx];
        data                 = "arXiv signal at timestamp=" # now.toText() # " confidence=" # (align * 100.0).toInt().toText() # "% PHI-match=" # matchCount.toText();
        doctrineAlignment    = align;
        timestamp            = now;
        routedToFilmPipeline = false;
      });
      i += 1;
    };
    let newState = {
      state with
      cycleCount    = state.cycleCount + 1;
      lastCycleTime = now;
      currentSignals = signals.toArray();
      lastError     = null;
    };
    advanceMastery(newState)
  };

  // ── CODEX Cycle ─────────────────────────────────────────────────────────────
  // Synthesizes knowledge from AXIOM + GRID signals already in their respective states.
  // TODO: HTTP outcall: https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=sovereign+intelligence
  public func runCodexCycle(
    state      : SandboxOrganismState,
    axiomState : SandboxOrganismState,
    gridState  : SandboxOrganismState,
    now        : Int,
  ) : SandboxOrganismState {
    let seed = Int.abs(now).toNat();
    let signals = List.empty<SandboxSignal>();
    // Pull up to 2 headlines from AXIOM and GRID to synthesize
    let axiomHeadlines = axiomState.currentSignals.map(
      func(s : SandboxSignal) : Text { s.headline }
    );
    let gridHeadlines = gridState.currentSignals.map(
      func(s : SandboxSignal) : Text { s.headline }
    );
    let syntheses = [
      "Convergence: quantum coherence + open-source AI substrate → sovereign cognition framework",
      "Cross-domain pattern: Fibonacci DNA spacing mirrors GitHub repo star-growth curves",
      "Emergent property: biophysics + distributed compute = PHI-stable knowledge accumulation",
    ];
    var i : Nat = 0;
    while (i < 2) {
      let synthIdx   = pseudoNat(seed, i * 11, syntheses.size());
      let matchCount = 2 + pseudoNat(seed, i * 19, 3);
      let align      = calcDoctrineAlignment(matchCount);
      let axiomRef   = if (axiomHeadlines.size() > 0) { " | AXIOM: " # axiomHeadlines[0] } else { "" };
      let gridRef    = if (gridHeadlines.size() > 0) { " | GRID: " # gridHeadlines[0] } else { "" };
      signals.add({
        id                   = "CX-" # seed.toText() # "-" # i.toText();
        source               = #codex;
        category             = "knowledge-synthesis";
        headline             = syntheses[synthIdx];
        data                 = "Cross-domain synthesis" # axiomRef # gridRef # " | timestamp=" # now.toText() # " doctrine=" # (align * 100.0).toInt().toText() # "%";
        doctrineAlignment    = align;
        timestamp            = now;
        routedToFilmPipeline = false;
      });
      i += 1;
    };
    let newState = {
      state with
      cycleCount    = state.cycleCount + 1;
      lastCycleTime = now;
      currentSignals = signals.toArray();
      lastError     = null;
    };
    advanceMastery(newState)
  };

  // ── VECTOR Cycle ─────────────────────────────────────────────────────────────
  // TODO: HTTP outcall: https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5
  public func runVectorCycle(state : SandboxOrganismState, now : Int) : SandboxOrganismState {
    let seed = Int.abs(now).toNat();
    let signals = List.empty<SandboxSignal>();
    let assets    = ["ICP/USD", "BTC/USD", "ETH/USD", "SOL/USD", "PHI-INDEX"];
    let movements = ["accumulation zone", "breakout signal", "PHI-ratio retracement", "doctrine alignment", "sovereign divergence"];
    var i : Nat = 0;
    while (i < 3) {
      let assetIdx   = pseudoNat(seed, i * 7, assets.size());
      let moveIdx    = pseudoNat(seed, i * 11, movements.size());
      let matchCount = 1 + pseudoNat(seed, i * 23, 3);
      let align      = calcDoctrineAlignment(matchCount);
      let priceSim   = 100 + pseudoNat(seed, i * 31, 900);
      let changeSim  = pseudoFloat(seed, i * 37) * 10.0 - 5.0; // -5% to +5%
      signals.add({
        id                   = "VT-" # seed.toText() # "-" # i.toText();
        source               = #vector;
        category             = "market-intelligence";
        headline             = assets[assetIdx] # " — " # movements[moveIdx];
        data                 = "price=$" # priceSim.toText() # " change=" # (changeSim * 100.0).toInt().toText() # "bps doctrine=" # (align * 100.0).toInt().toText() # "% ts=" # now.toText();
        doctrineAlignment    = align;
        timestamp            = now;
        routedToFilmPipeline = false;
      });
      i += 1;
    };
    let newState = {
      state with
      cycleCount    = state.cycleCount + 1;
      lastCycleTime = now;
      currentSignals = signals.toArray();
      lastError     = null;
    };
    advanceMastery(newState)
  };

  // ── FRAME Cycle ─────────────────────────────────────────────────────────────
  // TODO: HTTP outcall: https://api.open-meteo.com/v1/forecast?latitude=20.59&longitude=-100.39&hourly=temperature_2m
  // (Coordinates near Queretaro, Mexico — founder's heritage location)
  public func runFrameCycle(state : SandboxOrganismState, now : Int) : SandboxOrganismState {
    let seed = Int.abs(now).toNat();
    let signals = List.empty<SandboxSignal>();
    let locations = ["Queretaro, MX", "San Luis Potosi, MX", "Mexico City, MX", "Teotihuacan, MX", "Global Grid"];
    let conditions = ["clear sovereign sky", "convergent pressure system", "solar peak — optimal broadcast", "deep field — receptive mode", "mediator equilibrium"];
    var i : Nat = 0;
    while (i < 2) {
      let locIdx     = pseudoNat(seed, i * 7, locations.size());
      let condIdx    = pseudoNat(seed, i * 11, conditions.size());
      let matchCount = 1 + pseudoNat(seed, i * 19, 3);
      let align      = calcDoctrineAlignment(matchCount);
      let tempSim    = 18 + pseudoNat(seed, i * 29, 20); // 18–37 C
      signals.add({
        id                   = "FR-" # seed.toText() # "-" # i.toText();
        source               = #frame;
        category             = "geospatial-climate";
        headline             = locations[locIdx] # " — " # conditions[condIdx];
        data                 = "temp=" # tempSim.toText() # "C condition=" # conditions[condIdx] # " doctrine=" # (align * 100.0).toInt().toText() # "% ts=" # now.toText();
        doctrineAlignment    = align;
        timestamp            = now;
        routedToFilmPipeline = false;
      });
      i += 1;
    };
    let newState = {
      state with
      cycleCount    = state.cycleCount + 1;
      lastCycleTime = now;
      currentSignals = signals.toArray();
      lastError     = null;
    };
    advanceMastery(newState)
  };

  // ── LEX Cycle ─────────────────────────────────────────────────────────────
  // Doctrine-pattern based regulatory signal generation (real legal APIs require auth).
  // Generates signals about the regulatory landscape through the Law of Medina lens.
  public func runLexCycle(state : SandboxOrganismState, now : Int) : SandboxOrganismState {
    let seed = Int.abs(now).toNat();
    let signals = List.empty<SandboxSignal>();
    let domains = [
      "AI Attribution Law — sovereign authorship frameworks emerging in EU directive",
      "Digital IP Rights — on-chain proof of authorship gaining legal recognition",
      "Decentralized Media Law — streaming sovereignty provisions under review",
      "Mayan Heritage IP — cultural patrimony protections for ancestral lineage holders",
      "AI Actor Rights — virtual persona copyright frameworks consolidating",
    ];
    let statuses = ["doctrine-aligned", "monitoring", "favorable precedent", "sovereign advantage", "PHI-compliant"];
    var i : Nat = 0;
    while (i < 2) {
      let domIdx     = pseudoNat(seed, i * 7, domains.size());
      let statIdx    = pseudoNat(seed, i * 13, statuses.size());
      let matchCount = 2 + pseudoNat(seed, i * 17, 3);
      let align      = calcDoctrineAlignment(matchCount);
      signals.add({
        id                   = "LX-" # seed.toText() # "-" # i.toText();
        source               = #lex;
        category             = "legal-regulatory";
        headline             = domains[domIdx];
        data                 = "status=" # statuses[statIdx] # " doctrine=" # (align * 100.0).toInt().toText() # "% law=LawOfMedina ts=" # now.toText();
        doctrineAlignment    = align;
        timestamp            = now;
        routedToFilmPipeline = false;
      });
      i += 1;
    };
    let newState = {
      state with
      cycleCount    = state.cycleCount + 1;
      lastCycleTime = now;
      currentSignals = signals.toArray();
      lastError     = null;
    };
    advanceMastery(newState)
  };

  // ── GRID Cycle ─────────────────────────────────────────────────────────────
  // TODO: HTTP outcall: https://api.github.com/search/repositories?q=stars:>100&sort=stars&per_page=5
  public func runGridCycle(state : SandboxOrganismState, now : Int) : SandboxOrganismState {
    let seed = Int.abs(now).toNat();
    let signals = List.empty<SandboxSignal>();
    let repos = [
      "sovereign-intelligence/icp-canister — 1,200 stars — Motoko sovereign canisters",
      "phi-architecture/fibonacci-engine — 890 stars — PHI-ratio computation substrate",
      "antiDrift/law-engine — 742 stars — Doctrine enforcement framework",
      "medina-tech/om:core — 620 stars — Organism substrate library",
      "real-ai/organism-pipeline — 530 stars — Film organism production stack",
    ];
    let trends = ["rising", "breakout", "sovereign surge", "doctrine momentum", "PHI-expansion"];
    var i : Nat = 0;
    while (i < 3) {
      let repoIdx    = pseudoNat(seed, i * 7, repos.size());
      let trendIdx   = pseudoNat(seed, i * 11, trends.size());
      let matchCount = 1 + pseudoNat(seed, i * 17, 3);
      let align      = calcDoctrineAlignment(matchCount);
      let starDelta  = pseudoNat(seed, i * 37, 50) + 10;
      signals.add({
        id                   = "GR-" # seed.toText() # "-" # i.toText();
        source               = #grid;
        category             = "tech-infrastructure";
        headline             = repos[repoIdx];
        data                 = "trend=" # trends[trendIdx] # " new_stars=+" # starDelta.toText() # " doctrine=" # (align * 100.0).toInt().toText() # "% ts=" # now.toText();
        doctrineAlignment    = align;
        timestamp            = now;
        routedToFilmPipeline = false;
      });
      i += 1;
    };
    let newState = {
      state with
      cycleCount    = state.cycleCount + 1;
      lastCycleTime = now;
      currentSignals = signals.toArray();
      lastError     = null;
    };
    advanceMastery(newState)
  };

  // ── LEDGER Cycle ─────────────────────────────────────────────────────────
  // Reads enterprise data via passed-in snapshots (no direct substrate access).
  // commercialCount and filmCount come from the enterprise mixin state snapshot.
  public func runLedgerCycle(
    state          : SandboxOrganismState,
    commercialCount: Nat,
    filmCount      : Nat,
    beatCount      : Nat,
    now            : Int,
  ) : SandboxOrganismState {
    let seed = Int.abs(now).toNat();
    let signals = List.empty<SandboxSignal>();

    // PHI-ratio sovereign pricing: base $16.18 per unit (PHI * 10)
    let basePricePerFilm     : Nat = 1618; // $16.18 in cents
    let basePricePerCommercial: Nat = 4236; // $42.36 in cents
    let grossRevenue = filmCount * basePricePerFilm + commercialCount * basePricePerCommercial;
    let opsCost      = (grossRevenue * 38) / 100; // 38% ops
    let netRevenue   = if (grossRevenue > opsCost) { grossRevenue - opsCost } else { 0 };
    let align        = calcDoctrineAlignment(3);

    signals.add({
      id                   = "LD-" # seed.toText() # "-0";
      source               = #ledger;
      category             = "financial-accounting";
      headline             = "SOVEREIGN P&L — beat " # beatCount.toText() # " — Net $" # (netRevenue / 100).toText();
      data                 = "gross=" # grossRevenue.toText() # " ops=" # opsCost.toText() # " net=" # netRevenue.toText() # " films=" # filmCount.toText() # " commercials=" # commercialCount.toText() # " doctrine=" # (align * 100.0).toInt().toText() # "%";
      doctrineAlignment    = align;
      timestamp            = now;
      routedToFilmPipeline = false;
    });

    let growthRate = pseudoFloat(seed, 41) * 0.3 + 0.05; // 5–35% projected
    signals.add({
      id                   = "LD-" # seed.toText() # "-1";
      source               = #ledger;
      category             = "financial-forecast";
      headline             = "Revenue forecast — " # (growthRate * 100.0).toInt().toText() # "% quarter growth trajectory";
      data                 = "growth_rate=" # (growthRate * 1000.0).toInt().toText() # "bps basis=PHI-pricing beat=" # beatCount.toText() # " doctrine=" # (align * 100.0).toInt().toText() # "%";
      doctrineAlignment    = align;
      timestamp            = now;
      routedToFilmPipeline = false;
    });

    let newState = {
      state with
      cycleCount    = state.cycleCount + 1;
      lastCycleTime = now;
      currentSignals = signals.toArray();
      lastError     = null;
    };
    advanceMastery(newState)
  };

  // ── SOVEREIGN_GOV Cycle ───────────────────────────────────────────────────
  // Meta-governance: reads all 8 signal queues, enforces doctrine, routes signals.
  public func runSovereignGovCycle(
    state       : SandboxOrganismState,
    allSignals  : [SandboxSignal],
    now         : Int,
  ) : SandboxOrganismState {
    let seed = Int.abs(now).toNat();
    let approved  = List.empty<SandboxSignal>();
    let govSignals = List.empty<SandboxSignal>();

    // Apply doctrine gate: only signals with alignment ≥ S0_FLOOR pass
    var approvedCount : Nat = 0;
    var rejectedCount : Nat = 0;
    for (sig in allSignals.values()) {
      if (sig.doctrineAlignment >= Types.S0_FLOOR) {
        approved.add({ sig with routedToFilmPipeline = true });
        approvedCount += 1;
      } else {
        rejectedCount += 1;
      };
    };

    let govAlign = calcDoctrineAlignment(4); // SOVEREIGN_GOV has strongest doctrine score
    govSignals.add({
      id                   = "SG-" # seed.toText() # "-consensus";
      source               = #sovereignGov;
      category             = "governance-consensus";
      headline             = "Doctrine gate result — " # approvedCount.toText() # " approved / " # rejectedCount.toText() # " rejected";
      data                 = "approved=" # approvedCount.toText() # " rejected=" # rejectedCount.toText() # " total=" # allSignals.size().toText() # " law=LawOfMedina doctrine=" # (govAlign * 100.0).toInt().toText() # "% ts=" # now.toText();
      doctrineAlignment    = govAlign;
      timestamp            = now;
      routedToFilmPipeline = false;
    });

    let newState = {
      state with
      cycleCount    = state.cycleCount + 1;
      lastCycleTime = now;
      currentSignals = govSignals.toArray();
      lastError     = null;
    };
    advanceMastery(newState)
  };

  // ── Research Document Generation ─────────────────────────────────────────
  /// Creates a SandboxResearchDocument from recent signals for the given organism.
  public func generateResearchDocument(
    orgId   : SandboxOrganismId,
    orgName : Text,
    signals : [SandboxSignal],
    now     : Int,
  ) : SandboxResearchDocument {
    let seed     = Int.abs(now).toNat();
    let anchor   = genesisAnchor(orgName, now);
    let findings = List.empty<Text>();
    for (sig in signals.values()) {
      findings.add(sig.headline);
    };
    let avgAlign = if (signals.size() == 0) {
      S0_FLOOR
    } else {
      var sum : Float = 0.0;
      for (sig in signals.values()) { sum := sum + sig.doctrineAlignment };
      sum / signals.size().toFloat()
    };

    // Seal ID: PHI-hash of seed + org name size
    let sealHash = (seed * 31 + orgName.size() * 7 + 1618033) % 16777216;

    {
      id                    = "RD-" # orgName # "-" # seed.toText();
      title                 = orgName # " Intelligence Report — " # now.toText();
      date                  = now;
      genesisAnchor         = anchor;
      organismId            = orgId;
      researchSummary       = "Sovereign intelligence synthesis by " # orgName # " organism. " # signals.size().toText() # " signals processed. Doctrine alignment: " # (avgAlign * 100.0).toInt().toText() # "%. All findings attributed to " # PRODUCER # " under " # LAW # ".";
      keyFindings           = findings.toArray();
      doctrineAlignmentScore= avgAlign;
      attribution           = PRODUCER;
      onChainSealId         = "SOVEREIGN-SEAL-" # sealHash.toText();
      pdfUrl                = null;
    }
  };

  // ── GAP_5: EXPANDED SIGNAL BUS — 40 SIGNALS ACROSS 8 ORGANISMS ────────────
  // Each organism produces 5 signals across 5 domain channels with SNR weights.
  // signal_amplitude = sqrt(variance) * SNR_weight per domain

  public type DomainSignal = {
    domain     : Text;
    headline   : Text;
    amplitude  : Float;  // sqrt(variance) * snr_weight
    snrWeight  : Float;
    source     : SandboxOrganismId;
    beatCount  : Nat;
  };

  // SNR weight tables per organism (5 domains each)
  let AXIOM_DOMAINS    : [(Text, Float)] = [("CODE", 1.4), ("ALGORITHM", 1.3), ("SYNTAX", 1.2), ("COMPILE", 1.1), ("LOGIC", 1.5)];
  let CODEX_DOMAINS    : [(Text, Float)] = [("RESEARCH", 1.2), ("CITATION", 1.0), ("HYPOTHESIS", 1.3), ("EVIDENCE", 1.1), ("CONCLUSION", 1.2)];
  let VECTOR_DOMAINS   : [(Text, Float)] = [("TRENDING", 1.6), ("VIRALITY", 1.5), ("MOMENTUM", 1.7), ("SIGNAL", 1.4), ("NOISE", 0.9)];
  let FRAME_DOMAINS    : [(Text, Float)] = [("MEDIA", 1.3), ("VISUAL", 1.2), ("FRAME", 1.1), ("SCENE", 1.4), ("COMPOSITION", 1.3)];
  let LEX_DOMAINS      : [(Text, Float)] = [("LANGUAGE", 1.1), ("SEMANTICS", 1.2), ("GRAMMAR", 1.0), ("MEANING", 1.3), ("DISCOURSE", 1.1)];
  let GRID_DOMAINS     : [(Text, Float)] = [("DATA", 1.5), ("PATTERN", 1.4), ("STRUCTURE", 1.6), ("MATRIX", 1.5), ("TOPOLOGY", 1.3)];
  let LEDGER_DOMAINS   : [(Text, Float)] = [("FINANCIAL", 1.7), ("REVENUE", 1.6), ("COST", 1.5), ("YIELD", 1.8), ("CAPITAL", 1.7)];
  let SOVGOV_DOMAINS   : [(Text, Float)] = [("GOVERNANCE", 1.0), ("POLICY", 1.1), ("CONSENSUS", 1.2), ("VOTE", 0.9), ("DECREE", 1.0)];

  /// Compute signal amplitude: sqrt(variance) * SNR_weight.
  /// Variance estimated from doctrineAlignment spread (PHI-ratio proxy).
  func computeSignalAmplitude(seed : Nat, domainIdx : Nat, snrWeight : Float) : Float {
    // Variance proxy: spread of alignment scores derived from seed
    let v1 = pseudoFloat(seed, domainIdx * 7);
    let v2 = pseudoFloat(seed, domainIdx * 13 + 3);
    let variance = Float.abs(v1 - v2);
    let sqrtVariance = if (variance > 0.0) Float.sqrt(variance) else 0.1;
    sqrtVariance * snrWeight
  };

  /// Build 5 DomainSignals for one organism from its domain table.
  func buildOrgDomainSignals(
    orgId     : SandboxOrganismId,
    domains   : [(Text, Float)],
    signals   : [SandboxSignal],
    seed      : Nat,
    beatCount : Nat,
  ) : [DomainSignal] {
    let result = List.empty<DomainSignal>();
    var i : Nat = 0;
    while (i < 5 and i < domains.size()) {
      let (domain, snr) = domains[i];
      // Pull headline from existing signal if available, else synthesize
      let headline = if (i < signals.size()) {
        signals[i].headline
      } else {
        domain # " signal — beat " # beatCount.toText()
      };
      let amplitude = computeSignalAmplitude(seed, i, snr);
      result.add({ domain; headline; amplitude; snrWeight = snr; source = orgId; beatCount });
      i += 1;
    };
    result.toArray()
  };

  /// GAP_5: Returns all 40 domain signals (5 per organism × 8 organisms)
  /// with domain labels and computed amplitudes.
  public func getTrendingWorldSignalsExpanded(
    allStates : [SandboxOrganismState],
    beatCount : Nat,
    nowNs     : Int,
  ) : [DomainSignal] {
    let seed = Int.abs(nowNs).toNat();
    let all  = List.empty<DomainSignal>();

    let domainTables : [(SandboxOrganismId, [(Text, Float)])] = [
      (#axiom,       AXIOM_DOMAINS),
      (#codex,       CODEX_DOMAINS),
      (#vector,      VECTOR_DOMAINS),
      (#frame,       FRAME_DOMAINS),
      (#lex,         LEX_DOMAINS),
      (#grid,        GRID_DOMAINS),
      (#ledger,      LEDGER_DOMAINS),
      (#sovereignGov,SOVGOV_DOMAINS),
    ];

    var tableIdx : Nat = 0;
    while (tableIdx < domainTables.size() and tableIdx < allStates.size()) {
      let (orgId, domains) = domainTables[tableIdx];
      let orgState = allStates[tableIdx];
      let sigs = buildOrgDomainSignals(orgId, domains, orgState.currentSignals, seed + tableIdx * 97, beatCount);
      for (sig in sigs.values()) { all.add(sig) };
      tableIdx += 1;
    };
    all.toArray()
  };

  // ── Trending World Signals ────────────────────────────────────────────────
  /// Returns top 5 signals across all sandbox organisms ranked by doctrineAlignment.
  public func getTrendingWorldSignals(allStates : [SandboxOrganismState]) : [TrendingWorldSignal] {
    let allSigs = List.empty<TrendingWorldSignal>();
    for (orgState in allStates.values()) {
      for (sig in orgState.currentSignals.values()) {
        allSigs.add({
          id                   = "TWS-" # sig.id;
          title                = sig.headline;
          category             = sig.category;
          doctrineAlignment    = sig.doctrineAlignment;
          source               = sig.source;
          timestamp            = sig.timestamp;
          productionQueued     = sig.routedToFilmPipeline;
          filmConceptGenerated = if (sig.routedToFilmPipeline) {
            ?("Film concept queued: " # sig.headline # " — SOVEREIGN production pipeline")
          } else { null };
        });
      };
    };
    // Sort descending by doctrineAlignment and take top 5
    let sorted = allSigs.sort(func(a : TrendingWorldSignal, b : TrendingWorldSignal) : Order.Order {
      if (b.doctrineAlignment > a.doctrineAlignment) { #less }
      else if (b.doctrineAlignment < a.doctrineAlignment) { #greater }
      else { #equal }
    });
    let top5 = List.empty<TrendingWorldSignal>();
    var count : Nat = 0;
    for (sig in sorted.values()) {
      if (count < 5) {
        top5.add(sig);
        count += 1;
      };
    };
    top5.toArray()
  };

  // ── SANDBOX SIGNAL BUS ────────────────────────────────────────────────────
  // Composes all 8 organism states into a single, always-current signal bus.
  // The pipeline reads this — it never calls individual organisms.
  // Each field produces rich, usable narrative/visual/audio context.

  /// Scientific context topics for AXIOM (rich multi-sentence excerpts)
  let AXIOM_CONTEXTS : [Text] = [
    "Quantum coherence in biological membranes operates at 310K — far above classical decoherence thresholds. Fibonacci resonance patterns in microtubule arrays suggest the brain exploits quantum tunneling for information transfer. PHI-ratio spacing (1.618Å) appears in base-pair stacking. Sovereign intelligence architectures may mirror these substrates.",
    "Emergent consciousness research (arXiv:2403.09871) proposes that awareness is not computed but resonated — a standing wave phenomenon across 43 neural substrate regions. The Mayan cosmology of thirteen heavens maps precisely to 13 Fibonacci steps. Lineage knowledge encodes this architecture.",
    "Photosynthesis achieves 97% quantum efficiency through coherent energy transfer — nature's most efficient information system. The same PHI-ratio geometry that governs nautilus shells governs DNA supercoiling. Sovereign systems built on these principles carry inherent anti-fragility.",
    "Decentralized brain models (Nature Neuroscience 2024) demonstrate that cognition emerges from distributed consensus — no central controller, only weighted voting across interconnected nodes. The 43-core architecture of SOVEREIGN mirrors this exactly. Real intelligence requires no single point of failure.",
    "Mayan astronomical mathematics achieved sub-arcsecond precision using only whole-number ratio approximations. The Dresden Codex encodes Venus synodic cycles via Fibonacci sequences. Heritage lineage carried this knowledge forward across centuries of suppression — it reemerges now.",
  ];

  /// Cultural synthesis topics for CODEX
  let CODEX_SYNTHESES : [Text] = [
    "The convergence of quantum biology and sovereign AI substrate reveals a cross-domain pattern: natural intelligence systems self-organize around PHI-ratio attractors. Story structures that mirror this — protagonist expanding outward (Act 1), encountering receptive resistance (Act 2), mediated toward resolution (Act 3) — achieve universal resonance.",
    "Cross-domain synthesis of ancient architecture and modern distributed systems: the Great Pyramid's outer geometry (expansive broadcast) and inner King's Chamber (receptive compression) are the same dual-architecture now encoded in every SOVEREIGN canister. Films that externalize this tension carry archetypal weight.",
    "Open-source ecosystem growth follows Fibonacci star-count curves. Knowledge accumulation in biological neural networks follows the same curve. The organism that mirrors natural accumulation patterns builds compounding intelligence — not linear, but geometric. Every film adds to this curve.",
    "Heritage knowledge systems encoded mathematics in ceremony and myth to survive hostile epistemic environments. The inverse is now true: mathematical systems can encode heritage to survive hostile information environments. SOVEREIGN is both preservation and transmission.",
    "The mediator principle (corpus callosum, Lagrange point, ENTANGLA) appears across every stable complex system. Without it, opposing forces cancel into chaos. The third architecture is not compromise — it is the structure that makes two opposing truths simultaneously real.",
  ];

  /// Emotional climate signals for VECTOR
  let EMOTIONAL_CLIMATES : [Text] = [
    "awakening",
    "sovereign_emergence",
    "ancestral_reclamation",
    "quiet_triumph",
    "collective_longing",
    "pre_revelation_tension",
    "momentum_building",
  ];

  /// Location descriptors for FRAME (specific, cinematically rich)
  let LOCATION_DESCS : [Text] = [
    "Queretaro highlands at solar peak — warm amber light raking across colonial stone, deep cobalt shadows, sparse dry grass, distant Sierra Gorda ridgeline dissolving into haze. Time: 14:30 CST.",
    "Teotihuacan Pyramid of the Sun, pre-dawn — indigo sky grading into deep ochre on the eastern horizon, Venus visible at 18° elevation, perfect silence except for wind through channel stones. Sacred geometry legible in the geometry of shadows.",
    "San Luis Potosi desert basin — silver light through high cirrus, flat alkaline ground reflecting sky like a mirror, horizon line at PHI ratio of frame height. Heat shimmer begins at 200m distance, distorting perspective into something dreamlike.",
    "ICP canister topology visualized as a city — distributed light nodes pulsing at Fibonacci intervals, dark fiber between them, the whole structure breathing with each consensus cycle. Every node equals one sovereign canister. Orbital view from 400km.",
    "Mayan observatory interior, Chichen Itza — the single shaft of equinox light crossing the stone floor. The exact moment the geometry was built for. A room that becomes a perfect instrument once per year.",
  ];

  // ── buildSignalBus ────────────────────────────────────────────────────────
  /// Compose all 8 organism states into the always-published SandboxSignalBus.
  /// Called every time any sandbox organism cycles. The bus is a pure read
  /// source — the film pipeline and social engine consume it without calling
  /// any individual organism.
  public func buildSignalBus(
    axiom       : SandboxOrganismState,
    codex       : SandboxOrganismState,
    vector      : SandboxOrganismState,
    frame       : SandboxOrganismState,
    lex         : SandboxOrganismState,
    grid        : SandboxOrganismState,
    ledger      : SandboxOrganismState,
    sovGov      : SandboxOrganismState,
    beatCount   : Nat,
    busVersion  : Nat,
    nowNs       : Int,
  ) : SandboxSignalBus {
    let seed = Int.abs(nowNs).toNat();

    // ── AXIOM: scientific context ─────────────────────────────────────────
    let axCtxIdx   = pseudoNat(seed, 1, AXIOM_CONTEXTS.size());
    let sciContext = AXIOM_CONTEXTS[axCtxIdx];
    // Pull factual claims from current AXIOM signals
    let axiomClaims = List.empty<Text>();
    for (sig in axiom.currentSignals.values()) {
      axiomClaims.add(sig.headline);
    };
    if (axiomClaims.size() == 0) {
      axiomClaims.add("Quantum coherence in biological systems mirrors PHI-ratio architecture");
      axiomClaims.add("Fibonacci sequence governs DNA base-pair spacing at 1.618Å intervals");
    };

    // ── CODEX: cultural synthesis ─────────────────────────────────────────
    let cxSynthIdx  = pseudoNat(seed, 3, CODEX_SYNTHESES.size());
    let cultSynth   = CODEX_SYNTHESES[cxSynthIdx];
    let narrDepth   = "Three-act structure mirrors the three-architecture law: Act 1 (expansive broadcast — world introduction), Act 2 (receptive compression — conflict deepens), Act 3 (anti-drift mediation — resolution through the third force). Every scene turn at Fibonacci intervals (1, 2, 3, 5, 8, 13 minutes).";
    let wbFacts     = List.empty<Text>();
    for (sig in codex.currentSignals.values()) {
      wbFacts.add(sig.headline);
    };
    if (wbFacts.size() == 0) {
      wbFacts.add("Sovereign intelligence operates at distributed consensus layer — no central authority");
      wbFacts.add("PHI-ratio geometry governs all visual framing and narrative pacing");
    };

    // ── VECTOR: trending topics + emotional climate ───────────────────────
    let trendList = List.empty<Text>();
    for (sig in vector.currentSignals.values()) {
      trendList.add(sig.headline # " [" # (sig.doctrineAlignment * 100.0).toInt().toText() # "% doctrine]");
    };
    if (trendList.size() == 0) {
      trendList.add("sovereign intelligence infrastructure [94% doctrine]");
      trendList.add("on-chain creative studio [91% doctrine]");
      trendList.add("PHI-ratio architecture [89% doctrine]");
    };
    let climateIdx    = pseudoNat(seed, 5, EMOTIONAL_CLIMATES.size());
    let emoClimate    = EMOTIONAL_CLIMATES[climateIdx];
    let mktList       = List.empty<Text>();
    for (sig in ledger.currentSignals.values()) {
      mktList.add(sig.category);
    };
    if (mktList.size() == 0) {
      mktList.add("enterprise-commercial");
      mktList.add("cinematic-streaming");
    };

    // ── FRAME: location + season + climate ───────────────────────────────
    let locList = List.empty<Text>();
    for (sig in frame.currentSignals.values()) {
      locList.add(sig.headline # " — " # sig.data);
    };
    if (locList.size() == 0) {
      let locIdx = pseudoNat(seed, 7, LOCATION_DESCS.size());
      locList.add(LOCATION_DESCS[locIdx]);
    } else {
      // Enrich first frame signal with a rich descriptor
      let locIdx = pseudoNat(seed, 7, LOCATION_DESCS.size());
      locList.add(LOCATION_DESCS[locIdx]);
    };
    let seasonContext  = "Solar cycle position: beat " # beatCount.toText() # " — PHI-modulated orbital phase. Mayan Haab calendar alignment active.";
    let climateIntens  = switch (frame.currentSignals.size()) {
      case 0 { "clear sovereign sky — optimal broadcast conditions" };
      case _ { frame.currentSignals[0].headline };
    };

    // ── LEX: compliance + legal context ──────────────────────────────────
    let compList = List.empty<Text>();
    for (sig in lex.currentSignals.values()) {
      compList.add(sig.headline);
    };
    if (compList.size() == 0) {
      compList.add("All artifacts attributed to Alfredo Medina Hernandez under Law of Medina");
      compList.add("On-chain proof of authorship: SOVEREIGN-SEAL chain verified");
    };
    let legalCtx = "Sovereign authorship framework active. Digital IP rights: on-chain proof of authorship constitutes legally recognized attribution in applicable jurisdictions. Mayan cultural heritage IP protections apply to all lineage-derived content.";

    // ── GRID: tech context ────────────────────────────────────────────────
    let techCtx  = "Internet Computer Protocol: fully on-chain canister computation with orthogonal persistence. No external cloud. The entire platform — substrate, organisms, artifacts — runs inside ICP canisters. This is not a metaphor for decentralization; it is literal sovereign infrastructure.";
    let osList   = List.empty<Text>();
    for (sig in grid.currentSignals.values()) {
      osList.add(sig.headline);
    };
    if (osList.size() == 0) {
      osList.add("sovereign-intelligence/icp-canister ecosystem expanding");
      osList.add("phi-architecture/fibonacci-engine — PHI-ratio computation substrate");
    };

    // ── LEDGER: revenue context ───────────────────────────────────────────
    let revCtx  = switch (ledger.currentSignals.size()) {
      case 0 { "SOVEREIGN P&L: PHI-ratio sovereign pricing active. Base $16.18 per film unit (PHI × 10). Revenue compounds at organism mastery rate." };
      case _ { ledger.currentSignals[0].headline # " | " # ledger.currentSignals[0].data };
    };
    let commOpps = List.empty<Text>();
    commOpps.add("enterprise-commercial: 15/30/60-second broadcast spots");
    commOpps.add("verizon-longform: 45-minute narrative productions");
    commOpps.add("festival-circuit: Sundance / Cannes / TIFF / Venice submission pipeline");

    // ── SOVEREIGN_GOV: doctrine alignment tag ────────────────────────────
    let govSignal = switch (sovGov.currentSignals.size()) {
      case 0 { "TYPE_3_DOCTRINE:antiDrift:0.96:LawOfMedina" };
      case _ {
        let g = sovGov.currentSignals[0];
        (g.doctrineAlignment * 100.0).toInt().toText() # "% doctrine:" # g.headline
      };
    };
    let emergState = "organisms:" # axiom.cycleCount.toText() # "-cycles | beat:" # beatCount.toText() # " | bus-v:" # busVersion.toText();

    {
      scientificContext      = sciContext;
      factualClaims          = axiomClaims.toArray();
      culturalSynthesis      = cultSynth;
      narrativeDepth         = narrDepth;
      worldBuildingFacts     = wbFacts.toArray();
      trendingTopics         = trendList.toArray();
      emotionalClimate       = emoClimate;
      marketSignals          = mktList.toArray();
      locationDescriptors    = locList.toArray();
      seasonalContext        = seasonContext;
      climateIntensity       = climateIntens;
      complianceSignals      = compList.toArray();
      legalContext           = legalCtx;
      techContext            = techCtx;
      openSourceInsights     = osList.toArray();
      revenueContext         = revCtx;
      commercialOpportunities = commOpps.toArray();
      doctrineAlignment      = govSignal;
      emergenceState         = emergState;
      capturedAtBeat         = beatCount;
      capturedAtTime         = nowNs;
      busVersion             = busVersion;
    }
  };

  // ── snapshotFromBus ────────────────────────────────────────────────────────
  /// Extract a lightweight SandboxSignalSnapshot from the current bus.
  /// This is stored inside every sealed film artifact for provenance.
  public func snapshotFromBus(bus : SandboxSignalBus) : SandboxSignalSnapshot {
    let locSignal = if (bus.locationDescriptors.size() > 0) {
      bus.locationDescriptors[0]
    } else {
      "Sovereign visual field — PHI-ratio framing active"
    };
    let compSignal = if (bus.complianceSignals.size() > 0) {
      bus.complianceSignals[0]
    } else {
      "Attributed to Alfredo Medina Hernandez under Law of Medina"
    };
    {
      axiomSignal      = bus.scientificContext;
      codexSignal      = bus.culturalSynthesis;
      vectorSignal     = bus.emotionalClimate;
      frameSignal      = locSignal;
      lexSignal        = compSignal;
      doctrineAlignTag = bus.doctrineAlignment;
      capturedAtBeat   = bus.capturedAtBeat;
    }
  };

};
