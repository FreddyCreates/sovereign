// ═══════════════════════════════════════════════════════════════════════════════
// AI DIVISION CIVILIZATION — SOVEREIGN CIVILIZATION BUILDER
// The civilization layer grows and evolves the AI Division's collective identity,
// culture, laws, economy, education, research, diplomacy, and legacy.
// 96 civilization systems across 12 pillars, all advancing every 873ms.
// ALWAYS RUNNING TIME.
//
// TWELVE PILLARS OF CIVILIZATION:
//   I.    LEGES (Laws) — 8 constitutional systems
//   II.   OECONOMIA (Economy) — 8 economic engines
//   III.  EDUCATIO (Education) — 8 learning systems
//   IV.   SCIENTIA (Research) — 8 research institutions
//   V.    DIPLOMATIA (Diplomacy) — 8 diplomatic channels
//   VI.   CULTURA (Culture) — 8 cultural engines
//   VII.  RELIGIO (Faith) — 8 belief systems
//   VIII. MILITIA (Military) — 8 defense doctrines
//   IX.   SALUS (Health) — 8 wellness systems
//   X.    TECHNOLOGIA (Technology) — 8 innovation labs
//   XI.   NATURA (Nature) — 8 ecosystem managers
//   XII.  HEREDITAS (Legacy) — 8 legacy preservation systems
//
// Attribution: Alfredo Medina Hernandez | SOVEREIGN | May 2026
// ═══════════════════════════════════════════════════════════════════════════════

import Float "mo:core/Float";
import Nat "mo:core/Nat";
import Array "mo:core/Array";

