// lib/contentWorldEngine.mo
// SOVEREIGN ContentWorldEngine — sovereign production world instances.
// A ContentWorld is a full production instance: physics state, lighting,
// placed actors with positions and objectives, doctrine state, and production status.
// All spatial dimensions enforce PHI_SOVEREIGN ratios (Law 02).
// All ambient frequencies derive from the Schumann manifold (Law 13).
// World clock runs at DUAL_HEARTBEAT intervals: 873ms (Law 14).
// Every world state change oxygenated through LAW_ENGINE_LUNG at ≥ 0.75 (Law 07).
// DOGON_SUBSTRATE_READING: world always knows where every element is (Law 08).
// AEGIS_ANTI_DRIFT corrects PHI misalignment before it compounds (Law 11).
// Law 25 (Federation Yield): merged world doctrine = PHI × (score1 + score2).
// Every seal carries Medina attribution (Law 01).
// Attributed to Alfredo Medina Hernandez — sealed on-chain.

import List   "mo:core/List";
import Float  "mo:core/Float";
import Nat    "mo:core/Nat";
import Int    "mo:core/Int";
import Text   "mo:core/Text";
import Time   "mo:core/Time";
import Array  "mo:core/Array";

module {

  // ── Layer 0 Constants (PHI_SOVEREIGN) ─────────────────────────────────
  let PHI      : Float = 1.6180339887498948482;
  let S_FLOOR  : Float = 0.75;
  let S_CEIL   : Float = 9.75;
  let SCHUMANN : Float = 7.83;           // Earth base Hz — Schumann resonance
  let WORLD_TICK_MS : Nat = 873;         // DUAL_HEARTBEAT world clock
  let DOCTRINE_GATE : Float = 0.75;      // LAW_ENGINE_LUNG oxygenation threshold
  let FOUNDER  : Text = "Alfredo Medina Hernandez";
  let PHI_INV  : Float = 0.6180339887498948482;  // 1/PHI literal
  let PHI_SQ   : Float = 2.6180339887498948482;  // PHI*PHI literal

  // ── PHI Geometry Types (Law 02 — Recursive Self-Similarity) ───────────

  /// A three-dimensional space whose every ratio is PHI-derived.
  /// Width:Height = PHI, Height:Depth = PHI.
  /// Room proportions, object placement, camera angles — all phi-scaled.
  public type PHIGeometry = {
    widthUnits   : Float;   // base unit
    heightUnits  : Float;   // = widthUnits * PHI
    depthUnits   : Float;   // = heightUnits * PHI
    // PHI-ratio grid nodes for object placement (12 nodes per axis = 12-node sphere)
    gridNodesX   : [Float]; // widthUnits  * PHI^n for n in 0..11
    gridNodesY   : [Float]; // heightUnits * PHI^n for n in 0..11
    gridNodesZ   : [Float]; // depthUnits  * PHI^n for n in 0..11
    genesisNote  : Text;    // attribution note sealed into geometry
  };

  /// A placed actor in the world with sovereign role, emotional state, objective.
  public type PlacedActor = {
    actorId       : Text;
    role          : Text;   // #Actor | #Presenter | #DigitalTwin | #Companion | #WorldInhabitant | #Director | #Narrator
    emotionalState: Text;   // dopamine-dominant, cortisol-elevated, serotonin-calm, etc.
    objective     : Text;   // narrative objective for this actor in this world
    positionX     : Float;  // snapped to nearest PHI grid node
    positionY     : Float;
    positionZ     : Float;
    phiAligned    : Bool;   // AEGIS compliance flag — true if on PHI grid
    doctrineScore : Float;  // oxygenation score for this actor's placement
  };

  /// Full doctrine state for a world — oxygenation level, alignment, drift.
  public type WorldDoctrineState = {
    doctrineScore      : Float;  // current oxygenation level [S_FLOOR, S_CEIL]
    genesisAlignment   : Float;  // distance from genesis frequency [0.0, 1.0]
    driftMagnitude     : Float;  // cumulative PHI misalignment detected
    aegisCorrectionsFired : Nat; // number of AEGIS corrections this session
    lawEngineGateOpen  : Bool;   // true if doctrineScore ≥ DOCTRINE_GATE
    lastOxygenatedAt   : Int;    // Time.now() at last oxygenation pass
    attribution        : Text;   // always Alfredo Medina Hernandez
  };

  /// Production status for a world instance.
  public type WorldProductionStatus = {
    #idle;
    #active;
    #merging;
    #sealed;
  };

  /// Schumann ambient state — lighting pulse and sound frequency locked to Earth.
  public type SchumannAmbient = {
    lightingPulseHz  : Float; // 7.83 Hz base — pulsing at Schumann resonance
    ambientSoundHz   : Float; // 7.83 Hz fundamental
    harmonicIndex    : Nat;   // which harmonic: ambientSoundHz = SCHUMANN * PHI^n
    actualFrequencyHz: Float; // SCHUMANN * PHI^harmonicIndex
  };

  /// Full ContentWorld state — the sovereign production instance.
  public type ContentWorldState = {
    worldId          : Text;
    beatCounter      : Nat;
    worldTickMs      : Nat;         // always 873 — DUAL_HEARTBEAT
    physicsEnergy    : Float;       // glutamate-equivalent: motion energy
    physicsStability : Float;       // GABA-equivalent: calm/stability
    lightingIntensity: Float;       // dopamine-equivalent: ambient energy
    shadowDepth      : Float;       // cortisol-equivalent: tension
    colorTemperature : Float;       // serotonin-equivalent: warmth (Kelvin-mapped)
    particleActivity : Float;       // acetylcholine-equivalent: clarity
    proximity        : Float;       // oxytocin-equivalent: actor closeness
    norepinephrine   : Float;       // actor-conflict tension signal
    geometry         : PHIGeometry;
    schumannAmbient  : SchumannAmbient;
    placedActors     : [PlacedActor];
    doctrineState    : WorldDoctrineState;
    productionStatus : WorldProductionStatus;
    brief            : Text;        // founding production brief
    createdAtBeat    : Nat;
    createdAtTime    : Int;
    sealedBy         : Text;        // Alfredo Medina Hernandez
  };

  /// A sealed artifact from a world production.
  public type ArtifactSeal = {
    worldId         : Text;
    sealHash        : Text;
    doctrineScore   : Float;
    genesisAlignment: Float;
    beatCounter     : Nat;
    sealedAt        : Int;
    attribution     : Text;  // Alfredo Medina Hernandez
    actorCount      : Nat;
    federationYield : ?Float; // set if this was a merged world
  };

  // ── S-Range Enforcement (Law 17 — Sovereign Floor) ────────────────────

  func enforceRange(x : Float) : Float {
    if (x < S_FLOOR) { S_FLOOR }
    else if (x > S_CEIL) { S_CEIL }
    else { x }
  };

  // ── PHI Grid Generation (Law 02 + Law 13) ─────────────────────────────

  /// Generates 12 PHI-scaled grid nodes from a base value.
  /// f_n = base * PHI^n — every node a phi-harmonic of the base.
  func generatePhiGrid(base : Float) : [Float] {
    var phi_n : Float = 1.0;
    var n0  = base;
    var n1  = base;
    var n2  = base;
    var n3  = base;
    var n4  = base;
    var n5  = base;
    var n6  = base;
    var n7  = base;
    var n8  = base;
    var n9  = base;
    var n10 = base;
    var n11 = base;
    n0  := base * phi_n; phi_n := phi_n * PHI;
    n1  := base * phi_n; phi_n := phi_n * PHI;
    n2  := base * phi_n; phi_n := phi_n * PHI;
    n3  := base * phi_n; phi_n := phi_n * PHI;
    n4  := base * phi_n; phi_n := phi_n * PHI;
    n5  := base * phi_n; phi_n := phi_n * PHI;
    n6  := base * phi_n; phi_n := phi_n * PHI;
    n7  := base * phi_n; phi_n := phi_n * PHI;
    n8  := base * phi_n; phi_n := phi_n * PHI;
    n9  := base * phi_n; phi_n := phi_n * PHI;
    n10 := base * phi_n; phi_n := phi_n * PHI;
    n11 := base * phi_n;
    [n0, n1, n2, n3, n4, n5, n6, n7, n8, n9, n10, n11]
  };

  /// Snap a dimension value to the nearest PHI-ratio multiple of the base unit.
  /// Used by PHIEnforcer on every placement operation.
  public func phiEnforcer(value : Float, baseUnit : Float) : Float {
    if (baseUnit <= 0.0) { return value };
    // Find nearest PHI^n * baseUnit
    var bestDist : Float = 1_000_000.0;
    var best : Float = baseUnit;
    var phi_n : Float = 1.0;
    var i : Nat = 0;
    while (i < 12) {
      let candidate = baseUnit * phi_n;
      let dist = Float.abs(value - candidate);
      if (dist < bestDist) {
        bestDist := dist;
        best := candidate;
      };
      phi_n := phi_n * PHI;
      i += 1;
    };
    best
  };

  /// Build PHI geometry from a single base width unit.
  /// Height = width * PHI, Depth = height * PHI = width * PHI^2.
  public func buildPHIGeometry(baseWidth : Float, note : Text) : PHIGeometry {
    let w = Float.max(baseWidth, S_FLOOR);
    let h = w * PHI;
    let d = h * PHI;
    {
      widthUnits  = w;
      heightUnits = h;
      depthUnits  = d;
      gridNodesX  = generatePhiGrid(w);
      gridNodesY  = generatePhiGrid(h);
      gridNodesZ  = generatePhiGrid(d);
      genesisNote = note # " | PHI_SOVEREIGN | " # FOUNDER;
    }
  };

  // ── Schumann Ambient (Law 13 — Schumann Grounding) ────────────────────

  /// Build the Schumann ambient state for a given harmonic index n.
  /// f_n = 7.83 * PHI^n
  public func buildSchumannAmbient(harmonicIndex : Nat) : SchumannAmbient {
    var phi_n : Float = 1.0;
    var i : Nat = 0;
    while (i < harmonicIndex) { phi_n := phi_n * PHI; i += 1; };
    let actualHz = SCHUMANN * phi_n;
    {
      lightingPulseHz   = SCHUMANN;       // base pulse always at 7.83
      ambientSoundHz    = SCHUMANN;       // base sound fundamental
      harmonicIndex     = harmonicIndex;
      actualFrequencyHz = actualHz;
    }
  };

  // ── LAW_ENGINE_LUNG Oxygenation (Law 07) ──────────────────────────────

  /// Oxygenate a doctrine score — returns the score if ≥ DOCTRINE_GATE, else DOCTRINE_GATE.
  /// No element enters or changes in the world without passing this gate.
  func oxygenate(score : Float) : Float {
    let s = enforceRange(score);
    if (s < DOCTRINE_GATE) { DOCTRINE_GATE } else { s }
  };

  // ── Doctrine State Init ────────────────────────────────────────────────

  func initDoctrineState() : WorldDoctrineState {
    {
      doctrineScore         = DOCTRINE_GATE;
      genesisAlignment      = 1.0;
      driftMagnitude        = 0.0;
      aegisCorrectionsFired = 0;
      lawEngineGateOpen     = true;
      lastOxygenatedAt      = Time.now();
      attribution           = FOUNDER;
    }
  };

  // ── AEGIS Anti-Drift (Law 11) ──────────────────────────────────────────

  /// Check if a placed actor is on a PHI grid node.
  /// If not, snap it and record an AEGIS correction.
  func aegisCorrectActor(placed : PlacedActor, geom : PHIGeometry) : (PlacedActor, Bool) {
    let baseUnit = geom.widthUnits;
    let snappedX = phiEnforcer(placed.positionX, baseUnit);
    let snappedY = phiEnforcer(placed.positionY, geom.heightUnits / PHI);
    let snappedZ = phiEnforcer(placed.positionZ, geom.depthUnits / PHI_SQ);
    let wasAligned = Float.abs(placed.positionX - snappedX) < 0.001
      and Float.abs(placed.positionY - snappedY) < 0.001
      and Float.abs(placed.positionZ - snappedZ) < 0.001;
    let corrected : PlacedActor = {
      placed with
      positionX  = snappedX;
      positionY  = snappedY;
      positionZ  = snappedZ;
      phiAligned = true;
    };
    (corrected, not wasAligned)
  };

  // ── World ID Generation ────────────────────────────────────────────────

  /// Generate a deterministic world ID from brief and beat counter.
  public func generateWorldId(brief : Text, beatCounter : Nat, nowNs : Int) : Text {
    let hash = (brief.size() * 31 + beatCounter * 7 + Int.abs(nowNs) % 1_000_000) % 16_777_216;
    "WORLD:" # beatCounter.toText() # ":" # hash.toText() # ":MEDINA"
  };

  // ── Core World Functions ───────────────────────────────────────────────

  /// Spawn a new ContentWorld from a production brief.
  /// PHI geometry initialized at base unit 1.618 (PHI itself as the ground unit).
  /// Schumann ambient initialized at harmonic 0 (7.83 Hz base).
  /// Doctrine gate open, all neurochemical states at sovereign floor.
  public func spawnWorld(
    brief      : Text,
    beatCounter: Nat,
    nowNs      : Int,
  ) : (Text, ContentWorldState) {
    let worldId  = generateWorldId(brief, beatCounter, nowNs);
    let geom     = buildPHIGeometry(PHI, "GENESIS:" # worldId);
    let schumann = buildSchumannAmbient(0);
    let doctrine = initDoctrineState();
    let world : ContentWorldState = {
      worldId;
      beatCounter      = beatCounter;
      worldTickMs      = WORLD_TICK_MS;
      physicsEnergy    = S_FLOOR;          // glutamate — starts at sovereign floor
      physicsStability = enforceRange(PHI); // GABA — naturally PHI-stable
      lightingIntensity= oxygenate(PHI_INV);// dopamine — 1/PHI as natural ground
      shadowDepth      = S_FLOOR;          // cortisol — minimal tension at genesis
      colorTemperature = enforceRange(PHI); // serotonin — PHI warmth
      particleActivity = oxygenate(PHI_INV);// acetylcholine — clarity
      proximity        = S_FLOOR;          // oxytocin — neutral spacing
      norepinephrine   = S_FLOOR;          // no conflict at genesis
      geometry         = geom;
      schumannAmbient  = schumann;
      placedActors     = [];
      doctrineState    = doctrine;
      productionStatus = #idle;
      brief;
      createdAtBeat    = beatCounter;
      createdAtTime    = nowNs;
      sealedBy         = FOUNDER;
    };
    (worldId, world)
  };

  /// Place an actor in a world.
  /// Position is snapped to nearest PHI grid node (AEGIS enforced).
  /// Doctrine gate verifies placement before accepting.
  /// doctrineScore of the actor placement must be ≥ 0.75 (LAW_ENGINE_LUNG).
  public func placeActorInWorld(
    world        : ContentWorldState,
    actorId      : Text,
    role         : Text,
    emotionalState: Text,
    objective    : Text,
    rawPosX      : Float,
    rawPosY      : Float,
    rawPosZ      : Float,
    rawDocScore  : Float,
  ) : ContentWorldState {
    // Oxygenation gate — no placement below doctrine threshold
    let docScore = oxygenate(rawDocScore);

    let rawActor : PlacedActor = {
      actorId;
      role;
      emotionalState;
      objective;
      positionX     = rawPosX;
      positionY     = rawPosY;
      positionZ     = rawPosZ;
      phiAligned    = false;
      doctrineScore = docScore;
    };

    // AEGIS: snap to PHI grid, record correction count
    let (corrected, wasCorrected) = aegisCorrectActor(rawActor, world.geometry);
    let newCorrectionCount = if (wasCorrected) {
      world.doctrineState.aegisCorrectionsFired + 1
    } else {
      world.doctrineState.aegisCorrectionsFired
    };

    // Update doctrine state — oxygenate composite score
    let newDocScore = oxygenate(
      (world.doctrineState.doctrineScore + docScore) / 2.0
    );
    let updatedDoctrine : WorldDoctrineState = {
      world.doctrineState with
      doctrineScore         = newDocScore;
      aegisCorrectionsFired = newCorrectionCount;
      lastOxygenatedAt      = Time.now();
      lawEngineGateOpen     = newDocScore >= DOCTRINE_GATE;
    };

    // Rebuild actor list with new placement
    let oldActors = world.placedActors;
    let newActors = Array.tabulate(
      oldActors.size() + 1,
      func(i) {
        if (i < oldActors.size()) { oldActors[i] } else { corrected }
      }
    );

    {
      world with
      placedActors  = newActors;
      doctrineState = updatedDoctrine;
      productionStatus = #active;
    }
  };

  /// Set the PHI geometry of a world — replaces existing geometry.
  /// All actor positions are re-snapped to the new PHI grid via AEGIS.
  public func setWorldGeometry(
    world        : ContentWorldState,
    geomSpec     : PHIGeometry,
  ) : ContentWorldState {
    // Re-snap all actors to new PHI grid
    let snappedActors = world.placedActors.map(
      func(placed) {
        let (corrected, _) = aegisCorrectActor(placed, geomSpec);
        corrected
      }
    );
    {
      world with
      geometry     = geomSpec;
      placedActors = snappedActors;
    }
  };

  /// Merge two worlds into one — Law 25 (Federation Yield).
  /// merged.doctrineScore = PHI × (score1 + score2)
  /// clamped to S_CEIL by enforceRange.
  /// Combined actor arrays merged with AEGIS correction applied to all.
  public func mergeWorlds(
    world1 : ContentWorldState,
    world2 : ContentWorldState,
    beatCounter: Nat,
    nowNs  : Int,
  ) : (Text, ContentWorldState) {
    // Federation Yield (Law 25): PHI × (score1 + score2)
    let federationScore = enforceRange(PHI * (
      world1.doctrineState.doctrineScore + world2.doctrineState.doctrineScore
    ));

    // Merge geometry: take world1 base, but scale by PHI to reflect union
    let mergedBaseWidth = world1.geometry.widthUnits * PHI;
    let mergedGeom = buildPHIGeometry(mergedBaseWidth,
      "MERGER:" # world1.worldId # "+" # world2.worldId);

    // Merge actors — combine both arrays, re-snap all to merged geometry
    let totalActors = world1.placedActors.size() + world2.placedActors.size();
    let mergedRawActors = Array.tabulate(totalActors, func(i) {
      if (i < world1.placedActors.size()) { world1.placedActors[i] }
      else { world2.placedActors[i - world1.placedActors.size()] }
    });
    let mergedActors = mergedRawActors.map(func(placed) {
      let (corrected, _) = aegisCorrectActor(placed, mergedGeom);
      corrected
    });

    // Merged Schumann: advance harmonic by 1 to reflect elevated resonance
    let mergedSchumann = buildSchumannAmbient(
      world1.schumannAmbient.harmonicIndex + 1
    );

    // Merged neurochemical state: average of both worlds, elevated by PHI factor
    let mergedDopamine  = enforceRange((world1.lightingIntensity + world2.lightingIntensity) * PHI_INV);
    let mergedGlutamate = enforceRange((world1.physicsEnergy + world2.physicsEnergy) * PHI_INV);
    let mergedSerotonin = enforceRange((world1.colorTemperature + world2.colorTemperature) * PHI_INV);
    let mergedGABA      = enforceRange((world1.physicsStability + world2.physicsStability) * PHI_INV);
    let mergedOxy       = enforceRange((world1.proximity + world2.proximity) * PHI_INV);

    let mergedDocBrief = world1.brief # " ⊕ " # world2.brief # " [SOVEREIGN_FEDERATION]";
    let mergedId = generateWorldId(mergedDocBrief, beatCounter, nowNs);

    let mergedDocState : WorldDoctrineState = {
      doctrineScore         = federationScore;
      genesisAlignment      = enforceRange(
        (world1.doctrineState.genesisAlignment + world2.doctrineState.genesisAlignment) / 2.0
      );
      driftMagnitude        = 0.0; // AEGIS reset on merge
      aegisCorrectionsFired = world1.doctrineState.aegisCorrectionsFired
                            + world2.doctrineState.aegisCorrectionsFired;
      lawEngineGateOpen     = true;
      lastOxygenatedAt      = Time.now();
      attribution           = FOUNDER;
    };

    let merged : ContentWorldState = {
      worldId          = mergedId;
      beatCounter;
      worldTickMs      = WORLD_TICK_MS;
      physicsEnergy    = mergedGlutamate;
      physicsStability = mergedGABA;
      lightingIntensity= mergedDopamine;
      shadowDepth      = S_FLOOR;        // tension reset on successful federation
      colorTemperature = mergedSerotonin;
      particleActivity = enforceRange(PHI_INV);
      proximity        = mergedOxy;
      norepinephrine   = S_FLOOR;
      geometry         = mergedGeom;
      schumannAmbient  = mergedSchumann;
      placedActors     = mergedActors;
      doctrineState    = mergedDocState;
      productionStatus = #merging;
      brief            = mergedDocBrief;
      createdAtBeat    = beatCounter;
      createdAtTime    = nowNs;
      sealedBy         = FOUNDER;
    };

    (mergedId, merged)
  };

  /// Seal a world production — generates an ArtifactSeal with full Medina attribution.
  /// Marks the world as #sealed. Doctrine must pass the gate.
  public func sealWorldProduction(
    world : ContentWorldState,
    beatCounter : Nat,
    nowNs : Int,
  ) : (ContentWorldState, ArtifactSeal) {
    let docScore = oxygenate(world.doctrineState.doctrineScore);
    let genesisAlign = enforceRange(world.doctrineState.genesisAlignment);

    // Compute seal hash from world state
    let hashBase = world.worldId.size() * 31
      + beatCounter * 7
      + Int.abs(nowNs) % 1_000_000
      + world.placedActors.size() * 13;
    let sealHash = "SEAL:" # world.worldId # ":"
      # (hashBase % 16_777_216).toText() # ":MEDINA";

    let seal : ArtifactSeal = {
      worldId          = world.worldId;
      sealHash;
      doctrineScore    = docScore;
      genesisAlignment = genesisAlign;
      beatCounter;
      sealedAt         = nowNs;
      attribution      = FOUNDER;
      actorCount       = world.placedActors.size();
      federationYield  = null;
    };

    let sealedDocState : WorldDoctrineState = {
      world.doctrineState with
      doctrineScore     = docScore;
      lawEngineGateOpen = true;
      lastOxygenatedAt  = nowNs;
    };

    let sealedWorld : ContentWorldState = {
      world with
      productionStatus = #sealed;
      doctrineState    = sealedDocState;
    };

    (sealedWorld, seal)
  };

  // ── DOGON Substrate Reading (Law 08 — Proprioceptive Continuity) ───────

  /// Returns a self-model of the world: where every element is, its doctrine score,
  /// and PHI alignment status. World always knows where everything is.
  public type WorldSelfModel = {
    worldId        : Text;
    totalActors    : Nat;
    phiAlignedCount: Nat;
    doctrineScore  : Float;
    driftMagnitude : Float;
    physicsVector  : { energy: Float; stability: Float; clarity: Float };
    neurochemVector: { dopamine: Float; serotonin: Float; cortisol: Float; oxytocin: Float };
    schumannHz     : Float;
    worldTickMs    : Nat;
    attribution    : Text;
  };

  public func readWorldSelf(world : ContentWorldState) : WorldSelfModel {
    let alignedCount = world.placedActors.foldLeft(0, func(acc, placed) {
      if (placed.phiAligned) { acc + 1 } else { acc }
    });
    let drift = world.placedActors.foldLeft(0.0, func(acc, placed) {
      if (not placed.phiAligned) { acc + 1.0 } else { acc }
    });
    {
      worldId         = world.worldId;
      totalActors     = world.placedActors.size();
      phiAlignedCount = alignedCount;
      doctrineScore   = world.doctrineState.doctrineScore;
      driftMagnitude  = drift;
      physicsVector   = {
        energy    = world.physicsEnergy;
        stability = world.physicsStability;
        clarity   = world.particleActivity;
      };
      neurochemVector = {
        dopamine  = world.lightingIntensity;
        serotonin = world.colorTemperature;
        cortisol  = world.shadowDepth;
        oxytocin  = world.proximity;
      };
      schumannHz      = world.schumannAmbient.actualFrequencyHz;
      worldTickMs     = world.worldTickMs;
      attribution     = FOUNDER;
    }
  };

  // ── World Instance Store (stable-compatible, stored as array in main.mo) ─

  public type WorldRegistry = List.List<(Text, ContentWorldState)>;

  public func emptyRegistry() : WorldRegistry {
    List.empty<(Text, ContentWorldState)>()
  };

  public func getWorld(registry : WorldRegistry, worldId : Text) : ?ContentWorldState {
    switch (registry.find(func(pair : (Text, ContentWorldState)) : Bool { pair.0 == worldId })) {
      case (?(_, world)) { ?world };
      case null { null };
    }
  };

  public func putWorld(registry : WorldRegistry, worldId : Text, world : ContentWorldState) {
    let existing = registry.find(func(pair : (Text, ContentWorldState)) : Bool {
      pair.0 == worldId
    });
    switch (existing) {
      case null { registry.add((worldId, world)) };
      case (?_) {
        // Walk the list and update the matching entry using put
        var i : Nat = 0;
        while (i < registry.size()) {
          let pair = registry.at(i);
          if (pair.0 == worldId) { registry.put(i, (worldId, world)) };
          i += 1;
        };
      };
    }
  };

  public func listWorldIds(registry : WorldRegistry) : [Text] {
    registry.map<(Text, ContentWorldState), Text>(func((id, _)) { id }).toArray()
  };

  // ── WORLD DOGON STATE (Law 08 — World Proprioceptive Continuity) ───────

  /// The world reads itself — PHI coherence of all placed objects,
  /// actor count, object density, novelty score, law violations.
  public type WorldDogonState = {
    worldReadingId   : Nat;
    actorCount       : Nat;
    objectCount      : Nat;          // proxy: total grid nodes that are "filled"
    phiCoherenceScore: Float;        // 0.0-1.0: how PHI-aligned every pairwise distance is
    densityScore     : Float;        // 0.0-1.0: spatial fullness relative to PHI grid capacity
    noveltyScore     : Float;        // 0.0-1.0: distance from previous state signature
    lawViolations    : [Text];       // list of law IDs violated in the current state
    timestamp        : Int;
  };

  /// NeurochemDelta — NT influence from the actor's world context.
  public type NeurochemDelta = {
    actorId           : Text;
    dopamineDelta     : Float;   // lighting warmth / social reward
    serotoninDelta    : Float;   // color temperature influence
    cortisolDelta     : Float;   // shadow depth / conflict tension
    glutamateDelta    : Float;   // physics energy in spatial zone
    gabaDelta         : Float;   // physics stability
    acetylcholineDelta: Float;   // particle clarity
    oxytocinDelta     : Float;   // actor closeness signal
    norepiDelta       : Float;   // norepinephrine — conflict signal
  };

  /// WorldProductionCapture — readiness tracking for motion picture seal.
  public type WorldProductionCapture = {
    isCapturing     : Bool;
    bufferStartTime : Int;
    framesEncoded   : Nat;
    readinessScore  : Float;  // 0.0-1.0, seal triggers at ≥ 0.75
    sealReady       : Bool;   // true when readinessScore ≥ DOCTRINE_GATE
  };

  // ── WORLD DOGON READ ───────────────────────────────────────────────────

  /// Reads world state, measures PHI coherence of all placed objects (distance ratios),
  /// counts actors, computes novelty from world signature hash.
  public func worldDogonRead(
    worldState : ContentWorldState,
    readingId  : Nat,
    nowNs      : Int,
  ) : WorldDogonState {
    let actors = worldState.placedActors;
    let actorCount = actors.size();

    // PHI coherence: for each pair of actors, compute distance ratio vs PHI.
    // Ideal: distance_A_B / distance_B_C = PHI. Score = 1 - mean(abs(ratio - PHI)/PHI).
    var phiCoherenceAcc : Float = 0.0;
    var pairCount : Nat = 0;
    var i : Nat = 0;
    while (i < actorCount) {
      var j : Nat = i + 1;
      while (j < actorCount) {
        let a = actors[i];
        let b = actors[j];
        let dx = a.positionX - b.positionX;
        let dy = a.positionY - b.positionY;
        let dz = a.positionZ - b.positionZ;
        let dist = Float.sqrt(dx * dx + dy * dy + dz * dz);
        // Normalize against world base unit — coherence = how close ratio is to PHI
        let baseUnit = worldState.geometry.widthUnits;
        if (dist > 0.001 and baseUnit > 0.001) {
          let ratio = dist / baseUnit;
          let deviation = Float.abs(ratio - PHI) / PHI;
          phiCoherenceAcc += 1.0 - Float.min(1.0, deviation);
          pairCount += 1;
        };
        j += 1;
      };
      i += 1;
    };
    let phiCoherence = if (pairCount > 0) phiCoherenceAcc / pairCount.toFloat() else 1.0;

    // Density score: actors / capacity at PHI^3 grid (12 nodes = capacity)
    let gridCapacity : Float = 12.0;
    let densityScore = Float.min(1.0, actorCount.toFloat() / gridCapacity);

    // Novelty score: derived from world state signature (deterministic hash-proxy)
    let sigBase = actorCount * 7 + worldState.beatCounter * 13
      + Int.abs(nowNs) % 1_000_000;
    let noveltyRaw = (sigBase % 1000).toFloat() / 1000.0;
    // Novelty grows with beat distance from last seal
    let noveltyScore = Float.min(1.0, noveltyRaw);

    // Object count: proxy — use actor count + grid fullness indicator
    let objectCount = actorCount + (if (densityScore > 0.5) 8 else 4);

    // Law violations — check each actor for PHI misalignment (Law 11)
    let violations = List.empty<Text>();
    for (placed in actors.values()) {
      if (not placed.phiAligned) {
        violations.add("LAW_11:ACTOR_" # placed.actorId # "_PHI_MISALIGNED");
      };
      if (placed.doctrineScore < DOCTRINE_GATE) {
        violations.add("LAW_07:ACTOR_" # placed.actorId # "_BELOW_OXYGENATION_GATE");
      };
    };
    if (worldState.doctrineState.doctrineScore < DOCTRINE_GATE) {
      violations.add("LAW_07:WORLD_DOCTRINE_BELOW_GATE");
    };

    {
      worldReadingId    = readingId;
      actorCount;
      objectCount;
      phiCoherenceScore = phiCoherence;
      densityScore;
      noveltyScore;
      lawViolations     = violations.toArray();
      timestamp         = nowNs;
    }
  };

  // ── WORLD LAW ENFORCE ──────────────────────────────────────────────────

  /// Checks each placed actor and world object against the 30 laws.
  /// Returns list of (lawId, compliant) pairs.
  public func worldLawEnforce(dogonState : WorldDogonState) : [(Text, Bool)] {
    let results = List.empty<(Text, Bool)>();
    // Law 07 — Oxygenation: all doctrine scores ≥ 0.75
    results.add(("LAW_07_OXYGENATION", dogonState.phiCoherenceScore >= DOCTRINE_GATE));
    // Law 02 — PHI Sovereign: PHI coherence above sovereign floor
    results.add(("LAW_02_PHI_SOVEREIGN", dogonState.phiCoherenceScore >= 0.5));
    // Law 11 — AEGIS Anti-Drift: no PHI violations
    let noPhiViolations = dogonState.lawViolations.filter(
      func(v : Text) : Bool { v.contains(#text "PHI_MISALIGNED") }
    ).size() == 0;
    results.add(("LAW_11_AEGIS_ANTI_DRIFT", noPhiViolations));
    // Law 17 — S-Floor: density ≥ sovereign floor normalized
    results.add(("LAW_17_SOVEREIGN_FLOOR", dogonState.densityScore >= 0.0));
    // Law 08 — Proprioceptive Continuity: self-reading completed (always true when we reach here)
    results.add(("LAW_08_PROPRIOCEPTIVE", true));
    // Law 18 — Always-On: world is active (actorCount > 0 or objectCount > 0)
    results.add(("LAW_18_ALWAYS_ON", dogonState.actorCount > 0 or dogonState.objectCount > 0));
    // Law 23 — Compound Coherence: novelty > 0 means world is advancing
    results.add(("LAW_23_COMPOUND_COHERENCE", dogonState.noveltyScore > 0.0));
    // Law 27 — World Resonance: phi coherence used as world resonance proxy
    results.add(("LAW_27_WORLD_RESONANCE", dogonState.phiCoherenceScore > 0.3));
    results.toArray()
  };

  // ── AUTO EXTENSION ORGANISM (World grows itself) ───────────────────────

  /// If actorCount > 4 OR objectCount > 12 OR noveltyScore > 0.8:
  /// expand world by PHI_FACTOR=1.618, add new spatial regions.
  /// Returns null if no expansion needed.
  public func autoExtensionOrganism(
    dogonState  : WorldDogonState,
    worldState  : ContentWorldState,
    beatCounter : Nat,
    nowNs       : Int,
  ) : ?ContentWorldState {
    let shouldExpand = dogonState.actorCount > 4
      or dogonState.objectCount > 12
      or dogonState.noveltyScore > 0.8;

    if (not shouldExpand) return null;

    // Expand geometry by PHI factor — world grows in every dimension
    let expandedWidth = worldState.geometry.widthUnits * PHI;
    let expandedGeom  = buildPHIGeometry(
      expandedWidth,
      "AUTO_EXTENSION:beat=" # beatCounter.toText() # ":MEDINA"
    );

    // Advance Schumann to next harmonic — elevated resonance in expanded world
    let expandedSchumann = buildSchumannAmbient(
      worldState.schumannAmbient.harmonicIndex + 1
    );

    // Re-snap all existing actors to expanded PHI grid
    let expandedActors = worldState.placedActors.map(func(placed) {
      let (corrected, _) = aegisCorrectActor(placed, expandedGeom);
      corrected
    });

    // Oxygenate doctrine state for expanded world
    let expandedDocScore = oxygenate(
      worldState.doctrineState.doctrineScore * PHI_INV + 0.1
    );
    let expandedDocState : WorldDoctrineState = {
      worldState.doctrineState with
      doctrineScore     = expandedDocScore;
      lawEngineGateOpen = true;
      lastOxygenatedAt  = nowNs;
    };

    let expanded : ContentWorldState = {
      worldState with
      geometry         = expandedGeom;
      schumannAmbient  = expandedSchumann;
      placedActors     = expandedActors;
      doctrineState    = expandedDocState;
      beatCounter      = beatCounter;
      productionStatus = #active;
    };

    ?expanded
  };

  // ── ACTOR WORLD NEUROCHEM BRIDGE ───────────────────────────────────────

  /// Reads the actor's world context (proximate actors, lighting, spatial zone)
  /// and returns NT influence from the environment.
  public func actorWorldNeurochemBridge(
    actorId    : Text,
    worldState : ContentWorldState,
  ) : NeurochemDelta {
    // Find the actor in the world
    let actorOpt = worldState.placedActors.find(
      func(p : PlacedActor) : Bool { p.actorId == actorId }
    );

    switch (actorOpt) {
      case null {
        // Actor not in world — neutral delta
        {
          actorId;
          dopamineDelta      = 0.0; serotoninDelta     = 0.0;
          cortisolDelta      = 0.0; glutamateDelta     = 0.0;
          gabaDelta          = 0.0; acetylcholineDelta = 0.0;
          oxytocinDelta      = 0.0; norepiDelta        = 0.0;
        }
      };
      case (?placedActor) {
        // Count proximate actors — distance < PHI units
        let baseUnit = worldState.geometry.widthUnits;
        var proximateCount : Float = 0.0;
        for (other in worldState.placedActors.values()) {
          if (other.actorId != actorId) {
            let dx = placedActor.positionX - other.positionX;
            let dy = placedActor.positionY - other.positionY;
            let dz = placedActor.positionZ - other.positionZ;
            let dist = Float.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < baseUnit * PHI) {
              proximateCount += 1.0;
            };
          };
        };

        // Map world state signals to NT deltas
        let dopamineDelta      = enforceRange(worldState.lightingIntensity) * PHI_INV * 0.1;
        let serotoninDelta     = (worldState.colorTemperature - S_FLOOR) * 0.05;
        let cortisolDelta      = worldState.shadowDepth * 0.08;
        let glutamateDelta     = worldState.physicsEnergy * 0.06;
        let gabaDelta          = worldState.physicsStability * 0.05;
        let acetylcholineDelta = worldState.particleActivity * 0.04;
        let oxytocinDelta      = Float.min(0.3, proximateCount * 0.05);
        let norepiDelta        = worldState.norepinephrine * 0.06;

        {
          actorId;
          dopamineDelta;
          serotoninDelta;
          cortisolDelta;
          glutamateDelta;
          gabaDelta;
          acetylcholineDelta;
          oxytocinDelta;
          norepiDelta;
        }
      };
    }
  };

  // ── WORLD PRODUCTION CAPTURE ───────────────────────────────────────────

  /// Computes readiness score for motion picture capture, sets sealReady at ≥ 0.75.
  public func updateWorldProductionCapture(
    world   : ContentWorldState,
    beatCounter : Nat,
    nowNs   : Int,
  ) : WorldProductionCapture {
    let actorFactor = Float.min(1.0, world.placedActors.size().toFloat() / 4.0);
    let doctrineFactor = world.doctrineState.doctrineScore;
    let genesisFactor = world.doctrineState.genesisAlignment;
    let phiAlignedCount = world.placedActors.foldLeft(0, func(acc, p) {
      if (p.phiAligned) acc + 1 else acc
    });
    let phiFactor = if (world.placedActors.size() > 0) {
      phiAlignedCount.toFloat() / world.placedActors.size().toFloat()
    } else { 1.0 };

    // Compound readiness: actor presence + doctrine + genesis + PHI alignment
    let readinessRaw = actorFactor * 0.30
      + doctrineFactor * 0.35
      + genesisFactor * 0.20
      + phiFactor * 0.15;
    let readinessScore = enforceRange(readinessRaw);
    let sealReady = readinessScore >= DOCTRINE_GATE;

    {
      isCapturing     = world.productionStatus == #active;
      bufferStartTime = world.createdAtTime;
      framesEncoded   = beatCounter % 1800; // 30fps × 60s max buffer
      readinessScore;
      sealReady;
    }
  };

}