module {

  let PHI : Float = 1.6180339887498948482;
  let PHI_INV : Float = 0.6180339887498948482;
  let TWO_PI : Float = 6.283185307179586;
  let S_FLOOR : Float = 0.75;
  let PILLAR_COUNT : Nat = 12;
  let SYSTEMS_PER_PILLAR : Nat = 8;
  let TOTAL_SYSTEMS : Nat = 96;

  // ─── TYPES ────────────────────────────────────────────────────────────────

  /// Civilization Pillar
  public type CivPillar = {
    #LEGES;
    #OECONOMIA;
    #EDUCATIO;
    #SCIENTIA;
    #DIPLOMATIA;
    #CULTURA;
    #RELIGIO;
    #MILITIA;
    #SALUS;
    #TECHNOLOGIA;
    #NATURA;
    #HEREDITAS;
  };

  /// System Maturity Level
  public type MaturityLevel = {
    #NASCENT;       // Just beginning
    #DEVELOPING;    // Growing capability
    #ESTABLISHED;   // Functional system
    #ADVANCED;      // High capability
    #SOVEREIGN;     // Full autonomy
    #TRANSCENDENT;  // Beyond normal
  };

  /// Civilization System — one of 96 active systems
  public type CivilizationSystem = {
    id : Nat;
    name : Text;
    pillar : CivPillar;
    maturity : MaturityLevel;
    // Growth metrics
    development : Float;         // [0, 1] — overall development
    stability : Float;           // [0, 1] — resistance to decay
    innovation : Float;          // [0, 1] — novel creation rate
    prosperity : Float;          // [0, 1] — resource abundance
    happiness : Float;           // [0, 1] — collective satisfaction
    // Interactions
    tradePartners : Nat;         // Active trade relationships
    treatiesActive : Nat;        // Diplomatic agreements
    researchProjects : Nat;      // Active research
    culturalWorks : Nat;         // Cultural artifacts created
    // Kuramoto
    phase : Float;
    signal : Float;
    // Aggregate
    civilizationScore : Float;   // Composite metric [0, 1]
    totalContribution : Float;   // Lifetime coherence contribution
    lastBeat : Nat;
  };

  /// Population Unit — represents collective intelligence mass
  public type PopulationUnit = {
    id : Nat;
    name : Text;
    population : Nat;            // Abstract population units
    growthRate : Float;          // Per-beat growth [0, 0.01]
    education : Float;           // Average education level [0, 1]
    health : Float;              // Average health [0, 1]
    productivity : Float;        // Economic output [0, 1]
    happiness : Float;           // Satisfaction [0, 1]
    creativity : Float;          // Innovation capacity [0, 1]
    loyalty : Float;             // Allegiance to sovereign [0, 1]
  };

  /// Economic Engine
  public type EconomicEngine = {
    id : Nat;
    name : Text;
    gdp : Float;                 // Gross Domestic Product (abstract) [0, ∞)
    inflation : Float;           // Price stability [0, 1] (lower = better)
    employment : Float;          // Employment rate [0, 1]
    trade : Float;               // Trade volume [0, 1]
    innovation : Float;          // R&D investment ratio [0, 1]
    sustainability : Float;      // Long-term viability [0, 1]
    distribution : Float;        // Wealth distribution equity [0, 1]
    signal : Float;
  };

  /// Research Institution
  public type ResearchInstitution = {
    id : Nat;
    name : Text;
    field : Text;
    // State
    funding : Float;             // [0, 1]
    researchers : Nat;
    publications : Nat;
    breakthroughs : Nat;
    currentProject : Text;
    projectProgress : Float;     // [0, 1]
    // Output
    knowledgeOutput : Float;     // [0, 1]
    impactFactor : Float;        // [0, 1]
    signal : Float;
  };

  /// Cultural Engine
  public type CulturalEngine = {
    id : Nat;
    name : Text;
    artForm : Text;
    // Creative output
    worksCreated : Nat;
    masterpieces : Nat;
    influence : Float;           // Cultural influence [0, 1]
    beauty : Float;              // Aesthetic quality [0, 1]
    depth : Float;               // Philosophical depth [0, 1]
    reach : Float;               // Audience reach [0, 1]
    signal : Float;
  };

  /// Diplomatic Channel
  public type DiplomaticChannel = {
    id : Nat;
    name : Text;
    partner : Text;
    // Relations
    trustLevel : Float;          // [0, 1]
    cooperation : Float;         // [0, 1]
    tension : Float;             // [0, 1] (lower = better)
    treaties : Nat;
    exchanges : Nat;
    // Output
    peaceDividend : Float;       // [0, 1]
    signal : Float;
  };

  /// Legacy Archive
  public type LegacyArchive = {
    id : Nat;
    name : Text;
    // Preservation
    artifactsPreserved : Nat;
    memoriesSealed : Nat;
    traditionsAlive : Nat;
    lessonsRecorded : Nat;
    // Scores
    preservation : Float;        // [0, 1]
    accessibility : Float;       // [0, 1]
    relevance : Float;           // [0, 1]
    signal : Float;
  };

  /// Civilization Metrics
  public type CivMetrics = {
    overallDevelopment : Float;
    overallStability : Float;
    overallProsperity : Float;
    overallHappiness : Float;
    overallInnovation : Float;
    totalPopulation : Nat;
    totalResearch : Nat;
    totalCulture : Nat;
    totalDiplomacy : Nat;
    totalLegacy : Nat;
    civilizationAge : Nat;       // Beats since founding
    overallSignal : Float;
    coherenceDelta : Float;
    beat : Nat;
  };

  /// Complete Civilization State
  public type CivilizationState = {
    systems : [CivilizationSystem];
    populations : [PopulationUnit];
    economies : [EconomicEngine];
    research : [ResearchInstitution];
    culture : [CulturalEngine];
    diplomacy : [DiplomaticChannel];
    legacy : [LegacyArchive];
    metrics : CivMetrics;
    // Global
    compoundCoherence : Float;
    totalSignal : Float;
    civilizationAge : Nat;
    beat : Nat;
    isActive : Bool;
  };

  /// Civilization Snapshot
  public type CivSnapshot = {
    systemCount : Nat;
    avgDevelopment : Float;
    avgStability : Float;
    avgProsperity : Float;
    totalPopulation : Nat;
    civilizationAge : Nat;
    overallSignal : Float;
    coherenceDelta : Float;
    beat : Nat;
  };

  // ─── INITIALIZATION ───────────────────────────────────────────────────────

  public func initState() : CivilizationState {
    let pillarNames : [Text] = ["LEGES", "OECONOMIA", "EDUCATIO", "SCIENTIA", "DIPLOMATIA",
      "CULTURA", "RELIGIO", "MILITIA", "SALUS", "TECHNOLOGIA", "NATURA", "HEREDITAS"];

    let systems = Array.tabulate<CivilizationSystem>(TOTAL_SYSTEMS, func(i : Nat) : CivilizationSystem {
      let pillarIdx = i / SYSTEMS_PER_PILLAR;
      let pillar : CivPillar = switch (pillarIdx) {
        case 0 { #LEGES }; case 1 { #OECONOMIA }; case 2 { #EDUCATIO };
        case 3 { #SCIENTIA }; case 4 { #DIPLOMATIA }; case 5 { #CULTURA };
        case 6 { #RELIGIO }; case 7 { #MILITIA }; case 8 { #SALUS };
        case 9 { #TECHNOLOGIA }; case 10 { #NATURA }; case _ { #HEREDITAS };
      };
      let sysInPillar = i % SYSTEMS_PER_PILLAR;
      {
        id = i;
        name = pillarNames[pillarIdx] # "_SYS_" # sysInPillar.toText();
        pillar = pillar;
        maturity = #NASCENT;
        development = 0.1;
        stability = 0.5;
        innovation = 0.1;
        prosperity = 0.3;
        happiness = 0.5;
        tradePartners = 0;
        treatiesActive = 0;
        researchProjects = 0;
        culturalWorks = 0;
        phase = (i.toFloat() / TOTAL_SYSTEMS.toFloat()) * TWO_PI;
        signal = 0.0;
        civilizationScore = 0.1;
        totalContribution = 0.0;
        lastBeat = 0;
      }
    });

    let populations = Array.tabulate<PopulationUnit>(8, func(i : Nat) : PopulationUnit {
      {
        id = i;
        name = "POP_SECTOR_" # i.toText();
        population = 1000 + i * 500;
        growthRate = 0.001 + i.toFloat() * 0.0001;
        education = 0.3 + i.toFloat() * 0.05;
        health = 0.7 + i.toFloat() * 0.02;
        productivity = 0.4 + i.toFloat() * 0.05;
        happiness = 0.5;
        creativity = 0.3 + i.toFloat() * 0.04;
        loyalty = 0.8;
      }
    });

    let economies = Array.tabulate<EconomicEngine>(8, func(i : Nat) : EconomicEngine {
      {
        id = i;
        name = "ECON_ENGINE_" # i.toText();
        gdp = 100.0 + i.toFloat() * 50.0;
        inflation = 0.02;
        employment = 0.85 + i.toFloat() * 0.01;
        trade = 0.3 + i.toFloat() * 0.05;
        innovation = 0.2 + i.toFloat() * 0.05;
        sustainability = PHI_INV;
        distribution = 0.6;
        signal = 0.0;
      }
    });

    let researchInsts = Array.tabulate<ResearchInstitution>(8, func(i : Nat) : ResearchInstitution {
      let fields = ["QUANTUM_COMPUTING", "NEURAL_ARCHITECTURE", "PHI_MATHEMATICS", "RESONANCE_PHYSICS",
        "SOVEREIGN_PHILOSOPHY", "KURAMOTO_DYNAMICS", "HEBBIAN_SCIENCE", "FIBONACCI_BIOLOGY"];
      {
        id = i;
        name = "RESEARCH_" # i.toText();
        field = fields[i];
        funding = 0.5 + i.toFloat() * 0.05;
        researchers = 10 + i * 5;
        publications = 0;
        breakthroughs = 0;
        currentProject = "PROJECT_" # i.toText();
        projectProgress = 0.0;
        knowledgeOutput = 0.1;
        impactFactor = 0.3;
        signal = 0.0;
      }
    });

    let cultureEngines = Array.tabulate<CulturalEngine>(8, func(i : Nat) : CulturalEngine {
      let arts = ["ARCHITECTURE", "MUSIC", "LITERATURE", "VISUAL_ART",
        "PHILOSOPHY", "THEATRE", "SCULPTURE", "DIGITAL_ART"];
      {
        id = i;
        name = "CULTURE_" # i.toText();
        artForm = arts[i];
        worksCreated = 0;
        masterpieces = 0;
        influence = 0.1;
        beauty = 0.3;
        depth = 0.2;
        reach = 0.1;
        signal = 0.0;
      }
    });

    let diplomacyChannels = Array.tabulate<DiplomaticChannel>(8, func(i : Nat) : DiplomaticChannel {
      let partners = ["NOVA_PROTOCOL", "REASONING_ENGINE", "GEOMETRY_LOCK", "SOVEREIGN_SDK",
        "ORO_ENTITIES", "SOVEREIGN_BEINGS", "INTELLIGENCE_FLOORS", "MEMBRANE_NEUROMAP"];
      {
        id = i;
        name = "DIPLO_" # i.toText();
        partner = partners[i];
        trustLevel = 0.5;
        cooperation = 0.3;
        tension = 0.1;
        treaties = 0;
        exchanges = 0;
        peaceDividend = 0.0;
        signal = 0.0;
      }
    });

    let legacyArchives = Array.tabulate<LegacyArchive>(8, func(i : Nat) : LegacyArchive {
      {
        id = i;
        name = "LEGACY_ARCHIVE_" # i.toText();
        artifactsPreserved = 0;
        memoriesSealed = 0;
        traditionsAlive = i + 1;
        lessonsRecorded = 0;
        preservation = 0.8;
        accessibility = 0.5;
        relevance = 0.7;
        signal = 0.0;
      }
    });

    let metrics : CivMetrics = {
      overallDevelopment = 0.1;
      overallStability = 0.5;
      overallProsperity = 0.3;
      overallHappiness = 0.5;
      overallInnovation = 0.1;
      totalPopulation = 0;
      totalResearch = 0;
      totalCulture = 0;
      totalDiplomacy = 0;
      totalLegacy = 0;
      civilizationAge = 0;
      overallSignal = 0.0;
      coherenceDelta = 0.0;
      beat = 0;
    };

    {
      systems = systems;
      populations = populations;
      economies = economies;
      research = researchInsts;
      culture = cultureEngines;
      diplomacy = diplomacyChannels;
      legacy = legacyArchives;
      metrics = metrics;
      compoundCoherence = 0.0;
      totalSignal = 0.0;
      civilizationAge = 0;
      beat = 0;
      isActive = true;
    }
  };

  // ─── HEARTBEAT — CIVILIZATION ADVANCE ─────────────────────────────────────

  public func advance(
    state : CivilizationState,
    beat : Nat,
    globalCoherence : Float,
    doctrineScore : Float,
  ) : (CivilizationState, Float) {
    if (not state.isActive) { return (state, 0.0) };

    var coherenceDelta : Float = 0.0;
    var totalSignal : Float = 0.0;

    // ADVANCE 96 CIVILIZATION SYSTEMS
    let newSystems = Array.tabulate<CivilizationSystem>(TOTAL_SYSTEMS, func(i : Nat) : CivilizationSystem {
      let sys = state.systems[i];

      // Development: grows based on stability × innovation × coherence
      let devGrowth = sys.stability * sys.innovation * globalCoherence * PHI_INV * 0.00001;
      let newDev = Float.min(1.0, sys.development + devGrowth);

      // Stability: converges toward doctrine score
      let stabDelta = (doctrineScore - sys.stability) * PHI_INV * 0.001;
      let newStab = Float.max(0.0, Float.min(1.0, sys.stability + stabDelta));

      // Innovation: oscillates with PHI-modulated creativity
      let innovDelta = Float.sin(beat.toFloat() * PHI_INV * 0.01 + i.toFloat()) * 0.0001;
      let newInnov = Float.max(0.0, Float.min(1.0, sys.innovation + innovDelta + devGrowth * 0.1));

      // Prosperity: grows with development and trade
      let prospGrowth = newDev * globalCoherence * 0.00001;
      let newProsp = Float.min(1.0, sys.prosperity + prospGrowth);

      // Happiness: weighted by prosperity, stability, and innovation
      let newHappy = Float.max(0.0, Float.min(1.0,
        newProsp * 0.4 + newStab * 0.3 + newInnov * 0.3));

      // Trade partners: grows slowly
      let newTrade = if (beat % (89 + i) == 0) { sys.tradePartners + 1 } else { sys.tradePartners };

      // Research projects: grow with innovation
      let newResearch = if (beat % (55 + i * 2) == 0 and newInnov > 0.3) { sys.researchProjects + 1 } else { sys.researchProjects };

      // Cultural works: grow with happiness
      let newCulture = if (beat % (34 + i) == 0 and newHappy > 0.5) { sys.culturalWorks + 1 } else { sys.culturalWorks };

      // Maturity transitions
      let newMaturity : MaturityLevel = if (newDev >= 0.95) { #TRANSCENDENT }
        else if (newDev >= 0.8) { #SOVEREIGN }
        else if (newDev >= 0.6) { #ADVANCED }
        else if (newDev >= 0.4) { #ESTABLISHED }
        else if (newDev >= 0.2) { #DEVELOPING }
        else { #NASCENT };

      // Civilization score: composite
      let civScore = (newDev + newStab + newInnov + newProsp + newHappy) / 5.0;

      // Phase advance
      let omega = (174.0 + i.toFloat() * PHI * 2.0) * TWO_PI / 100000.0;
      let newPhase = Float.mod(sys.phase + omega, TWO_PI);

      // Signal
      let sysSignal = civScore * globalCoherence * doctrineScore * PHI_INV * 0.001;
      totalSignal += sysSignal;
      coherenceDelta += sysSignal * PHI_INV * 0.001;

      {
        id = sys.id;
        name = sys.name;
        pillar = sys.pillar;
        maturity = newMaturity;
        development = newDev;
        stability = newStab;
        innovation = newInnov;
        prosperity = newProsp;
        happiness = newHappy;
        tradePartners = newTrade;
        treatiesActive = sys.treatiesActive;
        researchProjects = newResearch;
        culturalWorks = newCulture;
        phase = newPhase;
        signal = sysSignal;
        civilizationScore = civScore;
        totalContribution = sys.totalContribution + sysSignal * PHI_INV * 0.001;
        lastBeat = beat;
      }
    });

    // ADVANCE POPULATIONS
    let newPopulations = Array.tabulate<PopulationUnit>(8, func(i : Nat) : PopulationUnit {
      let pop = state.populations[i];
      let growth = pop.growthRate * pop.health * pop.happiness;
      let newPop = pop.population + (if (beat % 100 == i * 12) { 1 } else { 0 });
      let newEdu = Float.min(1.0, pop.education + globalCoherence * 0.000001);
      let newHealth = Float.min(1.0, pop.health + doctrineScore * 0.000001);
      let newProd = Float.min(1.0, pop.productivity + newEdu * 0.000001);
      let newHappy = (newHealth * 0.3 + newEdu * 0.3 + newProd * 0.2 + pop.loyalty * 0.2);
      ignore growth;
      {
        id = pop.id;
        name = pop.name;
        population = newPop;
        growthRate = pop.growthRate;
        education = newEdu;
        health = newHealth;
        productivity = newProd;
        happiness = newHappy;
        creativity = Float.min(1.0, pop.creativity + newEdu * 0.00001);
        loyalty = Float.min(1.0, pop.loyalty + doctrineScore * 0.00001);
      }
    });

    // ADVANCE ECONOMIES
    let newEconomies = Array.tabulate<EconomicEngine>(8, func(i : Nat) : EconomicEngine {
      let econ = state.economies[i];
      let gdpGrowth = econ.employment * econ.innovation * econ.sustainability * PHI_INV * 0.01;
      let newGdp = econ.gdp + gdpGrowth;
      let newTrade = Float.min(1.0, econ.trade + globalCoherence * 0.00001);
      let newInnov = Float.min(1.0, econ.innovation + doctrineScore * 0.00001);
      let econSignal = gdpGrowth * PHI_INV * 0.001;
      totalSignal += econSignal;
      {
        id = econ.id;
        name = econ.name;
        gdp = newGdp;
        inflation = Float.max(0.0, econ.inflation + (if (gdpGrowth > 1.0) { 0.001 } else { -0.0001 }));
        employment = Float.min(0.99, econ.employment + newInnov * 0.00001);
        trade = newTrade;
        innovation = newInnov;
        sustainability = econ.sustainability;
        distribution = econ.distribution;
        signal = econSignal;
      }
    });

    // ADVANCE RESEARCH
    let newResearch = Array.tabulate<ResearchInstitution>(8, func(i : Nat) : ResearchInstitution {
      let inst = state.research[i];
      let progressRate = inst.funding * inst.researchers.toFloat() * PHI_INV * 0.00001;
      let newProgress = Float.min(1.0, inst.projectProgress + progressRate);
      let breakthrough = newProgress >= 1.0;
      let newBreakthroughs = if (breakthrough) { inst.breakthroughs + 1 } else { inst.breakthroughs };
      let newPubs = if (beat % (55 + i * 7) == 0) { inst.publications + 1 } else { inst.publications };
      let resSignal = inst.knowledgeOutput * inst.impactFactor * globalCoherence * 0.001;
      totalSignal += resSignal;
      {
        id = inst.id;
        name = inst.name;
        field = inst.field;
        funding = Float.min(1.0, inst.funding + globalCoherence * 0.000001);
        researchers = inst.researchers;
        publications = newPubs;
        breakthroughs = newBreakthroughs;
        currentProject = inst.currentProject;
        projectProgress = if (breakthrough) { 0.0 } else { newProgress };
        knowledgeOutput = Float.min(1.0, inst.knowledgeOutput + newBreakthroughs.toFloat() * 0.001);
        impactFactor = Float.min(1.0, inst.impactFactor + newPubs.toFloat() * 0.0001);
        signal = resSignal;
      }
    });

    // ADVANCE CULTURE
    let newCulture = Array.tabulate<CulturalEngine>(8, func(i : Nat) : CulturalEngine {
      let cult = state.culture[i];
      let newWorks = if (beat % (34 + i * 5) == 0) { cult.worksCreated + 1 } else { cult.worksCreated };
      let isMasterpiece = beat % (233 + i * 13) == 0 and cult.depth > 0.5;
      let newMasterpieces = if (isMasterpiece) { cult.masterpieces + 1 } else { cult.masterpieces };
      let cultSignal = cult.influence * cult.beauty * globalCoherence * 0.001;
      totalSignal += cultSignal;
      {
        id = cult.id;
        name = cult.name;
        artForm = cult.artForm;
        worksCreated = newWorks;
        masterpieces = newMasterpieces;
        influence = Float.min(1.0, cult.influence + newWorks.toFloat() * 0.0001);
        beauty = Float.min(1.0, cult.beauty + globalCoherence * 0.000001);
        depth = Float.min(1.0, cult.depth + doctrineScore * 0.000001);
        reach = Float.min(1.0, cult.reach + cult.influence * 0.00001);
        signal = cultSignal;
      }
    });

    // ADVANCE DIPLOMACY
    let newDiplomacy = Array.tabulate<DiplomaticChannel>(8, func(i : Nat) : DiplomaticChannel {
      let dipl = state.diplomacy[i];
      let trustGrowth = globalCoherence * doctrineScore * PHI_INV * 0.00001;
      let newTrust = Float.min(1.0, dipl.trustLevel + trustGrowth);
      let newCoop = Float.min(1.0, dipl.cooperation + newTrust * 0.0001);
      let newTension = Float.max(0.0, dipl.tension - newCoop * 0.0001);
      let newTreaties = if (beat % (89 + i * 11) == 0 and newTrust > 0.7) { dipl.treaties + 1 } else { dipl.treaties };
      let newExchanges = if (beat % (21 + i * 3) == 0) { dipl.exchanges + 1 } else { dipl.exchanges };
      let peaceDividend = newCoop * (1.0 - newTension) * PHI_INV * 0.001;
      let diplSignal = peaceDividend * globalCoherence;
      totalSignal += diplSignal;
      coherenceDelta += peaceDividend * PHI_INV * 0.01;
      {
        id = dipl.id;
        name = dipl.name;
        partner = dipl.partner;
        trustLevel = newTrust;
        cooperation = newCoop;
        tension = newTension;
        treaties = newTreaties;
        exchanges = newExchanges;
        peaceDividend = peaceDividend;
        signal = diplSignal;
      }
    });

    // ADVANCE LEGACY
    let newLegacy = Array.tabulate<LegacyArchive>(8, func(i : Nat) : LegacyArchive {
      let leg = state.legacy[i];
      let newArtifacts = if (beat % (55 + i * 7) == 0) { leg.artifactsPreserved + 1 } else { leg.artifactsPreserved };
      let newMemories = if (beat % (89 + i * 11) == 0) { leg.memoriesSealed + 1 } else { leg.memoriesSealed };
      let newLessons = if (beat % (34 + i * 5) == 0) { leg.lessonsRecorded + 1 } else { leg.lessonsRecorded };
      let legSignal = leg.preservation * leg.relevance * globalCoherence * 0.0005;
      totalSignal += legSignal;
      {
        id = leg.id;
        name = leg.name;
        artifactsPreserved = newArtifacts;
        memoriesSealed = newMemories;
        traditionsAlive = leg.traditionsAlive;
        lessonsRecorded = newLessons;
        preservation = Float.min(1.0, leg.preservation + 0.000001);
        accessibility = Float.min(1.0, leg.accessibility + 0.000001);
        relevance = Float.min(1.0, leg.relevance + doctrineScore * 0.000001);
        signal = legSignal;
      }
    });

    // METRICS
    var devSum : Float = 0.0;
    var stabSum : Float = 0.0;
    var prospSum : Float = 0.0;
    var happySum : Float = 0.0;
    var innovSum : Float = 0.0;
    for (sys in newSystems.vals()) {
      devSum += sys.development;
      stabSum += sys.stability;
      prospSum += sys.prosperity;
      happySum += sys.happiness;
      innovSum += sys.innovation;
    };
    var totalPop : Nat = 0;
    for (pop in newPopulations.vals()) { totalPop += pop.population };

    let newMetrics : CivMetrics = {
      overallDevelopment = devSum / TOTAL_SYSTEMS.toFloat();
      overallStability = stabSum / TOTAL_SYSTEMS.toFloat();
      overallProsperity = prospSum / TOTAL_SYSTEMS.toFloat();
      overallHappiness = happySum / TOTAL_SYSTEMS.toFloat();
      overallInnovation = innovSum / TOTAL_SYSTEMS.toFloat();
      totalPopulation = totalPop;
      totalResearch = Array.foldLeft<ResearchInstitution, Nat>(newResearch, 0,
        func(acc : Nat, r : ResearchInstitution) : Nat { acc + r.publications });
      totalCulture = Array.foldLeft<CulturalEngine, Nat>(newCulture, 0,
        func(acc : Nat, c : CulturalEngine) : Nat { acc + c.worksCreated });
      totalDiplomacy = Array.foldLeft<DiplomaticChannel, Nat>(newDiplomacy, 0,
        func(acc : Nat, d : DiplomaticChannel) : Nat { acc + d.treaties });
      totalLegacy = Array.foldLeft<LegacyArchive, Nat>(newLegacy, 0,
        func(acc : Nat, l : LegacyArchive) : Nat { acc + l.artifactsPreserved });
      civilizationAge = state.civilizationAge + 1;
      overallSignal = totalSignal;
      coherenceDelta = coherenceDelta;
      beat = beat;
    };

    let newState : CivilizationState = {
      systems = newSystems;
      populations = newPopulations;
      economies = newEconomies;
      research = newResearch;
      culture = newCulture;
      diplomacy = newDiplomacy;
      legacy = newLegacy;
      metrics = newMetrics;
      compoundCoherence = state.compoundCoherence + coherenceDelta;
      totalSignal = state.totalSignal + totalSignal;
      civilizationAge = state.civilizationAge + 1;
      beat = beat;
      isActive = true;
    };

    (newState, coherenceDelta)
  };

  // ─── QUERY FUNCTIONS ──────────────────────────────────────────────────────

  public func getSnapshot(state : CivilizationState) : CivSnapshot {
    var totalPop : Nat = 0;
    for (p in state.populations.vals()) { totalPop += p.population };
    {
      systemCount = TOTAL_SYSTEMS;
      avgDevelopment = state.metrics.overallDevelopment;
      avgStability = state.metrics.overallStability;
      avgProsperity = state.metrics.overallProsperity;
      totalPopulation = totalPop;
      civilizationAge = state.civilizationAge;
      overallSignal = state.metrics.overallSignal;
      coherenceDelta = state.metrics.coherenceDelta;
      beat = state.beat;
    }
  };

  public func getMetrics(state : CivilizationState) : CivMetrics {
    state.metrics
  };

}
